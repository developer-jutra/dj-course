#!/bin/bash

echo "🔄 Resetting MongoDB database..."

# Navigate to the customer-portal directory
cd "$(dirname "$0")/.."

# Confirmation prompt
read -p "⚠️  This will delete all data in MongoDB. Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled."
    exit 1
fi

# Stop containers and remove volumes
echo "🛑 Stopping containers and removing volumes..."
docker compose down -v

# Remove the MongoDB volume explicitly
echo "🗑️  Removing MongoDB volume..."
docker volume rm customer-portal_cp-mongodb_data 2>/dev/null || true

# Start containers again
echo "🚀 Starting containers with fresh database..."
docker compose up -d

# Wait for initialization
echo "⏳ Waiting for MongoDB initialization..."
sleep 5

# Show initialization logs
docker logs cp-mongodb-container | grep "MONGO INITIALIZATION"

echo ""
echo "✅ Database reset complete!"
echo "🌐 Frontend: http://localhost:4003"
