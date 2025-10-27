# MLFlow quickstart

MLFlow to paczka pythonowa - musisz mieć ją zainstalowaną (globalnie lub środowisko typu virtualenv).
Quickstart: https://mlflow.org/docs/latest/genai/getting-started/

Jeśli komuś krwawią oczy na widok pythona to jest jeszcze API JS 😅 https://mlflow.org/docs/latest/genai/tracing/quickstart/typescript-openai/

## FLOW

- agent integruje się z modelem (wiadomo)
- mlflow "nasłuchuje" tę komunikację
- musimy sprowokować dowolnego nasłuchiwanego agenta aby się "odezwał" do modelu
  - może to być `claude -p "bla bla"` (z CLI)
  - może to być dowolny lokalny model (uruchomiony za pośrednictwem ollama, llama.cpp, cokolwiek)
- (po zainstalowaniu zależności - wiadomo) uruchamiasz `mlflow ui`

Szczegółowe instrukcje poniżej.

## venv setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

albo `pip install mlflow`

## uruchomienie MLFlow UI (konieczne)

    mlflow ui
    mlflow ui --port 5001

## Podsłuchiwanie Claude

    mlflow autolog claude -u file:./mlruns

check:

    mlflow autolog claude --status

uruchomienie claude z konsoli:

    claude -p "write a poem about MLFlow in Polish"

albo edycja pliku pythonowego:

    claude -p "claude -p 'refactor the python function in test.py to use list comprehension'"

wyłączenie:

    mlflow autolog claude --disable

## lokalne modele

zobacz config w pliku `run-local-model.py`:
- czy używasz llama.cpp, ollama, czy jeszcze czegoś innego (byoe kompatybilnego z OpenAI API)
- stawianie lokalnego modelu:
  - ollama: `ollama run <MODEL>` np. `ollama run gemma3:27b`
  - llama.cpp: `llama-server -m <PATH>/<MODEL>` np. `llama-server -m ~/Library/Caches/llama.cpp/bartowski_Meta-Llama-3.1-8B-Instruct-GGUF_Meta-Llama-3.1-8B-Instruct-Q8_0.gguf`
    - lub to samo tylko `llama-cli` zamiast `llama-server`, np. `llama-cli -m ~/Library/Caches/llama.cpp/bartowski_Meta-Llama-3.1-8B-Instruct-GGUF_Meta-Llama-3.1-8B-Instruct-Q8_0.gguf`
- upewnij się, że `PORT` się zgadza
- `ollama` wymaga poprawnej nazwy modelu (bo serwer ma ich wiele), zaś dla `llama.cpp` - jej to obojętne
