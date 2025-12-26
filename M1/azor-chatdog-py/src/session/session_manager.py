from cli import console
from .chat_session import ChatSession
from assistant import create_azor_assistant
from files import session_files


class SessionManager:
    """
    Orchestrates session lifecycle and manages the current active session.
    Provides high-level operations for session management.
    """

    def __init__(self):
        """Initializes with no active session."""
        self._current_session: ChatSession | None = None

    def get_current_session(self) -> ChatSession:
        """
        Returns the current active session.
        
        Raises:
            RuntimeError: If no session is active
        """
        if not self._current_session:
            raise RuntimeError("No active session. Call create_new_session() or switch_to_session() first.")
        return self._current_session

    def has_active_session(self) -> bool:
        """Returns True if there's an active session."""
        return self._current_session is not None

    def create_new_session(self, save_current: bool = True) -> tuple[ChatSession, bool, str | None, str | None]:
        """
        Creates a new session, optionally saving the current one.

        Args:
            save_current: If True, saves current session before creating new one

        Returns:
            tuple: (new_session, save_attempted, previous_session_id, save_error)
                - new_session: The newly created session
                - save_attempted: Whether saving was attempted
                - previous_session_id: ID of the previous session (if any)
                - save_error: Error message if save failed, None if successful
        """
        save_attempted = False
        previous_session_id = None
        save_error = None

        # Save current session if requested
        if save_current and self._current_session:
            save_attempted = True
            previous_session_id = self._current_session.session_id
            success, error = self._current_session.save_to_file()
            if not success:
                save_error = error

        # Create new session
        assistant = create_azor_assistant()
        new_session = ChatSession(assistant=assistant)
        self._current_session = new_session

        return new_session, save_attempted, previous_session_id, save_error

    def switch_to_session(self, session_id: str) -> tuple[ChatSession | None, bool, str | None, bool, str | None, bool]:
        """
        Switches to an existing session by ID.
        Saves current session before switching.

        Args:
            session_id: ID of the session to load

        Returns:
            tuple: (new_session, save_attempted, previous_session_id, load_successful, load_error, has_history)
                - new_session: The loaded session (None if failed)
                - save_attempted: Whether saving previous session was attempted
                - previous_session_id: ID of the previous session (if any)
                - load_successful: Whether loading was successful
                - load_error: Error message if load failed, None if successful
                - has_history: Whether the loaded session has history (only valid if load_successful)
        """
        save_attempted = False
        previous_session_id = None

        # Save current session
        if self._current_session:
            save_attempted = True
            previous_session_id = self._current_session.session_id
            self._current_session.save_to_file()

        # Load new session
        assistant = create_azor_assistant()
        new_session, error = ChatSession.load_from_file(assistant=assistant, session_id=session_id)

        if error:
            # Failed to load - don't change current session
            return None, save_attempted, previous_session_id, False, error, False

        # Successfully loaded - update current session
        self._current_session = new_session
        has_history = not new_session.is_empty()

        return new_session, save_attempted, previous_session_id, True, None, has_history

    def remove_current_session_and_create_new(self) -> tuple[ChatSession, str, bool, str | None]:
        """
        Removes the current session file and immediately creates a new, empty session.

        Returns:
            A tuple containing the new session, the ID of the removed session, 
            a boolean indicating if the removal was successful, and an optional error message.
        """
        if not self._current_session:
            raise RuntimeError("No session is active to remove.")

        removed_session_id = self._current_session.session_id

        # Remove the session file
        remove_success, remove_error = session_files.remove_session_file(removed_session_id)

        # Create a new session regardless of whether the file was successfully removed
        assistant = create_azor_assistant()
        new_session = ChatSession(assistant=assistant)
        self._current_session = new_session

        return new_session, removed_session_id, remove_success, remove_error

    def initialize_from_cli(self, cli_session_id: str | None) -> ChatSession:
        """
        Initializes a session based on CLI arguments.
        Either loads an existing session or creates a new one.

        Args:
            cli_session_id: Session ID from CLI, or None for new session

        Returns:
            ChatSession: The initialized session
        """
        if cli_session_id:
            assistant = create_azor_assistant()
            session, error = ChatSession.load_from_file(assistant=assistant, session_id=cli_session_id)

            if error:
                console.print_error(error)
                # Fallback to new session
                session = ChatSession(assistant=assistant)
                console.print_info(f"Rozpoczęto nową sesję z ID: {session.session_id}")

            self._current_session = session

            console.display_help(session.session_id)
            if not session.is_empty():
                from commands.session_summary import display_history_summary
                display_history_summary(session.get_history(), session.assistant_name)
        else:
            print("Rozpoczynanie nowej sesji.")
            assistant = create_azor_assistant()
            session = ChatSession(assistant=assistant)
            self._current_session = session
            console.display_help(session.session_id)

        return session

    def cleanup_and_save(self):
        """
        Cleanup method to be called on program exit.
        Saves the current session if it has content.
        """
        if not self._current_session:
            return

        session = self._current_session

        if session.is_empty():
            console.print_info(f"\nSesja jest pusta/niekompletna. Pominięto finalny zapis.")
        else:
            console.print_info(f"\nFinalny zapis historii sesji: {session.session_id}")
            session.save_to_file()
            console.display_final_instructions(session.session_id)
