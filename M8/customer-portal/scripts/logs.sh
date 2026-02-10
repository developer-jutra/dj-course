#!/bin/bash

# Navigate to the customer-portal directory
cd "$(dirname "$0")/.."

# Check which container to show logs for
if [ "$1" == "mongo" ] || [ "$1" == "mongodb" ]; then
    echo "📊 Showing MongoDB logs..."
    docker logs -f cp-mongodb-container
elif [ "$1" == "frontend" ] || [ "$1" == "app" ] || [ "$1" == "cp" ]; then
    echo "🌐 Showing Frontend logs..."
    docker logs -f cp-container
else
    echo "📋 Showing all logs (press Ctrl+C to stop)..."
    docker compose logs -f
fi
