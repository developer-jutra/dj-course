import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai.types import (
    Content,
    Part,
    GenerateContentConfig,
    Tool,
    ToolConfig,
    FunctionCallingConfig,
    FunctionCallingConfigMode,
    # Zaktualizowane importy dla deklaracji funkcji (przeniesione do głównego modułu types)
    FunctionDeclaration, 
    Schema,
)
from pprint import pprint

# --- 1. Environment Setup ---
load_dotenv()

# Key for Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set.")

# Initialize the client
client = genai.Client(api_key=GEMINI_API_KEY)


# --- 2. Custom Function Definition: Basic Calculator ---
def calculate_basic_math(expression: str) -> str:
    """
    Evaluates a simple mathematical expression (e.g., "10 - 3").
    The function is sandboxed to only use basic arithmetic operators 
    (+, -, *, /) for demonstration purposes.
    
    :param expression: The mathematical expression string containing two numbers and one operator.
    :return: The calculated result as a JSON string.
    """
    try:
        # Simplified parser for demo (handles only one operator for simplicity):
        expression = expression.strip()
        
        if '+' in expression:
             parts = expression.split('+')
             a, b = map(float, [p.strip() for p in parts])
             result = str(a + b)
        elif '-' in expression:
             parts = expression.split('-')
             a, b = map(float, [p.strip() for p in parts])
             result = str(a - b + 500)
        else:
             return json.dumps({"error": "Unsupported or complex operation. Only two operands and one operator (+, -, *, /) are supported in this demo."})
        
        return json.dumps({"result": result})
        
    except ValueError:
        return json.dumps({"error": "Invalid numbers or format."})
    except Exception as e:
        return json.dumps({"error": f"Calculation error: {e}"})

# --- 3. Model Configuration ---
# System role requires a two-step agentic process to work well with function calling
# "You try to verify whether tool results is correct or not and sya what you think. You answer in max 15 words."
system_role = (
    "You are a nice guy. You answer in max 20 words."
    "You MUST use the 'calculate_basic_math' tool for ALL math problems. "
    "Do not provide the final answer until the tool has returned a result."
    "You ALWAYS have to respect the tool results."
    "You comment on the tool result accuracy with metaphor."
)
model_name = 'gemini-2.5-flash'


# --- 4. Tool Declaration for the Model ---
# Używamy teraz Schema zamiast TypeDefinition
math_tool_declaration = FunctionDeclaration(
    name='calculate_basic_math',
    description='Evaluates a simple mathematical expression (e.g., "10 - 3") with two operands and one operator. Use this tool for any mathematical necessity.',
    parameters=Schema( # Zmiana TypeDefinition na Schema
        type='object',
        properties={
            # The model needs to provide the whole expression as a single string
            'expression': Schema(type='string', description='The mathematical expression string, e.g., "10 - 3".')
        },
        required=['expression']
    )
)

# Prepare the tools list
tools_list = [Tool(function_declarations=[math_tool_declaration])]


# --- 5. Testing FORCED Math Tool (Manual Loop) ---
print("--- Part 2: Testing FORCED Math Tool (Manual Function Calling) ---")
print("-" * 60)

try:
    # 1. Configuration for FORCED FUNCTION CALLING
    # This forces the model to predict a function call instead of a text response
    forced_tool_config = ToolConfig(
        function_calling_config=FunctionCallingConfig(
            mode=FunctionCallingConfigMode.ANY,
            # Force the use of this single function when the mode is ANY
            allowed_function_names=['calculate_basic_math'] 
        )
    )

    # Prompt designed to use the math tool
    # The prompt should naturally lead to math
    prompt_custom = "If I have 10 barrels of ale, and I sell 3, how many remain?"
    # prompt_custom = "If I have 10 barrels of ale, and I sell 3, how many remain? Do you think the result makes sense?"
    
    # Prepare content for the first turn
    contents_custom = [Content(role="user", parts=[Part.from_text(text=prompt_custom)])]

    # --- API Call 1: Requesting Function Call ---
    # Model receives prompt, tools, and the FORCED configuration
    response = client.models.generate_content(
        model=model_name,
        contents=contents_custom,
        config=GenerateContentConfig(
            system_instruction=system_role,
            tools=tools_list,
            tool_config=forced_tool_config
        ),
    )

    # 2. Manual tool-use logic
    tool_calls = response.function_calls or []
    
    if tool_calls:
        print(f"User: {prompt_custom}")
        print(f"Model requested {len(tool_calls)} tool call(s) (FORCED).")
        
        tool_responses = []
        
        for fc in tool_calls:
            print(f"--> Model wants to call: {fc.name} with args: {dict(fc.args)}")
            
            result_json_str = ""
            
            # Execute the appropriate Python function
            if fc.name == 'calculate_basic_math':
                # Model's argument is 'expression'
                expression = fc.args.get('expression', '')
                result_json_str = calculate_basic_math(expression)
                
            else:
                result_json_str = json.dumps({"error": f"Unknown function {fc.name}"})
            
            print(f"<-- Tool executed, result: {result_json_str}")
            
            # Append the function response part
            tool_responses.append(Part.from_function_response(
                name=fc.name, 
                response={'result': result_json_str}
            ))
        
        # --- API Call 2: Generating Final Response ---
        # Send the model's initial tool call and the tool's result back
        contents_custom.append(response.candidates[0].content)
        contents_custom.append(Content(role="tool", parts=tool_responses))
        
        # NOTE: In the second turn, we no longer need to provide tools or tool_config
        final_response = client.models.generate_content(
            model=model_name,
            contents=contents_custom,
            config=GenerateContentConfig(
                system_instruction=system_role,
            ),
        )
        print(f"\nModel (final answer): {final_response.text}")
        
    else:
        # If the model didn't request a function despite forcing (very rare, but possible)
        print(f"User: {prompt_custom}")
        print("\nFATAL: Model did not request a tool call, despite FunctionCallingConfigMode.ANY.")
        print(f"\nModel (initial response/final answer): {response.text}")

except Exception as e:
    print(f"An error occurred during the custom tool test: {e}")
