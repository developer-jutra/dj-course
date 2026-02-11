# Manual Tracing Instrumentation - Summary

## Overview

This document describes the manual tracing instrumentation added to the `router-misc.ts` file, demonstrating various OpenTelemetry patterns for distributed tracing.

## Implemented Patterns

### Pattern 1: Simple Manual Span with Error Recording
**Endpoint:** `GET /error`

**Features:**
- Creates a child span within the existing Express request handler span
- Records exceptions with `span.recordException()`
- Sets span status to ERROR
- Adds events to track operation progress

**Code Example:**
```typescript
const span = tracer.startSpan('error_generation', {
  kind: SpanKind.INTERNAL,
  attributes: {
    'http.method': req.method,
    'error.type': 'intentional',
  }
});

span.addEvent('error_generation_started');
span.recordException(error);
span.setStatus({ code: SpanStatusCode.ERROR, message: 'Sample error generated' });
span.end();
```

**Trace Structure:**
```
├─ Express HTTP span (auto-instrumentation)
   └─ error_generation (manual span)
      ├─ Event: error_generation_started
      └─ Event: error_recorded
```

---

### Pattern 2: Multiple Child Spans with Events
**Endpoint:** `GET /inject-leak`

**Features:**
- Creates multiple sequential child spans to track different operation phases
- Uses span events to mark important milestones
- Rich span attributes describing the operation
- Demonstrates operation breakdown

**Code Example:**
```typescript
// Phase 1: Allocation
const allocationSpan = tracer.startSpan('memory.allocation', {
  kind: SpanKind.INTERNAL,
  attributes: {
    'operation.type': 'memory_allocation',
    'allocation.size_mb': 4,
  }
});

allocationSpan.addEvent('allocation_started', {
  'target_size_bytes': 4 * 1024 * 1024,
});

// Phase 2: Storage
const storageSpan = tracer.startSpan('memory.store', {
  kind: SpanKind.INTERNAL,
  attributes: {
    'operation.type': 'memory_storage',
  }
});
```

**Trace Structure:**
```
├─ Express HTTP span (auto-instrumentation)
   ├─ memory.allocation (manual span)
   │  ├─ Event: allocation_started
   │  └─ Event: memory_allocated
   └─ memory.store (manual span)
      ├─ Event: storage_started
      └─ Event: memory_stored
```

**Attributes Captured:**
- `operation.type`: Type of operation (allocation/storage)
- `allocation.size_mb`: Size of allocation in MB
- `storage.previous_count`: Number of leaks before operation
- `storage.new_count`: Number of leaks after operation
- `storage.total_bytes`: Total bytes leaked

---

### Pattern 3: Context Propagation Between Functions
**Endpoint:** `GET /inject-error`

**Features:**
- Demonstrates automatic context propagation
- Parent span creates a child span in a helper function
- Shows parent-child relationship in distributed context
- Different span status codes (OK vs ERROR)

**Code Example:**
```typescript
// Parent span
const operationSpan = tracer.startSpan('error_injection_operation', {
  kind: SpanKind.INTERNAL,
  attributes: {
    'error.injection_type': 'random_status',
  }
});

await context.with(trace.setSpan(context.active(), operationSpan), async () => {
  // Child span is automatically created in helper function
  const randomStatus = await selectRandomErrorCode();
  
  operationSpan.setAttributes({
    'http.status_code': randomStatus,
  });
});

// Helper function - creates child span
async function selectRandomErrorCode(): Promise<number> {
  const span = tracer.startSpan('select_random_error_code', {
    kind: SpanKind.INTERNAL,
  });
  // ... implementation
  span.end();
}
```

**Trace Structure:**
```
├─ Express HTTP span (auto-instrumentation)
   └─ error_injection_operation (manual parent span)
      ├─ Event: operation_started
      ├─ select_random_error_code (manual child span)
      │  ├─ Event: selection_started
      │  └─ Event: selection_completed
      └─ Event: operation_completed
```

