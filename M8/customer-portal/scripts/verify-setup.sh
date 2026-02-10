#!/bin/bash

echo "🔍 Verifying Customer Portal Setup..."
echo ""

cd "$(dirname "$0")/.."

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
PASSED=0
FAILED=0

# Function to check
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

# 1. Check if Docker is running
echo "📦 Checking Docker..."
docker info > /dev/null 2>&1
check "Docker is running"

# 2. Check if docker-compose.yml exists
[ -f "docker-compose.yml" ]
check "docker-compose.yml exists"

# 3. Check if MongoDB init script exists
[ -f "mongodb/cp/init-db.js" ]
check "MongoDB init script exists"

# 4. Check if containers are running
echo ""
echo "🐳 Checking containers..."
docker compose ps | grep -q "cp-mongodb-container"
check "MongoDB container exists"

docker compose ps | grep -q "cp-container"
check "Frontend container exists"

# 5. Check MongoDB connection
echo ""
echo "🗄️  Checking MongoDB..."
docker exec cp-mongodb-container mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1
check "MongoDB is accessible"

# 6. Check if collections exist
docker exec cp-mongodb-container mongosh customer_portal --eval "db.getCollectionNames()" 2>/dev/null | grep -q "dashboard_stats"
check "Collection 'dashboard_stats' exists"

docker exec cp-mongodb-container mongosh customer_portal --eval "db.getCollectionNames()" 2>/dev/null | grep -q "metrics"
check "Collection 'metrics' exists"

# 7. Check if data was seeded
echo ""
echo "📊 Checking seeded data..."
STATS_COUNT=$(docker exec cp-mongodb-container mongosh customer_portal --quiet --eval "db.dashboard_stats.countDocuments()" 2>/dev/null)
if [ "$STATS_COUNT" -eq 4 ]; then
    echo -e "${GREEN}✓${NC} dashboard_stats has 4 documents"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} dashboard_stats should have 4 documents, found: $STATS_COUNT"
    ((FAILED++))
fi

METRICS_COUNT=$(docker exec cp-mongodb-container mongosh customer_portal --quiet --eval "db.metrics.countDocuments()" 2>/dev/null)
if [ "$METRICS_COUNT" -eq 1 ]; then
    echo -e "${GREEN}✓${NC} metrics has 1 document"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} metrics should have 1 document, found: $METRICS_COUNT"
    ((FAILED++))
fi

# 8. Check Nuxt server files
echo ""
echo "📁 Checking Nuxt server files..."
[ -f "cp-frontend/server/plugins/mongodb.ts" ]
check "MongoDB plugin exists"

[ -f "cp-frontend/server/models/DashboardStat.ts" ]
check "DashboardStat model exists"

[ -f "cp-frontend/server/api/dashboard/stats.get.ts" ]
check "Stats API endpoint exists"

# 9. Check if frontend is responding
echo ""
echo "🌐 Checking frontend..."
curl -s http://localhost:4003 > /dev/null 2>&1
check "Frontend is accessible on port 4003"

# 10. Check API endpoints
curl -s http://localhost:4003/api/dashboard/stats > /dev/null 2>&1
check "API endpoint /api/dashboard/stats is accessible"

curl -s http://localhost:4003/api/dashboard/metrics > /dev/null 2>&1
check "API endpoint /api/dashboard/metrics is accessible"

# Summary
echo ""
echo "════════════════════════════════════════════"
echo -e "Summary: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo "════════════════════════════════════════════"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✨ All checks passed! Setup is complete.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please review the output above.${NC}"
    exit 1
fi
