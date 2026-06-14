-- ============================================================
-- Fleet Management Module — TMS
-- PostgreSQL 14+
-- Generated from: fleet-module.dbml
-- Scope: vehicle catalog, trailers, documents, insurance,
--        inspections, maintenance, service history,
--        spare-parts inventory, alert system.
-- ============================================================

-- ============================================================
-- DROP TYPES (in reverse dependency order)
-- ============================================================

DROP TYPE IF EXISTS alert_recipient_role CASCADE;
DROP TYPE IF EXISTS alert_status CASCADE;
DROP TYPE IF EXISTS tyre_season CASCADE;
DROP TYPE IF EXISTS inspection_type CASCADE;
DROP TYPE IF EXISTS repair_classification CASCADE;
DROP TYPE IF EXISTS coverage_type CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS trailer_body_type CASCADE;
DROP TYPE IF EXISTS maintenance_interval_unit CASCADE;

-- ============================================================
-- DROP TABLES (in reverse dependency order — children first)
-- ============================================================

DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS alert_recipient_rules CASCADE;
DROP TABLE IF EXISTS alert_rules CASCADE;
DROP TABLE IF EXISTS spare_part_aliases CASCADE;
DROP TABLE IF EXISTS tyre_swap_history CASCADE;
DROP TABLE IF EXISTS vehicle_tyres CASCADE;
DROP TABLE IF EXISTS service_order_parts CASCADE;
DROP TABLE IF EXISTS service_orders CASCADE;
DROP TABLE IF EXISTS maintenance_intervals CASCADE;
DROP TABLE IF EXISTS vehicle_inspections CASCADE;
DROP TABLE IF EXISTS policy_instalments CASCADE;
DROP TABLE IF EXISTS insurance_policies CASCADE;
DROP TABLE IF EXISTS vehicle_documents CASCADE;
DROP TABLE IF EXISTS trailers CASCADE;
DROP TABLE IF EXISTS spare_parts CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;

-- ============================================================
-- CREATE TYPES (enums)
-- ============================================================

CREATE TYPE trailer_body_type AS ENUM (
    'reefer',        -- chłodnia
    'tarp',          -- plandeka / curtain-side
    'isotherm',      -- izoterma
    'curtainsider'   -- firanka
);

CREATE TYPE document_type AS ENUM (
    'registration_certificate',  -- dowód rejestracyjny
    'vehicle_card',              -- karta pojazdu
    'atp_certificate',           -- świadectwo ATP (reefer)
    'waste_transport_auth',      -- zezwolenie na przewóz odpadów
    'consent_other'
);

CREATE TYPE coverage_type AS ENUM (
    'oc',          -- OC — third-party liability
    'ac',          -- AC — comprehensive (autocasco)
    'assistance',
    'ocp'          -- OCP — carrier liability
);

CREATE TYPE repair_classification AS ENUM (
    'warranty',
    'post_warranty',
    'post_accident'
);

CREATE TYPE inspection_type AS ENUM (
    'tachograph',       -- legalizacja tachografu
    'technical',        -- badanie techniczne (SKP)
    'udt_tail_lift'     -- UDT — winda załadunkowa / platforma
);

CREATE TYPE tyre_season AS ENUM (
    'summer',
    'winter',
    'all_season'
);

CREATE TYPE alert_status AS ENUM (
    'pending',
    'in_progress',
    'archived'
);

CREATE TYPE alert_recipient_role AS ENUM (
    'dispatcher',
    'fleet_manager',
    'mechanic'
);

CREATE TYPE maintenance_interval_unit AS ENUM (
    'km',
    'engine_hours',
    'months'
);

-- ============================================================
-- CREATE TABLES
-- ============================================================

-- ---------------------------------------------------------------------------
-- PLACEHOLDER: vehicles
-- In the real system this table is owned by the Fleet/Core module
-- (modelled as FLEET_VEHICLE in tms-er-diagram.mmd). It is materialised here
-- so that this file is runnable standalone. Do NOT add business columns here.
-- ---------------------------------------------------------------------------
CREATE TABLE vehicles (
    id    SERIAL PRIMARY KEY,
    specs jsonb NOT NULL
    -- Identification: vin, registration_number, fleet_number
    -- Engine/drivetrain: power_kw, displacement_cc, fuel_type, euro_norm
    -- Dimensions/limits: kerb_weight_kg, gvm_kg, max_payload_kg
    -- Live operations: odometer_km, avg_fuel_consumption, current_location
);

