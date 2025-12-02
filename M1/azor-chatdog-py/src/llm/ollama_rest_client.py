"""
Ollama LLM Client Implementation
Encapsulates all Ollama model interactions using HTTP API.
"""

import os
import requests
from typing import Optional, List, Any, Dict
from dotenv import load_dotenv
from cli import console
from .ollama_rest_validation import OllamaRestConfig
from .env_utils import parse_env_param


class OllamaRestChatSession:
    """
    Wrapper class that provides a chat session interface compatible with Gemini's interface.
    Manages conversation history and provides send_message() and get_history() methods.
    """
    
    def __init__(self, model_name: str, base_url: str, timeout: int, 
                 system_instruction: str, history: Optional[List[Dict]] = None,
                 temperature: Optional[float] = None, top_p: Optional[float] = None,
                 top_k: Optional[int] = None):
        """
        Initialize the Ollama chat session.
        
        Args:
            model_name: Name of the Ollama model to use
            base_url: Base URL of Ollama server
            timeout: Request timeout in seconds
            system_instruction: System prompt for the assistant
            history: Previous conversation history
            temperature: Temperature for response generation (0.0-2.0)
            top_p: Top P (nucleus sampling) for response generation (0.0-1.0)
            top_k: Top K for response generation
        """
        self.model_name = model_name
        self.base_url = base_url
        self.timeout = timeout
        self.system_instruction = system_instruction
        self._history = history or []
        self.temperature = temperature
        self.top_p = top_p
        self.top_k = top_k
        
    def send_message(self, text: str) -> Any:
        """
        Sends a message to the Ollama model and returns a response object.
        
        Args:
            text: User's message
            
        Returns:
            Response object with .text attribute containing the response
        """
        # Add user message to history
        user_message = {"role": "user", "parts": [{"text": text}]}
        self._history.append(user_message)
        
        # Convert history to Ollama format
        ollama_messages = self._convert_to_ollama_format()
        
        try:
            # Build request payload
            request_payload = {
                "model": self.model_name,
                "messages": ollama_messages,
                "stream": False # (msmet) check what if this will be tru - faster response but many calls and resposne as 'writing'?
            }
            
            # Add optional parameters if set
            options = {}
            if self.temperature is not None:
                options["temperature"] = self.temperature
            if self.top_p is not None:
                options["top_p"] = self.top_p
            if self.top_k is not None:
                options["top_k"] = self.top_k
            
            if options:
                request_payload["options"] = options
            
            # Call Ollama API
            response = requests.post(
                f"{self.base_url}/api/chat",
                json=request_payload,
                timeout=self.timeout
            )
            response.raise_for_status()
            
            # Extract response text
            response_data = response.json()
            response_text = response_data.get("message", {}).get("content", "").strip()
            
            # Add assistant response to history
            assistant_message = {"role": "model", "parts": [{"text": response_text}]}
            self._history.append(assistant_message)
            
            # Return response object compatible with Gemini interface
            return OllamaRestResponse(response_text)
            
        except requests.exceptions.RequestException as e:
            console.print_error(f"Błąd podczas generowania odpowiedzi Ollama: {e}")
            # Return error response
            error_text = "Przepraszam, wystąpił błąd podczas generowania odpowiedzi."
            assistant_message = {"role": "model", "parts": [{"text": error_text}]}
            self._history.append(assistant_message)
            return OllamaRestResponse(error_text)
    
    def get_history(self) -> List[Dict]:
        """Returns the current conversation history."""
        return self._history
    
    def _convert_to_ollama_format(self) -> List[Dict]:
        """
        Converts universal history format to Ollama message format.
        
        Returns:
            List of messages in Ollama format
        """
        ollama_messages = []
        
        # Add system instruction as first message
        if self.system_instruction:
            ollama_messages.append({
                "role": "system",
                "content": self.system_instruction
            })
        
        # Convert history to Ollama format
        for message in self._history:
            role = message["role"]
            text = message["parts"][0]["text"] if message.get("parts") else ""
            
            # Map roles: "model" -> "assistant", "user" -> "user"
            ollama_role = "assistant" if role == "model" else "user"
            
            ollama_messages.append({
                "role": ollama_role,
                "content": text
            })
        
        return ollama_messages


class OllamaRestResponse:
    """
    Response object that mimics the Gemini response interface.
    Provides a .text attribute containing the response text.
    """
    
    def __init__(self, text: str):
        self.text = text


