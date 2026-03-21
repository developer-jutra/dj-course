# CargoLoadPlan — PostgreSQL DDL + implementacje

## 1. Tabele

Dwie encje z `id` w module: `CargoLoadPlan` i `PalletUnit`. Tylko te wymagają tabel.
Wszystkie tabele żyją w schemacie `cargo_plans` (nie `public`).

### `cargo_plans.cargo_load_plans`

```sql
CREATE SCHEMA IF NOT EXISTS cargo_plans;

CREATE TABLE cargo_plans.cargo_load_plans (
  id           UUID         PRIMARY KEY,
  trailer_type TEXT         NOT NULL,        -- klucz rejestru: 'standard-curtainside' | 'mega' | 'reefer'
  status       TEXT         NOT NULL DEFAULT 'DRAFT',   -- 'DRAFT' | 'FINALIZED'
  current_ldm  NUMERIC(5,2) NOT NULL DEFAULT 0,
  version      INTEGER      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
```

### `cargo_plans.cargo_load_plan_units`

```sql
CREATE TABLE cargo_plans.cargo_load_plan_units (
  id                        UUID          PRIMARY KEY,
  load_plan_id              UUID          NOT NULL
                              REFERENCES cargo_plans.cargo_load_plans(id) ON DELETE CASCADE,
  pallet_type               TEXT          NOT NULL,   -- klucz rejestru: 'epal1' | 'industrial' | 'half' | 'cp1' | 'cp3' | 'h1'
  cargo_type                TEXT          NOT NULL,   -- 'FOOD' | 'CHEMICAL' | 'ELECTRONICS' | 'ADR' | 'GENERAL'
  weight_kg                 NUMERIC(10,2) NOT NULL,
  cargo_height_mm           INTEGER       NOT NULL,   -- cargoHeightMm z konstruktora PalletUnit; totalHeightMm = spec.height + cargo_height_mm
  is_temperature_controlled BOOLEAN       NOT NULL DEFAULT false,
  requires_side_loading     BOOLEAN       NOT NULL DEFAULT false,
  is_bulk                   BOOLEAN       NOT NULL DEFAULT false,
  high_security_required    BOOLEAN       NOT NULL DEFAULT false
);
```

### Indexes

```sql
CREATE INDEX idx_cargo_load_plan_units_load_plan_id ON cargo_plans.cargo_load_plan_units(load_plan_id);
CREATE INDEX idx_cargo_load_plans_status ON cargo_plans.cargo_load_plans(status);
```

**Dlaczego te, nie inne:**
- `load_plan_id` — zawsze używane w WHERE przy pobieraniu/usuwaniu jednostek dla planu
- `status` — potrzebny gdy np. filtrujemy po DRAFT / FINALIZED (np. w przyszłym listowaniu)

---

## 2. INSERTy — pełny flow

Flow: `createLoadPlan` → `addCargo` (x2) → `finalize`

```sql
-- === KROK 1: createLoadPlan (trailer: standard-curtainside) ===
-- save() z version=0 → INSERT, wersja w DB = 1
INSERT INTO cargo_plans.cargo_load_plans (id, trailer_type, status, current_ldm, version)
VALUES ('a1b2c3d4-0000-0000-0000-000000000001', 'standard-curtainside', 'DRAFT', 0.00, 1);

-- === KROK 2: addCargo (EPAL 1, FOOD, 500kg) ===
-- findById → version=1; save() → UPDATE WHERE version=1, version staje się 2; DELETE+INSERT units
UPDATE cargo_plans.cargo_load_plans
   SET current_ldm = 1.20, version = version + 1
 WHERE id = 'a1b2c3d4-0000-0000-0000-000000000001' AND version = 1;

INSERT INTO cargo_plans.cargo_load_plan_units
  (id, load_plan_id, pallet_type, cargo_type, weight_kg, cargo_height_mm,
   is_temperature_controlled, requires_side_loading, is_bulk, high_security_required)
VALUES
  ('u0000000-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'epal1', 'FOOD', 500.00, 1000, false, false, false, false);

-- === KROK 3: addCargo (EPAL-6, FOOD, 300kg) ===
-- findById → version=2; save() → DELETE+INSERT wszystkich units
UPDATE cargo_plans.cargo_load_plans
   SET current_ldm = 2.40, version = version + 1
 WHERE id = 'a1b2c3d4-0000-0000-0000-000000000001' AND version = 2;

DELETE FROM cargo_plans.cargo_load_plan_units WHERE load_plan_id = 'a1b2c3d4-0000-0000-0000-000000000001';

INSERT INTO cargo_plans.cargo_load_plan_units
  (id, load_plan_id, pallet_type, cargo_type, weight_kg, cargo_height_mm,
   is_temperature_controlled, requires_side_loading, is_bulk, high_security_required)
VALUES
  ('u0000000-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'epal1', 'FOOD', 500.00, 1000, false, false, false, false),
  ('u0000000-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001',
   'half', 'FOOD', 300.00,  800, false, false, false, false);

-- === KROK 4: finalize() ===
-- findById → version=3; save() → status FINALIZED, version=4
UPDATE cargo_plans.cargo_load_plans
   SET status = 'FINALIZED', version = version + 1
 WHERE id = 'a1b2c3d4-0000-0000-0000-000000000001' AND version = 3;
```

> `version` w agregacie to "wersja przy ostatnim załadowaniu z DB". `save()` zawsze inkrementuje po
> stronie DB. Przy `ON CONFLICT … WHERE cargo_load_plans.version = $currentVersion` → 0 wierszy =
> OptimisticLockError.

---

## 3. Implementacja `cargo-load-plan.repository.ts`

Plik: `tms-api/src/cargo-plans/cargo-load-plans/cargo-load-plan.repository.ts`

