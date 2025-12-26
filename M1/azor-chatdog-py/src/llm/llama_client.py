"""
Local LLaMA LLM Client Implementation
Encapsulates all local LLaMA model interactions using llama-cpp-python.
"""

import os
from typing import Optional, List, Any, Dict
from llama_cpp import Llama
from dotenv import load_dotenv

from ..cli import console
from .llama_validation import LlamaConfig


class LlamaChatSession:
    """
    Wrapper class that provides a chat session interface compatible with Gemini's interface.
    Manages conversation history and provides send_message() and get_history() methods.
    """
    load_dotenv()

    def __init__(
        self,
        llama_model: Llama,
        system_instruction: str,
        history: Optional[List[Dict]] = None,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        top_k: Optional[int] = None,
    ):
        """
        Initialize the LLaMA chat session.

        Args:
            llama_model: Initialized Llama model instance
            system_instruction: System prompt for the assistant
            history: Previous conversation history
            temperature: Sampling temperature
            top_p: Top-P sampling
            top_k: Top-K sampling
        """
        self.llama_model = llama_model
        self.system_instruction = system_instruction
        self._history = history or []
        self.temperature = temperature
        self.top_p = top_p
        self.top_k = top_k

    def send_message(self, text: str) -> Any:
        """
        Sends a message to the LLaMA model and returns a response object.

        Args:
            text: User's message

        Returns:
            Response object with .text attribute containing the response
        """
        # Add user message to history
        user_message = {"role": "user", "parts": [{"text": text}]}
        self._history.append(user_message)

        # Build prompt from system instruction + conversation history
        prompt = self._build_prompt_from_history()

        try:
            # Build generation parameters
            generation_params = {
                "max_tokens": 512,
                "stop": ["User:", "Assistant:", "\n\nUser:", "\n\nAssistant:"],
                "echo": False,
            }
            if self.temperature is not None:
                generation_params["temperature"] = self.temperature
            if self.top_p is not None:
                generation_params["top_p"] = self.top_p
            if self.top_k is not None:
                generation_params["top_k"] = self.top_k

            # Generate response using LLaMA
            output = self.llama_model(prompt, **generation_params)

            response_text = output["choices"][0]["text"].strip()

            # Add assistant response to history
            assistant_message = {"role": "model", "parts": [{"text": response_text}]}
            self._history.append(assistant_message)

            # Return response object compatible with Gemini interface
            return LlamaResponse(response_text)

        except Exception as e:
            console.print_error(f"Błąd podczas generowania odpowiedzi LLaMA: {e}")
            # Return error response
            error_text = "Przepraszam, wystąpił błąd podczas generowania odpowiedzi."
            assistant_message = {"role": "model", "parts": [{"text": error_text}]}
            self._history.append(assistant_message)
            return LlamaResponse(error_text)

    def get_history(self) -> List[Dict]:
        """Returns the current conversation history."""
        return self._history

    def _build_prompt_from_history(self) -> str:
        """
        Builds a prompt string from the conversation history and system instruction.

        Returns:
            Formatted prompt string for the LLaMA model
        """
        prompt_parts = []

        # Add system instruction
        if self.system_instruction:
            prompt_parts.append(f"System: {self.system_instruction}")

        # Add conversation history
        for message in self._history[
            :-1
        ]:  # Exclude the last message (current user input)
            role = message["role"]
            text = message["parts"][0]["text"]

            if role == "user":
                prompt_parts.append(f"User: {text}")
            elif role == "model":
                prompt_parts.append(f"Assistant: {text}")

        # Add the current user message
        if self._history:
            last_message = self._history[-1]
            if last_message["role"] == "user":
                user_text = last_message["parts"][0]["text"]
                prompt_parts.append(f"User: {user_text}")

        prompt_parts.append("Assistant:")

        return "\n\n".join(prompt_parts)


class LlamaResponse:
    """
    Response object that mimics the Gemini response interface.
    Provides a .text attribute containing the response text.
    """

    def __init__(self, text: str):
        self.text = text


