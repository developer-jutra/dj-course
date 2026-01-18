#!/bin/sh
REDIS_PASSWORD=$(cat /run/secrets/redis_password)
echo "[debug] REDIS_PASSWORD: $REDIS_PASSWORD"
exec redis-server --requirepass "$REDIS_PASSWORD"