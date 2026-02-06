import os
from typing import Any, Dict, List, Optional

from anthropic import Anthropic


class AnthropicChatSession:
    """
    Lightweight wrapper around an Anthropic chat interaction, keeping history
    and exposing send_message() consistent with existing clients.
    """

    def __init__(self, client: Anthropic, model_name: str, system_instruction: str, history: List[Dict[str, Any]]):
        self._client = client
        self._model = model_name
        self._system = system_instruction or ""
        # History format: list of dicts with keys 'role' in {"user","assistant"} and 'content' string
        self._history = list(history or [])

    def send_message(self, text: str) -> str:
        """Send a user message and return assistant reply; append both to history."""
        self._history.append({"role": "user", "content": text})

        # Build messages in Anthropic format (excluding system which goes separately)
        messages = [{"role": h["role"], "content": h["content"]} for h in self._history]

        # Read generation params from environment (with defaults)
        temperature = float(os.getenv("TEMPERATURE", "1.0"))
        top_p = float(os.getenv("TOP_P", "1.0"))
        top_k = int(os.getenv("TOP_K", "0"))  # 0 means disabled in Anthropic

        response = self._client.messages.create(
            model=self._model,
            max_tokens=1024,
            temperature=temperature,
            top_p=top_p,
            top_k=top_k if top_k > 0 else None,
            system=self._system if self._system else None,
            messages=messages,
        )

        # Anthropic returns content as a list of blocks; join textual parts
        parts = []
        for block in getattr(response, "content", []):
            if getattr(block, "type", "") == "text":
                parts.append(getattr(block, "text", ""))
        answer = "\n".join(p for p in parts if p is not None)

        self._history.append({"role": "assistant", "content": answer})
        return answer

    def get_history(self) -> List[Dict[str, Any]]:
        return self._history


class AnthropicClient:
    """
    Anthropic API client compatible with the existing LLM client interface.
    Expects environment variables:
      - ANTHROPIC_API_KEY
      - MODEL_NAME (optional; default 'claude-3-5-sonnet-20241022')
    """

    def __init__(self, client: Anthropic, model_name: str):
        self._client = client
        self._model = model_name

    @classmethod
    def from_environment(cls) -> "AnthropicClient":
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError("Missing ANTHROPIC_API_KEY in environment")
        model_name = os.getenv("MODEL_NAME", "claude-3-5-sonnet-20241022")
        client = Anthropic(api_key=api_key)
        return cls(client=client, model_name=model_name)

    def create_chat_session(self, system_instruction: str, history: Optional[List[Dict[str, Any]]], thinking_budget: int = 0) -> AnthropicChatSession:
        return AnthropicChatSession(
            client=self._client,
            model_name=self._model,
            system_instruction=system_instruction,
            history=history or [],
        )

    def count_history_tokens(self, history: List[Dict[str, Any]]) -> int:
        # Simple approximation: Anthropic SDK does not expose token counting directly.
        # Use length of content as proxy or integrate a tokenizer later.
        return sum(len(str(h.get("content", ""))) for h in history)

    def get_model_name(self) -> str:
        return self._model
"""
Google Gemini LLM Client Implementation
Encapsulates all Google Gemini AI interactions.
"""

import os
import sys
from typing import Optional, List, Any, Dict
from google import genai
from google.genai import types
from dotenv import load_dotenv
from cli import console
from .gemini_validation import GeminiConfig



class GeminiChatSessionWrapper:
    """
    Wrapper for Gemini chat session that provides universal dictionary-based history format.
    This ensures compatibility with LlamaClient's history format.
    """
    
    def __init__(self, gemini_session):
        """
        Initialize wrapper with Gemini chat session.
        
        Args:
            gemini_session: The actual Gemini chat session object
        """
        self.gemini_session = gemini_session
    
    def send_message(self, text: str) -> Any:
        """
        Forwards message to Gemini session.
        
        Args:
            text: User's message
            
        Returns:
            Response object from Gemini
        """
        return self.gemini_session.send_message(text)
    
    def get_history(self) -> List[Dict]:
        """
        Gets conversation history in universal dictionary format.
        
        Returns:
            List of dictionaries with format: {"role": "user|model", "parts": [{"text": "..."}]}
        """
        gemini_history = self.gemini_session.get_history()
        universal_history = []
        
        for content in gemini_history:
            # Convert Gemini Content object to universal dictionary format
            text_part = ""
            if hasattr(content, 'parts') and content.parts:
                for part in content.parts:
                    if hasattr(part, 'text') and part.text:
                        text_part = part.text
                        break
            
            if text_part:
                universal_content = {
                    "role": content.role,
                    "parts": [{"text": text_part}]
                }
                universal_history.append(universal_content)
        
        return universal_history

