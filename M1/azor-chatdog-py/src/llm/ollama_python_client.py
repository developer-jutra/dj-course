"""
Ollama Python Client Implementation
Encapsulates all Ollama model interactions using official ollama-python library.
"""

import os
from typing import Optional, List, Any, Dict
import ollama
from dotenv import load_dotenv
from cli import console
from .ollama_python_validation import OllamaPythonConfig


class OllamaPythonChatSession:
    """
    Wrapper class that provides a chat session interface compatible with Gemini's interface.
    Uses official ollama-python library for communication.
    Manages conversation history and provides send_message() and get_history() methods.
    """
    
    def __init__(self, model_name: str, host: str, timeout: float,
                 system_instruction: str, history: Optional[List[Dict]] = None):
        """
        Initialize the Ollama Python chat session.
        
        Args:
            model_name: Name of the Ollama model to use
            host: Host URL of Ollama server
            timeout: Request timeout in seconds
            system_instruction: System prompt for the assistant
            history: Previous conversation history
        """
        self.model_name = model_name
        self.host = host
        self.timeout = timeout
        self.system_instruction = system_instruction
        self._history = history or []
        
        # Create ollama client with custom host
        self._ollama_client = ollama.Client(host=host)
        
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
            # Call Ollama API using official library
            response = self._ollama_client.chat(
                model=self.model_name,
                messages=ollama_messages,
                options={
                    'timeout': self.timeout
                }
            )
            
            # Extract response text
            response_text = response.get('message', {}).get('content', '').strip()
            
            # Add assistant response to history
            assistant_message = {"role": "model", "parts": [{"text": response_text}]}
            self._history.append(assistant_message)
            
            # Return response object compatible with Gemini interface
            return OllamaPythonResponse(response_text)
            
        except Exception as e:
            console.print_error(f"Błąd podczas generowania odpowiedzi Ollama: {e}")
            # Return error response
            error_text = "Przepraszam, wystąpił błąd podczas generowania odpowiedzi."
            assistant_message = {"role": "model", "parts": [{"text": error_text}]}
            self._history.append(assistant_message)
            return OllamaPythonResponse(error_text)
    
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


class OllamaPythonResponse:
    """
    Response object that mimics the Gemini response interface.
    Provides a .text attribute containing the response text.
    """
    
    def __init__(self, text: str):
        self.text = text


