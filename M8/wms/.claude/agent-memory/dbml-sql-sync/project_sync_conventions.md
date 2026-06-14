---
name: project-sync-conventions
description: Fleet module DBML-to-SQL conventions: file locations, dialect, PK style, JSONB indexes, placeholder tables, dependency ordering
metadata:
  type: project
---

## File locations

- DBML source: `/Users/michal.cesarczyk/DJ/dj-course/M8/modelling/fleet-module.dbml`
- SQL output:  `/Users/michal.cesarczyk/DJ/dj-course/M8/modelling/fleet-module.sql`
- Sibling reference SQL: `/Users/michal.cesarczyk/DJ/dj-course/M8/modelling/tms-er-diagram.sql`

## SQL dialect & style

- Target: **PostgreSQL 14+**
- PK style: `SERIAL` (not `IDENTITY`) — matches `wms-data-generator/schema/create-wms-schema.sql`
- Naming: lowercase **snake_case** for all tables and columns
- Header banner comment names the source DBML file

## DROP / CREATE ordering

- `DROP TYPE IF EXISTS ... CASCADE` before `DROP TABLE IF EXISTS ... CASCADE`
- Tables dropped in reverse-dependency order (children before parents)
- Enum types dropped and recreated before any table that references them
- `spare_parts` must be created before `service_order_parts` even though DBML declares it later

## Placeholder tables

`vehicles` and `employees` are cross-module FK targets. They must be materialised as real tables so the file is runnable standalone. Each gets an SQL comment explaining it is owned by another module (Fleet/Core and HR respectively). Do not add business columns to `employees`.

## JSONB uniqueness indexes on vehicles.specs

The `vehicles.specs jsonb` column stores VIN, registration_number, fleet_number. Three partial unique indexes enforce the uniqueness guarantees lost when the old `vehicle_specs` table was collapsed:

```sql
CREATE UNIQUE INDEX uq_vehicles_vin ON vehicles ((specs->>'vin')) WHERE specs->>'vin' IS NOT NULL;
CREATE UNIQUE INDEX uq_vehicles_registration_number ON vehicles ((specs->>'registration_number')) WHERE specs->>'registration_number' IS NOT NULL;
CREATE UNIQUE INDEX uq_vehicles_fleet_number ON vehicles ((specs->>'fleet_number')) WHERE specs->>'fleet_number' IS NOT NULL;
CREATE INDEX idx_vehicles_specs_gin ON vehicles USING GIN (specs);
```

## Foreign key style

Inline `REFERENCES` clause on the column where possible. No separate `ALTER TABLE` statements needed for single-column FKs.

**Why:** Keeps the file re-runnable (DROP + CREATE), consistent with sibling tms-er-diagram.sql, and avoids dangling FK references.
**How to apply:** On every future DBML regeneration for this module, replicate all conventions above and validate CREATE order matches the dependency graph.
