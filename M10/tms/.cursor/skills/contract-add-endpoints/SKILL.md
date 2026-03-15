---
name: contract-add-endpoints
description: Adds or updates endpoints in the OpenAPI contract based on the running API. Analyzes route files, DTO schemas, and real HTTP responses for each endpoint variant. Use when the user asks to add endpoints to the OpenAPI spec, update the contract, document a new route, or generate OpenAPI definitions from a running Express/Node API.
---

# Add Endpoints to OpenAPI Contract

## Contract structure (split by entities)

Kontrakt jest rozdzielony na wiele plików. Są **2 pliki YAML w `contract/`** oraz **pliki encji przy kodzie** w `src/`:

| Plik | Rola |
|------|------|
| **`contract/entry.yaml`** | Źródło – shared components (parameters, responses, Pagination, ErrorResponse), `tags`, oraz `$ref` do paths w plikach encji. **Edytuj ten plik** gdy dodajesz shared components lub nową encję. |
| **`contract/openapi.yaml`** | Wynik bundlingu – jeden pełny plik bez zewnętrznych `$ref`. **Generowany** przez `npm run contract:bundle` – nie edytuj ręcznie. Używany przez Swagger UI, generatory typów, orval. |

| Plik encji | Zawartość |
|------------|-----------|
| **`src/<domain>/<domain>-openapi.yaml`** | Paths + schematy domenowe dla danej encji (np. `src/drivers/drivers-openapi.yaml`). Odwołuje się do shared przez `$ref: '../../contract/entry.yaml#/components/...'`. **Edytuj ten plik** gdy dodajesz endpointy do istniejącej encji. |

**Przepływ bundlingu:**
```
entry.yaml + src/*/...-openapi.yaml  ──[redocly bundle]──>  openapi.yaml
```

**Podgląd dokumentacji:** `npm run contract:serve` – uruchamia `scripts/serve-contract.js` ( bundle + minimalna Express + Swagger UI na porcie **3030**). Otwórz http://localhost:3030/api-docs.

**Nowa encja:** Dodaj `$ref` w `contract/entry.yaml` (paths) oraz utwórz `src/<domain>/<domain>-openapi.yaml` z paths i schemas. Shared components pozostają w `entry.yaml`.

## Workflow

### 1. Read the implementation

Read in order:
1. `src/<domain>/<domain>.routes.ts` – all endpoints, HTTP methods, status codes, error branches
2. `src/<domain>/<domain>.dto.ts` – Zod schemas (request body, response shapes)
3. `src/drizzle/schema.ts` – Drizzle column types (especially `decimal`/`numeric` → returned as `string` by pg driver)
4. `src/shared/pagination.types.ts` – if the endpoint is paginated

### 2. Make real HTTP requests

For **every** endpoint, run actual requests against the running Docker API (`http://localhost:3000`).

Cover all response variants that the implementation produces. The list below is illustrative – actual status codes depend on the implementation (may include 401, 403, 409, 422, 503, etc.):

| Variant | How to trigger |
|---|---|
| 2xx (200, 201, 204, …) | Valid request |
| 400 | Missing required field / wrong type in body |
| 404 | ID that doesn't exist (e.g. `99999`) |
| 5xx | Usually not triggerable manually – document from code |

```bash
# List with pagination
curl -s "http://localhost:3000/<resource>?page=1&limit=5" | jq .

# Single resource
curl -s http://localhost:3000/<resource>/1 | jq .

# 404
curl -s http://localhost:3000/<resource>/99999 | jq .

# POST – happy path
curl -s -X POST http://localhost:3000/<resource> \
  -H "Content-Type: application/json" \
  -d '{ <valid body> }' | jq .

# POST – validation error (400)
curl -s -X POST http://localhost:3000/<resource> \
  -H "Content-Type: application/json" \
  -d '{ <missing required field> }' | jq .

# PUT – update
curl -s -X PUT http://localhost:3000/<resource>/1 \
  -H "Content-Type: application/json" \
  -d '{ <body> }' | jq .

# DELETE – check status code only
curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3000/<resource>/1

# DELETE – 404
curl -s -X DELETE http://localhost:3000/<resource>/99999 | jq .
```

### 3. Build OpenAPI definitions from real responses

Use actual JSON responses as `example` values. Never invent example data.

Key rules:
- `decimal`/`numeric` Drizzle columns → OpenAPI type `string` (pg driver serialises them, e.g. `"51.1"`)
- Nullable Drizzle columns → `nullable: true` in OpenAPI
- `DELETE 204` → no `content` block in the response
- **400 responses** → no `example`; write a logical `description` explaining that the payload has an invalid structure or missing/invalid fields (do NOT quote the specific Zod error message)
- **5xx responses** → use `$ref: "#/components/responses/InternalServerError"` (reusable)