Zachowujemy istniejący interfejs `CargoLoadPlanRepository`. Dodajemy klasę `SqlCargoLoadPlanRepository`.

**`save()`** — kluczowe SQLe:

```typescript
// INSERT ON CONFLICT z optimistic lock — obsługuje i nowy plan (INSERT) i update (DO UPDATE)
const result = await this.db.query(
  `INSERT INTO cargo_plans.cargo_load_plans (id, trailer_type, status, current_ldm, version)
   VALUES ($1, $2, $3, $4, 1)
   ON CONFLICT (id) DO UPDATE
     SET trailer_type = EXCLUDED.trailer_type,
         status       = EXCLUDED.status,
         current_ldm  = EXCLUDED.current_ldm,
         version      = cargo_load_plans.version + 1
   WHERE cargo_load_plans.version = $5
   RETURNING id`,
  [id, trailerKey, status, currentLdm, version]
);
if (result.rowCount === 0) throw new OptimisticLockError(...);

// Replace units (DELETE + INSERT)
await this.db.query('DELETE FROM cargo_plans.cargo_load_plan_units WHERE load_plan_id = $1', [id]);
// ...batch INSERT wszystkich unitów
```

**Nota krytyczna — odwrotne mapowanie kluczy:**
`trailer.type` w snapshottcie to string `'Standard Curtainside'`, ale DB przechowuje klucz rejestru
`'standard-curtainside'`. Podobnie `unit.spec.label` to `'EPAL 1'` a nie `'epal1'`. Implementacja
potrzebuje dwóch prywatnych map:

```typescript
private readonly TRAILER_KEYS: Record<string, string> = {
  'Standard Curtainside': 'standard-curtainside',
  'Mega Trailer': 'mega',
  'Reefer': 'reefer',
};

private readonly PALLET_KEYS: Record<string, string> = {
  'EPAL 1': 'epal1', 'ISO-2': 'industrial', 'EPAL-6': 'half',
  'CP1': 'cp1', 'CP-3': 'cp3', 'H1': 'h1',
};
```

**`findById()`** — rekonstrukcja agregatu:

```typescript
const trailer = TrailerFactory.fromType(p.trailer_type);         // z klucza rejestru
const spec    = PalletSpec.fromType(u.pallet_type);              // z klucza rejestru
const unit    = new PalletUnit(u.id, spec, u.cargo_type, requirements,
                  Weight.from(u.weight_kg, 'KG'), u.cargo_height_mm);
return new CargoLoadPlan(p.id, trailer, p.current_ldm, units, p.status, p.version);
```

---

## 4. Implementacja `cargo-load-plan.queries.ts` (read side)

Plik: `tms-api/src/cargo-plans/cargo-load-plans/cargo-load-plan.queries.ts`

Istniejące eksporty (`CargoLoadPlanDbRow`, `CargoLoadPlanReadModel`, interfejs `CargoLoadPlanQueries`,
`toReadModel`) pozostają bez zmian. Dodajemy klasę `SqlCargoLoadPlanQueries`.

**`getById()`** — jedno zapytanie z `json_agg` (spójne z wzorcem `getDriverById`):

```sql
SELECT
  p.id, p.trailer_type, p.status, p.current_ldm, p.version,
  COALESCE(
    json_agg(json_build_object(
      'id',                        u.id,
      'pallet_type',               u.pallet_type,
      'cargo_type',                u.cargo_type,
      'weight_kg',                 u.weight_kg,
      'cargo_height_mm',           u.cargo_height_mm,
      'is_temperature_controlled', u.is_temperature_controlled,
      'requires_side_loading',     u.requires_side_loading,
      'is_bulk',                   u.is_bulk,
      'high_security_required',    u.high_security_required
    )) FILTER (WHERE u.id IS NOT NULL),
    '[]'
  ) AS units
FROM cargo_plans.cargo_load_plans p
LEFT JOIN cargo_plans.cargo_load_plan_units u ON u.load_plan_id = p.id
WHERE p.id = $1
GROUP BY p.id
```

Wynik mapujemy na `CargoLoadPlanDbRow` (klucze rejestru → labels via `PalletSpec.fromType`,
`totalHeightMm = spec.height + cargo_height_mm`) i przekazujemy do istniejącego `toReadModel(row, weightUnit)`.

---

## 5. Sugestia: co jeszcze powinno być w bazie (schemat `cargo_plans`?)

Poniższe koncepty z modułu to obecnie **dane statyczne w kodzie** (rejestry w `TrailerFactory` i
`PalletSpec`). Kandydaci do wyniesienia do DB jeśli chcemy:

- **`cargo_plans.trailer_specs`** — typy naczep z wymiarami; przydatne gdy flota jest konfigurowalna
  (np. nowa naczepa nienazwana w kodzie). Klucze: `id/type_key`, `display_name`, `max_ldm`,
  `width_mm`, `height_mm`, `max_weight_kg` + boolean capabilities
- **`cargo_plans.pallet_specs`** — definicje typów palet; przydatne gdy specyfikacje się zmieniają
  lub zależy nam na audycie. Klucze: `type_key`, `label`, `material`, `width_mm`, `length_mm`,
  `height_mm`, `max_load_kg`, lista `allowed_cargo_types` (osobna tabela relacyjna lub text[])

Obie tabele to **lookup tables** / dane konfiguracyjne — nie mają operacji domenowych, tylko czysty
CRUD. Ich wartość pojawia się gdy:
1. Nowe typy dodajemy bez deploymentu kodu
2. Chcemy historię zmian specyfikacji (np. `valid_from` / `valid_to`)
3. Różne środowiska (prod vs test) mają różne konfiguracje
