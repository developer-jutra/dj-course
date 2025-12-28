import os
import glob
import torch
from transformers import pipeline

# --- KONFIGURACJA ŚCIEŻEK (POZOSTAWIAM BEZ ZMIAN) ---

# Ścieżka do katalogu skryptu
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Przykładowe pliki (przykładowa lista - zaktualizowałem ją o długie pliki, aby je przetestować)
SAMPLE_UNDER30S_FILES = [
    "../sample-audio/test-Rachel.mp3",
    "../sample-audio/test-Tomasz.wav",
    "../sample-audio/test-Vince.wav",
]

SAMPLE_LONGER_FILES = [
    "../sample-audio/test-long-CherryTwinkle.wav",
    "../sample-audio/test-long-Bjorn.mp3",
    "../sample-audio/7cac6300-dccb-431f-a7a9-f1384bcfd334-full-conversation.wav",
    "../sample-audio/17d5d508-f093-4b69-b250-9495e8c40d79-full-conversation.wav",
    "../sample-audio/60961cfd-7fee-430c-b834-88525092c7c3-full-conversation.wav",
]

ALL_FILES_TO_PROCESS = SAMPLE_UNDER30S_FILES + SAMPLE_LONGER_FILES

# 1. General Configuration
MODEL_NAME = "openai/whisper-tiny"
CHUNK_LENGTH = 30  # Długość fragmentu w sekundach, wymagana dla dłuższych plików

# 2. OPTYMALIZACJA: Inicjalizacja modelu poza funkcją i pętlą
# Użycie GPU (CUDA) jeśli jest dostępne, w przeciwnym razie CPU
device = "cuda:0" if torch.cuda.is_available() else "cpu"

print(f"Loading model: {MODEL_NAME} on device: {device}")

try:
    # KLUCZOWA ZMIANA: Dodanie chunk_length_s
    asr_pipeline = pipeline(
        "automatic-speech-recognition",
        model=MODEL_NAME,
        chunk_length_s=CHUNK_LENGTH,  # Włącza przetwarzanie długich plików
        device=device,
    )
except Exception as e:
    print(
        f"BŁĄD KRYTYCZNY: Nie udało się zainicjalizować pipeline. Upewnij się, że masz FFmpeg i zależności: {e}"
    )
    # Użycie exit() uniemożliwi uruchomienie dalszego kodu bez działającego modelu
    exit(1)


def transcribe_audio(audio_path: str, asr_pipeline: pipeline) -> str:
    """
    Transkrybuje plik audio przy użyciu wstępnie załadowanego pipeline.
    """
    try:
        # 3. Transcription
        print(f"Starting transcription of file: {os.path.basename(audio_path)}...")

        # asr_pipeline obsługuje całą logikę chunkingu i łączenia
        result = asr_pipeline(audio_path)

        # The result is a dictionary; the 'text' key holds the transcription
        transcription = result["text"]

        return transcription

    except FileNotFoundError:
        return f"BŁĄD: Plik audio nie znaleziony pod ścieżką: {audio_path}"
    except Exception as e:
        return f"Wystąpił nieoczekiwany błąd podczas transkrypcji: {e}"


if __name__ == "__main__":

    # Przetwarzanie wszystkich plików, w tym dłuższych
    for AUDIO_FILE in ALL_FILES_TO_PROCESS:
        audio_file_path = os.path.normpath(AUDIO_FILE)

        # Sprawdzanie, czy plik istnieje, zanim przekażemy go do transkrypcji
        if not os.path.exists(audio_file_path):
            transcribed_text = (
                f"POMINIĘTO: Plik nie istnieje pod ścieżką: {audio_file_path}"
            )
        else:
            transcribed_text = transcribe_audio(audio_file_path, asr_pipeline)

        print("=" * 60)
        print(f"TRANSKRYPCJA DLA PLIKU: {os.path.basename(AUDIO_FILE)}:")
        print(transcribed_text, "\n")

    print("=" * 60)
    print("Wszystkie pliki zostały przetworzone.")
