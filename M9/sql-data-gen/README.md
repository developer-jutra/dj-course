# SQL Data Generator

This script generates a large `init-db.sql` file with synthetic data for testing purposes.

## Prerequisites

- [uv](https://github.com/astral-sh/uv) must be installed.
- Python 3.11+

## Installation

To install the required dependencies, run:

```bash
uv sync
```

## Usage

To generate the `init-db.sql` file, run:

```bash
uv run python src/generate_data.py
```
