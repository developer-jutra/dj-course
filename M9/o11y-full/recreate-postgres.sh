#!/bin/bash
# Restart PostgreSQL with fresh volume - clears all data and re-runs init-db.sql
# Use after regenerating init-db.sql seed data

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🛑 Stopping PostgreSQL and dependent services..."
docker compose stop postgres products-api postgres-exporter 2>/dev/null || true

echo "🗑️  Removing PostgreSQL volume (clears all data)..."
docker compose rm -f -s postgres 2>/dev/null || true
# Volume name: {project}_postgres-data when run from o11y-full dir
VOLUME_NAME="o11y-full_postgres-data"
if ! docker volume rm "$VOLUME_NAME" 2>/dev/null; then
  # Fallback: find volume by name pattern (prefer o11y-full)
  VOLUME_NAME=$(docker volume ls -q | grep 'o11y-full_postgres-data' | head -1)
  [ -z "$VOLUME_NAME" ] && VOLUME_NAME=$(docker volume ls -q | grep 'postgres-data$' | head -1)
  [ -n "$VOLUME_NAME" ] && docker volume rm "$VOLUME_NAME" || true
fi

echo "🚀 Starting PostgreSQL with fresh init-db.sql..."
docker compose up -d postgres

echo "⏳ Waiting for PostgreSQL to be healthy..."
docker compose exec -T postgres sh -c 'until pg_isready -U admin -d products; do sleep 1; done' 2>/dev/null || {
  echo "Waiting for healthcheck..."
  sleep 5
}

echo "🔄 Starting dependent services..."
docker compose up -d products-api postgres-exporter

echo "✅ PostgreSQL restarted with fresh data. init-db.sql has been applied."
