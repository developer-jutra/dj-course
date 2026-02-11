# Logs and Trace Correlation Guide

This guide shows how to verify that your logs include trace context (trace_id, span_id) and how to use this for correlation in Grafana.

## 🚀 Quick Start

**Check logs include trace IDs:**
```bash
docker-compose logs products-api --tail=10 | grep trace_id
```

**Test with a request:**
```bash
# Make a request
curl http://localhost:3000/products/1

# View the logs (look for trace_id field)
docker-compose logs products-api --tail=3
```

**Expected output:**
```json
{
  "trace_id": "9c87c415510e93613eb4b5e642f3445a",
  "span_id": "eb61d7857d6a7512",
  "trace_flags": "01",
  "method": "GET",
  "url": "/products/1",
  "duration": "26ms"
}
```

---

## 🔍 How to Check if Logs Include Trace IDs

### Method 1: View Container Logs Directly

The easiest way to verify trace correlation is to look at the container logs:

```bash
docker-compose logs products-api --tail=20
```

**Example Output with Trace Context:**

```
products-api-1  | [32minfo[39m: GET /products/1 {"duration":"26ms","host":"398b8fa06136","method":"GET","resource.service.name":"products-api","service":"products-api","span_id":"eb61d7857d6a7512","status":200,"timestamp":"2026-02-07T01:02:25.505Z","trace_flags":"01","trace_id":"9c87c415510e93613eb4b5e642f3445a","url":"/products/1","userAgent":"curl/8.7.1","userId":"anonymous"}
```

**Key Fields to Look For:**
- ✅ `trace_id`: `"9c87c415510e93613eb4b5e642f3445a"` - Unique identifier for the entire request
- ✅ `span_id`: `"eb61d7857d6a7512"` - Identifier for this specific operation
- ✅ `trace_flags`: `"01"` - Indicates this trace is sampled
- ✅ `resource.service.name`: `"products-api"` - Service identifier

### Method 2: Query Specific Logs

Filter logs for a specific endpoint:

```bash
docker-compose logs products-api | grep "products/3"
```

**Example Output:**

```
products-api-1  | [32minfo[39m: Retrieved product 3 {"host":"398b8fa06136","resource.service.name":"products-api","service":"products-api","span_id":"badeb7f9e0eb1c0c","timestamp":"2026-02-07T01:02:35.809Z","trace_flags":"01","trace_id":"246faf0c2e2b4c354f7c248afd0be338"}

products-api-1  | [32minfo[39m: GET /products/3 {"duration":"11ms","host":"398b8fa06136","method":"GET","resource.service.name":"products-api","service":"products-api","span_id":"b2b8e87810c14591","status":200,"timestamp":"2026-02-07T01:02:35.810Z","trace_flags":"01","trace_id":"246faf0c2e2b4c354f7c248afd0be338","url":"/products/3","userAgent":"curl/8.7.1","userId":"anonymous"}
```

**Note:** Both log entries share the same `trace_id` (`246faf0c2e2b4c354f7c248afd0be338`) but have different `span_id` values, showing they're part of the same trace but different operations.

### Method 3: Check if Logs Are Reaching Loki

Query Loki to verify logs are stored with trace context:

```bash
# Get all logs for the service
curl -s "http://localhost:3100/loki/api/v1/query_range?query={service_name=\"products-api\"}&limit=5"
```

Or query for a specific trace ID:

```bash
# Replace TRACE_ID with your actual trace ID
curl -s 'http://localhost:3100/loki/api/v1/query_range?query={service_name="products-api"}|="246faf0c2e2b4c354f7c248afd0be338"&limit=5'
```

## 📊 Using Trace Correlation in Grafana

### Step 1: Access Grafana

```bash
open http://localhost:4000
# Login: admin / secret
```

### Step 2: Find Logs from a Trace (Trace → Logs)

When you have a trace ID and want to find all related logs:

**Option A: From Tempo Trace View**

