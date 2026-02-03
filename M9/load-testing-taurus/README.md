# Load Testing with Taurus

This project uses Taurus to run load tests against a web application.

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

To run the load tests defined in `test_products.yml`, execute the following command:

```bash
bzt test_products.yml
```

This will start the load test and generate a report in a new directory named with the current timestamp.
