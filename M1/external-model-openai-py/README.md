# `openai` - setup

- stwórz swoj klucz: https://platform.openai.com/api-keys
- sprawdź dostępny usage: https://platform.openai.com/usage
- API/docs: https://platform.openai.com/docs/quickstart
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
export OPENAI_API_KEY="TWOJ_KLUCZ_API_TUTAJ"
```
i przekaż zmienną środowiskową do Pythona