**Attributes Captured:**
- `error.code`: Selected HTTP error code
- `error.codes_pool_size`: Number of available error codes
- `error.is_client_error`: Boolean indicating 4xx error
- `error.is_server_error`: Boolean indicating 5xx error
- `error.intentional`: Flag marking intentional error

---

### Pattern 4: Detailed Span with Rich Attributes
**Endpoint:** `GET /health`

**Features:**
- Single span with extensive attributes
- Multiple events tracking operation phases
- System metrics captured in span attributes
- Demonstrates observability of system state

**Code Example:**
```typescript
const span = tracer.startSpan('health_check_operation', {
  kind: SpanKind.INTERNAL,
  attributes: {
    'health_check.type': 'basic',
  }
});

span.addEvent('health_check_started');

const memUsage = process.memoryUsage();
span.setAttributes({
  'process.uptime_seconds': process.uptime(),
  'health.status': 'OK',
  'process.memory.heap_used': memUsage.heapUsed,
  'process.memory.heap_total': memUsage.heapTotal,
  'process.memory.rss': memUsage.rss,
  'process.memory.external': memUsage.external,
});

span.addEvent('health_data_collected', {
  'memory_heap_mb': Math.round(memUsage.heapUsed / 1024 / 1024),
});
```

**Trace Structure:**
```
├─ Express HTTP span (auto-instrumentation)
   └─ health_check_operation (manual span)
      ├─ Event: health_check_started
      ├─ Event: health_data_collected
      └─ Event: health_check_completed
```

**Attributes Captured:**
- `health_check.type`: Type of health check
- `health.status`: Current health status
- `health.timestamp`: Timestamp of check
- `process.uptime_seconds`: Application uptime
- `process.memory.*`: Detailed memory usage metrics

---

### Pattern 5: Multi-Level Context Propagation
**Endpoint:** `POST /client_metrics`

**Features:**
- 3-level span hierarchy (root → child → grandchild)
- Automatic context propagation across function boundaries
- Demonstrates complex distributed traces
- Each level has distinct attributes and events

**Code Example:**
```typescript
// Level 1: Root span
const rootSpan = tracer.startSpan('client_metrics_processing', {
  kind: SpanKind.INTERNAL,
  attributes: {
    'level': 'root',
  }
});

await context.with(trace.setSpan(context.active(), rootSpan), async () => {
  // Level 2: Child span (automatic context propagation)
  const { name, value, labels } = await parseClientMetrics(req.body);
  
  // Level 3: Grandchild span (automatic context propagation)
  await recordMetric(name, value, labels);
});

// Child function
async function parseClientMetrics(body: any) {
  const span = tracer.startSpan('parse_client_metrics', {
    kind: SpanKind.INTERNAL,
    attributes: { 'level': 'child' }
  });
  // ...
  span.end();
}

// Grandchild function
async function recordMetric(name: string, value: number, labels: any) {
  const span = tracer.startSpan('record_metric', {
    kind: SpanKind.INTERNAL,
    attributes: { 'level': 'grandchild' }
  });
  // ...
  span.end();
}
```

**Trace Structure:**
```
├─ Express HTTP span (auto-instrumentation)
   └─ client_metrics_processing (root span)
      ├─ Event: request_received
      ├─ parse_client_metrics (child span)
      │  ├─ Event: parsing_started
      │  └─ Event: parsing_completed
      ├─ Event: metrics_parsed
      ├─ record_metric (grandchild span)
      │  ├─ Event: metric_recording_started
      │  └─ Event: metric_recorded
      └─ Event: metrics_processed
```

**Attributes Captured:**
- `level`: Hierarchy level (root/child/grandchild)
- `metric.name`: Name of the metric
- `metric.value`: Metric value
- `metric.type`: Type of metric (lcp/inp/cls)
- `metric.category`: Category (web_vitals)
- `metric.page_path`: Page where metric was collected
- `metric.device_type`: Device type
- `metric.connection_type`: Network connection type

