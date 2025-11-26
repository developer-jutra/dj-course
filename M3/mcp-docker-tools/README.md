# MCP Docker Tools

A Model Context Protocol (MCP) server for interacting with Docker Hub. It exposes tools to fetch Docker repository metadata and a simple greeting.

## Table of Contents

- [Tools](#tools)
- [Setup](#setup)
- [Usage](#usage)
- [Examples](#examples)
- [Logging](#logging)

## Tools

### `docker-image-tags`

- **Method**: `docker-hub.docker-image-tags`
- **Parameters**:
  - `repository` (string, required): Docker repository in the form `namespace/name` (e.g., `library/postgres`).
  - `page` (number, optional): Page number for pagination (default: 1).
  - `pageSize` (number, optional): Number of results per page (default: 100).
  - `version` (string, optional): Docker Hub API version (default: "v2").
- **Description**: Fetches an auto-paginated list of tags for the specified repository.
- **Response**:
  ```json
  {
    "tags": ["tag1", "tag2", ...],
    "totalCount": <total tags count>,
    "fetchedCount": <number of tags retrieved>
  }
  ```

### `docker-image-description`

- **Method**: `docker-hub.docker-image-description`
- **Parameters**:
  - `repository` (string, required): Docker repository in the form `namespace/name`.
  - `version` (string, optional): Docker Hub API version (default: "v2").
- **Description**: Returns the full text description of the repository.
- **Response**:
  ```json
  {
    "content": [
      { "type": "text", "text": "<full repository description>" }
    ]
  }
  ```

### 4. `docker-image-details`

- **Method**: `docker-hub.docker-image-details`
- **Parameters**:
  - `repository` (string, required): Docker repository in the form `namespace/name`.
  - `version` (string, optional): Docker Hub API version (default: "v2").
- **Description**: Fetches detailed metadata of the repository (JSON).
- **Response**:
  ```json
  {
    ... // complete metadata object returned by Docker Hub API
  }
  ```

## Setup

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

```bash
git clone <your-repo-url>
cd mcp-docker-tools
npm install
```

### Running the Server

```bash
npm start
```

The server will start using STDIO transport and register with the MCP system.

## Usage

```javascript
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';

(async () => {
  const client = new McpClient();

  // 1. Greet
  const greetRes = await client.call('docker-hub.greet', { name: 'Alice' });
  console.log(greetRes.content[0].text);

  // 2. Fetch tags
  const tagsRes = await client.call('docker-hub.docker-image-tags', {
    repository: 'library/postgres',
  });
  const { tags, totalCount, fetchedCount } = JSON.parse(tagsRes.content[0].text);
  console.log('Tags:', tags);

  // 3. Repository description
  const descRes = await client.call('docker-hub.docker-image-description', {
    repository: 'library/postgres',
  });
  console.log(descRes.content[0].text);

  // 4. Repository details
  const detailsRes = await client.call('docker-hub.docker-image-details', {
    repository: 'library/postgres',
  });
  console.log(JSON.parse(detailsRes.content[0].text));
})();
```

## Logging

Enable verbose logging by setting:

```bash
export CONFIG_LOG_LEVEL=VERBOSE
```
