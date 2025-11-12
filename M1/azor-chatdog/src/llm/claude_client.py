"""
Anthropic Claude LLM Client Implementation
Encapsulates all Anthropic Claude AI interactions.
"""

import os
import sys
from typing import Optional, List, Any, Dict
from anthropic import Anthropic
from dotenv import load_dotenv
from cli import console
from .claude_validation import ClaudeConfig


class ClaudeChatSessionWrapper:
    """
    Wrapper for Claude chat session that provides universal dictionary-based history format.
    This ensures compatibility with GeminiClient and LlamaClient history formats.
    """

    def __init__(self, claude_client: Anthropic, model_name: str, system_instruction: str, history: Optional[List[Dict]] = None,
                 temperature: Optional[float] = None, top_p: Optional[float] = None, top_k: Optional[int] = None):
        """
        Initialize wrapper with Claude client and configuration.

        Args:
            claude_client: The Anthropic client instance
            model_name: Model name to use for completions
            system_instruction: System instruction/prompt for the assistant
            history: Previous conversation history (optional)
            temperature: Sampling temperature (0.0-1.0, optional)
            top_p: Nucleus sampling parameter (0.0-1.0, optional)
            top_k: Top-k sampling parameter (optional)
        """
        self.claude_client = claude_client
        self.model_name = model_name
        self.system_instruction = system_instruction
        self._history = history or []
        self.temperature = temperature
        self.top_p = top_p
        self.top_k = top_k

    def send_message(self, text: str) -> Any:
        """
        Sends message to Claude and returns response.

        Args:
            text: User's message

        Returns:
            Response object from Claude with .text attribute
        """
        # Add user message to history
        user_message = {"role": "user", "parts": [{"text": text}]}
        self._history.append(user_message)

        try:
            # Convert history to Claude's message format
            messages = self._convert_history_to_claude_messages()

            # Build API parameters
            api_params = {
                "model": self.model_name,
                "max_tokens": 8192,
                "system": self.system_instruction,
                "messages": messages
            }

            # Add optional sampling parameters if provided
            if self.temperature is not None:
                api_params["temperature"] = self.temperature
            if self.top_p is not None:
                api_params["top_p"] = self.top_p
            if self.top_k is not None:
                api_params["top_k"] = self.top_k

            # Call Claude API
            response = self.claude_client.messages.create(**api_params)

            # Extract response text
            response_text = response.content[0].text

            # Add assistant response to history
            assistant_message = {"role": "model", "parts": [{"text": response_text}]}
            self._history.append(assistant_message)

            # Return response object compatible with Gemini interface
            return ClaudeResponse(response_text)

        except Exception as e:
            console.print_error(f"Błąd podczas generowania odpowiedzi Claude: {e}")
            # Return error response
            error_text = "Przepraszam, wystąpił błąd podczas generowania odpowiedzi."
            assistant_message = {"role": "model", "parts": [{"text": error_text}]}
            self._history.append(assistant_message)
            return ClaudeResponse(error_text)

    def get_history(self) -> List[Dict]:
        """
        Gets conversation history in universal dictionary format.

        Returns:
            List of dictionaries with format: {"role": "user|model", "parts": [{"text": "..."}]}
        """
        return self._history

    def _convert_history_to_claude_messages(self) -> List[Dict[str, str]]:
        """
        Converts universal history format to Claude's message format.

        Returns:
            List of messages in Claude format: [{"role": "user|assistant", "content": "..."}]
        """
        claude_messages = []

        for entry in self._history:
            role = entry["role"]
            text = entry["parts"][0]["text"] if entry["parts"] else ""

            if text:
                # Map "model" role to "assistant" for Claude
                claude_role = "assistant" if role == "model" else role
                claude_messages.append({
                    "role": claude_role,
                    "content": text
                })

        return claude_messages


class ClaudeResponse:
    """
    Response object that mimics the Gemini response interface.
    Provides a .text attribute containing the response text.
    """

    def __init__(self, text: str):
        self.text = text