1. Open **Explore** (compass icon)
2. Select **Tempo** as data source
3. Enter your trace ID in the **Query** field: `edc8e7b0d60c2975b880a906457fa457`
4. Click **Run query**
5. Once the trace loads, look at each span:
   - Click on a span to expand details
   - Look for **"Logs for this span"** link
   - Click it to open related logs in Loki

**Option B: Direct LogQL Query in Loki**

1. Open **Explore** (compass icon)
2. Select **Loki** as data source
3. Use this LogQL query to find all logs for your trace:

```logql
{service_name="products-api"} |= "edc8e7b0d60c2975b880a906457fa457"
```

4. Click **Run query**
5. You'll see all log entries that contain this trace ID

**Option C: Using Loki Query Builder**

1. Open **Explore** → Select **Loki**
2. Click **Label filters** → Add:
   - Label: `service_name`
   - Operator: `=`
   - Value: `products-api`
3. Click **+ Line contains** (below the query)
4. Enter the trace ID: `edc8e7b0d60c2975b880a906457fa457`
5. Click **Run query**

### Step 3: Query Logs in Explore

Manual log queries using LogQL:

Manual log queries using LogQL:

1. Click **Explore** (compass icon in left sidebar)
2. Select **Loki** as the data source
3. Use LogQL queries:

```logql
# All logs from products-api
{service_name="products-api"}

# Logs for a specific endpoint
{service_name="products-api"} |= "products/1"

# Logs for a specific trace ID
{service_name="products-api"} |= "9c87c415510e93613eb4b5e642f3445a"

# Filter by log level
{service_name="products-api"} | json | level="error"
```

### Step 3: Navigate from Logs to Traces

When viewing logs in Grafana:

1. Look for the **trace_id** field in the log details
2. Click the **Tempo** link next to the trace_id
3. Grafana automatically opens the corresponding trace in Tempo

### Step 4: Navigate from Traces to Logs

When viewing a trace in Tempo:

1. Click on any span in the trace
2. Look for the **Logs** section in the span details
3. Click **Logs for this span** to see related logs in Loki

**Important Notes:**
- Log correlation works when logs have been sent to Loki with trace context
- There may be a delay (5-10 seconds) between generating logs and them appearing in Loki due to batching
- If you don't see the "Logs for this span" link, it means either:
  - The logs haven't reached Loki yet (wait a moment and refresh)
  - The trace ID isn't present in the logs (check instrumentation)
  - The data sources aren't properly configured for correlation

**Workaround if correlation link doesn't appear:**
Use the manual LogQL query method described in Step 2, Option B above.

## 🎯 Real-World Example

### Scenario: Debugging a slow request

1. **Find the slow request in logs:**
   ```logql
   {service_name="products-api"} | json | duration > 100
   ```

2. **Extract the trace_id from the log:**
   ```json
   {
     "trace_id": "9c87c415510e93613eb4b5e642f3445a",
     "duration": "150ms",
     "url": "/products/1"
   }
   ```

3. **View the full trace in Tempo:**
   - Copy the trace_id
   - Go to Tempo in Grafana
   - Search for trace: `9c87c415510e93613eb4b5e642f3445a`

4. **Analyze the trace:**
   - See all spans (HTTP request, database query, etc.)
   - Identify which operation took the longest
   - View logs from each span for additional context

## ✅ Verification Checklist

To confirm everything is working:

- [ ] Container logs show `trace_id` and `span_id` fields
- [ ] Multiple log entries for the same request share the same `trace_id`
- [ ] Logs appear in Grafana's Loki data source
- [ ] Clicking on a trace_id in logs opens the corresponding trace in Tempo
- [ ] Viewing a trace in Tempo shows links to related logs

## 🔧 Troubleshooting

### Systematic Debugging Guide for Trace-to-Logs Correlation

When logs don't appear in Grafana's trace drilldown view, follow this systematic verification plan:

#### 1. **Application Layer (Auto-instrumentation)**

**Verify OpenTelemetry SDK Configuration:**

