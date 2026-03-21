CREATE SCHEMA IF NOT EXISTS cargo_plans;

DROP TABLE IF EXISTS cargo_plans.cargo_load_plan_units;
DROP TABLE IF EXISTS cargo_plans.cargo_load_plans;

CREATE TABLE cargo_plans.cargo_load_plans (
    id           UUID         PRIMARY KEY,
    trailer_type TEXT         NOT NULL,
    status       TEXT         NOT NULL DEFAULT 'DRAFT',
    current_ldm  NUMERIC(5,2) NOT NULL DEFAULT 0,
    version      INTEGER      NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE cargo_plans.cargo_load_plan_units (
    id                        UUID          PRIMARY KEY,
    load_plan_id              UUID          NOT NULL
                                REFERENCES cargo_plans.cargo_load_plans(id) ON DELETE CASCADE,
    pallet_type               TEXT          NOT NULL,
    cargo_type                TEXT          NOT NULL,
    description               TEXT,
    weight_kg                 NUMERIC(10,2) NOT NULL,
    cargo_height_mm           INTEGER       NOT NULL,
    is_temperature_controlled BOOLEAN       NOT NULL DEFAULT false,
    requires_side_loading     BOOLEAN       NOT NULL DEFAULT false,
    is_bulk                   BOOLEAN       NOT NULL DEFAULT false,
    high_security_required    BOOLEAN       NOT NULL DEFAULT false
);

CREATE INDEX idx_cargo_load_plan_units_load_plan_id ON cargo_plans.cargo_load_plan_units(load_plan_id);
CREATE INDEX idx_cargo_load_plans_status ON cargo_plans.cargo_load_plans(status);
