#!/bin/bash

# Load env from project root (supports both: run from wms/ or wms/wms-api/)
if [ -f .env ]; then
  set -a
  source .env
  set +a
elif [ -f ../.env ]; then
  set -a
  source ../.env
  set +a
fi

# Defaults if not set (must match .env.example)
export POSTGRES_URL="${POSTGRES_URL:-postgresql+psycopg2://admin:strongpassword123@localhost:5432/deliveroo}"
export SERVICE_NAME="${SERVICE_NAME:-wms-api}"
export PORT="${PORT:-3001}"
export CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:4200}"

if [ ! -d .venv ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -e . --root-user-action=ignore
  echo "✅ Virtual environment ready"
else
  source .venv/bin/activate
  pip install -e . --root-user-action=ignore
fi

python src/run.py

deactivate