---

## Testing

### Running Tests

Execute the test script to verify all patterns:

```bash
./test-manual-tracing.sh
```

### Manual Verification

Check individual traces in Tempo:

```bash
# Get recent traces
curl "http://localhost:3200/api/search?tags=service.name%3Dproducts-api"

# Get specific trace details
curl "http://localhost:3200/api/traces/<TRACE_ID>" | jq .
```

### Verification in Grafana

1. Open Grafana: http://localhost:4000/explore
2. Select "Tempo" as data source
3. Search for traces with:
   - Service name: `products-api`
   - Span name: `memory.allocation`, `error_injection_operation`, etc.

---

## Key Learnings

### 1. Span Hierarchy
- Manual spans automatically become children of the active span created by auto-instrumentation
- No need to create new root spans - Express already creates the parent HTTP span

### 2. Context Propagation
- Using `context.with(trace.setSpan(...))` ensures child spans inherit the context
- Child functions automatically create grandchild spans when tracer is used within active context

### 3. Span Attributes vs Events
- **Attributes**: Static metadata about the span (tags for filtering/grouping)
- **Events**: Time-stamped occurrences during span lifecycle (milestones, logs)

### 4. Span Status
- `STATUS_CODE_OK`: Successful operation
- `STATUS_CODE_ERROR`: Failed operation
- Always set status explicitly for clarity

### 5. Multiple Batches in Traces
- Traces can have multiple batches from different instrumentation scopes
- Manual spans appear in batch with scope `products-api` (same as auto-instrumentation)
- Use `.batches[]` when querying to see all spans

---

## File Structure

### Core Files
- **`tracer.ts`** - Centralized tracer configuration with environment variables
- **`metrics.ts`** - Metrics configuration using environment variables
- **`logger.ts`** - Logger configuration using environment variables
- **`router-misc.ts`** - Endpoints with manual tracing instrumentation

### Environment Variables Used
- `SERVICE_NAME` - service name
- Default: `products-api` if neither is set

---

## Architecture Notes

### Tracer Configuration
```typescript
// tracer.ts
import { trace } from '@opentelemetry/api';

const SERVICE_NAME = process.env.SERVICE_NAME!;
const SERVICE_VERSION = '1.0.0';

export const tracer = trace.getTracer(SERVICE_NAME, SERVICE_VERSION);
```

This creates a named tracer that:
- Uses service name from environment variables (`SERVICE_NAME`)
- Groups manual spans under the same scope as the service
- Allows version tracking of instrumentation code
- Avoids hardcoding service names

### Span Kinds
- `SpanKind.INTERNAL`: Internal operation within the service
- `SpanKind.SERVER`: Entry point receiving a request
- `SpanKind.CLIENT`: Outgoing request to another service

### Best Practices
1. Always call `span.end()` to complete the span
2. Use try-catch to handle errors and record exceptions
3. Set span status explicitly
4. Use meaningful span names that describe the operation
5. Add contextual attributes for filtering and analysis
6. Use events for time-series data within a span

---

## Verification Results

✅ All patterns successfully implemented and verified:

1. **Pattern 1** - Error tracking with span status
2. **Pattern 2** - Multi-phase operation tracking
3. **Pattern 3** - Parent-child context propagation
4. **Pattern 4** - Rich attribute collection
5. **Pattern 5** - Multi-level hierarchy (3 levels)

All traces are successfully stored in Grafana Tempo and can be queried via:
- Tempo API: `http://localhost:3200`
- Grafana UI: `http://localhost:4000/explore`

---

## References

- [OpenTelemetry Tracing API](https://opentelemetry.io/docs/instrumentation/js/instrumentation/)
- [Grafana Tempo Documentation](https://grafana.com/docs/tempo/)
- [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
