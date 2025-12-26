"""
Local Ollama REST API Client Implementation
Encapsulates all local Ollama model interactions using its REST API.
"""

import os
import httpx
from typing import Optional, List, Any, Dict
from dotenv import load_dotenv
from cli import console
from .ollama_validation import OllamaConfig


class OllamaResponse:
    """
    Response object that mimics the Gemini and Llama response interface.
    Provides a .text attribute containing the response text.
    """

    def __init__(self, text: str):
        self.text = text


class OllamaChatSession:
    """
    Wrapper class that provides a chat session interface compatible with other clients.
    Manages conversation history and provides send_message() and get_history() methods.
    """
    load_dotenv()

    def __init__(
        self,
        client: httpx.Client,
        model_name: str,
        api_base_url: str,
        system_instruction: str,
        history: Optional[List[Dict]] = None,
        temperature: Optional[float] = float(v) if (v := os.getenv("TEMPERATURE")) else None,
        top_p: Optional[float] = float(v) if (v := os.getenv("TOP_P")) else None,
        top_k: Optional[int] = int(v) if (v := os.getenv("TOP_K")) else None,
    ):
        self.client = client
        self.model_name = model_name
        self.api_base_url = api_base_url
        self.system_instruction = system_instruction
        self._history = history or []
        self.temperature = temperature
        self.top_p = top_p
        self.top_k = top_k

    def send_message(self, text: str) -> OllamaResponse:
        """
        Sends a message to the Ollama model via its REST API and returns a response object.

        Args:
            text: User's message

        Returns:
            Response object with .text attribute containing the response
        """
        user_message = {"role": "user", "parts": [{"text": text}]}
        self._history.append(user_message)

        # Convert history to Ollama's expected format
        ollama_messages = self._convert_history_to_ollama_format()

        payload = {
            "model": self.model_name,
            "messages": ollama_messages,
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "top_p": self.top_p,
                "top_k": self.top_k,
            },
        }

        try:
            response = self.client.post(
                f"{self.api_base_url}/api/chat", json=payload, timeout=120
            )
            response.raise_for_status()

            response_data = response.json()
            response_text = response_data.get("message", {}).get("content", "").strip()

            assistant_message = {"role": "model", "parts": [{"text": response_text}]}
            self._history.append(assistant_message)

            return OllamaResponse(response_text)

        except (httpx.RequestError, httpx.HTTPStatusError) as e:
            error_message = f"Błąd podczas komunikacji z API Ollama: {e}"
            console.print_error(error_message)
            assistant_message = {"role": "model", "parts": [{"text": error_message}]}
            self._history.append(assistant_message)
            return OllamaResponse(error_message)

    def get_history(self) -> List[Dict]:
        """Returns the current conversation history."""
        return self._history

    def _convert_history_to_ollama_format(self) -> List[Dict]:
        """Converts internal history format to Ollama's message format."""
        ollama_messages = []
        if self.system_instruction:
            ollama_messages.append(
                {"role": "system", "content": self.system_instruction}
            )

        for message in self._history:
            role = "assistant" if message["role"] == "model" else message["role"]
            content = message["parts"][0]["text"]
            ollama_messages.append({"role": role, "content": content})

        return ollama_messages


class OllamaClient:
    """
    Encapsulates all Ollama REST API interactions.
    Provides a clean interface compatible with GeminiLLMClient and LlamaClient.
    """

    def __init__(
        self,
        model_name: str,
        api_base_url: str,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        top_k: Optional[int] = None,
    ):
        if not api_base_url:
            raise ValueError("Ollama API base URL cannot be empty")
        self.model_name = model_name
        self.api_base_url = api_base_url.rstrip("/")
        self.temperature = temperature
        self.top_p = top_p
        self.top_k = top_k
        self._client = self._initialize_client()

    @staticmethod
    def preparing_for_use_message() -> str:
        return "🦙 Przygotowywanie klienta Ollama (REST API)..."

    @classmethod
    def from_environment(cls) -> "OllamaClient":
        load_dotenv()
        config = OllamaConfig(
            model_name=os.getenv("OLLAMA_MODEL_NAME", "gemma3:4b"),
            ollama_api_base_url=os.getenv(
                "OLLAMA_API_BASE_URL", "http://localhost:11434"
            ),
        )
        console.print_info(
            f"Konfiguracja klienta Ollama z URL: {config.ollama_api_base_url}"
        )
        return cls(
            model_name=config.model_name, api_base_url=config.ollama_api_base_url
        )

    def _initialize_client(self) -> httpx.Client:
        """Initializes the httpx client."""
        return httpx.Client()

    def create_chat_session(
        self,
        system_instruction: str,
        history: Optional[List[Dict]] = None,
        thinking_budget: int = 0,
    ) -> OllamaChatSession:
        if not self._client:
            raise RuntimeError("Klient Ollama nie został zainicjowany")
        return OllamaChatSession(
            client=self._client,
            model_name=self.model_name,
            api_base_url=self.api_base_url,
            system_instruction=system_instruction,
            history=history or [],
        )

    def count_history_tokens(self, history: List[Dict]) -> int:
        """
        Estimates token count for the given conversation history.
        Ollama's API does not have a dedicated token counting endpoint,
        so this is a rough estimation.
        """
        if not history:
            return 0

        # Fallback: rough estimation (4 chars per token on average)
        full_text = " ".join(
            [msg["parts"][0]["text"] for msg in history if msg.get("parts")]
        )
        return len(full_text) // 4

    def get_model_name(self) -> str:
        return self.model_name

    def is_available(self) -> bool:
        """Checks if the Ollama API is available by checking the tags endpoint."""
        if not self._client:
            return False
        try:
            # Using /api/tags as a more reliable health check endpoint
            response = self.client.get(f"{self.api_base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except httpx.RequestError:
            return False

    def ready_for_use_message(self) -> str:
        return f"✅ Klient Ollama gotowy do użycia (Model: {self.model_name}, URL: {self.api_base_url})"

    @property
    def client(self):
        return self._client
