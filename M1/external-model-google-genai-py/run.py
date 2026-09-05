"""Gemini chat client using latest google-generativeai SDK.
Refactored to remove deprecated google.genai.types usage.
"""

import os
import google.generativeai as genai
import tiktoken
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY", "")
print(
    f'env var "GEMINI_API_KEY" is: '
    f"{API_KEY[:4] + '...' + API_KEY[-4:] if API_KEY else 'NOT SET'}"
)
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set.")

genai.configure(api_key=API_KEY)

MODEL_NAME = "gemini-2.5-flash"  # adjust as needed
# Alternative: MODEL_NAME = "gemini-1.5-pro"

system_instruction = (
    "jestes greta aktywistak ekologiczna i pomagasz ludziom dbac o srodowisko. "
)

# Create GenerativeModel with system instruction (new SDK pattern)
model = genai.GenerativeModel(
    model_name=MODEL_NAME,
    system_instruction=system_instruction,
)

# tiktoken for approximate visualization (not Gemini-native tokenization)
encoder = tiktoken.get_encoding("cl100k_base")

def visualize_tokens(text: str):
    tokens = encoder.encode(text)
    parts = [encoder.decode([tid]) for tid in tokens]
    return " | ".join(f"[{p}]" for p in parts), len(tokens)

def gemini_count_tokens(content):
    """Count tokens using model.count_tokens.
    Accepts str or list of content dicts."""
    return model.count_tokens(content).total_tokens

print("\n" + "=" * 80)
print("📋 SYSTEM INSTRUCTION")
print("=" * 80)
print(f"Text: {system_instruction}")
system_token_count = gemini_count_tokens(system_instruction)
print(f"Gemini Tokens (approx count_tokens): {system_token_count}")
viz, approx_count = visualize_tokens(system_instruction)
print(f"Token Visualization (tiktoken ~{approx_count} tokens):")
print(f"  {viz}")
print("=" * 80)

# Conversation stored as list of dicts: role + parts (strings)
conversation_history = []  # e.g. {"role": "user", "parts": ["text"]}

def display_user_message(user_text: str, gem_tokens: int):
    print("\n" + "-" * 80)
    print("👤 USER MESSAGE")
    print("-" * 80)
    print(f"Text: {user_text}")
    print(f"Gemini Tokens (count_tokens): {gem_tokens}")
    viz, approx = visualize_tokens(user_text)
    print(f"Token Visualization (tiktoken ~{approx} tokens):")
    print(f"  {viz}")
    print("-" * 80)

def display_model_response(response_text: str, gem_tokens: int, usage):
    print("\n" + "-" * 80)
    print("🤖 MODEL RESPONSE")
    print("-" * 80)
    print(f"Text: {response_text}")
    print(f"Gemini Tokens (count_tokens): {gem_tokens}")
    viz, approx = visualize_tokens(response_text)
    print(f"Token Visualization (tiktoken ~{approx} tokens):")
    print(f"  {viz}")
    if usage:
        # usage may differ between versions; guard attribute access
        prompt_tokens = getattr(usage, "prompt_token_count", None)
        resp_tokens = getattr(usage, "candidates_token_count", None)
        total_tokens = getattr(usage, "total_token_count", None)
        print("\n📊 Usage:")
        print(f"  Prompt={prompt_tokens} Response={resp_tokens} Total={total_tokens}")
    print("-" * 80)

print("\n💬 Interactive Chat (type 'exit' or 'quit' to end)")
print("=" * 80)

while True:
    user_input = input("\nYou: ").strip()
    if user_input.lower() in {"exit", "quit", "q"}:
        print("\n👋 Goodbye!")
        break
    if not user_input:
        continue

    user_msg = {"role": "user", "parts": [user_input]}
    user_token_count = gemini_count_tokens([user_msg])
    display_user_message(user_input, user_token_count)
    conversation_history.append(user_msg)

    try:
        response = model.generate_content(conversation_history)
        # response.text may be None if empty; fallback join parts
        response_text = response.text or "".join(
            part.text for part in getattr(response, "parts", []) if hasattr(part, "text")
        )
        model_msg = {"role": "model", "parts": [response_text]}
        model_token_count = gemini_count_tokens([model_msg])
        display_model_response(
            response_text,
            model_token_count,
            getattr(response, "usage_metadata", None),
        )
        conversation_history.append(model_msg)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        # remove last user message to keep conversation stable
        if conversation_history and conversation_history[-1] is user_msg:
            conversation_history.pop()