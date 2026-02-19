#!/bin/bash
set -e
# Run TMS schema and data on tms database (only if tms-latest.sql exists)
if [ -f /docker-entrypoint-initdb.d/tms-latest.sql ]; then
  psql -v ON_ERROR_STOP=1 -d tms -U "$POSTGRES_USER" -f /docker-entrypoint-initdb.d/tms-latest.sql
fi
