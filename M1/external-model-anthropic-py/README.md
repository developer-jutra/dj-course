# `@anthropic-ai` - setup

- stwórz swoj klucz: https://console.anthropic.com/settings/keys
- sprawdź dostępny usage: https://console.anthropic.com/usage
- API/docs: https://docs.claude.com/en/api/client-sdks#python
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
export ANTHROPIC_API_KEY="TWOJ_KLUCZ_API_TUTAJ"
```
i przekaż zmienną środowiskową do Pythona
