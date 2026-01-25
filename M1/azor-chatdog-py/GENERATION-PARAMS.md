# Parametry Generacji - Przewodnik Konfiguracji

## Przegląd

Wszystkie klienty LLM w projekcie AZØR obsługują konfigurację parametrów generacji przez zmienne środowiskowe. Parametry te kontrolują zachowanie modelu podczas generowania odpowiedzi.

---

## Parametry Uniwersalne

Poniższe zmienne środowiskowe działają dla **wszystkich silników** (OpenAI, Anthropic, Gemini, Llama):

### `TEMPERATURE`
- **Zakres:** 0.0 - 2.0
- **Domyślnie:** Zależy od silnika (patrz poniżej)
- **Opis:** Kontroluje losowość/kreatywność odpowiedzi
  - **0.0-0.3**: Bardzo deterministyczne, powtarzalne odpowiedzi
  - **0.7-1.0**: Zrównoważone (rekomendowane dla większości przypadków)
  - **1.5-2.0**: Bardzo kreatywne, mniej przewidywalne

### `TOP_P` (Nucleus Sampling)
- **Zakres:** 0.0 - 1.0
- **Domyślnie:** Zależy od silnika (patrz poniżej)
- **Opis:** Alternatywna metoda kontroli losowości
  - Model wybiera spośród najmniejszego zestawu tokenów, których skumulowane prawdopodobieństwo wynosi ≥ TOP_P
  - **0.9-0.95**: Rekomendowane dla większości przypadków
  - **1.0**: Brak ograniczeń (rozważa wszystkie tokeny)

### `TOP_K`
- **Zakres:** Liczba całkowita > 0
- **Domyślnie:** Zależy od silnika (patrz poniżej)
- **Opis:** Ogranicza wybór do K najbardziej prawdopodobnych tokenów
  - **20-40**: Rekomendowane dla krótkich odpowiedzi
  - **40-100**: Rekomendowane dla dłuższych, bardziej kreatywnych tekstów
  - **Nie wspierane przez:** OpenAI

---

## Konfiguracja per Silnik

### 1. OpenAI (ENGINE=OPENAI)

**Obsługiwane parametry:**
- ✅ `TEMPERATURE`
- ✅ `TOP_P`
- ❌ `TOP_K` (nie wspierane przez API OpenAI)

**Domyślne wartości:**
```bash
TEMPERATURE=0.7
TOP_P=1.0
```

**Przykład konfiguracji:**
```bash
ENGINE=OPENAI
OPENAI_API_KEY=sk-...
MODEL_NAME=gpt-4o-mini
TEMPERATURE=0.8
TOP_P=0.95
```

**Plik źródłowy:** `src/llm/openai_client.py`

**Dokumentacja API:** https://platform.openai.com/docs/api-reference/chat/create

---

### 2. Anthropic Claude (ENGINE=ANTHROPIC)

**Obsługiwane parametry:**
- ✅ `TEMPERATURE`
- ✅ `TOP_P`
- ✅ `TOP_K`

**Domyślne wartości:**
```bash
TEMPERATURE=1.0
TOP_P=1.0
TOP_K=0  # 0 = wyłączone
```

**Przykład konfiguracji:**
```bash
ENGINE=ANTHROPIC
ANTHROPIC_API_KEY=sk-ant-...
MODEL_NAME=claude-3-5-sonnet-20241022
TEMPERATURE=1.0
TOP_P=0.9
TOP_K=50
```

**Uwaga:** Anthropic zaleca używanie `temperature` LUB `top_p`, nie jednocześnie.

**Plik źródłowy:** `src/llm/anthropic_client.py`

**Dokumentacja API:** https://docs.anthropic.com/claude/reference/messages_post

---

### 3. Google Gemini (ENGINE=GEMINI)

**Obsługiwane parametry:**
- ✅ `TEMPERATURE`
- ✅ `TOP_P`
- ✅ `TOP_K`

**Domyślne wartości:**
```bash
TEMPERATURE=1.0
TOP_P=0.95
TOP_K=40
```

**Przykład konfiguracji:**
```bash
ENGINE=GEMINI
GEMINI_API_KEY=AIza...
MODEL_NAME=gemini-2.5-flash
TEMPERATURE=0.9
TOP_P=0.95
TOP_K=40
```

**Plik źródłowy:** `src/llm/gemini_client.py`

**Dokumentacja API:** https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/content-generation-parameters

---

### 4. Llama (lokalny, ENGINE=LLAMA_CPP)

**Obsługiwane parametry:**
- ✅ `TEMPERATURE`
- ✅ `TOP_P`
- ✅ `TOP_K`

