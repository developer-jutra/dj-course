from TTS.api import TTS

tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2",progress_bar=True).to("cpu")
FILE_PATH = "sample-agent.wav"
OUTPUT_WAV_PATH = "output.wav"

text = "Lubię ser i bułki - i strzelam z dwururki!"
# text = "Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki! Lubię ser i bułki - i strzelam z dwururki!"
tts.tts_to_file(
    text=text,
    file_path=OUTPUT_WAV_PATH,
    speaker_wav=FILE_PATH,
    language="pl"
)

