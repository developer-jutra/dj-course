# Artillery → Taurus Conversion Guide

This document explains the key differences between Artillery and Taurus configurations and how the scenarios were converted.

## Key Differences

### 1. Load Configuration

**Artillery:**
```yaml
config:
  phases:
    - duration: 60
      arrivalRate: 10      # New users per second
      rampTo: 20          # Ramp to this arrival rate
      maxVusers: 50       # Max concurrent users
```

**Taurus:**
```yaml
execution:
- concurrency: 50        # Number of concurrent users
  ramp-up: 15s          # Time to reach full concurrency
  hold-for: 60s         # Duration at peak load
  ramp-down: 15s        # Time to ramp down
```

**Key difference:** Artillery uses arrival rate (users/second), while Taurus uses concurrency (total concurrent users).

### 2. Base URL / Target

**Artillery:**
```yaml
config:
  target: "http://localhost:3000"
```

**Taurus:**
```yaml
scenarios:
  my-scenario:
    default-address: http://localhost:3000
```

### 3. Variables

**Artillery:**
```yaml
config:
  variables:
    productId:
      - 1
      - 2
      - 3

# Usage in request:
url: "/products/{{ productId }}"
```

**Taurus:**
```yaml
scenarios:
  my-scenario:
    variables:
      productId:
        - 1
        - 2
        - 3

# Usage in request:
url: /products/${productId}
```

**Key difference:** Artillery uses `{{ variable }}`, Taurus uses `${variable}`.

### 4. Request Flow

**Artillery:**
```yaml
scenarios:
  - name: "My scenario"
    flow:
      - get:
          url: "/products"
      - think: 2
      - post:
          url: "/products"
          json:
            name: "Test"
```

**Taurus:**
```yaml
scenarios:
  my-scenario:
    requests:
    - url: /products
      method: GET
      think-time: 2s
    - url: /products
      method: POST
      body:
        name: "Test"
```

**Key difference:** Artillery uses `flow` with action types (get, post), Taurus uses `requests` with explicit `method`.

### 5. Think Time

**Artillery:**
```yaml
- think: 2    # seconds
```

**Taurus:**
```yaml
think-time: 2s    # explicit unit required
```

### 6. Data Extraction

**Artillery:**
```yaml
- post:
    url: "/products"
    json:
      name: "Test"
    capture:
      - json: "$.id"
        as: createdProductId
```

**Taurus:**
```yaml
- url: /products
  method: POST
  body:
    name: "Test"
  extract-jsonpath:
    createdProductId:
      jsonpath: $.id
      default: 1
```

### 7. Request Headers

**Artillery:**
```yaml
- post:
    url: "/products"
    headers:
      Content-Type: "application/json"
    json:
      name: "Test"
```

**Taurus:**
```yaml
- url: /products
  method: POST
  headers:
    Content-Type: application/json
  body:
    name: "Test"
```

### 8. Scenario Weighting

**Artillery:**
```yaml
scenarios:
  - name: "Scenario A"
    weight: 3
    flow: [...]
  - name: "Scenario B"
    weight: 1
    flow: [...]
```

**Taurus:**
In Taurus, you can control throughput at the execution level:
```yaml
execution:
- scenario: scenario-a
  throughput: 75%    # 75% of requests
- scenario: scenario-b
  throughput: 25%    # 25% of requests
```

Or combine all scenarios in one with weighted random selection (more complex).

### 9. Multiple Phases

**Artillery:**
Phases are defined in the `config.phases` array.

**Taurus:**
Multiple phases are defined as separate execution blocks:
```yaml
execution:
- concurrency: 10
  hold-for: 30s
  scenario: my-scenario
- concurrency: 20
  hold-for: 30s
  scenario: my-scenario
```

## Converted Scenarios

### 1. product-load-test-only-get.yml
- **Source:** `scenarios-artillery/product-load-test-only-get.yml`
- **Changes:**
  - Converted arrival rate to concurrency
  - Changed `flow` to `requests`
  - Added explicit `method: GET`
  - Converted `think` to `think-time`

### 2. product-load-test.yml
- **Source:** `scenarios-artillery/product-load-test.yml`
- **Changes:**
  - Converted 3 phases (ramp-up, sustain, ramp-down)
  - Moved variables to scenario level
  - Changed variable syntax from `{{ }}` to `${}`
  - Converted `capture` to `extract-jsonpath`
  - Combined multiple scenarios into a single flow

### 3. product-error-test.yml
- **Source:** `scenarios-artillery/product-error-test.yml`
- **Changes:**
  - Converted 3 phases with different arrival rates
  - Added `throughput` parameter for rate limiting
  - Removed scenario weighting (combined all into one flow)
  - Preserved all error endpoints

### 4. product-slow-test.yml
- **Source:** `scenarios-artillery/product-slow-test.yml`
- **Changes:**
  - Converted 11 phases into 11 execution blocks
  - Each phase represents a different traffic pattern
  - Maintained the ~10 minute total duration
  - Preserved traffic spike patterns

## Running Converted Tests

Use the Task commands defined in `Taskfile.yml`:

```bash
# Simple test
task test

# GET-only test
task test-get-only

# Full CRUD test
task test-full

# Error scenarios
task test-errors

# Complex slow test with spikes
task test-slow
```

## Artillery Files Location

Original Artillery files are preserved in `scenarios-artillery/` for reference.
