import os
from datetime import datetime
from pydub import AudioSegment

from ..session import SessionManager
from ..cli.console import print_info, print_error
from ..xtts import run_tts

# USER_SPEAKER_WAV = "./src/files/sounds/sample-agent.wav"
# USER_SPEAKER_WAV = "./src/files/sounds/dzien swira-czy panowie.mp3"
USER_SPEAKER_WAV = "./src/files/sounds/znammalo.wav"
# AGENT_SPEAKER_WAV = "./src/files/sounds/Oczom ich ukazał się las... krzyży.mp3"
AGENT_SPEAKER_WAV = "./src/files/sounds/aplzaakc.wav"
OUTPUT_WAV_PATH = "./src/files/sounds/"
FILENAME = "output.wav"

def cmd_audio(session_manager: SessionManager, *args):
    """
    Generates an audio file from the last chat response, provided text, or the full conversation.
    Saves the audio file in the 'audio_output' directory.
    Usage:
        /audio - generates audio from the last model response
        /audio <text to generate> - generates audio from the provided text
        /audio --full - generates audio from the entire conversation history
    """

    output_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "audio_output")
    )
    os.makedirs(output_dir, exist_ok=True)

    if "--full" in args:
        if not session_manager.has_active_session():
            print_error("No active session to generate a full conversation audio.")
            return
        generate_full_conversation_audio(
            session_manager.get_current_session(),
            output_dir,
            USER_SPEAKER_WAV,
            AGENT_SPEAKER_WAV,
        )
        return

    text_to_generate = ""
    if args:
        text_to_generate = " ".join(args)

    if not text_to_generate:
        if not session_manager.has_active_session():
            print_error(
                "No active session. Start a conversation or provide text to generate."
            )
            return

        current_session = session_manager.get_current_session()
        last_response = current_session.get_last_model_response()

        if not last_response:
            print_error(
                "No model response found. Provide text to generate: /audio <text>"
            )
            return
        session_id = session_manager.get_current_session().session_id
        text_to_generate = last_response
        output_filename = f"{session_id}-{datetime.now().isoformat()}.wav"
    else:
        session_id = "custom"
        output_filename = f"{session_id}-{datetime.now().isoformat()}.wav"

    output_path = os.path.join(output_dir, output_filename)
    print_info(f"Generating audio... (this may take a moment)")

    try:
        run_tts([text_to_generate], AGENT_SPEAKER_WAV, output_path)
        print_info(f"Audio saved to: {os.path.relpath(output_path)}")
    except Exception as e:
        print_error(f"An unexpected error occurred: {e}")


def generate_full_conversation_audio(
    session, output_dir, user_speaker, agent_speaker
):
    """Generates and combines audio for the entire conversation."""
    print_info("Generating full conversation audio... This might take a while.")
    history = session.get_history()
    combined_audio = AudioSegment.empty()
    temp_files = []

    for i, entry in enumerate(history):
        role = entry.get("role")
        text = entry.get("parts")[0].get("text") if entry.get("parts") else ""

        if not text:
            continue

        speaker_wav = user_speaker if role == "user" else agent_speaker
        temp_filename = os.path.join(output_dir, f"temp_{session.session_id}_{i}.wav")
        temp_files.append(temp_filename)

        print_info(f"Generating audio for message {i+1}/{len(history)} ({role})...")
        try:
            run_tts([text], speaker_wav, temp_filename)
            segment = AudioSegment.from_wav(temp_filename)
            combined_audio += segment
        except Exception as e:
            print_error(f"Could not generate audio for message {i+1}: {e}")
            continue

    # Export combined audio
    final_filename = f"{session.session_id}-full-conversation.wav"
    final_path = os.path.join(output_dir, final_filename)
    combined_audio.export(final_path, format="wav")
    print_info(f"Full conversation audio saved to: {os.path.relpath(final_path)}")

    # Clean up temp files
    for f in temp_files:
        try:
            os.remove(f)
        except OSError:
            pass
