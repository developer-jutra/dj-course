# `google-genai` - setup

- stwórz swoj klucz: https://aistudio.google.com/app/api-keys
- sprawdź dostępny usage: https://aistudio.google.com/app/usage
- API/docs: https://github.com/googleapis/python-genai
- stwórz plik `.env` (lub skopiuj z `.env.example`)
- zależności:
  - `pip install -r requirements.txt`
  - lub najpierw venv: 
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    # i potem żeby wyjść:
    deactivate
    ```
- uruchom: `python run.py`

albo stwórz jakiś skrypt shellowy:
```bash
export GEMINI_API_KEY="TWOJ_KLUCZ_API_TUTAJ"
```
i przekaż zmienną środowiskową do Pythona