class GeminiLLMClient:
    """
    Encapsulates all Google Gemini AI interactions.
    Provides a clean interface for chat sessions, token counting, and configuration.
    """
    
    def __init__(self, model_name: str, api_key: str):
        """
        Initialize the Gemini LLM client with explicit parameters.
        
        Args:
            model_name: Model to use (e.g., 'gemini-2.5-flash')
            api_key: Google Gemini API key
        
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
        Returns a message indicating that Gemini client is being prepared.
        
        Returns:
            Formatted preparation message string
        """
        return "🤖 Przygotowywanie klienta Gemini..."
    
    @classmethod
    def from_environment(cls) -> 'GeminiLLMClient':
        """
        Factory method that creates a GeminiLLMClient instance from environment variables.
        
        Returns:
            GeminiLLMClient instance initialized with environment variables
            
        Raises:
            ValueError: If required environment variables are not set
        """
        load_dotenv()
    
        # Walidacja z Pydantic
        config = GeminiConfig(
            model_name=os.getenv('MODEL_NAME', 'gemini-2.5-flash'),
            gemini_api_key=os.getenv('GEMINI_API_KEY', '')
        )
        
        return cls(model_name=config.model_name, api_key=config.gemini_api_key)
    
    def _initialize_client(self) -> genai.Client:
        """
        Initializes the Google GenAI client.
        
        Returns:
            Initialized GenAI client
            
        Raises:
            SystemExit: If client initialization fails
        """
        try:
            return genai.Client()
        except Exception as e:
            console.print_error(f"Błąd inicjalizacji klienta Gemini: {e}")
            sys.exit(1)
    
    def create_chat_session(self, 
                          system_instruction: str, 
                          history: Optional[List[Dict]] = None,
                          thinking_budget: int = 0) -> GeminiChatSessionWrapper:
        """
        Creates a new chat session with the specified configuration.
        
        Args:
            system_instruction: System role/prompt for the assistant
            history: Previous conversation history (optional, in universal dict format)
            thinking_budget: Thinking budget for the model
            
        Returns:
            GeminiChatSessionWrapper with universal dictionary-based interface
        """
        if not self._client:
            raise RuntimeError("LLM client not initialized")
        
        # Convert universal dict format to Gemini Content objects
        gemini_history = []
        if history:
            for entry in history:
                if isinstance(entry, dict) and 'role' in entry and 'parts' in entry:
                    text = entry['parts'][0].get('text', '') if entry['parts'] else ''
                    if text:
                        content = types.Content(
                            role=entry['role'],
                            parts=[types.Part.from_text(text=text)]
                        )
                        gemini_history.append(content)
        
        gemini_session = self._client.chats.create(
            model=self.model_name,
            history=gemini_history,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                thinking_config=types.ThinkingConfig(thinking_budget=thinking_budget)
            )
        )
        
        return GeminiChatSessionWrapper(gemini_session)
    
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
            # Convert universal dict format to Gemini Content objects for token counting
            gemini_history = []
            for entry in history:
                if isinstance(entry, dict) and 'role' in entry and 'parts' in entry:
                    text = entry['parts'][0].get('text', '') if entry['parts'] else ''
                    if text:
                        content = types.Content(
                            role=entry['role'],
                            parts=[types.Part.from_text(text=text)]
                        )
                        gemini_history.append(content)
            
            response = self._client.models.count_tokens(
                model=self.model_name,
                contents=gemini_history
            )
            return response.total_tokens
        except Exception as e:
            console.print_error(f"Błąd podczas liczenia tokenów: {e}")
            return 0
    
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
        
        return f"✅ Klient Gemini gotowy do użycia (Model: {self.model_name}, Key: {masked_key})"
    
    @property
    def client(self):
        """
        Provides access to the underlying GenAI client for backwards compatibility.
        This property should be used sparingly and eventually removed.
        """
        return self._client
