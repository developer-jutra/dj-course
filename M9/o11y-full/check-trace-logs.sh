#!/bin/bash
# Quick diagnostic for trace-to-logs correlation
# Usage: ./check-trace-logs.sh [TRACE_ID]

TRACE_ID="${1:-edc8e7b0d60c2975b880a906457fa457}"

echo "=== Checking Trace: $TRACE_ID ==="
echo ""

echo "1️⃣  Logs in Container:"
docker-compose logs products-api 2>&1 | grep "$TRACE_ID" | head -5
echo ""

echo "2️⃣  Span IDs in this trace:"
docker-compose logs products-api 2>&1 | grep "$TRACE_ID" | \
  grep -o '"span_id":"[^"]*"' | sort -u
echo ""

echo "3️⃣  Checking Loki (may take 10-15 seconds for batching):"
sleep 2
# URL-encode the query properly
ENCODED_QUERY=$(python3 -c "import urllib.parse; print(urllib.parse.quote('{service_name=\"products-api\"} |= \"$TRACE_ID\"'))")
LOKI_RESULT=$(curl -s "http://localhost:3100/loki/api/v1/query_range?query=$ENCODED_QUERY&limit=5&start=$(python3 -c 'import time; print(int((time.time()-3600)*1e9))')&end=$(python3 -c 'import time; print(int(time.time()*1e9))')" 2>&1 | \
  jq -r '.data.result | length' 2>/dev/null || echo "0")
echo "Found $LOKI_RESULT log stream(s) in Loki"
echo ""

echo "4️⃣  Services in Loki:"
curl -s 'http://localhost:3100/loki/api/v1/label/service_name/values' | jq -r '.data[]'
echo ""

echo "5️⃣  OTel Collector Status:"
docker-compose ps otel-collector | grep -v "^NAME"
echo ""

echo "✅ Grafana Query:"
echo "   {service_name=\"products-api\"} |= \"$TRACE_ID\""
echo ""
echo "🔗 Grafana Explore:"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22loki%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22%7Bservice_name%3D%5C%22products-api%5C%22%7D%20%7C%3D%20%5C%22$TRACE_ID%5C%22%22%7D%5D%7D"
