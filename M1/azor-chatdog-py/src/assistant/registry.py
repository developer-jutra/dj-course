"""
Assistant Registry
Manages registration and retrieval of assistants.
"""

from typing import Dict, List, Optional
from .assistent import Assistant


class AssistantRegistry:
    """
    Singleton registry for managing AI assistants.
    Ensures unique IDs and provides lookup/listing capabilities.
    """
    
    _instance: Optional['AssistantRegistry'] = None
    _assistants: Dict[str, Assistant] = {}
    
    def __new__(cls):
        """Singleton pattern - ensures only one registry exists."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def register(self, assistant: Assistant) -> tuple[bool, str | None]:
        """
        Register a new assistant in the registry.
        
        Args:
            assistant: Assistant instance to register
            
        Returns:
            tuple: (success: bool, error_message: str | None)
        """
        assistant_id = assistant.id
        
        # Check if ID already exists
        if assistant_id in self._assistants:
            return False, f"Assistant with ID '{assistant_id}' already exists."
        
        # Check if name already exists
        existing_names = [a.name for a in self._assistants.values()]
        if assistant.name in existing_names:
            return False, f"Assistant with name '{assistant.name}' already exists."
        
        self._assistants[assistant_id] = assistant
        return True, None
    
    def get(self, assistant_id: str) -> Optional[Assistant]:
        """
        Retrieve an assistant by ID.
        
        Args:
            assistant_id: Unique identifier for the assistant
            
        Returns:
            Assistant instance or None if not found
        """
        return self._assistants.get(assistant_id.lower().strip())
    
    def list_all(self) -> List[Assistant]:
        """
        Get a list of all registered assistants.
        
        Returns:
            List of all Assistant instances
        """
        return list(self._assistants.values())
    
    def exists(self, assistant_id: str) -> bool:
        """
        Check if an assistant with the given ID exists.
        
        Args:
            assistant_id: Unique identifier to check
            
        Returns:
            True if assistant exists, False otherwise
        """
        return assistant_id.lower().strip() in self._assistants
    
    def get_default(self) -> Assistant:
        """
        Get the default assistant (Azor).
        
        Returns:
            Default Assistant instance
            
        Raises:
            RuntimeError: If default assistant is not registered
        """
        default = self.get("azor")
        if default is None:
            raise RuntimeError("Default assistant 'azor' not found in registry. Registry must be initialized first.")
        return default


# Global registry instance
_registry = AssistantRegistry()


def get_assistant_registry() -> AssistantRegistry:
    """
    Get the global assistant registry instance.
    
    Returns:
        AssistantRegistry: The singleton registry instance
    """
    return _registry


def register_assistant(name: str, system_prompt: str) -> Assistant:
    """
    Convenience function to create and register an assistant.
    Auto-generates ID from name (lowercase, spaces to underscores).
    
    Args:
        name: Display name of the assistant
        system_prompt: System instruction/prompt for the assistant
        
    Returns:
        Assistant: The registered assistant instance
        
    Raises:
        RuntimeError: If registration fails (duplicate ID/name)
    """
    # Auto-generate ID from name
    assistant_id = name.lower().replace(' ', '_').replace('-', '_')
    
    assistant = Assistant(
        assistant_id=assistant_id,
        system_prompt=system_prompt,
        name=name
    )
    
    success, error = _registry.register(assistant)
    if not success:
        raise RuntimeError(f"Failed to register assistant '{name}': {error}")
    
    return assistant
