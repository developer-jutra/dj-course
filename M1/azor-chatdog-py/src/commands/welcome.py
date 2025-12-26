import textwrap

from ..cli import console

_DOG_ART_BASE_RAW = r"""
           ,////,
          /  ' ,)
         (ò____/
        /  ~ \
       |  /   `----.
       | |         |
      /   \        |
     ~   / \
    ~   |   \
       /     \
      '       '
"""

def print_assistant(text: str) -> str:
    """
    Generates and returns an ASCII art string of a dog with a speech bubble.
    """
    text_length = len(text)
    top    = "   " + "-" * (text_length + 2) + "."
    middle = "  ( " + text + " )"
    bottom = "   " + "-" * (text_length + 2) + "'"
    tail1  = "      \\" 
    tail2  = "       \\" 
    # textwrap.dedent removes common indentation
    # .strip() removes empty lines at the beginning and end
    clean_dog_art = textwrap.dedent(_DOG_ART_BASE_RAW)
    full_art = f"{top}\n{middle}\n{bottom}\n{tail1}\n{tail2}\n{clean_dog_art}"
    return full_art

def print_welcome():
    """Displays ASCII art of Azor the dog."""
    try:
        console.print_info(print_assistant("Woof Woof!"))
    except Exception:
        console.print_error("Unknown Error.")

