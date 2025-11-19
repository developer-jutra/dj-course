from typing import List, Dict
from cli import console

def display_full_session(history: List[Dict], session_id: str, assistant_name: str):
    """
    Displays the full session history.
    
    Args:
        history: Lista słowników w formacie {"role": "user|model", "parts": [{"text": "..."}]}
        session_id: ID sesji
        assistant_name: Nazwa asystenta do wyświetlenia
    """
    if not history:
        console.print_info("Historia sesji jest pusta.")
        return

    console.print_info(f"\n--- PEŁNA HISTORIA SESJI ({session_id}, {len(history)} wpisów) ---")
    
    for i, content in enumerate(history):
        # Handle universal dictionary format
        role = content.get('role', '')
        display_role = "TY" if role == "user" else assistant_name
        
        # Extract text from parts
        text = ""
        if 'parts' in content and content['parts']:
            text = content['parts'][0].get('text', '')
        
        # Display with appropriate function
        if role == "user":
            console.print_user(f"\n[{i+1}] {display_role}:")
            console.print_user(f"{text}")
        else:
            console.print_assistant(f"\n[{i+1}] {display_role}:")
            console.print_assistant(f"{text}")
            
    console.print_info("--------------------------------------------------------")
