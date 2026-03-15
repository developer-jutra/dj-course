---
name: create-or-update-endpoint
description: "Creates a new REST endpoint or updates an existing one in the TMS API. Covers the full workflow: OpenAPI contract (YAML), entry.yaml registration, contract bundling, TypeScript type generation, and typed Express route handler. Use when the user asks to add an endpoint, create a route, update the API contract, document a new route, or implement a REST handler in tms-api."
---

# Create or Update Endpoint in TMS API

## Workflow (always follow this order)

### 1. Define or update the endpoint in the OpenAPI YAML

Each domain has its own file: `src/<domain>/<domain>-openapi.yaml`.

Add or update the `paths` entry and any new `components/schemas` in that file.

**include if they're used:**
- `operationId` (camelCase, unique across the whole API)
- `tags` matching the domain namespace (e.g. `TransportationOrders`)
- `parameters` — reuse `$ref: '../../contract/entry.yaml#/components/parameters/PathIdParam'` for `{id}` path params
- `responses` — at minimum `200`/`201`, `400` (if body accepted), `404` (if path param used), `500` (always `$ref: '../../contract/entry.yaml#/components/responses/InternalServerError'`)
- Realistic `example` values on every response schema

**Request body schema** — add to `components/schemas` in the same domain YAML file.

---

### 2. Register the path in `contract/entry.yaml`

Every path must appear in `contract/entry.yaml` under `paths:`. Use `$ref` with tilde-encoded slashes:

```yaml
/transportation-orders/{id}/driver:
  $ref: '../src/transportation-orders/transportation-orders-openapi.yaml#/paths/~1transportation-orders~1{id}~1driver'
```

Rule: `/` → `~1`, `{` and `}` stay as-is.

---

### 3. Bundle the contract

```bash
npm run contract:bundle
```

This regenerates `contract/openapi.yaml` from `entry.yaml` and all domain YAMLs.
**Must be run before type generation** — the generator reads `contract/openapi.yaml`, not individual domain files.

---

### 4. Generate TypeScript types

```bash
npm run generate:types:swagger-typescript-api
```

This regenerates `contract/contract-types-swagger-typescript-api/` (symlinked as `src/types/`).

**Do not edit generated contract files by hand** (`contract/contract-types-swagger-typescript-api/*`, `src/types/*`). If types are missing or wrong, modify the OpenAPI YAML contract (steps 1–2) and re-run steps 3–4 (`npm run contract:bundle` then `npm run generate:types:swagger-typescript-api`) to regenerate.

After generation, verify the new namespace exists:
```bash
grep -A 5 "YourOperationName" src/types/<Domain>Route.ts
```

---

### 5. Implement the Express handler in `*.routes.ts`

Location: `src/<domain>/<domain>.routes.ts`

**Typing pattern** (always all four generics):

```ts
import { ErrorResponse } from '../types/data-contracts';
import { TransportationOrders } from '../types/TransportationOrdersRoute';

router.put('/:id/driver', async (
  req: Request<
    TransportationOrders.AssignDriverToOrder.RequestParams,
    TransportationOrders.AssignDriverToOrder.ResponseBody | ErrorResponse,
    TransportationOrders.AssignDriverToOrder.RequestBody,
    TransportationOrders.AssignDriverToOrder.RequestQuery
  >,
  res: Response<TransportationOrders.AssignDriverToOrder.ResponseBody | ErrorResponse>,
) => {
  // ...
});
```

**Rules:**
- `Request<Params, ResBody, ReqBody, Query>` — all four, always, even when `never`
- `res: Response<SuccessBody | ErrorResponse>` — always union with `ErrorResponse`
- Namespace: `src/types/<Domain>Route.ts` → e.g. `TransportationOrders`, `Drivers`, `Vehicles`
- Operation name matches `operationId` from the YAML, PascalCase (e.g. `assignDriverToOrder` → `AssignDriverToOrder`)
- Never define local types for `RequestQuery`, `RequestBody`, `ResponseBody` — always use the generated contract types
- `req.body` is already typed — no cast needed

**Logging pattern** (consistent with the rest of the codebase):
```ts
logger.info('Starting operation', { id: req.params.id });
// ... operation ...
logger.info('Operation completed', { id: req.params.id });
```

**Error handler:**
```ts
} catch (error: unknown) {
  const err = error as Error;
  logger.error('Failed to ...', { error: { message: err.message, stack: err.stack }, operation: 'operation_name' });
  res.status(500).json({ error: 'Failed to ...' });
}
```

---

### 6. Update the `.http` test file

After adding or modifying any endpoint, update `tms-api/.all.http` (or the relevant `.http` file) so it reflects the current state of the API.

---

## Quick reference: npm scripts

| Command | Purpose |
|---------|---------|
| `npm run contract:bundle` | Bundle `entry.yaml` → `contract/openapi.yaml` |
| `npm run contract:lint` | Lint `entry.yaml` |
| `npm run generate:types:swagger-typescript-api` | Generate TS types used by `src/types/` |

---

## Type file locations

| File | What's in it |
|------|-------------|
| `src/types/data-contracts.ts` | Shared models: `ErrorResponse`, entity interfaces |
| `src/types/<Domain>Route.ts` | Per-domain namespaces with `RequestParams`, `ResponseBody`, `RequestBody`, `RequestQuery` |

`src/types/` is a symlink to `contract/contract-types-swagger-typescript-api/`.