### 4. Use reusable components

Before writing inline definitions, check `components` for existing reusable entries:

```yaml
components:
  parameters:
    PageParam:       # ?page= query param
    LimitParam:      # ?limit= query param
    PathIdParam:     # /{id} path param (generic integer id)

  responses:
    InternalServerError:   # 500 – reused by all endpoints

  schemas:
    Pagination:      # pagination metadata object
    ErrorResponse:   # { error: string }
```

Reference them instead of repeating inline. **In `contract/entry.yaml`** (when referencing from within entry), use internal refs:

```yaml
parameters:
  - $ref: "#/components/parameters/PageParam"
  - $ref: "#/components/parameters/LimitParam"

responses:
  "500":
    $ref: "#/components/responses/InternalServerError"
```

**In entity files** (`src/<domain>/<domain>-openapi.yaml`), shared components live in `contract/entry.yaml` – reference them via external `$ref`:

```yaml
$ref: '../../contract/entry.yaml#/components/parameters/PageParam'
$ref: '../../contract/entry.yaml#/components/responses/InternalServerError'
$ref: '../../contract/entry.yaml#/components/schemas/ErrorResponse'
$ref: '../../contract/entry.yaml#/components/schemas/Pagination'
```

### 5. Add to the entity file in `src/<domain>/<domain>-openapi.yaml`

**Do not edit `contract/openapi.yaml`** – it is generated. Edit the entity file next to the code.

Structure of `src/<domain>/<domain>-openapi.yaml`:

```yaml
paths:
  /<resource>:
    get: ...
    post: ...
  /<resource>/{id}:
    get: ...
    put: ...
    delete: ...

components:
  schemas:
    <Resource>:             # select schema (single item)
    <Resource>ListResponse: # paginated list (references Pagination via $ref to entry.yaml)
    <Resource>CreateInput:  # POST body
    <Resource>UpdateInput:  # PUT body (partial)
```

- Parameters, responses, Pagination, ErrorResponse → use `$ref` to `../../contract/entry.yaml#/components/...`
- Domain-specific schemas → define locally in `components/schemas` of the entity file

Every operation must have:
- `operationId` (camelCase, e.g. `getVehicleById`)
- `tags` referencing the domain tag (e.g. `Drivers`, `Customers`, `Vehicles`)
- `summary` (one line)
- All status codes documented with `schema` + `example` (except 400 and 5xx – no example)

**Adding a new domain/entity:** create `src/<domain>/<domain>-openapi.yaml` and add path entries in `contract/entry.yaml`:

```yaml
paths:
  /<resource>:
    $ref: '../src/<domain>/<domain>-openapi.yaml#/paths/~1<resource>'
  /<resource>/{id}:
    $ref: '../src/<domain>/<domain>-openapi.yaml#/paths/~1<resource>~1{id}'
```

Also add the tag in `contract/entry.yaml` if the domain is new.

### 6. Bundle, preview, and validate

**Bundle** – merges `entry.yaml` + entity files into `contract/openapi.yaml` (run automatically by `generate:types` and `contract:serve`):

```bash
cd tms-api && npm run contract:bundle
```

**Preview** – serve Swagger UI on port 3030 to verify the contract visually:

```bash
cd tms-api && npm run contract:serve
```

Opens `http://localhost:3030/api-docs`. The script bundles the contract before serving.

**Validate** – run from `tms-api`:

| Check | Command |
|-------|---------|
| Lint source (entry + entity files) | `npm run contract:lint` |
| Lint bundled output | `npm run contract:validate:minimal` |
| Full Redocly lint (stricter) | `npm run contract:validate` |

- `contract:lint` → validates `contract/entry.yaml` (and refs to entity files)
- `contract:validate:minimal` → validates `contract/openapi.yaml` (bundled output)

**Dependencies:** `js-yaml`, `@redocly/cli`, `swagger-ui-express`, `express`. Run `npm install` in `tms-api` if needed.

## Common pitfalls

- **Never edit `contract/openapi.yaml`** – it is generated by bundle. Edit `contract/entry.yaml` (shared) or `src/<domain>/<domain>-openapi.yaml` (entity paths + schemas).
- `tags` at root level, not inside `components`
- `exclusiveMinimum: true` for positive-only numbers (OpenAPI 3.0 syntax)
- Pagination query params (`page`, `limit`) modelled as `in: query`, not in request body
- `nullable: true` required for optional Drizzle columns; omitting it causes false schema violations
- 400 `description` must be logical (e.g. "payload has invalid structure"), not a copy of a specific error message
- 500 must always use `$ref: "#/components/responses/InternalServerError"`, never inline
