#!/bin/bash

# --- Środowisko Wirtualne (uv) ---
ENV_NAME=".venv"

echo "1. Tworzenie i aktywacja środowiska wirtualnego za pomocą 'uv'..."
# Tworzy środowisko (jeśli nie istnieje)
uv venv $ENV_NAME

# Aktywuje środowisko dla bieżącej sesji skryptu
source $ENV_NAME/bin/activate

echo "2. Instalacja zależności z requirements.txt za pomocą 'uv'..."
uv pip install -r requirements.txt

# --- Uruchomienie Serwera (Gunicorn) ---
# Gunicorn jako serwer WSGI: 
#   - -w 4: 4 procesy workerów (dla lepszej wydajności w produkcji)
#   - -b 0.0.0.0:8000: Bindowanie do wszystkich interfejsów na porcie 8000
#   - app:app: Wskazuje na obiekt 'app' w module 'app.py'
echo "3. Uruchomienie serwera Gunicorn..."
gunicorn -w 4 -b 0.0.0.0:8000 app:app

