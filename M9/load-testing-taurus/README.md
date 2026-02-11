# Load Testing with Taurus

This project uses Taurus to run load tests against a web application.

> **Note:** This project includes scenarios converted from Artillery. See [ARTILLERY_TO_TAURUS_CONVERSION.md](./ARTILLERY_TO_TAURUS_CONVERSION.md) for details on the conversion process and key differences between the two tools.

## Project Setup

1.  **Create and activate a virtual environment (standard python venv):**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Running Load Tests

All test scenarios are located in the `scenarios/` directory. 

### Using Task (Recommended)

```bash
# Simple GET test
task test

# Basic load test with only GET requests
task test-get-only

# Full load test with CRUD operations
task test-full

# Error scenarios test (404s, exceptions, etc.)
task test-errors

# Complex slow test with multiple traffic spikes (~10 minutes)
task test-slow

# Run custom scenario file
task test-custom FILE=scenarios/my-test.yml
```

### Using Taurus directly

```bash
# Simple GET test
bzt scenarios/test_products.yml

# Basic load test with only GET requests
bzt scenarios/product-load-test-only-get.yml

# Full load test with CRUD operations
bzt scenarios/product-load-test.yml

# Error scenarios test (404s, exceptions, etc.)
bzt scenarios/product-error-test.yml

# Complex slow test with multiple traffic spikes (~10 minutes)
bzt scenarios/product-slow-test.yml
```

## Available Scenarios

- **test_products.yml** - Simple GET test with 5 concurrent users and 100 iterations
- **product-load-test-only-get.yml** - Basic load test browsing products (GET only)
- **product-load-test.yml** - Full product lifecycle: GET, POST, DELETE operations
- **product-error-test.yml** - Error injection scenarios (404s, exceptions, random error codes)
- **product-slow-test.yml** - Complex 10-minute test with multiple traffic spikes and valleys

Each test generates a timestamped report in the `reports/` directory.