class ClaudeLLMClient:
    """
    Encapsulates all Anthropic Claude AI interactions.
    Provides a clean interface for chat sessions, token counting, and configuration.
    """

    def __init__(self, model_name: str, api_key: str):
        """
        Initialize the Claude LLM client with explicit parameters.

        Args:
            model_name: Model to use (e.g., 'claude-3-5-sonnet-20241022')
            api_key: Anthropic API key

        Raises:
            ValueError: If api_key is empty or None
        """
        if not api_key:
            raise ValueError("API key cannot be empty or None")

        self.model_name = model_name
        self.api_key = api_key

        # Initialize the client during construction
        self._client = self._initialize_client()

    @staticmethod
    def preparing_for_use_message() -> str:
        """
        Returns a message indicating that Claude client is being prepared.

        Returns:
            Formatted preparation message string
        """
        return "🤖 Przygotowywanie klienta Claude..."

    @classmethod
    def from_environment(cls) -> 'ClaudeLLMClient':
        """
        Factory method that creates a ClaudeLLMClient instance from environment variables.

        Returns:
            ClaudeLLMClient instance initialized with environment variables

        Raises:
            ValueError: If required environment variables are not set
        """
        load_dotenv()

        # Walidacja z Pydantic
        config = ClaudeConfig(
            model_name=os.getenv('MODEL_NAME', 'claude-3-5-sonnet-20241022'),
            anthropic_api_key=os.getenv('ANTHROPIC_API_KEY', '')
        )

        return cls(model_name=config.model_name, api_key=config.anthropic_api_key)

    def _initialize_client(self) -> Anthropic:
        """
        Initializes the Anthropic client.

        Returns:
            Initialized Anthropic client

        Raises:
            SystemExit: If client initialization fails
        """
        try:
            return Anthropic(api_key=self.api_key)
        except Exception as e:
            console.print_error(f"Błąd inicjalizacji klienta Claude: {e}")
            sys.exit(1)

    def create_chat_session(self,
                          system_instruction: str,
                          history: Optional[List[Dict]] = None,
                          thinking_budget: int = 0,
                          temperature: Optional[float] = None,
                          top_p: Optional[float] = None,
                          top_k: Optional[int] = None) -> ClaudeChatSessionWrapper:
        """
        Creates a new chat session with the specified configuration.

        Args:
            system_instruction: System role/prompt for the assistant
            history: Previous conversation history (optional, in universal dict format)
            thinking_budget: Thinking budget for the model (not used by Claude currently)
            temperature: Sampling temperature (0.0-1.0, optional). Controls randomness in responses.
            top_p: Nucleus sampling parameter (0.0-1.0, optional). Considers tokens with cumulative probability up to top_p.
            top_k: Top-k sampling parameter (optional). Only samples from top K most likely tokens.

        Returns:
            ClaudeChatSessionWrapper with universal dictionary-based interface
        """
        print(f"Creating chat session with model: {self.model_name}, temperature: {temperature}, top_p: {top_p}, top_k: {top_k}")
        if not self._client:
            raise RuntimeError("LLM client not initialized")

        return ClaudeChatSessionWrapper(
            claude_client=self._client,
            model_name=self.model_name,
            system_instruction=system_instruction,
            history=history or [],
            temperature=temperature,
            top_p=top_p,
            top_k=top_k
        )

    def count_history_tokens(self, history: List[Dict]) -> int:
        """
        Counts tokens for the given conversation history.

        Args:
            history: Conversation history in universal dict format

        Returns:
            Total token count
        """
        if not history:
            return 0

        try:
            # Convert universal dict format to Claude message format
            messages = []
            for entry in history:
                if isinstance(entry, dict) and 'role' in entry and 'parts' in entry:
                    text = entry['parts'][0].get('text', '') if entry['parts'] else ''
                    if text:
                        # Map "model" role to "assistant" for Claude
                        claude_role = "assistant" if entry['role'] == "model" else entry['role']
                        messages.append({
                            "role": claude_role,
                            "content": text
                        })

            # Use Claude's token counting API
            token_count = self._client.messages.count_tokens(
                model=self.model_name,
                messages=messages
            )

            return token_count.input_tokens
        except Exception as e:
            console.print_error(f"Błąd podczas liczenia tokenów: {e}")
            # Fallback: rough estimation (4 chars per token average)
            total_chars = sum(
                len(entry['parts'][0].get('text', ''))
                for entry in history
                if isinstance(entry, dict) and 'parts' in entry and entry['parts']
            )
            return total_chars // 4

    def get_model_name(self) -> str:
        """Returns the currently configured model name."""
        return self.model_name

    def is_available(self) -> bool:
        """
        Checks if the LLM service is available and properly configured.

        Returns:
            True if client is properly initialized and has API key
        """
        return self._client is not None and bool(self.api_key)

    def ready_for_use_message(self) -> str:
        """
        Returns a ready-to-use message with model info and masked API key.

        Returns:
            Formatted message string for display
        """
        # Mask API key - show first 4 and last 4 characters
        if len(self.api_key) <= 8:
            masked_key = "****"
        else:
            masked_key = f"{self.api_key[:4]}...{self.api_key[-4:]}"

        return f"✅ Klient Claude gotowy do użycia (Model: {self.model_name}, Key: {masked_key})"

    @property
    def client(self):
        """
        Provides access to the underlying Anthropic client for backwards compatibility.
        This property should be used sparingly and eventually removed.
        """
        return self._client
