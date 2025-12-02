import os
import json
from datetime import datetime
from typing import List, Any, Dict, Optional
from files.config import LOG_DIR

DEFAULT_ASSISTANT_ID = "azor"

def load_session_history(session_id: str) -> tuple[List[Dict], Optional[str], Optional[str]]:
    """
    Loads session history from a JSON file in universal format.
    
    Returns:
        tuple[List[Dict], str, str | None]: (conversation_history, assistant_id, error_message)
        History format: [{"role": "user|model", "parts": [{"text": "..."}]}, ...]
        assistant_id defaults to "azor" if not found in file (backwards compatibility)
    """
    
    log_filename = os.path.join(LOG_DIR, f"{session_id}-log.json")
    if not os.path.exists(log_filename):
        return [], DEFAULT_ASSISTANT_ID, f"Session log file '{log_filename}' does not exist. Starting new session."

    try:
        with open(log_filename, 'r', encoding='utf-8') as f:
            log_data = json.load(f)
    except json.JSONDecodeError:
        return [], DEFAULT_ASSISTANT_ID, f"Cannot decode log file '{log_filename}'. Starting new session."

    # Get assistant_id from metadata, default to "azor" for backwards compatibility
    assistant_id = log_data.get('assistant_id', DEFAULT_ASSISTANT_ID)

    # Convert JSON data to universal format (dictionaries)
    # This format works with both Gemini and LLaMA clients
    history = []
    for entry in log_data.get('history', []):
        content = {
            "role": entry['role'],
            "parts": [{"text": entry['text']}]
        }
        history.append(content)

    return history, assistant_id, None

def save_session_history(session_id: str, history: List[Dict], system_prompt: str, model_name: str, assistant_id: str) -> tuple[bool, str | None]:
    """
    Saves the current session history to a JSON file,
    only if the history contains at least one complete turn (User + Model).
    
    Args:
        session_id: Unique identifier for the session
        history: Conversation history to save (universal format: List of dicts)
        system_prompt: System prompt used for the assistant
        model_name: Name of the LLM model used
        assistant_id: Unique identifier for the assistant
    
    Returns:
        tuple[bool, str | None]: (success, error_message)
    """
    if len(history) < 2:
        # CONDITION: Prevents saving empty/incomplete session
        return True, None

    log_filename = os.path.join(LOG_DIR, f"{session_id}-log.json")

    json_history = []
    for content in history:
        # Handle universal format (dictionaries) from both Gemini and LLaMA clients
        if isinstance(content, dict) and 'parts' in content and content['parts']:
            text_part = content['parts'][0].get('text', '')
        else:
            # Fallback for legacy formats
            text_part = getattr(content, 'parts', [{}])[0].get('text', '') if hasattr(content, 'parts') else ""
        
        if text_part:
            json_history.append({
                'role': content.get('role', '') if isinstance(content, dict) else getattr(content, 'role', ''),
                'timestamp': datetime.now().isoformat(),
                'text': text_part
            })

    log_data = {
        'session_id': session_id,
        'model': model_name,
        'system_role': system_prompt,
        'assistant_id': assistant_id,
        'history': json_history
    }

    try:
        with open(log_filename, 'w', encoding='utf-8') as f:
            json.dump(log_data, f, indent=4, ensure_ascii=False)
        return True, None
        
    except Exception as e:
        return False, f"Error writing to file {log_filename}: {e}"

def list_sessions():
    """Returns a list of available sessions with their metadata."""
    files = os.listdir(LOG_DIR)
    session_ids = sorted([f.replace('-log.json', '') for f in files if f.endswith('-log.json') and f != 'azor-wal.json'])
    
    sessions_data = []
    for sid in session_ids:
        log_path = os.path.join(LOG_DIR, f"{sid}-log.json")
        try:
            with open(log_path, 'r', encoding='utf-8') as f:
                log_data = json.load(f)
                history_len = len(log_data.get('history', []))
                last_msg_time_str = log_data.get('history', [{}])[-1].get('timestamp', 'Brak daty')
                
                time_str = 'Brak aktywności'
                if last_msg_time_str != 'Brak daty':
                    try:
                        dt = datetime.fromisoformat(last_msg_time_str)
                        time_str = dt.strftime('%Y-%m-%d %H:%M')
                    except ValueError:
                        pass
            
            sessions_data.append({
                'id': sid,
                'messages_count': history_len,
                'last_activity': time_str,
                'error': None
            })
        except Exception:
            sessions_data.append({
                'id': sid,
                'error': 'BŁĄD ODCZYTU PLIKU'
            })
    
    return sessions_data

def remove_session_file(session_id: str) -> tuple[bool, str | None]:
    """
    Removes a session log file from the filesystem.

    Args:
        session_id: The ID of the session to remove.

    Returns:
        A tuple containing a boolean indicating success and an optional error message.
    """
    log_filename = os.path.join(LOG_DIR, f"{session_id}-log.json")
    if not os.path.exists(log_filename):
        return False, f"Session file for ID '{session_id}' not found."

    try:
        os.remove(log_filename)
        return True, None
    except OSError as e:
        return False, f"Error removing session file '{log_filename}': {e}"
