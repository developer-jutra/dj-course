#!/bin/bash

# Test script for metrics verification
# This script generates synthetic traffic and verifies metrics in Grafana Prometheus

set -e

echo "🧪 Testing Metrics Collection"
echo "=============================="
echo ""
echo "📝 Understanding Prometheus Labels:"
echo ""
echo "1. job=\"otel-metrics-agent\" - Automatically added by Prometheus during scraping"
echo "   (defined in prometheus.yml as job_name). This is ALWAYS added by Prometheus."
echo ""
echo "2. exported_job=\"products-api\" - This is service.name from the application."
echo "   OTel Collector converts service.name → job, but since Prometheus already has"
echo "   its own 'job' label, it renames the metric's job to 'exported_job'."
echo ""
echo "=============================="
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

# Generate diverse traffic patterns to trigger various metrics
echo -e "${BLUE}1. Testing /products endpoint (success)${NC}"
for i in {1..5}; do
  curl -s http://localhost:3000/products > /dev/null
  echo -n "."
done
echo " ✓"
echo ""

echo -e "${BLUE}2. Testing /products/:id endpoints${NC}"
for i in {1..3}; do
  curl -s http://localhost:3000/products/$i > /dev/null
  echo -n "."
done
echo " ✓"
echo ""

echo -e "${BLUE}3. Testing /inject-error endpoint (errors)${NC}"
for i in {1..3}; do
  curl -s http://localhost:3000/inject-error > /dev/null
  echo -n "."
done
echo " ✓"
echo ""

echo -e "${BLUE}4. Testing /inject-slow endpoint (slow responses)${NC}"
for i in {1..2}; do
  curl -s http://localhost:3000/inject-slow > /dev/null
  echo -n "."
done
echo " ✓"
echo ""

echo -e "${BLUE}5. Testing /client_metrics endpoint${NC}"
for i in {1..3}; do
  curl -s -X POST http://localhost:3000/client_metrics \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"LCP\", \"value\": $((2000 + RANDOM % 1000)), \"page_path\": \"/test-$i\", \"device_type\": \"desktop\", \"connection_type\": \"wifi\"}" > /dev/null
  echo -n "."
done
echo " ✓"
echo ""

# Wait for metrics to be scraped
echo -e "${YELLOW}⏳ Waiting 15 seconds for metrics to be scraped by Prometheus...${NC}"
sleep 15
echo ""

echo -e "${GREEN}✅ Synthetic traffic generated successfully!${NC}"
echo ""
echo "=========================================="
echo "📊 Verification in Prometheus"
echo "=========================================="
echo ""

# Query Prometheus for various metrics
echo "1️⃣  HTTP Request Count:"
HTTP_COUNT=$(curl -s 'http://localhost:9090/api/v1/query?query=sum(http_requests_total{exported_job="products-api"})' | \
  jq -r '.data.result[0].value[1] // "0"')
if [ "$HTTP_COUNT" = "0" ]; then
  echo -e "   ${RED}⚠️  No HTTP requests found!${NC}"
else
  echo -e "   ${GREEN}✓ Total requests: $HTTP_COUNT${NC}"
fi
echo ""

echo "2️⃣  HTTP Request Duration (p95):"
HTTP_DURATION=$(curl -s 'http://localhost:9090/api/v1/query?query=histogram_quantile(0.95,sum(rate(http_server_duration_milliseconds_bucket{exported_job="products-api"}[1m]))by(le))' | \
  jq -r '.data.result[0].value[1] // "N/A"')
if [ "$HTTP_DURATION" = "N/A" ]; then
  echo -e "   ${RED}⚠️  No duration data found!${NC}"
else
  echo -e "   ${GREEN}✓ p95 duration: ${HTTP_DURATION}ms${NC}"
fi
echo ""

echo "3️⃣  Database Connections:"
DB_CONNECTIONS=$(curl -s 'http://localhost:9090/api/v1/query?query=sum(db_client_connection_count{exported_job="products-api"})' | \
  jq -r '.data.result[0].value[1] // "0"')
if [ "$DB_CONNECTIONS" = "0" ]; then
  echo -e "   ${RED}⚠️  No DB connection metrics found!${NC}"