-- ---------------------------------------------------------------------------
-- PLACEHOLDER: employees
-- In the real system this table is owned by the HR module
-- (modelled as HR_DRIVER / employee record in the HR module).
-- It is materialised here so that this file is runnable standalone.
-- Do NOT add columns here — schema is controlled by the HR module.
-- ---------------------------------------------------------------------------
CREATE TABLE employees (
    id SERIAL PRIMARY KEY
);

-- ---------------------------------------------------------------------------
-- Spare-parts catalog — declared before service_order_parts which references it
-- ---------------------------------------------------------------------------

-- 8. SPARE-PARTS INVENTORY
-- Material indices with OEM numbers/aliases, warehouse location, min threshold.

CREATE TABLE spare_parts (
    id                  SERIAL PRIMARY KEY,
    name                varchar(200)  NOT NULL,
    oem_number          varchar(100)  NOT NULL UNIQUE,  -- primary OEM catalog number
    rack                varchar(50),                    -- warehouse rack
    shelf               varchar(50),                    -- warehouse shelf
    stock_quantity      decimal(10,3) NOT NULL DEFAULT 0,
    min_stock_threshold decimal(10,3) NOT NULL DEFAULT 0,  -- alert below this level
    unit                varchar(20)   NOT NULL          -- pcs, L, kg …
);

-- ---------------------------------------------------------------------------
-- 1. TRAILERS / SEMI-TRAILERS
-- Separate entity — trailers have distinct body type, cargo space and equipment.
-- ---------------------------------------------------------------------------

CREATE TABLE trailers (
    id                  SERIAL PRIMARY KEY,
    -- trailers are also FLEET_VEHICLE resources in the core module
    vehicle_id          integer       NOT NULL UNIQUE REFERENCES vehicles (id),

    -- Identification (mirrors vehicle_specs; trailers have their own VIN/plates)
    vin                 varchar(17)   NOT NULL UNIQUE,
    registration_number varchar(20)   NOT NULL UNIQUE,
    fleet_number        varchar(30)   UNIQUE,

    -- Body
    body_type           trailer_body_type NOT NULL,

    -- Cargo space
    euro_pallets        smallint,        -- number of euro-pallet spaces
    volume_m3           decimal(6,2),    -- internal volume m³
    interior_height_m   decimal(4,2),    -- internal height m

    -- Extra equipment
    has_tail_lift       boolean       NOT NULL DEFAULT false,
    has_refrigeration   boolean       NOT NULL DEFAULT false,
    has_temp_sensors    boolean       NOT NULL DEFAULT false
);

-- ---------------------------------------------------------------------------
-- 3. DOCUMENT & PERMISSION MANAGEMENT / DIGITAL REPOSITORY
-- One generic table covers all document kinds; type enum distinguishes them.
-- ---------------------------------------------------------------------------

CREATE TABLE vehicle_documents (
    id              SERIAL PRIMARY KEY,
    vehicle_id      integer       NOT NULL REFERENCES vehicles (id),
    document_type   document_type NOT NULL,
    document_number varchar(100),
    issued_date     date,
    expiry_date     date,
    file_url        varchar(500)  NOT NULL,  -- path/URL to the scan
    notes           text
);

-- ---------------------------------------------------------------------------
-- 4. INSURANCE POLICIES
-- ---------------------------------------------------------------------------

CREATE TABLE insurance_policies (
    id              SERIAL PRIMARY KEY,
    vehicle_id      integer       NOT NULL REFERENCES vehicles (id),
    insurer_name    varchar(200)  NOT NULL,
    policy_number   varchar(100)  NOT NULL UNIQUE,
    coverage_type   coverage_type NOT NULL,
    valid_from      date          NOT NULL,
    valid_to        date          NOT NULL
);

CREATE TABLE policy_instalments (
    id          SERIAL PRIMARY KEY,
    policy_id   integer       NOT NULL REFERENCES insurance_policies (id),
    due_date    date          NOT NULL,
    amount      decimal(10,2) NOT NULL,
    paid_date   date          -- null = not yet paid
);

-- ---------------------------------------------------------------------------
-- 5. LEGALISATIONS & INSPECTIONS
-- Tachographs, periodic technical (SKP), and UDT (tail-lift) share the same
-- shape: subject + date + result + next-due.  One table with an enum type.
-- ---------------------------------------------------------------------------

CREATE TABLE vehicle_inspections (
    id              SERIAL PRIMARY KEY,
    vehicle_id      integer         NOT NULL REFERENCES vehicles (id),
    inspection_type inspection_type NOT NULL,
    inspection_date date            NOT NULL,
    result          varchar(100),           -- pass / fail / remarks
    next_due_date   date            NOT NULL,
    performed_by    varchar(200)            -- station / lab name
);

