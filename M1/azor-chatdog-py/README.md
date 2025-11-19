# AZOR the CHATDOG

Utworzone na podst. prompta (oraz podlinkowanego wątku gemini) opisanego w [`INITIAL-CHAT-PROMPT.md`](./INITIAL-CHAT-PROMPT.md)

## setup/requirements

- stwórz venv: `python -m venv .venv`
- aktywacja venv: `source .venv/bin/activate`
- zależności: `pip install -r requirements.txt`

### opis zależności

- `google-genai` - klient Google Gemini API
- `llama-cpp-python` - klient lokalnych modeli LLaMA (GGUF)
- `python-dotenv` - ładowanie zmiennych środowiskowych z `.env`
- `colorama` - kolorowy output w terminalu
- `prompt-toolkit` - interaktywny prompt w terminalu

## Konfiguracja klienta LLM

Aplikacja obsługuje dwa typy modeli LLM:

### Google Gemini (domyślny)
Utwórz plik `.env` z następującymi zmiennymi:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
MODEL_NAME=gemini-2.5-flash # zgodny z dostępnymi modelami Gemini
```

### Local LLaMA (llama-cpp-python)
Dla lokalnych modeli LLaMA ustaw:
```bash
MODEL_NAME=llama-3.1-8b-instruct
LLAMA_MODEL_PATH=/path/to/your/model.gguf
LLAMA_GPU_LAYERS=1
LLAMA_CONTEXT_SIZE=2048
```

**Automatyczne wykrywanie:** System automatycznie wybierze odpowiedni klient na podstawie nazwy modelu. Nazwy zawierające "llama", "meta-llama", "vicuna" lub "alpaca" będą używać LlamaClient.

### Przykład użycia z LLaMA

1. Ustaw zmienne środowiskowe w `.env`:
```bash
MODEL_NAME=llama-3.1-8b-instruct
LLAMA_MODEL_PATH=/Users/tomaszku/Library/Caches/llama.cpp/bartowski_Meta-Llama-3.1-8B-Instruct-GGUF_Meta-Llama-3.1-8B-Instruct-Q8_0.gguf
LLAMA_GPU_LAYERS=1
LLAMA_CONTEXT_SIZE=2048
```

2. Uruchom aplikację - automatycznie zostanie użyty LlamaClient:
```bash
python src/run.py
```

3. System automatycznie wykryje model LLaMA na podstawie nazwy i załaduje lokalny model.

## uruchamianie

- aktywacja venv: `source .venv/bin/activate`
- run: `python src/run.py`
- kontynuacja sesji: `python src/run.py --session-id=<ID>`


## Wspierane slash-commands:

```
/exit
/quit
/help
/switch <ID>
/session list
/session display
/session pop
/session clear
/session new
```

## Pliki Sesji

Sesje są zapisywane w `~/.azor/`:
- `<session-id>-log.json` - historia konwersacji
- `azor-wal.json` - Write-Ahead Log (wszystkie transakcje)

## Architektura

### Zarządzanie Sesjami

Aplikacja wykorzystuje dwuklasowy system zarządzania sesjami:

#### **`ChatSession`** (pojedyncza sesja czatu)
Reprezentuje pojedynczą sesję czatu i zawiera:
- **Unikalny identyfikator sesji** (`session_id`)
- **Historia konwersacji** (wszystkie wiadomości)
- **Sesja LLM** (wewnętrzny obiekt Google GenAI)
- **Metody zarządzania**:
  - `send_message(text)` - wysyła wiadomość do modelu
  - `save_to_file()` / `load_from_file(id)` - persystencja
  - `get_history()` / `clear_history()` - zarządzanie historią
  - `pop_last_exchange()` - usuwa ostatnią wymianę
  - `count_tokens()` / `get_remaining_tokens()` - liczenie tokenów
  - `is_empty()` - sprawdza czy sesja ma zawartość

#### **`SessionManager`** (orkiestracja sesji)
Zarządza cyklem życia sesji i aktualnie aktywną sesją:
- Tworzy nowe sesje
- Przełącza między sesjami
- Automatycznie zapisuje sesje przy przełączaniu
- Obsługuje inicjalizację z CLI
- Zapewnia cleanup przy wyjściu z programu

**Kluczowa zmiana:** Cały stan sesji jest enkapsulowany w klasach. Żadne globalne zmienne nie są używane do przechowywania stanu sesji.

### Abstraktcja Klientów LLM

Aplikacja obsługuje różne typy modeli LLM poprzez zunifikowany interfejs:

#### **`GeminiLLMClient`** (Google Gemini API)
- Obsługuje modele Gemini przez API Google
- Wymaga klucza API (`GEMINI_API_KEY`)
- Obsługuje funkcje Gemini: thinking budget, structured responses

#### **`LlamaClient`** (lokalne modele LLaMA)
- Obsługuje lokalne modele GGUF przez llama-cpp-python
- Nie wymaga połączenia internetowego
- Konfigurowalne parametry: warstwy GPU, rozmiar kontekstu
- Kompatybilny interfejs z GeminiLLMClient

**Automatyczny wybór:** `ChatSession` automatycznie wybiera odpowiedni klient na podstawie nazwy modelu w `Assistant` konfiguracji.
