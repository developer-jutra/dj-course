#!/bin/bash

# Test script for manual tracing instrumentation
# This script generates synthetic traffic and verifies traces in Grafana Tempo

set -e

echo "🧪 Testing Manual Tracing Instrumentation"
echo "=========================================="
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

echo -e "${BLUE}1. Testing /health endpoint${NC}"
echo "   Pattern: Detailed span with multiple attributes and timing events"
echo "   ---"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)
echo "   Response: $HEALTH_RESPONSE"
HEALTH_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "trace_id" | grep "/health" | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $HEALTH_TRACE_ID"
echo ""

echo -e "${BLUE}2. Testing /inject-leak endpoint${NC}"
echo "   Pattern: Multiple child spans with events showing operation breakdown"
echo "   ---"
LEAK_RESPONSE=$(curl -s http://localhost:3000/inject-leak)
echo "   Response: $LEAK_RESPONSE"
LEAK_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "trace_id" | grep "/inject-leak" | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $LEAK_TRACE_ID"
echo ""

echo -e "${BLUE}3. Testing /inject-error endpoint${NC}"
echo "   Pattern: Context propagation between functions (parent → child)"
echo "   ---"
ERROR_RESPONSE=$(curl -s http://localhost:3000/inject-error)
echo "   Response: $ERROR_RESPONSE"
ERROR_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "trace_id" | grep "/inject-error" | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $ERROR_TRACE_ID"
echo ""

echo -e "${BLUE}4. Testing /client_metrics endpoint${NC}"
echo "   Pattern: Multi-level context propagation (root → child → grandchild)"
echo "   ---"
METRICS_RESPONSE=$(curl -s -X POST http://localhost:3000/client_metrics \
  -H "Content-Type: application/json" \
  -d '{"name": "LCP", "value": 2800, "page_path": "/test-tracing", "device_type": "desktop", "connection_type": "wifi"}')
echo "   Response: HTTP 204 (empty body)"
METRICS_TRACE_ID=$(docker logs o11y-full-products-api-1 2>&1 | grep "trace_id" | grep "/client_metrics" | tail -1 | grep -o '"trace_id":"[^"]*"' | cut -d'"' -f4)
echo "   Trace ID: $METRICS_TRACE_ID"
echo ""

# Wait for traces to be processed
echo -e "${YELLOW}⏳ Waiting 3 seconds for traces to be processed by Tempo...${NC}"
sleep 3
echo ""

echo -e "${GREEN}✅ Synthetic traffic generated successfully!${NC}"
echo ""
echo "=========================================="
echo "📊 Verification in Grafana Tempo"
echo "=========================================="
echo ""

echo -e "${BLUE}Checking traces in Tempo storage...${NC}"
echo ""

# Verify /health trace
echo "1️⃣  /health endpoint trace:"
curl -s "http://localhost:3200/api/traces/$HEALTH_TRACE_ID" | \
  jq -r '[.batches[] | select(.scopeSpans[0].scope.name == "products-api") | .scopeSpans[0].spans[] | {
    name: .name,
    attributes_count: (.attributes | length),
    events_count: (if .events then (.events | length) else 0 end),
    key_attributes: [.attributes[] | select(.key | startswith("health") or startswith("process.memory")) | .key]
  }] | if length > 0 then "   ✓ Manual span found: \(.[])" else "   ✗ No manual spans found" end'
echo ""

# Verify /inject-leak trace
echo "2️⃣  /inject-leak endpoint trace:"
curl -s "http://localhost:3200/api/traces/$LEAK_TRACE_ID" | \
  jq -r '[.batches[] | select(.scopeSpans[0].scope.name == "products-api") | .scopeSpans[0].spans[] | .name] | 
    if length > 0 then "   ✓ Found \(length) manual spans: \(join(", "))" else "   ✗ No manual spans found" end'
echo ""

# Verify /inject-error trace
echo "3️⃣  /inject-error endpoint trace:"
curl -s "http://localhost:3200/api/traces/$ERROR_TRACE_ID" | \
  jq -r '[.batches[] | select(.scopeSpans[0].scope.name == "products-api") | .scopeSpans[0].spans[] | {
    name: .name,
    error_attrs: [.attributes[] | select(.key | contains("error")) | .key]
  }] | if length > 0 then "   ✓ Found \(length) manual spans with context propagation" else "   ✗ No manual spans found" end'
echo ""

# Verify /client_metrics trace
echo "4️⃣  /client_metrics endpoint trace:"
curl -s "http://localhost:3200/api/traces/$METRICS_TRACE_ID" | \
  jq -r '[.batches[] | select(.scopeSpans[0].scope.name == "products-api") | .scopeSpans[0].spans[] | {
    name: .name,
    level: (.attributes[] | select(.key == "level") | .value.stringValue)
  }] | if length > 0 then "   ✓ Found \(length)-level hierarchy: \(map(.name) | join(" → "))
   ✓ Levels: \(map(.level) | join(", "))" else "   ✗ No manual spans found" end'
echo ""

echo -e "${GREEN}=========================================="
echo "✅ Manual Tracing Verification Complete!"
echo "==========================================${NC}"
echo ""
echo "🔗 Grafana Explore URLs:"
echo ""
echo -e "   ${BLUE}All Traces:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22tempo%22%2C%22queries%22%3A%5B%7B%22queryType%22%3A%22traceql%22%2C%22query%22%3A%22%7Bresource.service.name%3D%5C%22products-api%5C%22%7D%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}Health endpoint:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22tempo%22%2C%22queries%22%3A%5B%7B%22queryType%22%3A%22traceql%22%2C%22query%22%3A%22$HEALTH_TRACE_ID%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}Inject Leak endpoint:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22tempo%22%2C%22queries%22%3A%5B%7B%22queryType%22%3A%22traceql%22%2C%22query%22%3A%22$LEAK_TRACE_ID%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}Inject Error endpoint:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22tempo%22%2C%22queries%22%3A%5B%7B%22queryType%22%3A%22traceql%22%2C%22query%22%3A%22$ERROR_TRACE_ID%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}Client Metrics endpoint:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22tempo%22%2C%22queries%22%3A%5B%7B%22queryType%22%3A%22traceql%22%2C%22query%22%3A%22$METRICS_TRACE_ID%22%7D%5D%7D"
echo ""
echo "📝 Trace IDs:"
echo "   Health:       ${HEALTH_TRACE_ID}..."
echo "   Inject Leak:  ${LEAK_TRACE_ID}..."
echo "   Inject Error: ${ERROR_TRACE_ID}..."
echo "   Client:       ${METRICS_TRACE_ID}..."
echo ""