class LlamaClient:
    """
    Encapsulates all local LLaMA model interactions.
    Provides a clean interface compatible with GeminiLLMClient.
    """

    def __init__(
        self, model_name: str, model_path: str, n_gpu_layers: int = 1, n_ctx: int = 2048,
        temperature: Optional[float] = None, top_p: Optional[float] = None, top_k: Optional[int] = None
    ):
        """
        Initialize the LLaMA client with explicit parameters.

        Args:
            model_name: Display name for the model
            model_path: Path to the GGUF model file
            n_gpu_layers: Number of layers to run on GPU
            n_ctx: Maximum context length
            temperature: Sampling temperature
            top_p: Top-P sampling
            top_k: Top-K sampling

        Raises:
            ValueError: If model_path is empty or file doesn't exist
        """
        if not model_path:
            raise ValueError("Model path cannot be empty")

        if not os.path.exists(model_path):
            raise ValueError(f"Model file not found: {model_path}")

        self.model_name = model_name
        self.model_path = model_path
        self.n_gpu_layers = n_gpu_layers
        self.n_ctx = n_ctx
        self.temperature = temperature
        self.top_p = top_p
        self.top_k = top_k

        # Initialize the model during construction
        self._llama_model = self._initialize_model()

    @staticmethod
    def preparing_for_use_message() -> str:
        """
        Returns a message indicating that LLaMA client is being prepared.

        Returns:
            Formatted preparation message string
        """
        return "🦙 Przygotowywanie klienta llama.cpp..."

    @classmethod
    def from_environment(cls) -> "LlamaClient":
        """
        Factory method that creates a LlamaClient instance from environment variables.

        Returns:
            LlamaClient instance initialized with environment variables

        Raises:
            ValueError: If model file is not found or configuration is invalid
        """
        load_dotenv()

        # Walidacja z Pydantic
        config = LlamaConfig(
            model_name=os.getenv("LLAMA_MODEL_NAME", "llama-3.1-8b-instruct"),
            llama_model_path=os.getenv("LLAMA_MODEL_PATH"),
            llama_gpu_layers=int(os.getenv("LLAMA_GPU_LAYERS", "1")),
            llama_context_size=int(os.getenv("LLAMA_CONTEXT_SIZE", "2048")),
            temperature=os.getenv("TEMPERATURE"),
            top_p=os.getenv("TOP_P"),
            top_k=os.getenv("TOP_K"),
        )

        console.print_info(f"Ładowanie modelu LLaMA z: {config.llama_model_path}")

        return cls(
            model_name=config.model_name,
            model_path=config.llama_model_path,
            n_gpu_layers=config.llama_gpu_layers,
            n_ctx=config.llama_context_size,
            temperature=config.temperature,
            top_p=config.top_p,
            top_k=config.top_k,
        )

    def _initialize_model(self) -> Llama:
        """
        Initializes the LLaMA model.

        Returns:
            Initialized Llama model instance

        Raises:
            RuntimeError: If model initialization fails
        """
        try:
            console.print_info(f"Inicjalizacja modelu LLaMA: {self.model_name}")
            console.print_info(f"Ścieżka: {self.model_path}")
            console.print_info(
                f"Warstwy GPU: {self.n_gpu_layers}, Kontekst: {self.n_ctx}"
            )

            return Llama(
                model_path=self.model_path,
                n_gpu_layers=self.n_gpu_layers,
                n_ctx=self.n_ctx,
                verbose=False,  # Reduce verbose output
            )
        except Exception as e:
            console.print_error(f"Błąd inicjalizacji modelu LLaMA: {e}")
            raise RuntimeError(f"Failed to initialize LLaMA model: {e}")

    def create_chat_session(
        self,
        system_instruction: str,
        history: Optional[List[Dict]] = None,
        thinking_budget: int = 0,
    ) -> LlamaChatSession:
        """
        Creates a new chat session with the specified configuration.

        Args:
            system_instruction: System role/prompt for the assistant
            history: Previous conversation history (optional)
            thinking_budget: Ignored for LLaMA (compatibility parameter)

        Returns:
            LlamaChatSession object
        """
        if not self._llama_model:
            raise RuntimeError("LLaMA model not initialized")

        return LlamaChatSession(
            llama_model=self._llama_model,
            system_instruction=system_instruction,
            history=history or [],
            temperature=self.temperature,
            top_p=self.top_p,
            top_k=self.top_k,
        )

    def count_history_tokens(self, history: List[Dict]) -> int:
        """
        Counts tokens for the given conversation history.
        Note: This is an approximation since llama-cpp-python doesn't provide
        direct token counting for conversations.

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

            # Use LLaMA's tokenizer to count tokens
            tokens = self._llama_model.tokenize(full_text.encode("utf-8"))
            return len(tokens)

        except Exception as e:
            console.print_error(f"Błąd podczas liczenia tokenów: {e}")
            # Fallback: rough estimation (4 chars per token average)
            total_chars = sum(
                len(msg["parts"][0]["text"])
                for msg in history
                if "parts" in msg and msg["parts"]
            )
            return total_chars // 4

    def get_model_name(self) -> str:
        """Returns the currently configured model name."""
        return self.model_name

    def is_available(self) -> bool:
        """
        Checks if the LLM service is available and properly configured.

        Returns:
            True if model is properly initialized
        """
        return self._llama_model is not None

    def ready_for_use_message(self) -> str:
        """
        Returns a ready-to-use message with model info and parameters.

        Returns:
            Formatted message string for display
        """
        return f"✅ Klient llama.cpp gotowy do użycia (model lokalny: {self.model_name}, Warstwy GPU: {self.n_gpu_layers}, Kontekst: {self.n_ctx}"

    @property
    def client(self):
        """
        Provides access to the underlying LLaMA model for backwards compatibility.
        This property should be used sparingly and eventually removed.
        """
        return self._llama_model