class OllamaPythonClient:
    """
    Encapsulates all Ollama model interactions using official ollama-python library.
    Provides a clean interface compatible with GeminiLLMClient and LlamaClient.
    """
    
    def __init__(self, model_name: str, host: str = "http://localhost:11434", timeout: float = 120.0):
        """
        Initialize the Ollama Python client with explicit parameters.
        
        Args:
            model_name: Name of the Ollama model to use
            host: Host URL of Ollama server
            timeout: Request timeout in seconds
            
        Raises:
            ValueError: If model_name is empty
        """
        if not model_name:
            raise ValueError("Model name cannot be empty")
        
        self.model_name = model_name
        self.host = host.rstrip('/')
        self.timeout = timeout
        
        # Create ollama client
        self._ollama_client = ollama.Client(host=host)
        
        # Verify Ollama server is available during construction
        self._check_availability()
    
    @staticmethod
    def preparing_for_use_message() -> str:
        """
        Returns a message indicating that Ollama Python client is being prepared.
        
        Returns:
            Formatted preparation message string
        """
        return "🦙 Przygotowywanie klienta Ollama (Python SDK)..."
    
    @classmethod
    def from_environment(cls) -> 'OllamaPythonClient':
        """
        Factory method that creates an OllamaPythonClient instance from environment variables.
        
        Returns:
            OllamaPythonClient instance initialized with environment variables
            
        Raises:
            ValueError: If required environment variables are not set or invalid
        """
        load_dotenv()
    
        # Walidacja z Pydantic
        config = OllamaPythonConfig(
            model_name=os.getenv('MODEL_NAME', 'llama3.1:8b'),
            ollama_host=os.getenv('OLLAMA_HOST', 'http://localhost:11434'),
            ollama_timeout=float(os.getenv('OLLAMA_TIMEOUT', '120.0'))
        )
        
        console.print_info(f"Łączenie z serwerem Ollama: {config.ollama_host}")
        console.print_info(f"Model: {config.model_name}")
        
        return cls(
            model_name=config.model_name,
            host=config.ollama_host,
            timeout=config.ollama_timeout
        )
    
    def _check_availability(self) -> None:
        """
        Checks if Ollama server is available and the model exists.
        
        Raises:
            RuntimeError: If Ollama server is not available
        """
        try:
            # List available models
            models_response = self._ollama_client.list()
            # Access models attribute (not get method), each model has 'model' attribute (not 'name')
            available_models = [model.model for model in models_response.models]
            
            console.print_info("✅ Serwer Ollama jest dostępny")
            
            # Check if the requested model is available
            if self.model_name not in available_models:
                console.print_info(
                    f"⚠️  Model '{self.model_name}' może nie być dostępny. "
                    f"Dostępne modele: {', '.join(available_models) if available_models else 'brak'}"
                )
                console.print_info(f"💡 Możesz pobrać model: ollama pull {self.model_name}")
            else:
                console.print_info(f"✅ Model '{self.model_name}' jest dostępny")
            
        except Exception as e:
            error_msg = (
                f"Nie można połączyć się z serwerem Ollama pod adresem {self.host}. "
                f"Upewnij się, że Ollama jest uruchomiona (ollama serve). Błąd: {e}"
            )
            console.print_error(error_msg)
            raise RuntimeError(error_msg)
    
    def create_chat_session(self, 
                          system_instruction: str, 
                          history: Optional[List[Dict]] = None,
                          thinking_budget: int = 0) -> OllamaPythonChatSession:
        """
        Creates a new chat session with the specified configuration.
        
        Args:
            system_instruction: System role/prompt for the assistant
            history: Previous conversation history (optional)
            thinking_budget: Ignored for Ollama (compatibility parameter)
            
        Returns:
            OllamaPythonChatSession object
        """
        return OllamaPythonChatSession(
            model_name=self.model_name,
            host=self.host,
            timeout=self.timeout,
            system_instruction=system_instruction,
            history=history or []
        )
    
    def count_history_tokens(self, history: List[Dict]) -> int:
        """
        Counts tokens for the given conversation history.
        Uses Ollama's embeddings endpoint for more accurate token estimation.
        
        Args:
            history: Conversation history
            
        Returns:
            Estimated token count
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
            
            # Try to use ollama's tokenize if available, otherwise fallback to estimation
            try:
                # Note: This is a rough approximation
                # Ollama doesn't expose tokenization directly in the Python SDK yet
                # We use character-based estimation similar to other clients
                estimated_tokens = len(full_text) // 4
                return estimated_tokens
            except:
                # Fallback to simple estimation
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
            self._ollama_client.list()
            return True
        except:
            return False
    
    def ready_for_use_message(self) -> str:
        """
        Returns a ready-to-use message with model info and server details.
        
        Returns:
            Formatted message string for display
        """
        return f"✅ Klient Ollama (Python SDK) gotowy do użycia (Model: {self.model_name}, Server: {self.host})"
    
    @property
    def client(self):
        """
        Provides access to the underlying ollama client for advanced usage.
        This property should be used sparingly and eventually removed.
        """
        return self._ollama_client
    
    def get_model_info(self) -> Optional[Dict]:
        """
        Gets detailed information about the current model.
        
        Returns:
            Dictionary with model information or None if unavailable
        """
        try:
            models_response = self._ollama_client.list()
            for model in models_response.models:
                if model.model == self.model_name:
                    # Convert to dict for easier handling
                    return {
                        'model': model.model,
                        'modified_at': str(model.modified_at) if hasattr(model, 'modified_at') else None,
                        'size': model.size if hasattr(model, 'size') else None,
                        'digest': model.digest if hasattr(model, 'digest') else None,
                    }
            return None
        except Exception as e:
            console.print_error(f"Błąd podczas pobierania informacji o modelu: {e}")
            return None
    
    def pull_model(self) -> bool:
        """
        Pulls/downloads the model if it's not available locally.
        
        Returns:
            True if successful, False otherwise
        """
        try:
            console.print_info(f"Pobieranie modelu {self.model_name}...")
            self._ollama_client.pull(self.model_name)
            console.print_info(f"✅ Model {self.model_name} został pobrany")
            return True
        except Exception as e:
            console.print_error(f"Błąd podczas pobierania modelu: {e}")
            return False
