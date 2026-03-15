---
name: type-express-endpoints
description: Types Express route handlers in this project using generated contract namespaces (e.g. Drivers, Vehicles). Use when the user asks to type an Express endpoint, add TypeScript types to a route handler, or type request/response params in a *.routes.ts file.
---

# Typing Express endpoints

## Where types come from

| File | What's in it |
|------|-------------|
| `src/types/data-contracts.ts` | Shared models: `ErrorResponse`, entity interfaces (`DriverListItem`, etc.) — symlink to `contract/types/data-contracts.ts` |
| `src/types/<Domain>Route.ts` | Per-domain namespaces with `RequestParams`, `ResponseBody`, `RequestBody`, `RequestQuery` — symlink to `contract/types/<Domain>Route.ts` |

## Pattern

Always provide all four generic parameters to `Request`. Never use `{}` or omit parameters.

```ts
import { ErrorResponse } from '../types/data-contracts';
import { Drivers } from '../types/DriversRoute';

router.get('/', async (
  req: Request<
    Drivers.GetDrivers.RequestParams,
    Drivers.GetDrivers.ResponseBody | ErrorResponse,
    Drivers.GetDrivers.RequestBody,
    Drivers.GetDrivers.RequestQuery
  >,
  res: Response<Drivers.GetDrivers.ResponseBody | ErrorResponse>,
) => { ... });
```

## Rules

- `Request<Params, ResBody, ReqBody, Query>` — all four, always.
- `res: Response<SuccessBody | ErrorResponse>` — always union with `ErrorResponse`.
- Namespace comes from `src/types/<Domain>Route.ts`, e.g. `Drivers`, `Vehicles`, `Customers`.
- Operation name matches the route method, e.g. `GetDrivers`, `CreateDriver`, `GetDriverById`.
- `ErrorResponse` always from `../types/data-contracts`.
- If `RequestBody` is `never` (GET), it still appears in `Request<>` explicitly.
- **Do not define local types** for `RequestQuery`, `RequestBody`, `ResponseBody` — use contract types. Local duplicates (e.g. `GetCustomersHttpQuery`, `CustomerListItemResponse`, `PatchCustomerHttpBody`) are redundant. Use `Customers.GetCustomers.RequestQuery`, `Customers.GetCustomers.ResponseBody`, `Customers.PatchCustomer.RequestBody`, etc. `req.body` is already typed via `Request<>` generics — no cast needed.
