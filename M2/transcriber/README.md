# `transcriber`

Wykorzystujemy OSS model `openai/whisper`:
- domyślnie: https://huggingface.co/openai/whisper-tiny aby ściągał jak najmniejszy model spośród wielu
- pozostałe dostępne modele: https://huggingface.co/collections/openai/whisper-release

Pliki:
- `transcriber.py` - (prosty) skrypt do transkrypcji (max 30s nagrania - ograniczenie modelu)
- `transcriber-long.py` - chunkowanie umożliwiające transkrypcję dłuższych nagrań

## setup

wymagane `ffmpeg` w systemie.

windows (chocolatey):
`choco install ffmpeg`

macos:
`brew install ffmpeg`

linux:
`sudo apt update`
`sudo apt install ffmpeg`

## python

venv/uv/... - do wyboru, do koloru

```bash
python -m venv .venv
source .venv/bin/activate  # linux/macos
.venv\Scripts\activate     # windows
pip install -r requirements.txt
```
