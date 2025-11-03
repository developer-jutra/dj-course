## Azor DOCS

### ⚙️ Konfiguracja i Pliki
* **`.env`**: Plik konfiguracyjny z wyborem silnika i odpowiednimi zmiennymi środowiskowymi.
* **`~/.azor/`**: Główny katalog roboczy aplikacji. Tworzony automatycznie.
* **`~/.azor/<SESSION-ID>-log.json`**: Pliki historii sesji. Zapisywane są w nich tury konwersacji (rola, treść, czas) dla konkretnego ID sesji.
* **`~/.azor/azor-wal.json`**: Dziennik Zapisu Transakcji (WAL). Plik śledzący każde żądanie i odpowiedź do modelu (prompt, response, tokens) niezależnie od sesji.
* **`chat_ascii.py`**: Zewnętrzny moduł zawierający funkcję `print_azor` do wyświetlania ASCII Artu na starcie.

#### Konfiguracja Silnika

**Dla Gemini (ENGINE=GEMINI):**
* `ENGINE=GEMINI`
* `GEMINI_API_KEY` - klucz API Google Gemini
* `MODEL_NAME` - nazwa modelu (np. "gemini-2.5-flash")

**Dla Llama (ENGINE=LLAMA_CPP):**
* `ENGINE=LLAMA_CPP`
* `MODEL_NAME` - nazwa modelu (np. "llama-3.1-8b-instruct")
* `LLAMA_MODEL_PATH` - ścieżka do pliku modelu .gguf
* `LLAMA_GPU_LAYERS` - liczba warstw GPU (opcjonalne)
* `LLAMA_CONTEXT_SIZE` - rozmiar kontekstu (opcjonalne)

***

### 🧱 Ogólna Architektura Aplikacji
* **Klient LLM**: Inicjalizowany na podstawie zmiennej `ENGINE` - obsługuje zarówno Gemini jak i Llama.
* **Sesja (ChatSession)**: Obiekt zarządzający bieżącą konwersacją i jej historią (`conversation_history`).
* **Inicjalizacja**: Sprawdza konfigurację silnika, wyświetla ASCII Art, parsuje opcjonalne `--session-id` z CLI, wczytuje historię lub tworzy nową sesję.
* **Pętla Główna**: Czeka na wejście użytkownika, rozróżnia komendy od wiadomości do modelu.
* **Obsługa Historii**: Historia jest pobierana po każdej odpowiedzi (`chat_session.get_history()`) i zapisywana do pliku sesji (`-log.json`) **na bieżąco**.
* **Zapis WAL**: Każda transakcja (zapytanie + odpowiedź) jest **natychmiast** dopisywana do pliku `azor-wal.json`.

***

### 🔒 Reguły i Zasady
* **Wymagania Konfiguracyjne**: 
  - Dla `ENGINE=GEMINI`: wymagana zmienna `GEMINI_API_KEY`
  - Dla `ENGINE=LLAMA_CPP`: wymagana zmienna `LLAMA_MODEL_PATH`
* **Walidacja Inputu**: Jeśli input zaczyna się od `/`, musi to być jedna z predefiniowanych komend slash, w przeciwnym razie jest odrzucany z błędem.
* **Zapis Historii Sesji**: Sesja jest zapisywana do pliku `.json` **tylko wtedy**, gdy zawiera co najmniej dwie wiadomości (`len(history) >= 2`), tj. jedną pełną turę (User + Model).
* **Automatyczny Zapis Końcowy**: Funkcja zarejestrowana przez `atexit` zapewnia finalny zapis sesji i wyświetla instrukcję jej wznowienia.
* **Tokeny Kontekstu**: Po każdej wiadomości wyświetlana jest zajętość kontekstu (tokeny), porównywana z limitem **`MAX_CONTEXT_TOKENS`** (32768) i oznaczana kolorami w zależności od poziomu zapełnienia.

***

### ⌨️ Obsługiwane Komendy Slash
* **`/exit`, `/quit`**: Kończy czat i uruchamia procedurę finalnego zapisu.
* **`/sessions`**: Wyświetla listę wszystkich dostępnych ID sesji zapisanych w katalogu `~/.azor/`.
* **`/switch <ID>`**: Zapisuje bieżącą sesję, wczytuje i kontynuuje sesję o podanym ID. Po przełączeniu wyświetla podsumowanie historii.
* **`/help`**: Wyświetla instrukcję użytkowania komend i informacje o bieżącej sesji.
