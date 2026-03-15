# WMS API

Warehouse Management System.

## Setup

1.  **Przygotowanie środowiska** (tworzy venv i instaluje zależności):
    ```bash
    ./recreate-venv.sh
    ```

2.  **Uruchomienie aplikacji** (startuje serwer deweloperski):
    ```bash
    ./run-local.sh
    ```

## Docker

```bash
docker build -t wms-api .
docker run -p 5000:5000 wms-api
```
