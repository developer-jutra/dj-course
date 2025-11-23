# M3: LLM-Assisted Coding

- coding-agent-specific files
  - `M3/claude` - pliki specyficzne dla CC (claude code)
  - `M3/copilot` - pliki specyficzne dla GitHub Copilot
  - są "symlinkowane" zarówno do głównego folderu repo jak i do `M3/tms-data-generator`
- `docker-mcp-py` - klon serwera MCP dla dockera (python)
- `mcp-docker-tools` - customowy server MCP (node.js) zawierający przydatnego toola (`docker-image-tags`) oraz ilustracje tools, resources, prompts
- `mcp-playground-js`, `mcp-playground-py` - zaślepkowe serwery MCP z przykładami tool, resource, prompt
- `tms-data-generator` - generator danych SQLowych systemu transportowego TMS (golang), mający później zasilić (seed) bazę danych do testów
- `tms-data-generator` - generator danych SQLowych systemu transportowego TMS (golang), mający później zasilić (seed) developerską bazę danych postgres/deliveroo
- `warehouse-simulator` - symulator 3D magazynu - uważaj na nazistów!
