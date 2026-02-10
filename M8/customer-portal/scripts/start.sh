#!/bin/bash

echo "🚀 Starting Customer Portal with MongoDB..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to the customer-portal directory
cd "$(dirname "$0")/.."

# Start the containers
echo "📦 Starting Docker containers..."
docker compose up -d

# Wait a bit for containers to start
sleep 3

# Check MongoDB initialization
echo ""
echo "📊 Checking MongoDB initialization..."
docker logs cp-mongodb-container | grep "MONGO INITIALIZATION"

# Show container status
echo ""
echo "📋 Container status:"
docker compose ps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Frontend: http://localhost:4003"
echo "🗄️  MongoDB: mongodb://root:example@localhost:27017/customer_portal?authSource=admin"
echo ""
echo "📝 Useful commands:"
echo "  - View frontend logs: docker logs -f cp-container"
echo "  - View MongoDB logs: docker logs -f cp-mongodb-container"
echo "  - Stop containers: docker compose down"
echo "  - Reset database: docker compose down -v && docker compose up -d"
