# MCP Playground (PYTHON)

- Python 3.10+
- pydantic for schema validation

## docs

- https://github.com/modelcontextprotocol/python-sdk

## install

preferably in virtualenv (`python -m venv .venv && source .venv/bin/activate`, then: `deactivate` to exit)

```sh
pip install .
```

## test (MCP inspector)

- Użycie inspectora CLI do wywołania narzędzia 'tools/list'
  `npx @modelcontextprotocol/inspector --cli python server.py --method tools/list`

- Wywołanie narzędzia 'greet'
  `npx @modelcontextprotocol/inspector --cli python server.py --method greet --params '{"name": "Tomek"}'`

- Uruchomienie pełnego testu
  `npx @modelcontextprotocol/inspector python server.py`

## config

```json
{
  "mcpServers": {
    "mcp-playground": {
      "command": "python server.py"
    }
  }
}
```
