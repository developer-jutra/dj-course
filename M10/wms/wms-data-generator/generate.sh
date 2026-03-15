#!/bin/bash

# Get DATA_MODE from first argument, default to SMALL
DATA_MODE="${1:-SMALL}"
# Get VERBOSE from second argument, default to FALSE
VERBOSE="${2:-FALSE}"

echo "🚚 Generating SQL WMS file (MODE: ${DATA_MODE}, VERBOSE: ${VERBOSE})..."

if [ ! -d .venv ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -e .
  echo "✅ Virtual environment ready"
else
  source .venv/bin/activate
fi

export DATA_MODE="${DATA_MODE}"
export VERBOSE="${VERBOSE}"
python -m src.run
deactivate
echo "✅ Done"