else
  echo -e "   ${GREEN}✓ Connection count: $DB_CONNECTIONS${NC}"
fi
echo ""

echo "4️⃣  Client-side Metrics (LCP):"
CLIENT_LCP_COUNT=$(curl -s 'http://localhost:9090/api/v1/query?query=sum(web_vitals_lcp_milliseconds_count{exported_job="products-api"})' | \
  jq -r '.data.result[0].value[1] // "0"')
if [ "$CLIENT_LCP_COUNT" = "0" ]; then
  echo -e "   ${YELLOW}⚠️  No LCP measurements (expected if no client metrics sent)${NC}"
else
  echo -e "   ${GREEN}✓ LCP measurements: $CLIENT_LCP_COUNT${NC}"
fi
echo ""

echo "5️⃣  Health Status:"
HEALTH_STATUS=$(curl -s 'http://localhost:9090/api/v1/query?query=health_status_ratio{exported_job="products-api"}' | \
  jq -r '.data.result[0].value[1] // "0"')
if [ "$HEALTH_STATUS" = "1" ]; then
  echo -e "   ${GREEN}✓ Service is healthy (1)${NC}"
elif [ "$HEALTH_STATUS" = "0" ]; then
  echo -e "   ${RED}⚠️  Health metric found but value is 0${NC}"
else
  echo -e "   ${RED}⚠️  No health metric found!${NC}"
fi
echo ""

echo "6️⃣  Available Metrics for products-api:"
METRICS_LIST=$(curl -s 'http://localhost:9090/api/v1/label/__name__/values' | \
  jq -r '.data[] | select(. | test("^(http_|db_|web_vitals|health_)") and (. | test("prometheus") | not))')
METRICS_COUNT=$(echo "$METRICS_LIST" | wc -l | xargs)
echo -e "   ${GREEN}✓ Found $METRICS_COUNT relevant metrics:${NC}"
echo "$METRICS_LIST" | head -10 | sed 's/^/      - /'
if [ "$METRICS_COUNT" -gt 10 ]; then
  echo "      ... and $((METRICS_COUNT - 10)) more"
fi
echo ""

echo -e "${GREEN}=========================================="
echo "✅ Metrics Verification Complete!"
echo "==========================================${NC}"
echo ""
echo "🔗 Grafana Dashboard URLs:"
echo ""
echo -e "   ${BLUE}OTLP Products Dashboard:${NC}"
echo "   http://localhost:4000/d/otlp-products/otlp-products-api-metrics"
echo ""
echo -e "   ${BLUE}Explore Prometheus - All Metrics:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22prometheus%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22%7Bexported_job%3D%5C%22products-api%5C%22%7D%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}HTTP Request Count:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22prometheus%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22http_requests_total%7Bexported_job%3D%5C%22products-api%5C%22%7D%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}HTTP Request Rate:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22prometheus%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22rate(http_requests_total%7Bexported_job%3D%5C%22products-api%5C%22%7D%5B5m%5D)%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}HTTP Request Duration (p95):${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22prometheus%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22histogram_quantile(0.95%2Csum(rate(http_server_duration_milliseconds_bucket%7Bexported_job%3D%5C%22products-api%5C%22%7D%5B5m%5D))by(le))%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}Database Connections:${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22prometheus%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22db_client_connection_count%7Bexported_job%3D%5C%22products-api%5C%22%7D%22%7D%5D%7D"
echo ""
echo -e "   ${BLUE}Web Vitals - LCP (Largest Contentful Paint):${NC}"
echo "   http://localhost:4000/explore?left=%7B%22datasource%22%3A%22prometheus%22%2C%22queries%22%3A%5B%7B%22expr%22%3A%22web_vitals_lcp_milliseconds_sum%7Bexported_job%3D%5C%22products-api%5C%22%7D%22%7D%5D%7D"
echo ""
echo "📊 Key Metrics Summary:"
echo "   Requests:     $HTTP_COUNT total"
echo "   p95 Duration: ${HTTP_DURATION}ms"
echo "   DB Conns:     $DB_CONNECTIONS active"
echo "   LCP Count:    $CLIENT_LCP_COUNT measurements"
echo ""