```bash
# Check if W3C Trace Context is being used
docker-compose logs products-api | grep -i "traceparent\|trace-id" | head -5

# Verify logger has OTel instrumentation
cd products-api
grep -r "instrumentation-winston" package.json
grep -r "WinstonInstrumentation\|winston-transport" tracing.ts
```

**Ensure Logger Context-Awareness:**

The logger must be instrumented to inject `trace_id` and `span_id`. In our setup:

```typescript
// ✅ CORRECT: Logger created AFTER tracing initialized
import setupTracing from './tracing';
const sdk = setupTracing();  // Initialize first

import logger from './logger';  // Import logger after

// ✅ Winston instrumentation enabled in tracing.ts
instrumentations: [
  getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-winston': {
      enabled: true,
      disableLogSending: false
    }
  })
]
```

**Verify Context Propagation (AsyncLocalStorage):**

```javascript
// The OTel SDK automatically uses AsyncLocalStorage
// Logger must be able to access active span context:
const span = trace.getSpan(context.active());
const traceId = span.spanContext().traceId;
```

#### 2. **Log Format Validation**

**Check Field Names in Raw Logs:**

```bash
# Get a raw log entry and check field names
docker-compose logs products-api --tail=5 | grep trace_id

# Expected format:
# "trace_id":"9c87c415510e93613eb4b5e642f3445a"
# "span_id":"eb61d7857d6a7512"
```

**Common Field Name Variations:**
- `trace_id` (our format - OpenTelemetry standard)
- `traceID` (alternative format)
- `traceId` (camelCase variant)
- `tid` (shortened version)

**Verify Trace ID Format Matches:**

```bash
# Trace ID should be hexadecimal, 32 characters
# Tempo format: 9c87c415510e93613eb4b5e642f3445a
# Log format:   9c87c415510e93613eb4b5e642f3445a
# ✅ MUST MATCH EXACTLY
```

**Query Loki to Inspect Field Structure:**

```bash
# Get a log and check its structure
curl -s 'http://localhost:3100/loki/api/v1/query_range?query={service_name="products-api"}&limit=1' \
  | jq '.data.result[0].values[0][1]' | jq '.'
```

#### 3. **Grafana Data Source Mapping**

**Verify Tempo Data Source Settings:**

1. Go to **Configuration** (gear icon) → **Data Sources** → **Tempo**
2. Scroll to **Trace to logs** section
3. Check configuration:

```yaml
Data source: Loki (must be selected)
Tags: 
  - Key: service.name
    Value: service_name (field in logs)
Span start time shift: -5m (buffer before span)
Span end time shift: 5m (buffer after span)
Filter by Trace ID: ✅ Enabled
```

**Common Mapping Issues:**

| Issue | Symptom | Fix |
|-------|---------|-----|
| Wrong field name | No logs found | Map `traceID` → `trace_id` in tags |
| No data source | Link doesn't work | Select Loki as log data source |
| Time range too narrow | Old logs missing | Increase time shift buffers |
| No service mapping | Too many logs | Add `service.name` tag filter |

**Test Mapping Configuration:**

```bash
# Verify both datasources are configured
curl -s http://localhost:4000/api/datasources | jq '.[] | select(.type=="tempo" or .type=="loki") | {name, type, uid}'
```

#### 4. **Resource Attributes Validation**

**Verify Common Attributes Between Traces and Logs:**

```bash
# Check trace has service.name
curl -s "http://localhost:3200/api/traces/edc8e7b0d60c2975b880a906457fa457" \
  | jq '.batches[0].resource.attributes[] | select(.key=="service.name")'

# Check logs have service_name label
curl -s 'http://localhost:3100/loki/api/v1/labels' | jq '.data'
```

**Required Shared Attributes:**
- ✅ `service.name` (trace) ↔ `service_name` (log label)
- ✅ `trace_id` (must be in log body or structured metadata)
- ✅ Overlapping timestamps

#### 5. **Context Injection Deep Dive**

**The Missing Link: Middleware Context**

The most common failure point is that middleware (like `jsonParser`, `query`) processes requests but the logger doesn't know about the active OpenTelemetry span.

**How Our Setup Handles This:**