**Domyślne wartości:**
```bash
TEMPERATURE=0.8
TOP_P=0.95
TOP_K=40
```

**Przykład konfiguracji:**
```bash
ENGINE=LLAMA_CPP
MODEL_NAME=llama-3.1-8b-instruct
LLAMA_MODEL_PATH=C:\path\to\model.gguf
LLAMA_GPU_LAYERS=8
LLAMA_CONTEXT_SIZE=4096
TEMPERATURE=0.7
TOP_P=0.9
TOP_K=50
```

**Plik źródłowy:** `src/llm/llama_client.py`

**Dokumentacja API:** https://llama-cpp-python.readthedocs.io/en/latest/api-reference/

---

## Jak Ustawić Zmienne

### Metoda 1: Plik `.env` (rekomendowana)

Edytuj plik `M1/azor-chatdog-py/.env`:

```bash
# Wybierz silnik
ENGINE=OPENAI

# Klucz API
OPENAI_API_KEY=sk-...

# Model
MODEL_NAME=gpt-4o-mini

# Parametry generacji
TEMPERATURE=0.8
TOP_P=0.95
TOP_K=40
```

### Metoda 2: Zmienne środowiskowe w PowerShell

```powershell
$env:ENGINE = "OPENAI"
$env:OPENAI_API_KEY = "sk-..."
$env:MODEL_NAME = "gpt-4o-mini"
$env:TEMPERATURE = "0.8"
$env:TOP_P = "0.95"
$env:TOP_K = "40"

python .\src\run.py
```

### Metoda 3: Zmienne środowiskowe w Bash/Linux

```bash
export ENGINE=OPENAI
export OPENAI_API_KEY=sk-...
export MODEL_NAME=gpt-4o-mini
export TEMPERATURE=0.8
export TOP_P=0.95
export TOP_K=40

python ./src/run.py
```

---

## Macierz Kompatybilności

| Parametr | OpenAI | Anthropic | Gemini | Llama |
|----------|--------|-----------|--------|-------|
| TEMPERATURE | ✅ | ✅ | ✅ | ✅ |
| TOP_P | ✅ | ✅ | ✅ | ✅ |
| TOP_K | ❌ | ✅ | ✅ | ✅ |

---

## Rekomendacje

### Do dialogów konwersacyjnych (chatbot):
```bash
TEMPERATURE=0.8
TOP_P=0.9
TOP_K=40
```

### Do zadań precyzyjnych (klasyfikacja, ekstrakcja):
```bash
TEMPERATURE=0.2
TOP_P=0.9
TOP_K=20
```

### Do kreatywnego pisania:
```bash
TEMPERATURE=1.2
TOP_P=0.95
TOP_K=100
```

### Do generowania kodu:
```bash
TEMPERATURE=0.3
TOP_P=0.9
TOP_K=30
```

---

## Testowanie

Aby przetestować różne konfiguracje, uruchom aplikację z różnymi wartościami:

```powershell
# Test 1: Bardzo deterministyczne
$env:TEMPERATURE = "0.1"; python .\src\run.py

# Test 2: Standardowe
$env:TEMPERATURE = "0.7"; python .\src\run.py

# Test 3: Bardzo kreatywne
$env:TEMPERATURE = "1.5"; python .\src\run.py
```

---

## Rozwiązywanie Problemów

### Problem: Parametry nie są stosowane
**Rozwiązanie:** Upewnij się, że zmienne są ustawione w tej samej sesji terminala przed uruchomieniem `python .\src\run.py`

### Problem: Odpowiedzi są zbyt powtarzalne
**Rozwiązanie:** Zwiększ `TEMPERATURE` (np. z 0.7 do 1.0)

### Problem: Odpowiedzi są chaotyczne/niespójne
**Rozwiązanie:** Zmniejsz `TEMPERATURE` (np. z 1.2 do 0.7) lub `TOP_P` (np. z 0.95 do 0.9)

### Problem: TOP_K nie działa z OpenAI
**Rozwiązanie:** To normalne - OpenAI API nie wspiera `TOP_K`. Użyj tylko `TEMPERATURE` i `TOP_P`.

---

## Przypisy

- Wszystkie wartości są odczytywane jako `float` lub `int` z funkcji `os.getenv()`
- Jeśli zmienna nie jest ustawiona, używana jest wartość domyślna dla danego silnika
- Wartości są walidowane przez odpowiednie API (nieprawidłowe wartości spowodują błąd)
- Parametry są stosowane **przy każdym wywołaniu** modelu (nie są cache'owane)

---

**Ostatnia aktualizacja:** 28 listopada 2025  
**Autor implementacji:** GitHub Copilot  
**Projekt:** AZØR the CHATDOG (M1/azor-chatdog-py)
