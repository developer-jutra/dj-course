---
name: analyze-errors
description: Classifies and refactors error handling in this TMS codebase: decides when errors should be plain value objects (domain/application layer) vs instances of Error (infrastructure, unexpected, or input-validation guards). Generates the correct before/after transformation for domain errors, application service errors, and infrastructure errors. Use when the user asks to refactor errors, add a new error class, review error handling patterns, or when reviewing any *.errors.ts, *-service.ts, or *.routes.ts files.
---

# Analyze & Classify Errors

## Why this matters

Two categories of "errors" exist in this codebase and they have fundamentally different semantics:

| Category | Meaning | Correct representation |
|---|---|---|
| **Expected outcome** | A business rule was violated or a requested resource doesn't exist — a normal part of the domain's language | **Plain value object** — no `extends Error`, no stack trace |
| **Unexpected failure** | Infrastructure broke, programmer made a bad call, or data is corrupt — something truly exceptional | **`extends Error`** — captured in `try/catch`, propagated as exception |

Using `extends Error` for expected outcomes wastes stack-trace allocation, misleads readers ("why is this throwable if it's never thrown?"), and blocks TypeScript's exhaustive union checking.

---

## Decision map

When you encounter or create an error class, classify it:

| Question | Yes → | No → |
|---|---|---|
| Is this a known business rule violation the caller must handle? | Plain value object | Continue ↓ |
| Is this triggered by bad user input validated at the HTTP boundary? | `extends Error` — last-resort guard after route validation | Continue ↓ |
| Is this an infrastructure failure (DB concurrency, network, corrupt state)? | `extends Error` — thrown, caught in service | Continue ↓ |
| Is this a programmer error / configuration mistake? | `throw new Error(...)` inline — crash early | — |

---

## Layer-by-layer patterns

### Domain layer (`*.errors.ts`)

Business rules return `Result<T, DomainError>`. The error is a value, never thrown.

**Before:**
```typescript
export class WeightCapacityExceededError extends Error {
  constructor(actualKg: number, maxKg: number) {
    super(`Weight capacity exceeded: ${actualKg}kg > ${maxKg}kg`);
    this.name = 'WeightCapacityExceededError';
  }
}
```

**After:**
```typescript
export class WeightCapacityExceededError {
  readonly kind = 'WeightCapacityExceededError' as const;
  readonly message: string;
  constructor(readonly actualKg: number, readonly maxKg: number) {
    this.message = `Weight capacity exceeded: ${actualKg}kg > ${maxKg}kg`;
  }
}
```

Rules:
- Remove `extends Error` and the `super(...)` / `this.name` boilerplate.
- Add `readonly kind = 'ClassName' as const` — this is the discriminant for switch/exhaustive checks.
- Add `readonly message: string` (computed in constructor) when the message depends on parameters; use `readonly message = '...'` (literal) for parameter-less errors.
- Keep constructor parameters as `readonly` properties if they carry domain data useful to callers.
- The union type (`CargoLoadPlanDomainError`) stays unchanged.

---

### Application (service) layer (`*-service.ts`)

"Not found" and similar application-level expected outcomes are also plain value objects.

**Before:**
```typescript
export class LoadPlanNotFoundError extends Error {
  constructor(id: string) {
    super(`Load plan '${id}' not found`);
    this.name = 'LoadPlanNotFoundError';
  }
}

export { UnknownTrailerTypeError, UnknownPalletTypeError };

export type CargoPlanServiceError =
  | LoadPlanNotFoundError
  | UnknownTrailerTypeError
  | UnknownPalletTypeError
  | Error;          // ← catch-all blocks exhaustive checking
```

**After:**
```typescript
export class LoadPlanNotFoundError {
  readonly kind = 'LoadPlanNotFoundError' as const;
  readonly message: string;
  constructor(readonly id: string) {
    this.message = `Load plan '${id}' not found`;
  }
}

// Input-validation errors removed — validated in routes before reaching service.
// Error catch-all removed — TypeScript can now exhaustively check all cases.
export type CargoPlanServiceError =
  | LoadPlanNotFoundError
  | CargoLoadPlanDomainError
  | OptimisticLockError;
```

