from .chat_session import ChatSession
from .session_manager import SessionManager


# Global session manager instance
# This replaces the global variables in config.py
_session_manager: SessionManager | None = None


def get_session_manager() -> SessionManager:
    """
    Returns the global session manager instance.
    Creates it if it doesn't exist.
    """
    global _session_manager
    if _session_manager is None:
        _session_manager = SessionManager()
    return _session_manager


# Export public classes
__all__ = ['ChatSession', 'SessionManager', 'get_session_manager']
