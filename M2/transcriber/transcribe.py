import torch
import librosa
from transformers import pipeline

import os
import glob

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

SAMPLE_FILES = glob.glob("../sample-audio/*")

SAMPLE_UNDER30S_FILES = [
    "../sample-audio/test-Rachel.mp3",
    "../sample-audio/test-Tomasz.wav",
    "../sample-audio/test-Vince.wav",
]

SAMPLE_LONGER_FILES = [
    "../sample-audio/test-long-CherryTwinkle.wav",
    "../sample-audio/test-long-Bjorn.mp3",
]

# 1. General Configuration
MODEL_NAME = "openai/whisper-tiny"


def transcribe_audio(audio_path: str, model_name: str) -> str:
    """
    Loads the Whisper-tiny model and transcribes the audio file.
    """
    try:
        # 2. Pipeline initialization (recommended by Hugging Face for transcription)
        # The Pipeline automatically manages the model, processor, and tokenizer.
        # Defines the task: automatic-speech-recognition

        # We use the pipeline with the whisper-tiny model
        asr_pipeline = pipeline(
            "automatic-speech-recognition",
            model=model_name,
            # device=0 if you have a CUDA card and want to speed up transcription
        )

        # 3. Transcription
        # The Pipeline can directly accept the path to the audio file
        print(f"Starting transcription of file: {audio_path}...")

        result = asr_pipeline(audio_path)

        # The result is a dictionary; the 'text' key holds the transcription
        transcription = result["text"]

        return transcription

    except FileNotFoundError:
        return f"ERROR: Audio file not found at path: {audio_path}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"


if __name__ == "__main__":
    print(f"Loading model: {MODEL_NAME}")

    # Make sure the file `audio.mp3` exists in the same directory
    # or replace the path `AUDIO_FILE_PATH` with the correct one

    for AUDIO_FILE in SAMPLE_UNDER30S_FILES:
        audio_file_path = os.path.normpath(AUDIO_FILE)
        transcribed_text = transcribe_audio(audio_file_path, MODEL_NAME)

        print("=" * 40)
        print(f"TRANSCRIPTION for {os.path.basename(AUDIO_FILE)}:")
        print(transcribed_text, "\n")
