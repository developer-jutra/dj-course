#!/bin/bash

echo "🗄️  Starting MongoDB only..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to the customer-portal directory
cd "$(dirname "$0")/.."

# Start only MongoDB container
echo "📦 Starting MongoDB container..."
docker compose up -d cp-mongodb

# Wait a bit for container to start
sleep 3

# Check MongoDB initialization
echo ""
echo "📊 Checking MongoDB initialization..."
docker logs cp-mongodb-container | grep "MONGO INITIALIZATION" || echo "⚠️  Initialization logs not found (container might have been running already)"

# Show container status
echo ""
echo "📋 MongoDB container status:"
docker compose ps cp-mongodb

echo ""
echo "✅ MongoDB is running!"
echo ""
echo "🗄️  MongoDB Connection String:"
echo "   mongodb://root:example@localhost:27017/customer_portal?authSource=admin"
echo ""
echo "📝 Useful commands:"
echo "  - MongoDB shell: docker exec -it cp-mongodb-container mongosh -u root -p example --authenticationDatabase admin"
echo "  - View logs: docker logs -f cp-mongodb-container"
echo "  - Stop MongoDB: docker compose stop cp-mongodb"
echo "  - Reset database: ./scripts/reset-db.sh"
echo ""
echo "💡 To run frontend locally (outside Docker):"
echo "   cd cp-frontend"
echo "   npm run dev:local"
echo ""
echo "   (or manually: export MONGODB_URI=... && npm run dev)"
