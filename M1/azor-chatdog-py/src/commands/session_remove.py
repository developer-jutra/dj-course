from cli import console
from session.session_manager import SessionManager

def remove_session_command(manager: SessionManager):
    """
    Handles the logic for removing the current session and starting a new one.

    Args:
        manager: The session manager instance.
    """
    new_session, removed_session_id, success, error = manager.remove_current_session_and_create_new()

    if success:
        console.print_info(f"Pomyślnie usunięto plik sesji dla ID: {removed_session_id}")
    else:
        # Even if the file removal failed (e.g., file not found), a new session is created.
        console.print_warning(f"Nie można usunąć pliku sesji dla ID: {removed_session_id}. Powód: {error}")

    console.print_info(f"\n--- Rozpoczęto nową, anonimową sesję: {new_session.session_id} ---")
    console.display_help(new_session.session_id, new_session.assistant_name)