class OllamaRestClient:
    """
    Encapsulates all Ollama model interactions.
    Provides a clean interface compatible with GeminiLLMClient and LlamaClient.
    """
    
    def __init__(self, model_name: str, base_url: str = "http://localhost:11434", timeout: int = 120,
                 temperature: Optional[float] = None, top_p: Optional[float] = None,
                 top_k: Optional[int] = None):
        """
        Initialize the Ollama client with explicit parameters.
        
        Args:
            model_name: Name of the Ollama model to use
            base_url: Base URL of Ollama server
            timeout: Request timeout in seconds
            temperature: Temperature for response generation (0.0-2.0)
            top_p: Top P (nucleus sampling) for response generation (0.0-1.0)
            top_k: Top K for response generation
            
        Raises:
            ValueError: If model_name is empty
        """
        if not model_name:
            raise ValueError("Model name cannot be empty")
        
        self.model_name = model_name
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.temperature = temperature
        self.top_p = top_p
        self.top_k = top_k
        
        # Verify Ollama server is available during construction
        self._check_availability()
    
    @staticmethod
    def preparing_for_use_message() -> str:
        """
        Returns a message indicating that Ollama REST client is being prepared.
        
        Returns:
            Formatted preparation message string
        """
        return "🦙 Przygotowywanie klienta Ollama (REST API)..."
    
    @classmethod
    def from_environment(cls) -> 'OllamaRestClient':
        """
        Factory method that creates an OllamaRestClient instance from environment variables.
        
        Returns:
            OllamaRestClient instance initialized with environment variables
            
        Raises:
            ValueError: If required environment variables are not set or invalid
        """
        load_dotenv()
    
        # Parse optional parameters
        temperature = parse_env_param('TEMPERATURE', float)
        top_p = parse_env_param('TOP_P', float)
        top_k = parse_env_param('TOP_K', int)
        
        # Walidacja z Pydantic
        config = OllamaRestConfig(
            model_name=os.getenv('MODEL_NAME', 'llama3.1:8b'),
            ollama_base_url=os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434'),
            ollama_timeout=int(os.getenv('OLLAMA_TIMEOUT', '120')),
            temperature=temperature,
            top_p=top_p,
            top_k=top_k
        )
        
        console.print_info(f"Łączenie z serwerem Ollama: {config.ollama_base_url}")
        console.print_info(f"Model: {config.model_name}")
        if config.temperature is not None:
            console.print_info(f"🌡️  Temperature: {config.temperature}")
        if config.top_p is not None:
            console.print_info(f"Top P: {config.top_p}")
        if config.top_k is not None:
            console.print_info(f"🎰 Top K: {config.top_k}")
        
        return cls(
            model_name=config.model_name,
            base_url=config.ollama_base_url,
            timeout=config.ollama_timeout,
            temperature=config.temperature,
            top_p=config.top_p,
            top_k=config.top_k
        )
    
    def _check_availability(self) -> None:
        """
        Checks if Ollama server is available and responsive.
        
        Raises:
            RuntimeError: If Ollama server is not available
        """
        try:
            response = requests.get(
                f"{self.base_url}/api/tags",
                timeout=5
            )
            response.raise_for_status()
            console.print_info("✅ Serwer Ollama jest dostępny")
            
            # Check if the requested model is available
            models_data = response.json()
            available_models = [m.get("name") for m in models_data.get("models", [])]
            
            if self.model_name not in available_models:
                console.print_info(
                    f"⚠️  Model '{self.model_name}' może nie być dostępny. "
                    f"Dostępne modele: {', '.join(available_models) if available_models else 'brak'}"
                )
            
        except requests.exceptions.RequestException as e:
            error_msg = (
                f"Nie można połączyć się z serwerem Ollama pod adresem {self.base_url}. "
                f"Upewnij się, że Ollama jest uruchomiona (ollama serve). Błąd: {e}"
            )
            console.print_error(error_msg)
            raise RuntimeError(error_msg)
    
    def create_chat_session(self, 
                          system_instruction: str, 
                          history: Optional[List[Dict]] = None,
                          thinking_budget: int = 0) -> OllamaRestChatSession:
        """
        Creates a new chat session with the specified configuration.
        
        Args:
            system_instruction: System role/prompt for the assistant
            history: Previous conversation history (optional)
            thinking_budget: Ignored for Ollama (compatibility parameter)
            
        Returns:
            OllamaRestChatSession object
        """
        return OllamaRestChatSession(
            model_name=self.model_name,
            base_url=self.base_url,
            timeout=self.timeout,
            system_instruction=system_instruction,
            history=history or [],
            temperature=self.temperature,
            top_p=self.top_p,
            top_k=self.top_k
        )
    
    def count_history_tokens(self, history: List[Dict]) -> int:
        """
        Counts tokens for the given conversation history.
        Note: This is an approximation since Ollama doesn't provide 
        direct token counting via API.
        
        Args:
            history: Conversation history
            
        Returns:
            Estimated token count (rough approximation: 1 token ≈ 4 characters)
        """
        if not history:
            return 0
        
        try:
            # Build text from history
            text_parts = []
            for message in history:
                if "parts" in message and message["parts"]:
                    text_parts.append(message["parts"][0]["text"])
            
            full_text = " ".join(text_parts)
            
            # Rough estimation: 1 token ≈ 4 characters
            estimated_tokens = len(full_text) // 4
            
            return estimated_tokens
            
        except Exception as e:
            console.print_error(f"Błąd podczas liczenia tokenów: {e}")
            return 0
    
    def get_model_name(self) -> str:
        """Returns the currently configured model name."""
        return self.model_name
    
    def is_available(self) -> bool:
        """
        Checks if the Ollama service is available and properly configured.
        
        Returns:
            True if Ollama server is reachable
        """
        try:
            response = requests.get(
                f"{self.base_url}/api/tags",
                timeout=5
            )
            return response.status_code == 200
        except:
            return False
    
    def ready_for_use_message(self) -> str:
        """
        Returns a ready-to-use message with model info and server details.
        
        Returns:
            Formatted message string for display
        """
        return f"✅ Klient Ollama (REST API) gotowy do użycia (Model: {self.model_name}, Server: {self.base_url})"
    
    @property
    def client(self):
        """
        Provides access to the base URL for backwards compatibility.
        This property should be used sparingly and eventually removed.
        """
        return self.base_url
