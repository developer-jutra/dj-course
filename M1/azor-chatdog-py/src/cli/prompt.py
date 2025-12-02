"""
Module for handling user input prompt with advanced features.
Includes syntax highlighting, auto-completion, and custom key bindings.
"""

from prompt_toolkit import prompt
from prompt_toolkit.completion import NestedCompleter, WordCompleter
from prompt_toolkit.lexers import Lexer
from prompt_toolkit.styles import Style
from prompt_toolkit.key_binding import KeyBindings
from prompt_toolkit.filters import completion_is_selected
from assistant import get_assistant_registry

# --- Configuration ---
SLASH_COMMANDS = ('/exit', '/quit', '/switch', '/help', '/session', '/pdf', '/assistant')
SESSION_SUBCOMMANDS = ['list', 'display', 'pop', 'clear', 'new', 'remove']
ASSISTANT_SUBCOMMANDS = ['list', 'switch']


class SlashCommandLexer(Lexer):
    """Custom lexer to color slash commands and subcommands."""

    def lex_document(self, document):
        def get_line_tokens(lineno):
            line = document.lines[lineno]

            # Check if line starts with a slash command
            for cmd in SLASH_COMMANDS:
                if line.startswith(cmd):
                    tokens = [('class:slash-command', cmd)]
                    remainder = line[len(cmd) :]

                    # Special handling for commands with subcommands
                    if cmd in ['/session', '/assistant'] and remainder.strip():
                        # Find the position where subcommand starts
                        space_prefix = len(remainder) - len(remainder.lstrip())
                        remainder_content = remainder[space_prefix:]

                        # Extract subcommand (first word)
                        parts = remainder_content.split(maxsplit=1)
                        subcommand = parts[0].strip()

                        # Determine valid subcommands based on command
                        valid_subcommands = []
                        if cmd == '/session':
                            valid_subcommands = SESSION_SUBCOMMANDS
                        elif cmd == '/assistant':
                            # For 'switch' subcommand, check the assistant ID (second argument)
                            if subcommand == 'switch':
                                valid_subcommands = ['switch']  # The subcommand itself is valid
                                # Highlight the assistant ID if present
                                if len(parts) > 1:
                                    assistant_id = parts[1].strip()
                                    available_ids = _get_available_assistant_ids()
                                    tokens.append(('class:normal-text', remainder[:space_prefix]))
                                    tokens.append(('class:subcommand', subcommand))
                                    if assistant_id in available_ids:
                                        tokens.append(('class:normal-text', ' '))
                                        tokens.append(('class:subcommand', assistant_id))
                                    else:
                                        tokens.append(('class:normal-text', ' ' + assistant_id))
                                    return tokens
                            else:
                                valid_subcommands = ASSISTANT_SUBCOMMANDS

                        # Check if it's a valid subcommand
                        if subcommand in valid_subcommands:
                            # Add space before subcommand
                            tokens.append(('class:normal-text', remainder[:space_prefix]))
                            tokens.append(('class:subcommand', subcommand))
                            # Add rest of the line if present
                            if len(parts) > 1:
                                tokens.append(('class:normal-text', ' ' + parts[1]))
                        else:
                            tokens.append(('class:normal-text', remainder))
                    else:
                        tokens.append(('class:normal-text', remainder))

                    return tokens

            return [('class:normal-text', line)]

        return get_line_tokens


# Custom style for prompt_toolkit
_prompt_style = Style.from_dict({
    'slash-command': '#ff0066 bold',
    'subcommand': '#00ff00 bold',
    'normal-text': '#aaaaaa',
})


def _get_available_assistant_ids():
    """Get list of available assistant IDs from registry."""
    try:
        registry = get_assistant_registry()
        assistants = registry.list_all()
        return [assistant.id for assistant in assistants]
    except Exception:
        # If registry not initialized yet, return empty list
        return []


def _create_commands_completer():
    """Create nested completer with dynamic assistant list."""
    assistant_ids = _get_available_assistant_ids()
    
    # Create nested completer for /assistant with subcommands
    assistant_completer = NestedCompleter({
        'list': None,
        'switch': WordCompleter(assistant_ids, ignore_case=False) if assistant_ids else None
    })
    
    return NestedCompleter({
        '/exit': None,
        '/quit': None,
        '/help': None,
        '/switch': None,
        '/pdf': None,
        '/session': WordCompleter(SESSION_SUBCOMMANDS, ignore_case=False),
        '/assistant': assistant_completer
    })


def _create_key_bindings():
    """
    Create custom key bindings to handle Enter behavior:
    - If completion menu is open: Accept the completion
    - If completion menu is closed: Submit the prompt
    """
    kb = KeyBindings()

    @kb.add('enter', filter=completion_is_selected)
    def _(event):
        """When completion is selected, accept it (close dropdown)"""
        event.app.current_buffer.complete_state = None

    return kb


_key_bindings = _create_key_bindings()


def get_user_input(prompt_text: str = "TY: ") -> str:
    """
    Get user input with advanced prompt_toolkit features.

    Features:
    - Syntax highlighting for slash commands and subcommands
    - Auto-completion for commands and subcommands
    - Dynamic assistant ID completion for /switch-assistant
    - Smart Enter key behavior (accepts completions, submits prompt)

    Args:
        prompt_text: The prompt text to display (default: "TY: ")

    Returns:
        str: The user's input, stripped of leading/trailing whitespace

    Raises:
        KeyboardInterrupt: When Ctrl+C is pressed
        EOFError: When Ctrl+D is pressed
    """
    # Rebuild completer each time to get fresh assistant list
    completer = _create_commands_completer()
    
    return prompt(
        prompt_text,
        completer=completer,
        lexer=SlashCommandLexer(),
        style=_prompt_style,
        complete_while_typing=True,
        key_bindings=_key_bindings
    ).strip()
