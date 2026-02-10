#!/bin/bash

# Chaos Engineering Test Script for Database Resilience
# This script tests how the products-api handles PostgreSQL failures

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Database Resilience Chaos Test ===${NC}\n"

# Function to check health endpoint
check_health() {
  local response=$(curl -s http://localhost:3000/health)
  local status=$(echo $response | jq -r '.status')
  local db_status=$(echo $response | jq -r '.dependencies.database.status')
  
  echo "Health Check:"
  echo "  App Status: $status"
  echo "  DB Status: $db_status"
  echo ""
  
  if [ "$status" = "OK" ]; then
    echo -e "${GREEN}✓ App is healthy${NC}"
  else
    echo -e "${YELLOW}⚠ App is degraded${NC}"
  fi
  
  if [ "$db_status" = "healthy" ]; then
    echo -e "${GREEN}✓ Database is healthy${NC}"
  else
    echo -e "${RED}✗ Database is unhealthy${NC}"
  fi
  echo ""
}

# Function to test products endpoint
test_products() {
  echo "Testing /products endpoint..."
  local http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/products)
  
  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ /products returned 200 OK${NC}"
  elif [ "$http_code" = "503" ]; then
    echo -e "${YELLOW}⚠ /products returned 503 Service Unavailable (expected when DB is down)${NC}"
  else
    echo -e "${RED}✗ /products returned unexpected status: $http_code${NC}"
  fi
  echo ""
}

# Function to check if products-api is still running
check_container() {
  local container_status=$(docker ps --filter "name=products-api" --format "{{.Status}}" | head -n 1)
  
  if [ -z "$container_status" ]; then
    echo -e "${RED}✗ products-api container is NOT running!${NC}"
    return 1
  else
    echo -e "${GREEN}✓ products-api container is running: $container_status${NC}"
  fi
  echo ""
}

# Find PostgreSQL container
POSTGRES_CONTAINER=$(docker ps --filter "name=postgres" --format "{{.Names}}" | head -n 1)

if [ -z "$POSTGRES_CONTAINER" ]; then
  echo -e "${RED}Error: PostgreSQL container not found. Is docker-compose running?${NC}"
  exit 1
fi

echo "Found PostgreSQL container: $POSTGRES_CONTAINER"
echo ""

# Step 1: Verify everything is healthy
echo -e "${YELLOW}Step 1: Verify baseline (everything should be healthy)${NC}"
check_container
check_health
test_products

read -p "Press Enter to continue to chaos test..."

# Step 2: Stop PostgreSQL
echo -e "\n${YELLOW}Step 2: Stopping PostgreSQL container (simulating database failure)...${NC}"
docker stop $POSTGRES_CONTAINER
echo "PostgreSQL stopped."
echo ""

# Wait a bit for the connection to fail
echo "Waiting 5 seconds for connection to fail..."
sleep 5

# Step 3: Check if products-api is still running
echo -e "\n${YELLOW}Step 3: Verify products-api is still running (should NOT crash)${NC}"
check_container || {
  echo -e "${RED}FAILURE: products-api crashed when database went down!${NC}"
  echo "Starting PostgreSQL back up..."
  docker start $POSTGRES_CONTAINER
  exit 1
}

# Step 4: Check health endpoint
echo -e "${YELLOW}Step 4: Check health endpoint (should show DEGRADED)${NC}"
check_health

# Step 5: Test products endpoint
echo -e "${YELLOW}Step 5: Test /products endpoint (should return 503)${NC}"
test_products

read -p "Press Enter to restart PostgreSQL..."

# Step 6: Restart PostgreSQL
echo -e "\n${YELLOW}Step 6: Restarting PostgreSQL...${NC}"
docker start $POSTGRES_CONTAINER
echo "PostgreSQL started."
echo ""

# Step 7: Wait for recovery
echo "Waiting 10 seconds for automatic reconnection..."
sleep 10

# Step 8: Verify recovery
echo -e "\n${YELLOW}Step 7: Verify automatic recovery${NC}"
check_container
check_health
test_products

# Step 9: Test with some requests
echo -e "${YELLOW}Step 8: Testing with 5 API requests to verify full recovery...${NC}"
for i in {1..5}; do
  http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/products?limit=10)
  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Request $i: 200 OK${NC}"
  else
    echo -e "${RED}✗ Request $i: $http_code${NC}"
  fi
  sleep 1
done

echo ""
echo -e "${GREEN}=== Chaos Test Complete ===${NC}"
echo ""
echo "Summary:"
echo "- products-api should have stayed running when PostgreSQL stopped"
echo "- Health endpoint should have shown DEGRADED status"
echo "- API endpoints should have returned 503 during downtime"
echo "- After restart, connection should have automatically recovered"
echo "- API endpoints should work normally after recovery"
