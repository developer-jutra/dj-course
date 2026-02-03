#!/bin/bash
set -e

SOURCE_FILE="output/init-db.sql"
# Check if the source file exists
if [ ! -f "$SOURCE_FILE" ]; then
  echo "Error: Source file not found at $SOURCE_FILE"
  exit 1
fi

# Copy the file, overwriting the destination
DESTINATION_FILE="../o11y-metrics/postgres/init-db.sql"
cp "$SOURCE_FILE" "$DESTINATION_FILE"
echo "✅ Successfully synced $SOURCE_FILE to $DESTINATION_FILE"

DESTINATION_FILE="../o11y-logs/postgres/init-db.sql"
cp "$SOURCE_FILE" "$DESTINATION_FILE"
echo "✅ Successfully synced $SOURCE_FILE to $DESTINATION_FILE"

DESTINATION_FILE="../o11y-full/postgres/init-db.sql"
cp "$SOURCE_FILE" "$DESTINATION_FILE"
echo "✅ Successfully synced $SOURCE_FILE to $DESTINATION_FILE"

