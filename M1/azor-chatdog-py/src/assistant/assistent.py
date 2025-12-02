"""
Assistant class definition
Defines the Assistant class that encapsulates assistant configuration.
"""

class Assistant:
    """
    Represents an AI assistant with system prompt and identity configuration.
    Encapsulates the assistant's behavior and name, independent of the underlying model.
    """
    
    def __init__(self, assistant_id: str, system_prompt: str, name: str):
        """
        Initialize an Assistant with system prompt and name configuration.
        
        Args:
            assistant_id: Unique identifier for the assistant (lowercase, no spaces)
            system_prompt: The system instruction/prompt that defines the assistant's behavior
            name: The display name of the assistant
        """
        self._id = assistant_id.lower().strip()
        self._system_prompt = system_prompt
        self._name = name
    
    @property
    def id(self) -> str:
        """Get the unique identifier for this assistant."""
        return self._id
    
    @property
    def system_prompt(self) -> str:
        """Get the system prompt for this assistant."""
        return self._system_prompt
    
    @property
    def name(self) -> str:
        """Get the display name for this assistant."""
        return self._name