-- ---------------------------------------------------------------------------
-- 6. MAINTENANCE INTERVAL DEFINITIONS
-- Reusable templates: by km, by engine-hours/months, or by elapsed time.
-- ---------------------------------------------------------------------------

CREATE TABLE maintenance_intervals (
    id              SERIAL PRIMARY KEY,
    name            varchar(200)              NOT NULL,  -- e.g. "Oil change", "Summer tyre swap"
    description     text,
    interval_unit   maintenance_interval_unit NOT NULL,
    interval_value  integer                   NOT NULL   -- e.g. 15000 (km), 6 (months)
);

-- ---------------------------------------------------------------------------
-- 7a. SERVICE HISTORY — WORK ORDERS
-- Workshop work orders with defect description, dates and labour cost.
-- ---------------------------------------------------------------------------

CREATE TABLE service_orders (
    id                    SERIAL PRIMARY KEY,
    vehicle_id            integer               NOT NULL REFERENCES vehicles (id),
    repair_classification repair_classification NOT NULL,
    damage_case_number    varchar(100),                 -- required for post_accident
    defect_description    text                  NOT NULL,
    vehicle_in_date       date                  NOT NULL,
    vehicle_out_date      date,
    workshop_name         varchar(200),
    labour_cost           decimal(10,2)
);

-- ---------------------------------------------------------------------------
-- 7b. PARTS CONSUMPTION LOG
-- Detailed list of parts used in a work order (filters, oils, brake discs …).
-- ---------------------------------------------------------------------------

CREATE TABLE service_order_parts (
    id               SERIAL PRIMARY KEY,
    service_order_id integer       NOT NULL REFERENCES service_orders (id),
    part_id          integer       NOT NULL REFERENCES spare_parts (id),
    quantity         decimal(10,3) NOT NULL,
    unit_cost        decimal(10,2)
);

-- ---------------------------------------------------------------------------
-- 7c. TYRE MANAGEMENT
-- Current tyre state per axle position, plus a separate swap history table.
-- ---------------------------------------------------------------------------

CREATE TABLE vehicle_tyres (
    id             SERIAL PRIMARY KEY,
    vehicle_id     integer     NOT NULL REFERENCES vehicles (id),
    axle_position  varchar(50) NOT NULL,  -- e.g. "front-left", "rear-right-outer"
    season         tyre_season NOT NULL,
    tread_depth_mm decimal(4,1),
    brand          varchar(100),
    model          varchar(100),
    size           varchar(30)            -- e.g. "315/70 R22.5"
);

CREATE TABLE tyre_swap_history (
    id               SERIAL PRIMARY KEY,
    vehicle_id       integer     NOT NULL REFERENCES vehicles (id),
    service_order_id integer     REFERENCES service_orders (id),  -- null = ad-hoc swap outside a work order
    axle_position    varchar(50) NOT NULL,
    swap_date        date        NOT NULL,
    tread_depth_mm   decimal(4,1),   -- tread depth at time of swap
    season           tyre_season NOT NULL,
    brand            varchar(100),
    model            varchar(100),
    size             varchar(30)
);

-- ---------------------------------------------------------------------------
-- Spare-part aliases — must come after spare_parts
-- ---------------------------------------------------------------------------

CREATE TABLE spare_part_aliases (
    id           SERIAL PRIMARY KEY,
    part_id      integer      NOT NULL REFERENCES spare_parts (id),
    alias_number varchar(100) NOT NULL,
    source       varchar(100)  -- e.g. manufacturer name
);

-- ---------------------------------------------------------------------------
-- 9. MONITORING & NOTIFICATION SYSTEM
-- ---------------------------------------------------------------------------

CREATE TABLE alert_rules (
    id              SERIAL PRIMARY KEY,
    name            varchar(200) NOT NULL,
    description     text,
    threshold_days  integer,  -- e.g. 30 days before policy expiry
    threshold_km    integer   -- e.g. 2000 km before next service
);

CREATE TABLE alert_recipient_rules (
    id             SERIAL PRIMARY KEY,
    alert_rule_id  integer              NOT NULL REFERENCES alert_rules (id),
    recipient_role alert_recipient_role NOT NULL
);

