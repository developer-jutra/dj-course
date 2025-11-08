# `transcriber-ui`

[`tkinter`](https://docs.python.org/3/library/tkinter.html) - python builtin GUI std lib

Plik `tkinter-only.py` - zawiera tkinterowe hello world

Aplikacja jest w `app.py`. Domyślnie nagrany plik (potrzebny na rzecz transkrypcji) jest zrzucany do `recording.wav`.

## setup

System może najpierw potrzebować zainstalowane `portaudio`:

macos:
`brew install portaudio`

linux:
`sudo apt-get install portaudio19-dev`

## tkinter

upewnij się że tkinter jest zainstalowany:

macos:
`brew install tcl-tk`
lub
`brew install python-tk@3.13`

## python

venv/uv/... - do wyboru, do koloru

```bash
python -m venv .venv
source .venv/bin/activate  # linux/macos
.venv\Scripts\activate     # windows
pip install -r requirements.txt
```

## bundle as dekstop app - `pyinstaller`

Może potrwać chwilę

Uruchom:
`pyinstaller --onefile --windowed --name "Azor-Transcriber" app.py`

## śledzenie zajętości miejsca

No rocket science, ale warto monitorować zajętość miejsca (i wiedzieć, gdzie który toolstack przechowuje modele)

```bash
# model w wersji najmniejszej
(.venv) ➜  transcriber-ui git:(main) ✗ du -sh ~/.cache/huggingface/hub/models--openai--whisper-tiny 
148M    /Users/tomaszku/.cache/huggingface/hub/models--openai--whisper-tiny

# zależności lokalne (porównywalnie do czarnej dziury czyli node_modules :P)
(.venv) ➜  transcriber-ui git:(main) ✗ du -sh .venv/
994M    .venv/
# w tym największe:
385M    .venv/lib/python3.13/site-packages/torch
111M    .venv/lib/python3.13/site-packages/transformers
 98M    .venv/lib/python3.13/site-packages/scipy
```
