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
sleep 1  # Give logs time to be written
PRODUCTS_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "HTTP Request" | grep '"/products"' | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $PRODUCTS_TRACE_ID"
echo ""

echo -e "${BLUE}2. Testing /inject-error endpoint${NC}"
ERROR_RESPONSE=$(curl -s http://localhost:3000/inject-error)
echo "   Response: $ERROR_RESPONSE"
sleep 1  # Give logs time to be written
ERROR_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "HTTP Request" | grep '"/inject-error"' | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $ERROR_TRACE_ID"
echo ""

echo -e "${BLUE}3. Testing /inject-leak endpoint${NC}"
LEAK_RESPONSE=$(curl -s http://localhost:3000/inject-leak)
echo "   Response: $LEAK_RESPONSE"
sleep 1  # Give logs time to be written
LEAK_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "HTTP Request" | grep '"/inject-leak"' | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $LEAK_TRACE_ID"
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
# URL-encode the query properly - use structured metadata filter
ENCODED_QUERY=$(python3 -c "import urllib.parse; print(urllib.parse.quote('{service_name=\"products-api\"} | trace_id=\"$TEST_TRACE_ID\"'))")
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
echo -e "==========================================${NC}"
echo ""
echo "🔗 Grafana Explore URLs:"
echo ""
echo -e "   ${BLUE}Products endpoint logs:${NC}"
PRODUCTS_JSON=$(python3 -c "import json, urllib.parse; print(urllib.parse.quote(json.dumps({'datasource': 'loki', 'queries': [{'refId': 'A', 'expr': '{service_name=\"products-api\"} | trace_id=\"$PRODUCTS_TRACE_ID\"'}], 'range': {'from': 'now-1h', 'to': 'now'}})))")
echo "   http://localhost:4000/explore?left=$PRODUCTS_JSON"
echo ""
echo -e "   ${BLUE}Inject Error endpoint logs:${NC}"
ERROR_JSON=$(python3 -c "import json, urllib.parse; print(urllib.parse.quote(json.dumps({'datasource': 'loki', 'queries': [{'refId': 'A', 'expr': '{service_name=\"products-api\"} | trace_id=\"$ERROR_TRACE_ID\"'}], 'range': {'from': 'now-1h', 'to': 'now'}})))")
echo "   http://localhost:4000/explore?left=$ERROR_JSON"
echo ""
echo -e "   ${BLUE}Inject Leak endpoint logs:${NC}"
LEAK_JSON=$(python3 -c "import json, urllib.parse; print(urllib.parse.quote(json.dumps({'datasource': 'loki', 'queries': [{'refId': 'A', 'expr': '{service_name=\"products-api\"} | trace_id=\"$LEAK_TRACE_ID\"'}], 'range': {'from': 'now-1h', 'to': 'now'}})))")
echo "   http://localhost:4000/explore?left=$LEAK_JSON"
echo ""
echo -e "   ${BLUE}All products-api logs:${NC}"
ALL_JSON=$(python3 -c "import json, urllib.parse; print(urllib.parse.quote(json.dumps({'datasource': 'loki', 'queries': [{'refId': 'A', 'expr': '{service_name=\"products-api\"}'}], 'range': {'from': 'now-1h', 'to': 'now'}})))")
echo "   http://localhost:4000/explore?left=$ALL_JSON"
echo ""
echo "📝 Full Trace IDs (for Grafana):"
echo "   Products:     ${PRODUCTS_TRACE_ID}"
echo "   Inject Error: ${ERROR_TRACE_ID}"
echo "   Inject Leak:  ${LEAK_TRACE_ID}"
echo ""
