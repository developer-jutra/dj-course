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
from .env_utils import parse_env_param

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
    
    def __init__(self, model_name: str, api_key: str, temperature: Optional[float] = None,
                 top_p: Optional[float] = None, top_k: Optional[int] = None):
        """
        Initialize the Gemini LLM client with explicit parameters.
        
        Args:
            model_name: Model to use (e.g., 'gemini-2.5-flash')
            api_key: Google Gemini API key
            temperature: Temperature for response generation (0.0-2.0)
            top_p: Top P (nucleus sampling) for response generation (0.0-1.0)
            top_k: Top K for response generation
        
        Raises:
            ValueError: If api_key is empty or None
        """
        if not api_key:
            raise ValueError("API key cannot be empty or None")
        
        self.model_name = model_name
        self.api_key = api_key
        self.temperature = temperature
        self.top_p = top_p
        self.top_k = top_k
        
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
    
        # Parse optional parameters
        temperature = parse_env_param('TEMPERATURE', float)
        top_p = parse_env_param('TOP_P', float)
        top_k = parse_env_param('TOP_K', int)
        
        # Walidacja z Pydantic
        config = GeminiConfig(
            model_name=os.getenv('MODEL_NAME', 'gemini-2.5-flash'),
            gemini_api_key=os.getenv('GEMINI_API_KEY', ''),
            temperature=temperature,
            top_p=top_p,
            top_k=top_k
        )
        
        if config.temperature is not None:
            console.print_info(f"🌡️  Temperature: {config.temperature}")
        if config.top_p is not None:
            console.print_info(f"Top P: {config.top_p}")
        if config.top_k is not None:
            console.print_info(f"🎰 Top K: {config.top_k}")
        
        return cls(
            model_name=config.model_name,
            api_key=config.gemini_api_key,
            temperature=config.temperature,
            top_p=config.top_p,
            top_k=config.top_k
        )
    
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
        
        # Build generation config
        generation_config_params = {}
        if self.temperature is not None:
            generation_config_params["temperature"] = self.temperature
        if self.top_p is not None:
            generation_config_params["top_p"] = self.top_p
        if self.top_k is not None:
            generation_config_params["top_k"] = self.top_k
        
        config_params = {
            "system_instruction": system_instruction,
            "thinking_config": types.ThinkingConfig(thinking_budget=thinking_budget)
        }
        
        if generation_config_params:
            config_params["generation_config"] = generation_config_params
        
        gemini_session = self._client.chats.create(
            model=self.model_name,
            history=gemini_history,
            config=types.GenerateContentConfig(**config_params)
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
