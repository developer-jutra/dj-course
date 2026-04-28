import os
import sys
from typing import Any, Dict, List, Optional

# Fix Windows console encoding issues before importing OpenAI SDK
if sys.platform == "win32":
    import locale
    # Force English locale to avoid Polish characters in User-Agent headers
    try:
        locale.setlocale(locale.LC_ALL, 'C')
    except:
        pass
    os.environ.setdefault("LANG", "en_US.UTF-8")
    os.environ.setdefault("LC_ALL", "en_US.UTF-8")

# Monkey-patch httpx to force UTF-8 encoding for headers (fixes Windows Polish locale bug)
import httpx._models
_original_normalize = httpx._models._normalize_header_value

def _normalize_header_value_utf8(value, encoding=None):
    """Force UTF-8 encoding for all headers to avoid ASCII codec errors on Windows."""
    if isinstance(value, str):
        return value.encode('utf-8')
    return _original_normalize(value, encoding)

httpx._models._normalize_header_value = _normalize_header_value_utf8

from openai import OpenAI


class OpenAIChatSession:
    """
    Minimal wrapper around OpenAI Chat Completions keeping conversation history.
    Compatible shape with other clients.
    """

    def __init__(self, client: OpenAI, model_name: str, system_instruction: str, history: List[Dict[str, Any]]):
        self._client = client
        self._model = model_name
        self._system = system_instruction or ""
        # History: list of {role: "user"|"assistant", content: str}
        self._history = list(history or [])

    def send_message(self, text: str) -> str:
        self._history.append({"role": "user", "content": text})

        # Build messages including system message at the beginning if provided
        messages = []
        if self._system:
            messages.append({"role": "system", "content": self._system})
        messages.extend(self._history)

        # Read generation params from environment (with defaults)
        temperature = float(os.getenv("TEMPERATURE", "0.7"))
        top_p = float(os.getenv("TOP_P", "1.0"))

        completion = self._client.chat.completions.create(
            model=self._model,
            messages=messages,
            temperature=temperature,
            top_p=top_p,
            max_tokens=1024,
        )

        answer = completion.choices[0].message.content if completion.choices else ""
        self._history.append({"role": "assistant", "content": answer})
        return answer

    def get_history(self) -> List[Dict[str, Any]]:
        return self._history


class OpenAIClient:
    """
    OpenAI API client. Environment variables:
      - OPENAI_API_KEY (required)
      - MODEL_NAME (optional; default 'gpt-4o-mini')
    """

    def __init__(self, client: OpenAI, model_name: str):
        self._client = client
        self._model = model_name

    @classmethod
    def from_environment(cls) -> "OpenAIClient":
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("Missing OPENAI_API_KEY in environment")
        model_name = os.getenv("MODEL_NAME", "gpt-4o-mini")
        
        # Ensure API key is properly encoded to avoid ASCII encoding issues
        # This fixes Windows console UTF-8 problems with httpx headers
        api_key = api_key.strip()
        
        client = OpenAI(
            api_key=api_key,
            max_retries=2,
            timeout=30.0
        )
        return cls(client=client, model_name=model_name)

    def create_chat_session(self, system_instruction: str, history: Optional[List[Dict[str, Any]]], thinking_budget: int = 0) -> OpenAIChatSession:
        return OpenAIChatSession(
            client=self._client,
            model_name=self._model,
            system_instruction=system_instruction,
            history=history or [],
        )

    def count_history_tokens(self, history: List[Dict[str, Any]]) -> int:
        # Approximate counting by character length; can be replaced with tokenizer.
        return sum(len(str(h.get("content", ""))) for h in history)

    def get_model_name(self) -> str:
        return self._model
