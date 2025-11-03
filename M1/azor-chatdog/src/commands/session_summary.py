from typing import List, Dict
from cli import console

def display_history_summary(history: List[Dict], assistant_name: str):
    """
    Wyświetla podsumowanie historii: liczbę pominiętych i ostatnie 2 wiadomości.
    
    Args:
        history: Lista słowników w formacie {"role": "user|model", "parts": [{"text": "..."}]}
        assistant_name: Nazwa asystenta do wyświetlenia
    """
    total_count = len(history)
    
    if total_count == 0:
        return

    # Wyświetlenie podsumowania
    if total_count > 2:
        console.print_info(f"\n--- Wątek sesji wznowiony ---")
        omitted_count = total_count - 2
        console.print_info(f"(Pominięto {omitted_count} wcześniejszych wiadomości)")
    else:
        console.print_info(f"\n--- Wątek sesji ---")

    # Display last 2 messages
    last_two = history[-2:]
    
    for content in last_two:
        # Handle universal dictionary format
        role = content.get('role', '')
        display_role = "TY" if role == "user" else assistant_name
        
        # Extract text from parts
        text = ""
        if 'parts' in content and content['parts']:
            text = content['parts'][0].get('text', '')
        
        if role == "user":
            console.print_user(f"  {display_role}: {text[:80]}...")
        elif role == "model":
            console.print_assistant(f"  {display_role}: {text[:80]}...")
            
    console.print_info(f"----------------------------")