CREATE TABLE alerts (
    id            SERIAL PRIMARY KEY,
    vehicle_id    integer      NOT NULL REFERENCES vehicles (id),
    alert_rule_id integer      NOT NULL REFERENCES alert_rules (id),
    raised_at     timestamp    NOT NULL,
    status        alert_status NOT NULL DEFAULT 'pending',
    assigned_to   integer      REFERENCES employees (id),  -- optional assignee
    resolved_at   timestamp
);

-- ============================================================
-- CREATE INDEXES
-- ============================================================

-- Trailers
-- (vehicle_id is UNIQUE → backed by an implicit unique btree, no extra index needed)
CREATE INDEX idx_trailers_body_type            ON trailers (body_type);

-- Vehicle documents
CREATE INDEX idx_vehicle_documents_vehicle_id  ON vehicle_documents (vehicle_id);
CREATE INDEX idx_vehicle_documents_type        ON vehicle_documents (document_type);
CREATE INDEX idx_vehicle_documents_expiry      ON vehicle_documents (expiry_date) WHERE expiry_date IS NOT NULL;

-- Insurance
CREATE INDEX idx_insurance_policies_vehicle_id ON insurance_policies (vehicle_id);
CREATE INDEX idx_insurance_policies_valid_to   ON insurance_policies (valid_to);
CREATE INDEX idx_policy_instalments_policy_id  ON policy_instalments (policy_id);
CREATE INDEX idx_policy_instalments_due_date   ON policy_instalments (due_date);

-- Inspections
CREATE INDEX idx_vehicle_inspections_vehicle_id   ON vehicle_inspections (vehicle_id);
CREATE INDEX idx_vehicle_inspections_type         ON vehicle_inspections (inspection_type);
CREATE INDEX idx_vehicle_inspections_next_due     ON vehicle_inspections (next_due_date);

-- Service orders
CREATE INDEX idx_service_orders_vehicle_id         ON service_orders (vehicle_id);
CREATE INDEX idx_service_orders_classification     ON service_orders (repair_classification);
CREATE INDEX idx_service_orders_vehicle_in_date    ON service_orders (vehicle_in_date);

-- Service order parts
CREATE INDEX idx_service_order_parts_order_id      ON service_order_parts (service_order_id);
CREATE INDEX idx_service_order_parts_part_id       ON service_order_parts (part_id);

-- Tyres
CREATE INDEX idx_vehicle_tyres_vehicle_id          ON vehicle_tyres (vehicle_id);
CREATE INDEX idx_tyre_swap_history_vehicle_id      ON tyre_swap_history (vehicle_id);
CREATE INDEX idx_tyre_swap_history_service_order   ON tyre_swap_history (service_order_id) WHERE service_order_id IS NOT NULL;
CREATE INDEX idx_tyre_swap_history_swap_date       ON tyre_swap_history (swap_date);

-- Spare parts
-- (spare_parts.oem_number is UNIQUE → backed by an implicit unique btree)
CREATE INDEX idx_spare_part_aliases_part_id        ON spare_part_aliases (part_id);
CREATE INDEX idx_spare_part_aliases_alias_number   ON spare_part_aliases (alias_number);

-- Alerts
CREATE INDEX idx_alert_recipient_rules_rule_id     ON alert_recipient_rules (alert_rule_id);
CREATE INDEX idx_alerts_vehicle_id                 ON alerts (vehicle_id);
CREATE INDEX idx_alerts_rule_id                    ON alerts (alert_rule_id);
CREATE INDEX idx_alerts_status                     ON alerts (status);
CREATE INDEX idx_alerts_raised_at                  ON alerts (raised_at);
CREATE INDEX idx_alerts_assigned_to                ON alerts (assigned_to) WHERE assigned_to IS NOT NULL;

-- vehicles.specs — partial unique indexes to enforce uniqueness of key identifiers
-- stored inside the JSONB column (replaces the uniqueness guarantees from the
-- old vehicle_specs table that was collapsed into specs).
CREATE UNIQUE INDEX uq_vehicles_vin
    ON vehicles ((specs->>'vin'))
    WHERE specs->>'vin' IS NOT NULL;

CREATE UNIQUE INDEX uq_vehicles_registration_number
    ON vehicles ((specs->>'registration_number'))
    WHERE specs->>'registration_number' IS NOT NULL;

CREATE UNIQUE INDEX uq_vehicles_fleet_number
    ON vehicles ((specs->>'fleet_number'))
    WHERE specs->>'fleet_number' IS NOT NULL;

-- GIN index on vehicles.specs for general JSONB querying
CREATE INDEX idx_vehicles_specs_gin ON vehicles USING GIN (specs);

-- ============================================================
-- END OF SCRIPT
-- ============================================================
