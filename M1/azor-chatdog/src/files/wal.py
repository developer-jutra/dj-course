import os
import json
from datetime import datetime
from files.config import WAL_FILE


def append_to_wal(session_id: str, prompt: str, response_text: str, total_tokens: int, model_name: str) -> tuple[bool, str | None]:
    """
    Appends a transaction to the WAL (Write-Ahead Log) file.
    
    Args:
        session_id: Unique session identifier
        prompt: User's input prompt
        response_text: Model's response text
        total_tokens: Total tokens used in the conversation
        model_name: Name of the LLM model used
    
    Returns:
        tuple[bool, str | None]: (success, error_message)
    """
    
    wal_entry = {
        'timestamp': datetime.now().isoformat(),
        'session_id': session_id,
        'model': model_name,
        'prompt': prompt,
        'response': response_text,
        'tokens_used': total_tokens
    }

    try:
        if os.path.exists(WAL_FILE) and os.path.getsize(WAL_FILE) > 0:
            with open(WAL_FILE, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                except json.JSONDecodeError:
                    data = []
                    return False, f"WAL file corrupted, resetting: {WAL_FILE}"
        else:
            data = []

        data.append(wal_entry)

        with open(WAL_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            return True, None
            
    except Exception as e:
        return False, f"Error writing to WAL file ({WAL_FILE}): {e}"
