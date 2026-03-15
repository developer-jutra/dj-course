---
name: create-endpoint-dto
description: Creates a DTO type file for an Express endpoint by running the HTTP request, inspecting the real response, and generating TypeScript types. Then types the Express route handler with the new DTO. Use when the user asks to type an Express endpoint, create a DTO for an endpoint, add TypeScript types to a route handler, or type a response from a REST API endpoint.
---

# Create Endpoint DTO

## Workflow

### 1. Run the HTTP request
Execute `curl -s <endpoint_url>` to get the real API response and inspect its shape.

### 2. Create `<resource>.dto.ts`
Place the file next to the corresponding `<resource>.routes.ts`.

Type rules derived from node-postgres behaviour:
- `INTEGER` / `BIGINT` → `number`
- `NUMERIC` / `DECIMAL` → **`string`** (node-postgres serializes these to avoid precision loss)
- `TEXT` / `VARCHAR` → `string`
- `BOOLEAN` → `boolean`
- `TIMESTAMPTZ` / `TIMESTAMP` → `string`
- `JSONB` / `JSON` → typed object or `Record<string, unknown>`

For list endpoints reuse the shared `Pagination` type:

```typescript
import { Pagination } from '../shared/pagination.types';

export type <Resource>Dto = {
  id: number;
  // ... fields derived from the actual response
};

export type <Resource>ListResponse = {
  data: <Resource>Dto[];
  pagination: Pagination;
};
```

### 3. Type the route handler
Import the DTO and apply it to the Express `Response` generic. Use a union with `{ error: string }` to cover error responses:

```typescript
import { <Resource>ListResponse } from './<resource>.dto';

router.get('/', async (req: Request, res: Response<<Resource>ListResponse | { error: string }>) => {
  // ...
});
```

### 4. Compile
```bash
cd tms-api && npm run build
```
Fix any type errors before proceeding.

### 5. Rebuild Docker and verify
```bash
docker compose down -v
docker compose build --no-cache tms-api
docker compose up -d
# Wait ~3s, then verify:
curl -s http://localhost:3000/<resource>
```
