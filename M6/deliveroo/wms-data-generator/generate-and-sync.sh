#!/bin/bash

# Get DATA_MODE from first argument, default to SMALL
DATA_MODE="${1:-SMALL}"
# Get VERBOSE from second argument, default to FALSE
VERBOSE="${2:-FALSE}"

echo "🚚 Removing old SQL WMS files..."
rm output/*.sql
echo "✅ Done"

./generate.sh "${DATA_MODE}" "${VERBOSE}"

echo "🚚 Replacing old SQL WMS files in postgres directory (not container)..."
rm -rf ../postgres/init-scripts/wms-*.sql
cp output/*.sql ../postgres/init-scripts/wms-latest.sql
echo "✅ Done"
