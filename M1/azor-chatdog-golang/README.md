# AZOR the CHATDOG - Go Edition

Port 1:1 z wersji Python do Go. Obsługuje Google Gemini API oraz lokalne modele LLaMA.

## Setup/Requirements

### Instalacja Task (opcjonalnie, ale zalecane)
```bash
brew install go-task  # macOS
```

### Instalacja zależności
```bash
task install          # z Task
# lub
go mod download       # bez Task
```

### Konfiguracja klienta LLM

Aplikacja obsługuje dwa typy modeli LLM:

#### Google Gemini (domyślny)
Utwórz plik `.env` z następującymi zmiennymi:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
MODEL_NAME=gemini-2.5-flash
ENGINE=GEMINI
```

#### Local LLaMA (llama-cpp)

**UWAGA:** Klient LLaMA wymaga zainstalowania llama.cpp i odpowiednich nagłówków C.

Dla lokalnych modeli LLaMA ustaw:
```bash
ENGINE=LLAMA_CPP
MODEL_NAME=llama-3.1-8b-instruct
LLAMA_MODEL_PATH=/path/to/your/model.gguf
LLAMA_GPU_LAYERS=1
LLAMA_CONTEXT_SIZE=2048
```

##### Instalacja llama.cpp (wymagane dla ENGINE=LLAMA_CPP)

```bash
# Clone llama.cpp
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# Build
make

# Ustaw zmienną środowiskową
export LLAMA_CPP_DIR=$(pwd)
```

Następnie przebuduj projekt Go z tymi zależnościami.

## Uruchamianie

### Z Task (zalecane)
```bash
task env              # Utwórz .env (raz)
task build            # Kompiluj
task run              # Uruchom
task sessions         # Lista sesji
task clean            # Wyczyść
```

### Bez Task
```bash
cp .env.example .env
go build -o azor-chatdog .
./azor-chatdog
./azor-chatdog --session-id=<ID>  # Kontynuacja sesji
```

## Wspierane slash-commands

```
/exit             - Zakończenie czatu
/quit             - Zakończenie czatu
/help             - Wyświetla pomoc
/switch <ID>      - Przełącz na inną sesję
/session list     - Wyświetla listę sesji
/session display  - Wyświetla całą historię
/session pop      - Usuwa ostatnią wymianę
/session clear    - Czyści historię
/session new      - Rozpoczyna nową sesję
/session remove   - Usuwa bieżącą sesję
/pdf              - Export do PDF (TODO)
```

### Autocompletion

Po wpisaniu `/` i naciśnięciu **Tab**, pojawią się podpowiedzi:
- Slash commands (`/help`, `/session`, `/switch`, etc.)
- Subkomendy dla `/session` (`list`, `display`, `pop`, etc.)
- ID sesji dla `/switch` (dynamicznie pobrane z `~/.azor/`)

**Klawisze:**
- `Tab` / `Ctrl+I` - Pokaż/przełącz podpowiedzi
- `↑` / `↓` - Nawigacja po podpowiedziach
- `Enter` - Wybierz podpowiedź lub wyślij komendę
- `Ctrl+C` - Przerwanie (exit)

## Pliki Sesji

Sesje są zapisywane w `~/.azor/`:
- `<session-id>-log.json` - historia konwersacji
- `azor-wal.json` - Write-Ahead Log (wszystkie transakcje)

## Architektura

Struktura projektu:
- `assistant/` - Konfiguracja asystenta (Azor)
- `llm/` - Klienci LLM (Gemini i Llama)
- `session/` - Zarządzanie sesjami czatu
- `cli/` - Interfejs CLI (konsola, prompt, argumenty)
- `files/` - Zarządzanie plikami (config, sesje, WAL)
- `commands/` - Obsługa komend slash
- `main.go` - Punkt wejścia
- `chat.go` - Główna pętla czatu
- `command_handler.go` - Handler komend

## Różnice od wersji Python

- Brak wsparcia dla eksportu do PDF (planowane)
- Llama.cpp wymaga dodatkowej konfiguracji C dependencies (obecnie stub implementation)
- Używa natywnej biblioteki Google Go GenAI zamiast Python SDK
- Brak wsparcia dla prompt_toolkit (używa prostego bufio.Reader)

## Kompletność Portu

✅ **Zaimplementowane:**
- Pełne wsparcie dla Google Gemini API
- Zarządzanie sesjami (tworzenie, przełączanie, zapisywanie, usuwanie)
- Historia konwersacji
- Write-Ahead Log (WAL)
- Wszystkie slash commands (/exit, /quit, /help, /switch, /session)
- **Autocompletion komend** (Tab dla podpowiedzi)
- Liczenie tokenów
- Persystencja sesji w ~/.azor/
- Konfiguracja przez .env
- Kolorowy output w terminalu

⚠️ **Stub/Placeholder:**
- LLaMA client (wymaga instalacji llama.cpp bindings)
- Export do PDF

## Struktura Plików

```
azor_golang/
├── README.md              # Ta dokumentacja
├── .env.example           # Przykładowa konfiguracja
├── go.mod                 # Go module definition
├── main.go                # Punkt wejścia
├── chat.go                # Główna logika czatu
├── command_handler.go     # Obsługa komend
├── assistant/             # Konfiguracja asystenta
│   ├── assistant.go
│   └── azor.go
├── llm/                   # Klienci LLM
│   ├── types.go
│   ├── gemini_client.go
│   ├── gemini_validation.go
│   ├── llama_client.go
│   └── llama_validation.go
├── session/               # Zarządzanie sesjami
│   ├── chat_session.go
│   └── session_manager.go
├── cli/                   # Interfejs CLI
│   ├── console.go
│   ├── prompt.go
│   └── args.go
├── files/                 # Zarządzanie plikami
│   ├── config.go
│   ├── session_files.go
│   └── wal.go
└── commands/              # Handlery komend
    ├── welcome.go
    ├── session_list.go
    ├── session_display.go
    ├── session_summary.go
    └── session_remove.go
```

## Quick Start

1. Skopiuj `.env.example` do `.env` i dodaj swój klucz API Gemini
2. Build: `go build -o azor-chatdog .`
3. Run: `./azor-chatdog`

## Rozwój

Projekt jest kompletnym portem 1:1 funkcjonalności Python, z wyjątkiem:
- LLaMA client (stub - wymaga implementacji z llama.cpp bindings)
- PDF export (do zaimplementowania)
