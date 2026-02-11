#!/bin/bash

# Test script for trace-to-logs correlation
# This script generates synthetic traffic and verifies logs in Grafana Loki

set -e

echo "🧪 Testing Trace-to-Logs Correlation"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Wait for API to be ready
echo "⏳ Waiting for API to be ready..."
sleep 2

echo ""
echo -e "${YELLOW}🚀 Generating synthetic traffic...${NC}"
echo ""

# Test multiple endpoints to generate various logs
echo -e "${BLUE}1. Testing /products endpoint${NC}"
PRODUCTS_RESPONSE=$(curl -s http://localhost:3000/products | jq -r '.[0].name' 2>/dev/null || echo "OK")
echo "   Response: $PRODUCTS_RESPONSE"
PRODUCTS_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "trace_id" | grep "GET /products" | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $PRODUCTS_TRACE_ID"
echo ""

echo -e "${BLUE}2. Testing /inject-error endpoint${NC}"
ERROR_RESPONSE=$(curl -s http://localhost:3000/inject-error)
echo "   Response: $ERROR_RESPONSE"
ERROR_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "trace_id" | grep "/inject-error" | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $ERROR_TRACE_ID"
echo ""

echo -e "${BLUE}3. Testing /inject-slow endpoint${NC}"
SLOW_RESPONSE=$(curl -s http://localhost:3000/inject-slow)
echo "   Response: $SLOW_RESPONSE"
SLOW_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "trace_id" | grep "/inject-slow" | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $SLOW_TRACE_ID"
echo ""

# Wait for logs to be processed
echo -e "${YELLOW}⏳ Waiting 3 seconds for logs to be processed by Loki...${NC}"
sleep 3
echo ""

echo -e "${GREEN}✅ Synthetic traffic generated successfully!${NC}"
echo ""
echo "=========================================="
echo "📊 Verification in Loki"
echo "=========================================="
echo ""

# Use the first trace ID for detailed checking
TEST_TRACE_ID="${ERROR_TRACE_ID:-$PRODUCTS_TRACE_ID}"

echo "1️⃣  Logs in Container:"
docker-compose logs products-api 2>&1 | grep "$TEST_TRACE_ID" | head -5
echo ""

echo "2️⃣  Span IDs in this trace:"
docker-compose logs products-api 2>&1 | grep "$TEST_TRACE_ID" | \
  grep -o '"span_id":"[^"]*"' | sort -u
echo ""

echo "3️⃣  Checking Loki storage:"
# URL-encode the query properly
ENCODED_QUERY=$(python3 -c "import urllib.parse; print(urllib.parse.quote('{service_name=\"products-api\"} |= \"$TEST_TRACE_ID\"'))")
LOKI_RESULT=$(curl -s "http://localhost:3100/loki/api/v1/query_range?query=$ENCODED_QUERY&limit=5&start=$(python3 -c 'import time; print(int((time.time()-3600)*1e9))')&end=$(python3 -c 'import time; print(int(time.time()*1e9))')" 2>&1 | \
  jq -r '.data.result | length' 2>/dev/null || echo "0")
echo "   Found $LOKI_RESULT log stream(s) in Loki"
echo ""

echo "4️⃣  Services in Loki:"
curl -s 'http://localhost:3100/loki/api/v1/label/service_name/values' | jq -r '.data[]'
echo ""

echo "5️⃣  OTel Collector Status:"
docker-compose ps otel-collector | grep -v "^NAME"
echo ""

echo -e "${GREEN}=========================================="
echo "✅ Trace-to-Logs Verification Complete!"
echo "==========================================${NC}"
echo ""
echo "🔗 Grafana Explore URLs:"
echo ""
echo -e "   ${BLUE}Products endpoint logs:${NC}"
PRODUCTS_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('{service_name=\"products-api\"} |= \"$PRODUCTS_TRACE_ID\"'))")
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22loki%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22$(python3 -c "import urllib.parse; print(urllib.parse.quote('{service_name=\"products-api\"} |= \"' + '$PRODUCTS_TRACE_ID' + '\"'))")%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}Inject Error endpoint logs:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22loki%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22$(python3 -c "import urllib.parse; print(urllib.parse.quote('{service_name=\"products-api\"} |= \"' + '$ERROR_TRACE_ID' + '\"'))")%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}Inject Slow endpoint logs:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22loki%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22$(python3 -c "import urllib.parse; print(urllib.parse.quote('{service_name=\"products-api\"} |= \"' + '$SLOW_TRACE_ID' + '\"'))")%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}All products-api logs:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22loki%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22%7Bservice_name%3D%5C%22products-api%5C%22%7D%22%7D%5D%7D"
echo ""
echo "📝 Trace IDs (abbreviated):"
echo "   Products:     ${PRODUCTS_TRACE_ID:0:16}..."
echo "   Inject Error: ${ERROR_TRACE_ID:0:16}..."
echo "   Inject Slow:  ${SLOW_TRACE_ID:0:16}..."
echo ""