```typescript
// tracing.ts - SDK creates AsyncLocalStorage context
const sdk = new NodeSDK({
  instrumentations: [
    // Express instrumentation creates spans automatically
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-express': { enabled: true }
    }),
    // Winston instrumentation reads from AsyncLocalStorage
    '@opentelemetry/instrumentation-winston': { enabled: true }
  ]
});

// The instrumentation automatically:
// 1. Express middleware creates a span and stores it in AsyncLocalStorage
// 2. Winston instrumentation reads the active span from context
// 3. trace_id and span_id are injected into every log
```

**Verify Context Propagation Works:**

```bash
# Generate a request
curl http://localhost:3000/products/1

# Check logs show different span_ids but same trace_id
docker-compose logs products-api --tail=10 | grep trace_id
```

Expected output:
```json
// HTTP span
{"trace_id":"abc123","span_id":"def456",...}
// DB span (child)
{"trace_id":"abc123","span_id":"ghi789",...}  // Same trace_id!
```

### Logs don't show trace_id

**Check:**
1. Winston instrumentation is enabled in `tracing.ts`
2. `@opentelemetry/instrumentation-winston` package is installed
3. `@opentelemetry/winston-transport` package is installed
4. Logger is created AFTER tracing is initialized

### Logs show trace_id but don't appear in Loki

**Check:**
1. OTel Collector is running: `docker-compose ps otel-collector`
2. LoggerProvider is configured with OTLP exporter
3. NodeSDK has `logRecordProcessor` configured
4. Check collector logs: `docker-compose logs otel-collector`
5. **Wait 5-10 seconds** - logs are batched before sending to Loki

**Force flush logs immediately (for testing):**
```bash
# Restart the service to flush pending logs
docker-compose restart products-api
```

### Can't find logs for a specific trace in Grafana

**Solution 1: Use Direct LogQL Query**

Instead of relying on the automatic correlation link, query Loki directly:

1. Go to **Explore** → Select **Loki**
2. Enter this query (replace with your trace ID):
   ```logql
   {service_name="products-api"} |= "edc8e7b0d60c2975b880a906457fa457"
   ```
3. Set time range to **Last 15 minutes** or wider
4. Click **Run query**

**Solution 2: Verify Logs Exist First**

Check if logs with that trace ID exist in the container:

```bash
# Replace TRACE_ID with your actual trace ID
docker-compose logs products-api | grep "edc8e7b0d60c2975b880a906457fa457"
```

If logs appear in container but not Loki:
- Wait 10-15 seconds for batching
- Check OTel collector is processing logs: `docker-compose logs otel-collector --tail=50`
- Verify Loki is receiving data: `curl -s http://localhost:3100/ready`

**Solution 3: Generate Fresh Test Data**

```bash
# Make a new request
curl http://localhost:3000/products/1

# Immediately get the trace ID from logs
docker-compose logs products-api --tail=2 | grep trace_id

# Wait 10 seconds for batching
sleep 10

# Query Loki with the trace ID you just captured
```

### Can't correlate logs with traces in Grafana

**Check:**
1. Both Loki and Tempo data sources are configured in Grafana
2. Trace ID format matches between logs and traces (should be hex string)
3. Time ranges align when searching
4. Data source correlation settings:
   - Go to **Configuration** → **Data Sources** → **Loki**
   - Scroll to **Derived fields**
   - Verify there's a field for `traceID` or `trace_id`

## 🎬 Complete Workflow: From Request to Correlated Logs

Here's the complete flow with a real example:

### 1. Generate a Request
```bash
curl http://localhost:3000/products/42
```

### 2. Capture the Trace ID
```bash
# View the logs
docker-compose logs products-api --tail=3

# Look for output like:
# "trace_id":"abc123...","url":"/products/42"
```

### 3. View in Tempo
```
1. Open Grafana → Explore
2. Select Tempo
3. Query: abc123... (your trace ID)
4. See the full trace waterfall
```

