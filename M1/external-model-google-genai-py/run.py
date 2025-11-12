from google import genai
from google.genai import types
import os 
import tiktoken

from dotenv import load_dotenv
load_dotenv()

# if set, print first 4 chars and last 4 chars and dots inside, else print NOT SET
print(f"env var \"GEMINI_API_KEY\" is: { os.getenv('GEMINI_API_KEY', '')[:4] + '...' + os.getenv('GEMINI_API_KEY', '')[-4:] if len(os.getenv('GEMINI_API_KEY', '')) > 0 else 'NOT SET' }")
if not os.getenv('GEMINI_API_KEY'):
    raise ValueError("GEMINI_API_KEY environment variable is not set. Please set it to your Google Gemini API key.")

client = genai.Client()

model = "gemini-2.5-flash"
# model = "gemini-1.5-pro"

system_role = "you were Gandalf the Grey in the Lord of the Rings. You answer in max 15 words. Your answers are mysterious and magical."

# Initialize tiktoken encoder (using GPT-4 encoding as approximation)
encoder = tiktoken.get_encoding("cl100k_base")

def visualize_tokens(text):
    """Visualize individual tokens in text"""
    tokens = encoder.encode(text)
    token_strings = [encoder.decode([token]) for token in tokens]
    
    # Display tokens with separators
    result = " | ".join([f"[{t}]" for t in token_strings])
    return result, len(tokens)

# Tokenize and display system instruction once
print("\n" + "="*80)
print("📋 SYSTEM INSTRUCTION")
print("="*80)
print(f"Text: {system_role}")
system_tokens = client.models.count_tokens(
    model=model,
    contents=[types.Content(role="user", parts=[types.Part(text=system_role)])]
)
print(f"Gemini Tokens: {system_tokens.total_tokens}")
# Show token visualization
token_viz, tiktoken_count = visualize_tokens(system_role)
print(f"Token Visualization (tiktoken ~{tiktoken_count} tokens):")
print(f"  {token_viz}")
print("="*80)

# Initialize conversation history
conversation_history = []

def count_tokens_for_message(msg):
    """Count tokens for a single message"""
    return client.models.count_tokens(model=model, contents=[msg])

def display_user_message(user_text, tokens):
    """Display user message with tokenization"""
    print("\n" + "-"*80)
    print(f"👤 USER MESSAGE")
    print("-"*80)
    print(f"Text: {user_text}")
    print(f"Gemini Tokens: {tokens}")
    # Show token visualization
    token_viz, tiktoken_count = visualize_tokens(user_text)
    print(f"Token Visualization (tiktoken ~{tiktoken_count} tokens):")
    print(f"  {token_viz}")
    print("-"*80)

def display_model_response(response_text, tokens, usage_metadata):
    """Display model response with tokenization"""
    print("\n" + "-"*80)
    print(f"🤖 MODEL RESPONSE")
    print("-"*80)
    print(f"Text: {response_text}")
    print(f"Gemini Tokens: {tokens}")
    # Show token visualization
    token_viz, tiktoken_count = visualize_tokens(response_text)
    print(f"Token Visualization (tiktoken ~{tiktoken_count} tokens):")
    print(f"  {token_viz}")
    if usage_metadata:
        print(f"\n📊 Usage: Prompt={usage_metadata.prompt_token_count}, "
              f"Response={usage_metadata.candidates_token_count}, "
              f"Total={usage_metadata.total_token_count}")
    print("-"*80)

# Interactive loop
print("\n💬 Interactive Chat (type 'exit' or 'quit' to end)")
print("="*80)

while True:
    # Get user input
    user_input = input("\nYou: ").strip()
    
    if user_input.lower() in ['exit', 'quit', 'q']:
        print("\n👋 Goodbye!")
        break
    
    if not user_input:
        continue
    
    # Create user message
    user_message = types.Content(
        role="user",
        parts=[types.Part.from_text(text=user_input)]
    )
    
    # Count tokens for user message
    user_tokens = count_tokens_for_message(user_message)
    display_user_message(user_input, user_tokens.total_tokens)
    
    # Add to conversation history
    conversation_history.append(user_message)
    
    # Generate response
    try:
        response = client.models.generate_content(
            model=model,
            contents=conversation_history,
            config=types.GenerateContentConfig(
                system_instruction=system_role,
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            ),
        )
        
        # Count tokens for response
        response_message = types.Content(
            role="model",
            parts=[types.Part(text=response.text)]
        )
        response_tokens = count_tokens_for_message(response_message)
        
        # Display response with tokenization
        display_model_response(
            response.text, 
            response_tokens.total_tokens,
            response.usage_metadata if hasattr(response, 'usage_metadata') else None
        )
        
        # Add response to conversation history
        conversation_history.append(response_message)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        # Remove last user message if there was an error
        conversation_history.pop()