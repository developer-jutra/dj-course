import os
import asyncio
from dotenv import load_dotenv
from anthropic import Anthropic, AsyncClient

load_dotenv()

print(f"env var \"ANTHROPIC_API_KEY\": { os.getenv('ANTHROPIC_API_KEY', '')[:4] + '...' + os.getenv('ANTHROPIC_API_KEY', '')[-4:] if len(os.getenv('ANTHROPIC_API_KEY', '')) > 0 else 'NOT SET' }")
if not os.getenv('ANTHROPIC_API_KEY'):
    raise ValueError("ANTHROPIC_API_KEY environment variable is not set. Please set it to your OpenAI API key.")


client = AsyncClient(api_key=os.getenv('ANTHROPIC_API_KEY'))
MODEL = 'claude-3-5-haiku-latest'
# MODEL = 'claude-haiku-4-5'
# MODEL = 'claude-opus-4-1'
# MODEL = 'claude-sonnet-4-5'

async def send_message(content: str):
    message = await client.messages.create(
        model=MODEL,
        max_tokens=256,
        messages=[{"role": "user", "content": content}],
    )
    return message

async def main():
    PROMPT = 'Write a super short software joke in Polish.'
    response = await send_message(PROMPT)
    print(response.content[0].text)

if __name__ == '__main__':
    asyncio.run(main())
