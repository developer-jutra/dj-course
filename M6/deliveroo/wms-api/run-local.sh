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

# Check if venv exists and is valid
VENV_CREATED=false
if [ -d .venv ]; then
  # Try to run python from venv - if it fails, venv is broken
  if ! .venv/bin/python --version >/dev/null 2>&1; then
    echo "⚠️  Virtual environment broken. Recreating..."
    rm -rf .venv
    VENV_CREATED=true
  fi
fi

if [ ! -d .venv ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv .venv
  VENV_CREATED=true
  echo "✅ Virtual environment ready"
fi

# Only install dependencies if venv was just created
if [ "$VENV_CREATED" = true ]; then
  echo "📥 Installing dependencies..."
  .venv/bin/pip install -e . --root-user-action=ignore
fi

.venv/bin/python src/run.py