When cleaning up the service methods:
- Remove `try/catch` around domain calls that no longer throw (e.g. `addCargo()` after palletType is validated in routes).
- Keep `try/catch` only around infrastructure calls (`repository.save()`, external APIs) that throw real exceptions.
- Simplify `normalizeError` to handle only the infrastructure exception(s):

```typescript
private normalizeError(e: unknown): OptimisticLockError {
  if (e instanceof OptimisticLockError) return e;
  throw e; // unexpected — let it propagate
}
```

---

### Infrastructure layer (`optimistic-lock-error.ts`, repository throws)

Infrastructure errors remain `extends Error` — they represent unexpected failures, not expected outcomes.

```typescript
// Stays as-is — correct pattern
export class OptimisticLockError extends Error {
  constructor(entityName: string, id: string, expectedVersion: number, actualVersion: number) {
    super(`Optimistic lock failure for ${entityName} ${id}: expected v${expectedVersion}, found v${actualVersion}.`);
    this.name = 'OptimisticLockError';
  }
}
```

---

### HTTP layer (`*.routes.ts`)

**Input validation errors** (bad user input, unknown enum values) belong in the routes — validated *before* the service is called. The factory/spec `throw` becomes a last-resort defensive guard, not the primary path.

```typescript
// Validate before calling service
if (!palletType || !PalletSpec.allowedTypes().includes(palletType)) {
  return res.status(400).json({
    error: `Unknown palletType: '${palletType}'. Allowed: ${PalletSpec.allowedTypes().join(', ')}`,
  });
}
```

**Error handling** uses `instanceof` for real exceptions (`OptimisticLockError extends Error`) and an exhaustive `switch` on `kind` for value-object errors. No default case — TypeScript enforces exhaustiveness.

**Before:**
```typescript
function handleResultError(res, err: unknown, context: string) {
  const error = err as Error;
  if (err instanceof OptimisticLockError) return res.status(409).json({ error: error.message });
  if (err instanceof LoadPlanNotFoundError) return res.status(404).json({ error: error.message });
  if (err instanceof UnknownTrailerTypeError || err instanceof UnknownPalletTypeError)
    return res.status(400).json({ error: error.message });
  return res.status(400).json({ error: error.message }); // silent fallback
}
```

**After:**
```typescript
function handleResultError(
  res: Response,
  err: CargoPlanServiceError, // typed — no more `unknown`
  context: string
): Response<ErrorResponse> {
  if (err instanceof OptimisticLockError) {
    logger.warn(context, { error: err.message });
    return res.status(409).json({ error: err.message });
  }
  switch (err.kind) {
    case 'LoadPlanNotFoundError':    return res.status(404).json({ error: err.message });
    case 'CargoUnitNotFoundError':  return res.status(404).json({ error: err.message });
    case 'PlanAlreadyFinalizedError':       return res.status(409).json({ error: err.message });
    case 'IncompatibleCargoColoadingError': return res.status(409).json({ error: err.message });
    case 'EmptyPlanError':                  return res.status(422).json({ error: err.message });
    case 'WeightCapacityExceededError':     return res.status(422).json({ error: err.message });
    case 'LdmCapacityExceededError':        return res.status(422).json({ error: err.message });
    case 'CargoTooTallForTrailerError':     return res.status(422).json({ error: err.message });
    case 'TrailerCapabilityMismatchError':  return res.status(422).json({ error: err.message });
    // No default — TypeScript verifies all cases are covered
  }
}
```

---

## Checklist when adding a new error

1. Classify using the decision map above.
2. If plain value object: add `kind`, `message`, remove `extends Error`.
3. Add the new class to the appropriate union type (`CargoLoadPlanDomainError`, `CargoPlanServiceError`, etc.).
4. Add a new `case` to `handleResultError` — TypeScript will warn if you forget (no `default`).
5. If it's an input validation error: add route-level guard *before* calling the service.
