# animate.py

import time
import random
import string
import threading
import re

from rich.console import Console
from rich.text import Text
from rich.live import Live

SPECIAL_CHARS = list(string.punctuation + string.digits + "@#$%^&*")
BLUE_PALETTE = [
    "#00FFFF",
    "#00BFFF",
    "#1E90FF",
    "#4169E1",
    "#0000FF",
    "#0000CD",
    "#00008B",
    "#00CED1",
    "#4682B4",
]

ANIMATION_DELAY = 0.10
console = Console()


def run_tts_animation(
    target_text: str,
    thread_to_monitor: threading.Thread | None = None,
    duration_sec: float | None = None,
    text_length: int = 50,
):
    """
    Uruchamia animację tekstową w konsoli, działającą przez określony czas
    lub do zakończenia monitorowanego wątku.

    Args:
        target_text: Tekst do wyświetlenia i wyróżnienia w animacji.
        thread_to_monitor: Wątek, którego zakończenie zatrzyma animację.
        duration_sec: Czas trwania animacji w sekundach (ignorowany, jeśli podano thread_to_monitor).
        text_length: Całkowita szerokość paska animacji.

    Returns:
        Czas trwania animacji w sekundach.
    """

    clean_text = Text.from_markup(target_text).plain
    start_pos = (text_length - len(clean_text)) // 2
    target_regex = re.compile(re.escape(clean_text))

    is_timed = duration_sec is not None and thread_to_monitor is None

    start_time = time.time()

    with Live(console=console, screen=False, refresh_per_second=20) as live:

        while True:

            if is_timed and (time.time() - start_time) >= duration_sec:
                break

            if not is_timed and thread_to_monitor and not thread_to_monitor.is_alive():
                break

            random_color = random.choice(BLUE_PALETTE)
            random_background = "".join(
                random.choice(SPECIAL_CHARS) for _ in range(text_length)
            )

            end_pos = start_pos + len(clean_text)

            final_text_string = (
                random_background[:start_pos] + clean_text + random_background[end_pos:]
            )

            display_text = Text(final_text_string, style=f"bold {random_color}")

            display_text.highlight_regex(target_regex, "bold blue")

            live.update(display_text)

            time.sleep(ANIMATION_DELAY)

    if thread_to_monitor:
        thread_to_monitor.join()

    return time.time() - start_time


if __name__ == "__main__":

    console.print("\n[bold cyan]▶️ Uruchomienie testowej animacji...[/bold cyan]")
    run_tts_animation(target_text=" TESTOWANIE EFEKTU ", duration_sec=10.0)
    console.print("[bold green]✅ Testowa animacja zakończona.[/bold green]")
