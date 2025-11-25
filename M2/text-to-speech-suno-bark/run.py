import scipy.io.wavfile as wavfile
from transformers import pipeline

def generate_speech_from_text(text_to_speak, output_filename="example-output.wav"):
    """
    Generuje mowę na podstawie tekstu i zapisuje ją do pliku WAV.
    Używa potoku 'text-to-speech' z modelu suno/bark.
    
    :param text_to_speak: Tekst do syntezy.
    :param output_filename: Nazwa pliku wyjściowego (domyślnie .wav).
    """
    try:
        print("Ładowanie modelu Text-to-Speech (suno/bark)...")
        synthesizer = pipeline("text-to-speech", "suno/bark")
        print("Model załadowany.")

        print(f"Syntetyzowanie mowy dla tekstu: '{text_to_speak[:50]}...'")
        speech = synthesizer(text_to_speak)
        
        sampling_rate = speech["sampling_rate"]
        audio_data = speech["audio"][0]
        
        wavfile.write(output_filename, rate=sampling_rate, data=audio_data)
        print(f"\n✅ Sukces! Plik audio zapisany jako: {output_filename}")

    except ImportError as e:
        print(f"\nBłąd importu: {e}")
        print("Upewnij się, że zainstalowałeś wszystkie biblioteki z requirements.txt (np. pip install -r requirements.txt).")
    except Exception as e:
        print(f"\nWystąpił błąd: {e}")

def clear_output_files():
    import glob
    import os
    for filename in glob.glob("output*"):
        try:
            os.remove(filename)
            print(f"Usunięto plik: {filename}")
        except Exception as e:
            print(f"Nie udało się usunąć pliku {filename}: {e}")

texts = [
    "witaj w szkoleniu DEVELOPER JUTRA! Mówi do Ciebie model suno bark!",
    "Sąd sądem, a sprawiedliwość musi być po naszej stronie.",
    "[sighs] A może by tak rzucić to wszystko i wyjechać w Bieszczady?",
    "[laughs] Nie matura, lecz chęć szczera zrobi z ciebie oficera.",
    "♪ Nie matura, lecz chęć szczera zrobi z ciebie oficera ♪",
]
# zerknij na plik texts.py

if __name__ == "__main__":
    clear_output_files()    
    for i, text in enumerate(texts):
        output_filename = f"output_{i+1}.wav"
        generate_speech_from_text(text, output_filename)
