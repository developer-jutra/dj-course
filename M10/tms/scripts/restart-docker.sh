#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

HEALTH_URL="${1:-http://localhost:3000/drivers}"
MAX_RETRIES=15
RETRY_INTERVAL=2

cd "$PROJECT_DIR"

echo "==> [1/3] Zatrzymywanie serwisów i usuwanie wolumenów..."
docker compose down -v

echo "==> [2/3] Budowanie obrazu tms-api (bez cache)..."
docker compose build --no-cache tms-api

echo "==> [3/3] Uruchamianie stacku w tle..."
docker compose up -d

echo ""
echo "Oczekiwanie na API ($HEALTH_URL)..."

for i in $(seq 1 "$MAX_RETRIES"); do
  if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
    echo ""
    echo "API odpowiada poprawnie:"
    curl -s "$HEALTH_URL" | head -c 500
    echo ""
    echo ""
    echo "Stack uruchomiony pomyslnie."
    exit 0
  fi
  echo "  Proba $i/$MAX_RETRIES – czekam ${RETRY_INTERVAL}s..."
  sleep "$RETRY_INTERVAL"
done

echo "BLAD: API nie odpowiada po $((MAX_RETRIES * RETRY_INTERVAL))s. Sprawdz logi:"
echo "  docker compose logs tms-api"
exit 1
