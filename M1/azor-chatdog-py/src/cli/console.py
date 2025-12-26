"""
Console output utilities for the chatbot.
Centralizes colorama usage for consistent terminal output.
"""

import sys
from colorama import init, Fore, Style

from ..files.config import LOG_DIR

init(autoreset=True)


def print_error(message: str):
    """Print an error message in red color.

    Args:
        message: The error message to display
    """
    print(Fore.RED + message + Style.RESET_ALL)


def print_assistant(message: str):
    """Print an assistant message in cyan color.

    Args:
        message: The assistant message to display
    """
    print(Fore.CYAN + message + Style.RESET_ALL)


def print_user(message: str):
    """Print a user message in blue color.

    Args:
        message: The user message to display
    """
    print(Fore.BLUE + message + Style.RESET_ALL)


def print_info(message: str):
    """Print an informational message in yellow color.

    Args:
        message: The informational message to display
    """
    print(message)


def print_help(message: str):
    """Print an informational message in yellow color.

    Args:
        message: The informational message to display
    """
    print(Fore.YELLOW + message + Style.RESET_ALL)


def display_help(session_id: str):
    """Displays a short help message."""
    print_info(f"Aktualna sesja (ID): {session_id}")
    print_info(f"Pliki sesji są zapisywane na bieżąco w: {LOG_DIR}")
    print_help("Dostępne komendy (slash commands):")
    print_help("  /switch <ID>      - Przełącza na istniejącą sesję.")
    print_help("  /help             - Wyświetla tę pomoc.")
    print_help("  /exit, /quit      - Zakończenie czatu.")
    print_help("\n  /session list     - Wyświetla listę dostępnych sesji.")
    print_help("  /session display  - Wyświetla całą historię sesji.")
    print_help("  /session pop      - Usuwa ostatnią parę wpisów (TY i asystent).")
    print_help("  /session clear    - Czyści historię bieżącej sesji.")
    print_help("  /session new      - Rozpoczyna nową sesję.")


def display_final_instructions(session_id: str):
    """Displays instructions for continuing the session."""
    print_info("\n--- Instrukcja Kontynuacji Sesji ---")
    print_info(f"Aby kontynuować tę sesję (ID: {session_id}) później, użyj komendy:")
    print(
        Fore.WHITE
        + Style.BRIGHT
        + f"\n    python {sys.argv[0]} --session-id={session_id}\n"
        + Style.RESET_ALL
    )
    print("--------------------------------------\n")
