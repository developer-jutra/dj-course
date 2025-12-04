"""
Command to list available assistants.
"""

from assistant import get_assistant_registry
from cli import console


def list_assistants_command():
    """
    Lists all available assistants in the registry.
    """
    registry = get_assistant_registry()
    assistants = registry.list_all()
    
    if not assistants:
        console.print_warning("Brak zarejestrowanych asystentów.")
        return
    
    console.print_info("\n=== Dostępni Asystenci ===")
    for assistant in assistants:
        console.print_info(f"  ID: {assistant.id}")
        console.print_info(f"  Nazwa: {assistant.name}")
        console.print_info(f"  System Prompt: {assistant.system_prompt[:80]}...")
        console.print_info("")
    console.print_info(f"Łącznie: {len(assistants)} asystentów")
    console.print_info("Użyj: /assistant switch <assistant-id> aby przełączyć asystenta\n")
