#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load .env from project root if present
if [ -f "../.env" ]; then
  set -a
  source ../.env
  set +a
fi

# When running locally (outside Docker), use localhost - wms-postgres only resolves inside Docker network
export POSTGRES_HOST=localhost

echo "🚚 Testing WMS SQL queries... (POSTGRES_HOST: ${POSTGRES_HOST})"

if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

python3 -c "from src.queries import run_all_queries_test; run_all_queries_test()"

deactivate
echo "✅ Done"
