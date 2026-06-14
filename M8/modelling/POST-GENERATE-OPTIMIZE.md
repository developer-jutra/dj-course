 1. Redundant indexes — delete these (instant wins)

  Two indexes that duplicate constraints already ithe
  schema:

  -- trailers.vehicle_id is declared UNIQUE → Postgres
  auto-creates a unique btree index.
  DROP INDEX idx_trailers_vehicle_id;   -- line 355

  -- spare_parts.oem_number is declared UNIQUE → same.
  DROP INDEX idx_spare_parts_oem_number; -- line 390

  Same pattern to watch for going forward: a columwith
   UNIQUE does not need a parallel CREATE INDEX.

  ---
  2. Missing index — spare_part_aliases.alias_number

  This table's entire purpose is reverse-lookup: "have
   a third-party catalog number, what's our OEM?" That
  query hits alias_number, which has no index. Every
  alias lookup will seq-scan.

  CREATE INDEX idx_spare_part_aliases_alias_number
    ON spare_part_aliases (alias_number);
  -- Or, if aliases should be globally unique:
  -- CREATE UNIQUE INDEX
  uq_spare_part_aliases_alias_number ...

  ---
  3. Replace single-column indexes with composites

  Several tables have two single-column indexes where                                                a
  composite serves both queries and the index-onlyscan
  path:

  Table: vehicle_documents
  Current: (vehicle_id) + (document_type)
  Better: (vehicle_id, document_type)
  ────────────────────────────────────────
  Table: vehicle_inspections
  Current: (vehicle_id) + (inspection_type) +
    (next_due_date)
  Better: (vehicle_id, inspection_type, next_due_date)                                               +

    keep (next_due_date) for fleet-wide "what's due
  next"
  ────────────────────────────────────────
  Table: policy_instalments
  Current: (policy_id) + (due_date)
  Better: (policy_id, due_date)
  ────────────────────────────────────────
  Table: tyre_swap_history
  Current: (vehicle_id) + (swap_date)
  Better: (vehicle_id, swap_date DESC) — DESC matches
    "show me the most recent swap"
  ────────────────────────────────────────
  Table: alerts
  Current: (vehicle_id) + (raised_at)
  Better: (vehicle_id, raised_at DESC)

  Single-column indexes aren't wrong, but a composite                                                of
   the two most common filter columns lets Postgredo
  an index-only scan and satisfy the ORDER BY in one
  shot.

  ---
  4. Partial indexes for skewed predicates

  Three places where queries will be filtered
  overwhelmingly to one value:

  -- "Open alerts" dashboard — most alerts are
  eventually 'archived';
  -- the live dashboard only ever queries 'pending'.
  DROP INDEX idx_alerts_status;
  CREATE INDEX idx_alerts_pending_by_raised
    ON alerts (raised_at DESC)
    WHERE status = 'pending';

  -- "Unpaid instalments" — once paid, the row is rarely
   queried.
  CREATE INDEX idx_policy_instalments_unpaid
    ON policy_instalments (due_date)
    WHERE paid_date IS NULL;

  -- Low-stock parts. Postgres can't index a row-level
  comparison directly,
  -- but you can use a generated column.
  ALTER TABLE spare_parts
    ADD COLUMN is_low_stock boolean
    GENERATED ALWAYS AS (stock_quantity <
  min_stock_threshold) STORED;

  CREATE INDEX idx_spare_parts_low_stock
    ON spare_parts (id)
    WHERE is_low_stock = true;

  The alert-status fix is the spectacular one — same
  pattern as idx_reservation_status_filter in the WMS
  schema we discussed earlier.

  ---
  5. JSONB on vehicles.specs — design trade-off you've
  already taken

  You moved 12 columns into one jsonb blob. Now:

  - GIN on the whole document is heavy. Default
  jsonb_ops is roughly 2–3× larger and slower to update
  than jsonb_path_ops. If you only need containment
  queries (specs @> '{"fuel_type": "diesel"}'), switch:

  DROP INDEX idx_vehicles_specs_gin;
  CREATE INDEX idx_vehicles_specs_gin
    ON vehicles USING GIN (specs jsonb_path_ops);
  - No statistics inside JSONB. Postgres has no
  histogram for specs->>'fuel_type', so the planner
  guesses cardinalities. Expect bad join orders once
  data grows.
  - No CHECK constraints inside JSONB. Things like
  power_kw > 0, gvm_kg > kerb_weight_kg, euro_normIN
  ('euro_3', ...) are lost.

  If you query by fuel_type / euro_norm regularly,hoist
   them back out of the JSONB into real columns (you                                                 can
   keep the JSONB for the long-tail spec fields). Hybrid
   pattern:

  ALTER TABLE vehicles
    ADD COLUMN vin                 varchar(17)
  GENERATED ALWAYS AS (specs->>'vin') STORED,
    ADD COLUMN registration_number varchar(20)
  GENERATED ALWAYS AS (specs->>'registration_number')
  STORED,
    ADD COLUMN fuel_type           text
  GENERATED ALWAYS AS (specs->>'fuel_type') STORED;

  Generated columns give you indexable,
  statistics-bearing, constraint-able columns while
  keeping the JSONB as the canonical source. The current
   partial unique indexes on specs->>'vin' etc. cathen
   be replaced with normal unique indexes on the
  generated columns (cheaper, faster).

  ---
  6. Data-integrity constraints that also help the
  planner

  Not strictly indexes, but every constraint givesthe
  planner more information:

  -- A vehicle has ONE current tyre per axle position.
  ALTER TABLE vehicle_tyres
    ADD CONSTRAINT uq_vehicle_tyres_axle
    UNIQUE (vehicle_id, axle_position);
  -- Bonus: the underlying unique index covers the
  (vehicle_id) lookup too,
  -- so you can DROP INDEX idx_vehicle_tyres_vehicle_id.

  -- Post-accident repairs must reference a damagecase.
  ALTER TABLE service_orders
    ADD CONSTRAINT chk_damage_case_required
    CHECK (repair_classification <> 'post_accident'
           OR damage_case_number IS NOT NULL);

  -- Insurance policy validity range must be non-empty.
  ALTER TABLE insurance_policies
    ADD CONSTRAINT chk_policy_dates
    CHECK (valid_from < valid_to);

  ---
  TL;DR priority order

  1. Drop the 2 redundant indexes (zero risk, instant
  win).
  2. Add the missing alias_number index (single missing
  index = full seq scan today).
  3. Convert idx_alerts_status and policy_instalments
  indexes to partial form (biggest performance cliff                                                 on
  real data).
  4. Decide whether to keep vehicles.specs as a full
  JSONB or hoist vin/registration/fuel_type into
  DROP INDEX idx_alerts_status;
  CREATE INDEX idx_alerts_pending_by_raised
    ON alerts (raised_at DESC)
    WHERE status = 'pending';

  -- "Unpaid instalments" — once paid, the row is
  rarely queried.
  CREATE INDEX idx_policy_instalments_unpaid
    ON policy_instalments (due_date)
    WHERE paid_date IS NULL;

  -- Low-stock parts. Postgres can't index a
  row-level comparison directly,
  -- but you can use a generated column.
  ALTER TABLE spare_parts
    ADD COLUMN is_low_stock boolean
    GENERATED ALWAYS AS (stock_quantity <
  min_stock_threshold) STORED;

  CREATE INDEX idx_spare_parts_low_stock
    ON spare_parts (id)
    WHERE is_low_stock = true;

  The alert-status fix is the spectacular one —
  same pattern as idx_reservation_status_filter in
  the WMS schema we discussed earlier.

  ---
  5. JSONB on vehicles.specs — design trade-off
  you've already taken

  You moved 12 columns into one jsonb blob. Now:

  - GIN on the whole document is heavy. Default
  jsonb_ops is roughly 2–3× larger and slower to
  update than jsonb_path_ops. If you only need
  containment queries (specs @> '{"fuel_type":
  "diesel"}'), switch:

  DROP INDEX idx_vehicles_specs_gin;
  CREATE INDEX idx_vehicles_specs_gin
    ON vehicles USING GIN (specs jsonb_path_ops);
  - No statistics inside JSONB. Postgres has no
  histogram for specs->>'fuel_type', so the planner
   guesses cardinalities. Expect bad join orders
  once data grows.
  - No CHECK constraints inside JSONB. Things like
  power_kw > 0, gvm_kg > kerb_weight_kg, euro_norm
  IN ('euro_3', ...) are lost.

  If you query by fuel_type / euro_norm regularly,
  hoist them back out of the JSONB into real
  columns (you can keep the JSONB for the long-tail
   spec fields). Hybrid pattern:

  ALTER TABLE vehicles
    ADD COLUMN vin                 varchar(17)
      GENERATED ALWAYS AS (specs->>'vin') STORED,
    ADD COLUMN registration_number varchar(20)
      GENERATED ALWAYS AS
  (specs->>'registration_number') STORED,
    ADD COLUMN fuel_type           text
      GENERATED ALWAYS AS (specs->>'fuel_type')
  STORED;

  Generated columns give you indexable,
  statistics-bearing, constraint-able columns while
   keeping the JSONB as the canonical source. The
  current partial unique indexes on specs->>'vin'
  etc. can then be replaced with normal unique
  indexes on the generated columns (cheaper,
  faster).

  ---
  6. Data-integrity constraints that also help the
  planner

  Not strictly indexes, but every constraint gives
  the planner more information:

  -- A vehicle has ONE current tyre per axle
  position.
  ALTER TABLE vehicle_tyres
    ADD CONSTRAINT uq_vehicle_tyres_axle
    UNIQUE (vehicle_id, axle_position);
  -- Bonus: the underlying unique index covers the
  (vehicle_id) lookup too,
  -- so you can DROP INDEX
  idx_vehicle_tyres_vehicle_id.

  -- Post-accident repairs must reference a damage
  case.
  ALTER TABLE service_orders
    ADD CONSTRAINT chk_damage_case_required
    CHECK (repair_classification <> 'post_accident'
           OR damage_case_number IS NOT NULL);

  -- Insurance policy validity range must be
  non-empty.
  ALTER TABLE insurance_policies
    ADD CONSTRAINT chk_policy_dates
    CHECK (valid_from < valid_to);

  ---
  TL;DR priority order

  1. Drop the 2 redundant indexes (zero risk,
  instant win).
  2. Add the missing alias_number index (single
  missing index = full seq scan today).
  euro_norm IN ('euro_3', ...) are lost.

  If you query by fuel_type / euro_norm
  regularly, hoist them back out of the JSONB
  into real columns (you can keep the JSONB for
  the long-tail spec fields). Hybrid pattern:

  ALTER TABLE vehicles
    ADD COLUMN vin                 varchar(17)
        GENERATED ALWAYS AS (specs->>'vin')
  STORED,
    ADD COLUMN registration_number varchar(20)
        GENERATED ALWAYS AS
  (specs->>'registration_number') STORED,
    ADD COLUMN fuel_type           text
        GENERATED ALWAYS AS (specs->>'fuel_type')
   STORED;

  Generated columns give you indexable,
  statistics-bearing, constraint-able columns
  while keeping the JSONB as the canonical
  source. The current partial unique indexes on
  specs->>'vin' etc. can then be replaced with
  normal unique indexes on the generated columns
  (cheaper, faster).

  ---
  6. Data-integrity constraints that also help
  the planner

  Not strictly indexes, but every constraint
  gives the planner more information:

  -- A vehicle has ONE current tyre per axle
  position.
  ALTER TABLE vehicle_tyres
    ADD CONSTRAINT uq_vehicle_tyres_axle
    UNIQUE (vehicle_id, axle_position);
  -- Bonus: the underlying unique index covers
  the (vehicle_id) lookup too,
  -- so you can DROP INDEX
  idx_vehicle_tyres_vehicle_id.

  -- Post-accident repairs must reference a
  damage case.
  ALTER TABLE service_orders
    ADD CONSTRAINT chk_damage_case_required
    CHECK (repair_classification <>
  'post_accident'
           OR damage_case_number IS NOT NULL);

  -- Insurance policy validity range must be
  non-empty.
  ALTER TABLE insurance_policies
    ADD CONSTRAINT chk_policy_dates
    CHECK (valid_from < valid_to);

  ---
  TL;DR priority order

  1. Drop the 2 redundant indexes (zero risk,
    CHECK (valid_from < valid_to);

  ---
  TL;DR priority order

  1. Drop the 2 redundant indexes (zero risk, instant win).
  2. Add the missing alias_number index (single missing index = full seq scan
  today).
  3. Convert idx_alerts_status and policy_instalments indexes to partial form
  (biggest performance cliff on real data).
  4. Decide whether to keep vehicles.specs as a full JSONB or hoist
  vin/registration/fuel_type into generated columns.
  5. Add the missing CHECK constraints and vehicle_tyres UNIQUE for
  correctness.

  Composite-index migrations (#3) can wait until you have real query logs —
  picking a composite without knowing the actual filter combinations is
  guesswork.