### 4. Find Related Logs
```
1. In the same Grafana Explore
2. Switch data source to Loki (top dropdown)
3. Query: {service_name="products-api"} |= "abc123..."
4. See all logs for that trace
```

### 5. Analyze Together
- Keep both queries open in split view
- Click the "Split" button in Explore
- Put Tempo on left, Loki on right
- Navigate through the trace while seeing related logs

## 📚 Additional Resources

- [OpenTelemetry Logs Specification](https://opentelemetry.io/docs/specs/otel/logs/)
- [Winston Instrumentation Documentation](https://www.npmjs.com/package/@opentelemetry/instrumentation-winston)
- [Grafana Trace Correlation](https://grafana.com/docs/grafana/latest/explore/trace-integration/)

---

## 🎯 Quick Reference Card

### Find Logs for Trace ID: `edc8e7b0d60c2975b880a906457fa457`

**In Grafana Loki:**
```logql
{service_name="products-api"} |= "edc8e7b0d60c2975b880a906457fa457"
```

**In Terminal:**
```bash
# Check container logs
docker-compose logs products-api | grep "edc8e7b0d60c2975b880a906457fa457"

# Query Loki API directly
curl -s 'http://localhost:3100/loki/api/v1/query_range?query={service_name="products-api"}|="edc8e7b0d60c2975b880a906457fa457"&limit=10'
```

### Common LogQL Queries

```logql
# All logs from products-api
{service_name="products-api"}

# Logs for specific endpoint
{service_name="products-api"} |= "/products/1"

# Logs with trace correlation
{service_name="products-api"} | json | trace_id != ""

# Error logs only
{service_name="products-api"} | json | level="error"

# Slow requests (duration > 100ms)
{service_name="products-api"} | json | duration_ms > 100
```

### Key Fields in Logs

| Field | Example | Description |
|-------|---------|-------------|
| `trace_id` | `9c87c415510e93613eb4b5e642f3445a` | Links logs to traces |
| `span_id` | `eb61d7857d6a7512` | Identifies specific operation |
| `trace_flags` | `01` | Indicates if trace is sampled |
| `resource.service.name` | `products-api` | Service identifier |
| `timestamp` | `2026-02-07T01:02:25.505Z` | Log timestamp |

### Grafana Navigation

```
Logs → Traces: Click trace_id in log details
Traces → Logs: Click "Logs for this span" in span details
Manual Query: Use LogQL with trace_id filter
```

---

## 🔍 Quick Diagnostic Script

Save this as `check-trace-logs.sh` for rapid debugging:

```bash
#!/bin/bash
# Quick diagnostic for trace-to-logs correlation

TRACE_ID="${1:-edc8e7b0d60c2975b880a906457fa457}"

echo "=== Checking Trace: $TRACE_ID ==="
echo ""

echo "1️⃣ Logs in Container:"
docker-compose logs products-api 2>&1 | grep "$TRACE_ID" | head -5
echo ""

echo "2️⃣ Span IDs in this trace:"
docker-compose logs products-api 2>&1 | grep "$TRACE_ID" | \
  grep -o '"span_id":"[^"]*"' | sort -u
echo ""

echo "3️⃣ Checking Loki (may take 10-15 seconds for batching):"
sleep 2
LOKI_RESULT=$(curl -s "http://localhost:3100/loki/api/v1/query_range?query={service_name=\"products-api\"}|=\"$TRACE_ID\"&limit=5" | \
  jq -r '.data.result | length')
echo "Found $LOKI_RESULT log stream(s) in Loki"
echo ""

echo "4️⃣ Services in Loki:"
curl -s 'http://localhost:3100/loki/api/v1/label/service_name/values' | jq -r '.data[]'
echo ""

echo "5️⃣ OTel Collector Status:"
docker-compose ps otel-collector | grep -v "^NAME"
echo ""

echo "✅ Grafana Query:"
echo "   {service_name=\"products-api\"} |= \"$TRACE_ID\""
```

**Usage:**
```bash
chmod +x check-trace-logs.sh
./check-trace-logs.sh edc8e7b0d60c2975b880a906457fa457
```
