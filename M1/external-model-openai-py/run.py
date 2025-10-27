import os
import sys
from openai import OpenAI
from dotenv import load_dotenv
from colorama import init, Fore, Style

# Initialize colorama for cross-platform terminal compatibility
init(autoreset=True)

# Define color constants using colorama
ERROR = Fore.RED + Style.BRIGHT
SECTION = Fore.CYAN + Style.BRIGHT
ITEM = Fore.YELLOW + Style.BRIGHT
RESET = Style.RESET_ALL

# 1. Load environment variables from the .env file
# This sets variables in os.environ for use by the OpenAI client.
load_dotenv()

# 2. Check if the API key is available
# if set, print first 4 chars and last 4 chars and dots inside, else print NOT SET
print(f"{ITEM}env var \"OPENAI_API_KEY\"{RESET}: { os.getenv('OPENAI_API_KEY', '')[:4] + '...' + os.getenv('OPENAI_API_KEY', '')[-4:] if len(os.getenv('OPENAI_API_KEY', '')) > 0 else 'NOT SET' }")
if not os.getenv('OPENAI_API_KEY'):
    raise ValueError("OPENAI_API_KEY environment variable is not set. Please set it to your OpenAI API key.")

# Initialize the OpenAI client
client = OpenAI()

def run():
    # Model selection (uncomment the desired model)
    # model = "gpt-3.5-turbo-0125"
    # model = "gpt-4"
    # model = "gpt-o4"
    # model = "gpt-4o"
    model = "gpt-4-turbo" # Selected model

    prompt_content = "Jakie jest najszybsze zwierzę na Ziemi?" # User query

    # Display the model used, colored cyan
    print(f"{ITEM}model{RESET}: {model}")

    try:
        # API call to create a chat completion
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": prompt_content,
                },
            ],
            max_completion_tokens=128,
        )

        response_text = completion.choices[0].message.content.strip()
        usage = completion.usage

        # Display the conversation, with roles colored yellow
        print(f"{SECTION}--- Conversation ---{RESET}")
        print(f"{ITEM}User{RESET}: \"{prompt_content}\"")
        print(f"{ITEM}Model{RESET}: \"{response_text}\"")
        
        # Display usage statistics
        print(f"{SECTION}--- Usage Statistics ---{RESET}")
        print(f"Prompt tokens (input): {usage.prompt_tokens}")
        print(f"Completion tokens (output): {usage.completion_tokens}")
        print(f"Total tokens: {usage.total_tokens}")
        print("Success: Connection and API call are working correctly! 🎉")

    # Catch potential API errors or other exceptions
    except Exception as error:
        print(f"{ERROR}\n--- API ERROR ---{RESET}", file=sys.stderr)
        # Display the specific error message
        print(f"{ERROR}An error occurred: {error}{RESET}", file=sys.stderr)
        print(f"{ERROR}Check the status of your API key and payment plan.{RESET}", file=sys.stderr)

if __name__ == "__main__":
    run()
