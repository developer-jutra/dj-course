# Python Test Setup for Testcontainers with PostgreSQL

This document provides instructions on how to set up the Python test environment and run the tests for the PostgreSQL integration using testcontainers.

## Prerequisites

- Python 3.8+
- pip
- Docker

## Installation

1.  **Create and activate a virtual environment:**

    It's recommended to use a virtual environment to manage project dependencies.

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

2.  **Install dependencies:**

    Install all the required Python packages using the `requirements.txt` file.

    ```bash
    pip install -r requirements.txt
    ```

## Running the Tests

To run the tests, simply execute `pytest` from within the `python` directory. Make sure your Docker daemon is running.

```bash
pytest
```

The tests will automatically:
1.  Start a PostgreSQL container using Testcontainers.
2.  Connect to the database.
3.  Create a `persons` table.
4.  Insert mock data.
5.  Run the tests against the database.
6.  Stop and remove the container after the tests are finished.
