"""
Contract tests for TMS API using Schemathesis.

Run with: uv run pytest tests/test_contract.py

Ensure the API is running (e.g. docker compose up -d) before executing tests.
Base URL defaults to http://localhost:3000, override via API_BASE_URL env var.
"""
import os

import schemathesis
from schemathesis.core.failures import AcceptedNegativeData
from schemathesis.openapi.checks import UndefinedStatusCode, UnsupportedMethodResponse

# Contract path: tms-api/contract/openapi.yaml (sibling of tms-api-tests)
_SCHEMA_DIR = os.path.dirname(os.path.abspath(__file__))
SCHEMA_PATH = os.path.join(_SCHEMA_DIR, "..", "..", "tms-api", "contract", "openapi.yaml")

schema = schemathesis.openapi.from_path(SCHEMA_PATH)

# Checks excluded from validation:
# - AcceptedNegativeData: Schemathesis mutates request data (e.g. year:{} instead of year:2024)
#   and expects a 4xx rejection. Express does not validate body types – intentional for this API.
# - UndefinedStatusCode: Schemathesis sends invalid path params (e.g. /customers/null,null)
#   and the API returns 400. The 400 is correct behavior but not yet documented in the contract.
# - UnsupportedMethodResponse: Express returns 404 for methods like TRACE instead of 405.
#   Returning 405 would require a catch-all middleware – out of scope for this project.
_EXCLUDED_CHECKS = [AcceptedNegativeData, UndefinedStatusCode, UnsupportedMethodResponse]


@schema.parametrize()
def test_api_contract(case):
    """
    Contract test: executes examples from the OpenAPI contract (Phase.explicit only,
    configured in conftest.py) and validates responses against the documented schema.
    """
    base_url = os.environ.get("API_BASE_URL", "http://localhost:3000")
    case.call_and_validate(base_url=base_url, excluded_checks=_EXCLUDED_CHECKS)
