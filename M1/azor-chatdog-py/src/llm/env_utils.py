"""
Environment variable parsing utilities for LLM clients.
"""
import os
from typing import Optional, Callable, TypeVar

T = TypeVar('T')


def parse_env_param(env_var: str, converter: Callable[[str], T]) -> Optional[T]:
    """
    Parse and convert environment variable with error handling.
    
    Args:
        env_var: Environment variable name
        converter: Conversion function (float, int, etc.)
        
    Returns:
        Converted value or None if not set
        
    Raises:
        ValueError: If conversion fails
        
    Example:
        >>> temperature = parse_env_param('TEMPERATURE', float)
        >>> top_k = parse_env_param('TOP_K', int)
    """
    value = os.getenv(env_var)
    if value:
        try:
            return converter(value)
        except ValueError:
            type_name = converter.__name__
            raise ValueError(f"Invalid value for {env_var}: '{value}'. Must be a {type_name}.")
    return None
