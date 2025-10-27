# Llama.cpp mini-tutorial

## install

windows:
- albo lokalna kompilacja... (MinGW/MSYS2)
- albo np. za pośrednictwem pakietu pythonowego `llama-cpp-python` który ma llama.cpp "pod spodem".
  `pip install llama-cpp-python`
- albo po prostu pozostać przy ollama które jest prostsze w instalacji.

macos:
`brew install llama.cpp`

linux (local compile):

```bash
sudo apt update
sudo apt install build-essential git cmake

# repo
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# compile
make
```

## pobierz model z HF

(może być potrzebna autoryzacja konta poprzez HF, bo modele wymagają akceptacji regulaminu)

`llama-server -hf ggml-org/gpt-oss-20b-GGUF`

## uruchamianie modelu lokalnie

Przykład komendy do uruchomienia modelu Bielik-7B-Instruct w `llama.cpp`:

- `llama-server -m <MODEL_FILE>` - model działający jako serwer HTTP
  - http://127.0.0.1:8080
  - REST API (np. POST /v1/chat/completions)
- `llama-cli -m <MODEL_FILE>` - model działający w terminalu

przykładowo (dla modelu Bielik-7B-Instruct):
`llama-server -m ~/Library/Caches/llama.cpp/speakleash_Bielik-7B-Instruct-v0.1-GGUF_bielik-7b-instruct-v0.1.Q4_K_M.gguf`
`llama-cli -m ~/Library/Caches/llama.cpp/speakleash_Bielik-7B-Instruct-v0.1-GGUF_bielik-7b-instruct-v0.1.Q4_K_M.gguf`
