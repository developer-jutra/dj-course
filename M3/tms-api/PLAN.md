Zrozumiałem, Tomek. Wygeneruję dla Ciebie podstawowy setup aplikacji Pythonowej z serwerem REST za pomocą **Flask** i serwerem WSGI **Gunicorn**, zarządzany środowiskowo za pomocą **`uv`**.

-----

## 🛠️ Podstawowy Setup Projektu REST API (Flask + Gunicorn + uv)

### 1\. Struktura Katalogów

Struktura projektu będzie następująca:

```
rest_api_app/
├── app.py
├── requirements.txt
└── run.sh
```

-----

### 2\. Pliki Implementacyjne i Konfiguracyjne

#### `requirements.txt`

Lista wymaganych pakietów. Zamiast `pip`, pakiety zostaną zainstalowane przez **`uv`**.

```text
Flask
gunicorn
```

#### `app.py`

Główny plik aplikacji Flask, implementujący proste endpoints REST dla zasobów `vehicles` i `drivers`. Używamy tu słownika jako prostej bazy danych.

```python
from flask import Flask, jsonify, request

# Create a Flask application instance
app = Flask(__name__)

# Simple in-memory data store for demonstration
vehicles = [
    {"id": 1, "make": "Toyota", "model": "Corolla"},
    {"id": 2, "make": "Ford", "model": "Mustang"}
]
drivers = [
    {"id": 101, "name": "Alice", "license_id": "A123"},
    {"id": 102, "name": "Bob", "license_id": "B456"}
]

# Helper function to find max ID
def get_new_id(data):
    """Generates the next sequential ID for a list of dictionaries."""
    return max([item['id'] for item in data]) + 1 if data else 1

### VEHICLES ENDPOINTS ###

@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    """GET: Retrieve all vehicles."""
    return jsonify(vehicles)

@app.route('/api/vehicles', methods=['POST'])
def create_vehicle():
    """POST: Create a new vehicle."""
    new_vehicle = request.json
    if new_vehicle:
        new_vehicle['id'] = get_new_id(vehicles)
        vehicles.append(new_vehicle)
        return jsonify(new_vehicle), 201
    return jsonify({"error": "Invalid data"}), 400

@app.route('/api/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    """GET: Retrieve a specific vehicle by ID."""
    vehicle = next((v for v in vehicles if v['id'] == vehicle_id), None)
    if vehicle:
        return jsonify(vehicle)
    return jsonify({"error": "Vehicle not found"}), 404

@app.route('/api/vehicles/<int:vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    """PUT: Update an existing vehicle by ID."""
    data = request.json
    vehicle = next((v for v in vehicles if v['id'] == vehicle_id), None)
    
    if vehicle and data:
        # Update only specified fields
        vehicle.update(data)
        return jsonify(vehicle)
    
    return jsonify({"error": "Vehicle not found or invalid data"}), 404

@app.route('/api/vehicles/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    """DELETE: Remove a vehicle by ID."""
    global vehicles
    initial_length = len(vehicles)
    vehicles = [v for v in vehicles if v['id'] != vehicle_id]
    
    if len(vehicles) < initial_length:
        return '', 204 # HTTP 204 No Content for successful deletion
    return jsonify({"error": "Vehicle not found"}), 404

### DRIVERS ENDPOINTS (GET/POST Example) ###

@app.route('/api/drivers', methods=['GET'])
def get_drivers():
    """GET: Retrieve all drivers."""
    return jsonify(drivers)

@app.route('/api/drivers', methods=['POST'])
def create_driver():
    """POST: Create a new driver."""
    new_driver = request.json
    if new_driver:
        new_driver['id'] = get_new_id(drivers)
        drivers.append(new_driver)
        return jsonify(new_driver), 201
    return jsonify({"error": "Invalid data"}), 400

# Endpoint for Gunicorn to find the application object
# This is mainly for local testing with 'flask run' but kept for clarity
if __name__ == '__main__':
    # Typically, Gunicorn handles serving, but this allows for local debug run
    app.run(debug=True)
```

#### `run.sh`

Skrypt bash automatyzujący tworzenie środowiska **`uv`**, instalację zależności i uruchomienie serwera WSGI **Gunicorn**.

```bash
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
```

-----

### 3\. Komendy do Uruchomienia

Wykonaj poniższe kroki w terminalu, aby zainicjować i uruchomić aplikację.

#### Krok 1: Utworzenie katalogu i plików

```bash
mkdir rest_api_app
cd rest_api_app

# Utwórz plik app.py
touch app.py

# Utwórz plik requirements.txt
touch requirements.txt

# Utwórz plik run.sh
touch run.sh
```

#### Krok 2: Wklejenie zawartości

Wklej zawartość z sekcji 2 do odpowiednich plików (`app.py`, `requirements.txt`, `run.sh`).

#### Krok 3: Nadanie uprawnień i uruchomienie

Nadaj uprawnienia do wykonania dla skryptu `run.sh` i uruchom go:

```bash
chmod +x run.sh
./run.sh
```

Serwer będzie dostępny pod adresem **`http://0.0.0.0:8000`**.

-----

## 🚀 Przykładowe Testowanie API

Po uruchomieniu serwera, możesz użyć narzędzia takiego jak `curl` lub Postman do testowania endpoints.

### Zasób `VEHICLES`

| Metoda | Endpoint | Opis | Przykład Ciała (Body) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/vehicles` | Pobierz listę | - |
| **POST** | `/api/vehicles` | Dodaj nowy pojazd | `{"make": "Tesla", "model": "Model 3"}` |
| **GET** | `/api/vehicles/1` | Pobierz pojazd o ID 1 | - |
| **PUT** | `/api/vehicles/1` | Zaktualizuj pojazd ID 1 | `{"model": "Corolla GR"}` |
| **DELETE**| `/api/vehicles/2` | Usuń pojazd o ID 2 | - |

### Przykład `curl` (POST)

Dodanie nowego pojazdu:

```bash
curl -X POST \
  http://localhost:8000/api/vehicles \
  -H 'Content-Type: application/json' \
  -d '{"make": "Tesla", "model": "Model 3"}'
```

Czy chciałbyś, Tomek, abym wygenerował przykładowe testy jednostkowe dla tych endpoints?