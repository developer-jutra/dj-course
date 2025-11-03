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

# --- Configuration ---
SLASH_COMMANDS = ('/exit', '/quit', '/switch', '/help', '/session')
SESSION_SUBCOMMANDS = ['list', 'display', 'pop', 'clear', 'new', 'remove']


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

                    # Special handling for /session with subcommands
                    if cmd == '/session' and remainder.strip():
                        # Find the position where subcommand starts
                        space_prefix = len(remainder) - len(remainder.lstrip())
                        remainder_content = remainder[space_prefix:]

                        # Extract subcommand (first word)
                        parts = remainder_content.split(maxsplit=1)
                        subcommand = parts[0].strip()

                        # Check if it's a valid subcommand
                        if subcommand in SESSION_SUBCOMMANDS:
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

# Nested auto-completion for slash commands with subcommands
_commands_completer = NestedCompleter({
    '/exit': None,
    '/quit': None,
    '/help': None,
    '/switch': None,
    '/session': WordCompleter(SESSION_SUBCOMMANDS, ignore_case=False)
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
    - Smart Enter key behavior (accepts completions, submits prompt)

    Args:
        prompt_text: The prompt text to display (default: "TY: ")

    Returns:
        str: The user's input, stripped of leading/trailing whitespace

    Raises:
        KeyboardInterrupt: When Ctrl+C is pressed
        EOFError: When Ctrl+D is pressed
    """
    return prompt(
        prompt_text,
        completer=_commands_completer,
        lexer=SlashCommandLexer(),
        style=_prompt_style,
        complete_while_typing=True,
        key_bindings=_key_bindings
    ).strip()
