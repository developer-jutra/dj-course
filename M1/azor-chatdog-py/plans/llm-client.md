(initial prompt for the refactoring plan, `claude-4.5-sonnet`/`MAX`)

> please plan a refactor for a new GeminiLLMClass class. Put this plan itno the @llm-client.md - it will be executed later on by someone.
> 
> The GeminiLLMClass should be mainly a replacement for this fle @client.py content. The class should:
> - know what model it has (via initialization)
> - have all required env vars, config, ertc.
> - be initialied in nearby @__init__.py  file
> - include count_history_tokens, obviously
> - and encapsulate the this call `self._llm_chat_session = llm_client.client.chats.create` from @chat_session.py - so that other files never need to import `from google.genai import types`. Everything related to `from google.genai import types` would be hidden inside the new GeminiLLMClass class. And if we wanted to bring new implementations - that would be a single place to do so.
> 
> You may also name the file accordingly (gemini_llm_client or something)
> 
> So make the plan please

# GeminiLLMClass Refactoring Plan

## Overview
Refactor the current `src/llm/client.py` into a proper class-based design that encapsulates all Google Gemini AI interactions. This will abstract away implementation details and make it easier to add other LLM providers in the future.

## Goals
1. **Encapsulation**: Hide all `google.genai.types` imports from other modules
2. **Abstraction**: Create a clean interface for LLM operations
3. **Configuration**: Model and settings configurable via initialization
4. **Extensibility**: Easy to add other LLM providers later
5. **Maintainability**: Single place for all Gemini-specific code

## Current Issues
- `chat_session.py` directly imports `from google.genai import types`
- LLM client is global and not easily configurable
- Hard to test and mock LLM interactions
- Direct coupling to Google GenAI SDK throughout codebase

## Proposed Structure

### New File: `src/llm/gemini_client.py`

```python
"""
Google Gemini LLM Client Implementation
"""

import os
import sys
from typing import Optional, List, Any, Dict
from google import genai
from google.genai import types
from dotenv import load_dotenv
from cli import console

class GeminiLLMClient:
    """
    Encapsulates all Google Gemini AI interactions.
    Provides a clean interface for chat sessions, token counting, and configuration.
    """
    
    def __init__(self, model_name: Optional[str] = None, api_key: Optional[str] = None):
        """
        Initialize the Gemini LLM client.
        
        Args:
            model_name: Model to use (defaults to env var MODEL_NAME or 'gemini-2.5-flash')
            api_key: API key (defaults to env var GEMINI_API_KEY)
        """
        
    def create_chat_session(self, 
                          system_instruction: str, 
                          history: Optional[List[Any]] = None,
                          thinking_budget: int = 0) -> Any:
        """
        Creates a new chat session with the specified configuration.
        
        Args:
            system_instruction: System role/prompt for the assistant
            history: Previous conversation history (optional)
            thinking_budget: Thinking budget for the model
            
        Returns:
            Chat session object (implementation-specific)
        """
        
    def count_history_tokens(self, history: List[Any]) -> int:
        """
        Counts tokens for the given conversation history.
        
        Args:
            history: Conversation history
            
        Returns:
            Total token count
        """
        
    def get_model_name(self) -> str:
        """Returns the currently configured model name."""
        
    def is_available(self) -> bool:
        """Checks if the LLM service is available and properly configured."""
```

### Updated File: `src/llm/__init__.py`

```python
"""
LLM Module Initialization
Provides the default LLM client instance.
"""

from .gemini_client import GeminiLLMClient

# Global LLM client instance - initialized with environment defaults
llm_client = GeminiLLMClient()

# For backwards compatibility and easy access
client = llm_client
```

### Updated File: `src/session/chat_session.py`

Remove direct `google.genai.types` imports and use the new LLM client:

```python
# Remove: from google.genai import types
# Replace with: import llm

class ChatSession:
    def _initialize_llm_session(self):
        """Creates or recreates the LLM chat session with current history."""
        from assistant.azor import SYSTEM_ROLE
        
        # Use the abstracted LLM client instead of direct GenAI calls
        self._llm_chat_session = llm.client.create_chat_session(
            system_instruction=SYSTEM_ROLE,
            history=self._history,
            thinking_budget=0
        )
    
    def count_tokens(self) -> int:
        """Counts total tokens in the conversation history."""
        return llm.client.count_history_tokens(self._history)
```

## Implementation Steps

### Step 1: Create Base LLM Interface (Optional, Future-Proofing)
```python
# src/llm/base_client.py
from abc import ABC, abstractmethod
from typing import List, Any, Optional

class BaseLLMClient(ABC):
    """Abstract base class for LLM clients."""
    
    @abstractmethod
    def create_chat_session(self, system_instruction: str, history: Optional[List[Any]] = None) -> Any:
        pass
    
    @abstractmethod
    def count_history_tokens(self, history: List[Any]) -> int:
        pass
    
    @abstractmethod
    def get_model_name(self) -> str:
        pass
```

### Step 2: Implement GeminiLLMClient
- Create `src/llm/gemini_client.py`
- Move all Google GenAI specific code from `client.py`
- Implement the interface methods
- Handle initialization, error handling, and configuration

### Step 3: Update Module Initialization
- Modify `src/llm/__init__.py` to expose the client instance
- Ensure backwards compatibility with existing imports

### Step 4: Update ChatSession Class
- Remove direct `google.genai.types` imports
- Use the new LLM client interface
- Update method calls to use abstracted interface

### Step 5: Clean Up
- Remove old `src/llm/client.py` file
- Update any other files that import from the old client
- Ensure all tests pass

## Benefits After Refactoring

1. **Clean Separation**: LLM implementation details are fully encapsulated
2. **Easy Testing**: Can easily mock the LLM client for unit tests
3. **Provider Agnostic**: Easy to add OpenAI, Claude, or other providers
4. **Better Error Handling**: Centralized error handling for LLM operations
5. **Configuration**: Easy to configure different models or settings per session
6. **Type Safety**: Better type hints and IDE support

## Migration Notes

- All existing functionality should continue to work
- The interface should be backwards compatible during transition
- Consider deprecation warnings for old import patterns
- Update documentation and examples to use new patterns

## Future Enhancements

After the refactor, it will be easy to add:
- Multiple LLM provider support
- Connection pooling
- Rate limiting
- Response caching
- Better error recovery
- Metrics and logging
