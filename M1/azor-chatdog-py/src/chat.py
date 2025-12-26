import atexit
from .cli.args import get_session_id_from_cli
from .session import get_session_manager
from .cli import console
from .cli.prompt import get_user_input
from .commands.welcome import print_welcome
from . import command_handler



def init_chat():
    """Initializes a new session or loads an existing one."""
    print_welcome()
    manager = get_session_manager()

    # Initialize session based on CLI args
    cli_session_id = get_session_id_from_cli()
    session = manager.initialize_from_cli(cli_session_id)

    # Register cleanup handler
    atexit.register(lambda: manager.cleanup_and_save())


def main_loop():
    """Main loop of the interactive chat."""
    manager = get_session_manager()

    while True:
        try:
            user_input = get_user_input()

            if not user_input:
                continue

            if user_input.startswith("/"):
                should_exit = command_handler.handle_command(user_input)
                if should_exit:
                    break
                continue

            # Conversation with the model
            session = manager.get_current_session()

            # Send message (handles WAL logging internally)
            response = session.send_message(user_input)

            # Get token information
            total_tokens, remaining_tokens, max_tokens = session.get_token_info()

            # Display response
            console.print_assistant(f"\n{session.assistant_name}: {response.text}")
            console.print_info(
                f"Tokens: {total_tokens} (Pozostało: {remaining_tokens} / {max_tokens})"
            )

            # Save session
            success, error = session.save_to_file()
            if not success and error:
                console.print_error(f"Error saving session: {error}")

        except KeyboardInterrupt:
            console.print_info(
                "\nPrzerwano przez użytkownika (Ctrl+C). Uruchamianie procedury finalnego zapisu..."
            )
            break
        except EOFError:
            console.print_info("\nWyjście (Ctrl+D).")
            break
        except Exception as e:
            console.print_error(f"\nWystąpił nieoczekiwany błąd: {e}")
            import traceback

            traceback.print_exc()
            break
