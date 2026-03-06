# Python to TypeScript Routes Porting Plan

## Overview

Port all routes from `tms-api-py` (Flask) to `tms-api` (Express/TypeScript), using PostgreSQL where applicable instead of in-memory mock data.

---

## Existing tms-api Endpoints Verification

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/health` | GET | **KEEP** | Health check for orchestration/monitoring. Python has no equivalent. |
| `/vehicles` | GET | **KEEP** | Fetches from DB. Python has same (in-memory). |
| `/vehicles/:id` | GET | **KEEP** | Fetches from DB. Python has same. |
| `/transportation-orders` | GET | **KEEP** | TMS-specific, not in Python. Valuable for order management. |
| `/drivers` | GET | **KEEP** | Fetches from DB. Python has same. |

**Conclusion:** All existing endpoints remain. We add new endpoints from Python.

---

## Route-by-Route Porting Plan

### 1. index.py → Index/Uptime Endpoint

**Python:** `GET /` - Returns server uptime as plain text.

**TypeScript:** Add `GET /` to router.

| Aspect | Python | TypeScript |
|--------|--------|------------|
| Path | `/` | `/` |
| Response | Plain text with uptime | Plain text (same format) |
| Data | In-memory `start_time` | Module-level `startTime` |

**Implementation:** Store `Date` at server start, compute diff on each request.

---

### 2. drivers.py → Drivers Routes

**Python endpoints:**
- `GET /api/drivers` - All drivers (in-memory)
- `POST /api/drivers` - Create driver (in-memory)
- `GET /api/drivers/<id>` - Driver by ID (in-memory)

**tms-api current:** `GET /drivers` (DB) ✓

**TypeScript additions:**
- `GET /drivers/:id` - Driver by ID (DB)
- `POST /drivers` - Create driver (DB)

**Schema mapping:** Python uses `{id, name, license_id}`. DB uses `{id, first_name, last_name, email, phone, contract_type, status}`. We use DB schema for POST.

---

### 3. vehicles.py → Vehicles Routes

**Python endpoints:**
- `GET /api/vehicles` - All vehicles ✓ (exists)
- `POST /api/vehicles` - Create vehicle
- `GET /api/vehicles/<id>` - Vehicle by ID ✓ (exists)
- `PUT /api/vehicles/<id>` - Update vehicle
- `DELETE /api/vehicles/<id>` - Delete vehicle

**TypeScript additions:**
- `POST /vehicles` - Create vehicle (DB)
- `PUT /vehicles/:id` - Update vehicle (DB)
- `DELETE /vehicles/:id` - Delete vehicle (DB)

**DB schema:** `vehicles(id, make, model, year, fuel_tank_capacity)`

---

### 4. notifications.py → Notifications Route

**Python:** `GET /api/notifications` - Mock notification list.

**TypeScript:** Add `GET /notifications` with same mock data (no DB table exists).

---

## Path Convention

- **Python:** `/api/drivers`, `/api/vehicles`, etc.
- **tms-api:** `/drivers`, `/vehicles`, etc. (no `/api` prefix)

We keep tms-api convention for consistency with existing routes.

---

## Implementation Order

1. **index** - Simple, no dependencies
2. **drivers** - Add GET/:id, POST; extend database.ts
3. **vehicles** - Add POST, PUT, DELETE; extend database.ts
4. **notifications** - Mock data only

---

## Database Functions to Add

**database.ts:**
- `getDriverById(id)` - SELECT driver by id
- `createDriver(data)` - INSERT driver, return created row
- `createVehicle(data)` - INSERT vehicle, return created row
- `updateVehicle(id, data)` - UPDATE vehicle by id
- `deleteVehicle(id)` - DELETE vehicle by id

For `createDriver`/`createVehicle`, we need ID generation. DB uses explicit IDs. Options:
- Use `SELECT max(id)+1` (simple, race-condition risk)
- Use SERIAL/sequence (requires schema change)
- Use `RETURNING` with explicit next-id query

For minimal changes, we'll use a subquery to get next ID: `(SELECT COALESCE(MAX(id), 0) + 1 FROM drivers)`.

---

## Implementation Complete ✓

All routes have been ported. Summary:

| Route | Method | Status |
|-------|--------|--------|
| `/` | GET | ✓ Uptime |
| `/health` | GET | ✓ Kept |
| `/vehicles` | GET | ✓ Kept |
| `/vehicles` | POST | ✓ Added |
| `/vehicles/:id` | GET | ✓ Kept |
| `/vehicles/:id` | PUT | ✓ Added |
| `/vehicles/:id` | DELETE | ✓ Added |
| `/drivers` | GET | ✓ Kept |
| `/drivers` | POST | ✓ Added |
| `/drivers/:id` | GET | ✓ Added |
| `/notifications` | GET | ✓ Added |
| `/transportation-orders` | GET | ✓ Kept |
