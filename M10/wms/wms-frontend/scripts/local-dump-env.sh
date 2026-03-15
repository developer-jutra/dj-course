#! /bin/bash

# Load .env from project root if present
if [ -f "../../.env" ]; then
  set -a
  source ../../.env
  set +a
fi

export NODE_ENV="${NODE_ENV:-development}"
export API_URL="${API_URL:-http://localhost:3001}"
node scripts/dump-env.js
