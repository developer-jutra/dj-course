import time
import threading
from TTS.api import TTS
import warnings 
from animate import run_tts_animation, console

warnings.filterwarnings("ignore", category=UserWarning)

FILE_PATH = "sample-agent.wav"
OUTPUT_WAV_PATH = "output.wav"

GENERATION_DONE = threading.Event() 
def generate_file_thread(tts_instance, text, file_path, speaker_wav, language):
    """
    Wątek do asynchronicznego generowania pliku audio TTS.
    """
    try:
        tts_instance.tts_to_file(
            text=text,
            file_path=file_path,
            speaker_wav=speaker_wav,
            language=language
        )
    finally:
        GENERATION_DONE.set()

texts = [
    "witaj w szkoleniu DEVELOPER JUTRA! Mówi do Ciebie model XTTS!",
    "Sąd sądem, a sprawiedliwość musi być po naszej stronie.",
    "A może by tak rzucić to wszystko i wyjechać w Bieszczady?",
    "Nie matura, lecz chęć szczera zrobi z ciebie oficera.",
]

if __name__ == "__main__":
    
    try:
        console.print("\n[bold yellow]🤖 Ładowanie modelu TTS...[/bold yellow]")
        tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to("cpu")
        console.print("[bold green]✅ Model załadowany pomyślnie.[/bold green]")
    except Exception as e:
        console.print(f"[bold red]❌ Błąd ładowania modelu: {e}[/bold red]")
        exit(1)

    for idx, text_to_synthesize in enumerate(texts, 1):
        output_wav_path = f"output_{idx}.wav"
        GENERATION_DONE.clear()
        generation_thread = threading.Thread(
            target=generate_file_thread,
            args=(tts, text_to_synthesize, output_wav_path, FILE_PATH, "pl")
        )
        generation_thread.start()

        console.print(f"[bold cyan]▶️  ({idx}/{len(texts)}) Uruchomienie generowania pliku audio...[/bold cyan]")
        
        elapsed_time = run_tts_animation(
            target_text=" GENEROWANIE PLIKU AUDIO... ",
            thread_to_monitor=generation_thread
        )

        if GENERATION_DONE.is_set():
            console.print(f"[bold green]✅ Sukces! Plik '{output_wav_path}' został wygenerowany w {elapsed_time:.2f}s.[/bold green]")
        else:
            console.print(f"[bold red]❌ BŁĄD: Generowanie pliku '{output_wav_path}' nie powiodło się lub zostało przerwane.[/bold red]")
    
    console.print("[bold magenta]Operacja zakończona.[/bold magenta]")