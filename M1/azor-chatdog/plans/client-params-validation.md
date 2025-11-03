# Plan: Walidacja Parametrów Klientów LLM z Pydantic

## 🎯 Cel
Dodać obowiązkową walidację parametrów konfiguracyjnych dla klientów Gemini i Llama przed ich inicjalizacją, używając Pydantic do walidacji.

## 📁 Struktura Plików

### Nowe pliki do utworzenia:
- `src/llm/gemini_validation.py` - klasa Pydantic dla walidacji Gemini
- `src/llm/llama_validation.py` - klasa Pydantic dla walidacji Llama

### Pliki do modyfikacji:
- `src/llm/gemini_client.py` - dodać walidację w `from_environment()`
- `src/llm/llama_client.py` - dodać walidację w `from_environment()`
- `src/session/chat_session.py` - dodać walidację zmiennej ENGINE
- `requirements.txt` - dodać `pydantic`

## 🔧 Implementacja

### 1. Utworzyć `src/llm/gemini_validation.py`
```python
from pydantic import BaseModel, Field, validator
from typing import Optional

class GeminiConfig(BaseModel):
    engine: str = Field(default="GEMINI", const=True)
    model_name: str = Field(..., description="Nazwa modelu Gemini")
    gemini_api_key: str = Field(..., min_length=1, description="Klucz API Google Gemini")
    
    @validator('gemini_api_key')
    def validate_api_key(cls, v):
        if not v or v.strip() == "":
            raise ValueError("GEMINI_API_KEY nie może być pusty")
        return v.strip()
```

### 2. Utworzyć `src/llm/llama_validation.py`
```python
from pydantic import BaseModel, Field, validator
from typing import Optional
import os

class LlamaConfig(BaseModel):
    engine: str = Field(default="LLAMA", const=True)
    model_name: str = Field(..., description="Nazwa modelu Llama")
    llama_model_path: str = Field(..., description="Ścieżka do pliku modelu .gguf")
    llama_gpu_layers: int = Field(default=1, ge=0, description="Liczba warstw GPU")
    llama_context_size: int = Field(default=2048, ge=1, description="Rozmiar kontekstu")
    
    @validator('llama_model_path')
    def validate_model_path(cls, v):
        if not os.path.exists(v):
            raise ValueError(f"Plik modelu nie istnieje: {v}")
        if not v.endswith('.gguf'):
            raise ValueError("Plik modelu musi mieć rozszerzenie .gguf")
        return v
```

### 3. Zaktualizować `src/llm/gemini_client.py`
W metodzie `from_environment()` dodać:
```python
from .gemini_validation import GeminiConfig

@classmethod
def from_environment(cls) -> 'GeminiLLMClient':
    load_dotenv()
    
    # Walidacja z Pydantic
    config = GeminiConfig(
        model_name=os.getenv('MODEL_NAME', 'gemini-2.5-flash'),
        gemini_api_key=os.getenv('GEMINI_API_KEY', '')
    )
    
    return cls(model_name=config.model_name, api_key=config.gemini_api_key)
```

### 4. Zaktualizować `src/llm/llama_client.py`
W metodzie `from_environment()` dodać:
```python
from .llama_validation import LlamaConfig

@classmethod
def from_environment(cls) -> 'LlamaClient':
    load_dotenv()
    
    # Walidacja z Pydantic
    config = LlamaConfig(
        model_name=os.getenv('MODEL_NAME', 'llama-3.1-8b-instruct'),
        llama_model_path=os.getenv('LLAMA_MODEL_PATH', DEFAULT_MODEL_PATH),
        llama_gpu_layers=int(os.getenv('LLAMA_GPU_LAYERS', '1')),
        llama_context_size=int(os.getenv('LLAMA_CONTEXT_SIZE', '2048'))
    )
    
    return cls(
        model_name=config.model_name,
        model_path=config.llama_model_path,
        n_gpu_layers=config.llama_gpu_layers,
        n_ctx=config.llama_context_size
    )
```

### 5. Zaktualizować `src/session/chat_session.py`
W metodzie `_initialize_llm_session()` dodać na początku:
```python
def _initialize_llm_session(self):
    engine = os.getenv('ENGINE', 'GEMINI').upper()
    if engine not in ['GEMINI', 'LLAMA_CPP']:
        raise ValueError(f"ENGINE musi być 'GEMINI' lub 'LLAMA_CPP', otrzymano: {engine}")
    
    # Reszta istniejącej logiki...
```

### 6. Dodać `pydantic` do `requirements.txt`
```
pydantic>=2.0.0
```

## ✅ Oczekiwane rezultaty

1. **Walidacja przed inicjalizacją**: Błędy konfiguracji wykrywane wcześnie
2. **Type Safety**: Pydantic zapewnia walidację typów
3. **Clear Error Messages**: Konkretne komunikaty błędów dla każdego silnika
4. **Modularność**: Każdy silnik ma osobną klasę walidacyjną
5. **Backward Compatibility**: Nie zmienia istniejącego API

## 🧪 Testowanie

Po implementacji przetestować:
1. Błędną konfigurację Gemini (brak API key)
2. Błędną konfigurację Llama (nieistniejący plik modelu)
3. Nieprawidłową wartość ENGINE
4. Poprawną konfigurację obu silników
