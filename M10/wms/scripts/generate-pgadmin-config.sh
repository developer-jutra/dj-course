#!/bin/bash
# Generates pgadmin/servers.json from .env and pgadmin/servers.json.template

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

export POSTGRES_HOST="${POSTGRES_HOST:-wms-postgres}"
export POSTGRES_PORT="${POSTGRES_PORT:-5432}"
export POSTGRES_DB="${POSTGRES_DB:-deliveroo}"
export POSTGRES_USER="${POSTGRES_USER:-admin}"
export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-strongpassword123}"

envsubst < pgadmin/servers.json.template > pgadmin/servers.json
echo "Generated pgadmin/servers.json"
