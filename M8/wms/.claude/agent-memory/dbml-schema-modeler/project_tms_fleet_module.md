---
name: tms-fleet-module
description: Fleet management module DBML for TMS project — file location, design decisions, cross-module boundary
metadata:
  type: project
---

**File:** `/Users/michal.cesarczyk/DJ/dj-course/M8/modelling/fleet-module.dbml`

**Existing TMS diagram:** `/Users/michal.cesarczyk/DJ/dj-course/M8/modelling/tms-er-diagram.mmd`
Already models: FLEET_VEHICLE, VEHICLE_CATEGORY, RESOURCE, HR_DRIVER, TRANSPORT, ORDER, SHIPMENT, MANIFEST_ITEM, CONTRAHENT, ADDRESS.

**Cross-module boundary pattern used:** placeholder stub tables (`vehicles`, `employees`) with a comment; fleet module FKs point there.

**Key design decisions (2026-06-14):**
- `vehicle_specs` is a 1-to-1 extension of `vehicles` (the existing FLEET_VEHICLE stub), holding the full technical profile. `vehicle_id` is `unique`.
- `trailers` also extends `vehicles` 1-to-1 — trailers are FLEET_VEHICLE resources in the core module but have a distinct body/cargo spec table.
- All three inspection types (tachograph, SKP, UDT tail-lift) collapsed into one `vehicle_inspections` table with `inspection_type` enum — their attributes are identical (subject, date, result, next-due).
- `vehicle_documents` is a single generic table covering all document kinds (registration cert, vehicle card, ATP, waste auth) via `document_type` enum.
- Tyre management split into two tables: `vehicle_tyres` (current state per axle) + `tyre_swap_history` (explicit history the spec asked for).
- `spare_part_aliases` is a child table of `spare_parts` for OEM equivalents/cross-references — avoids an array column.
- Alert system uses three tables: `alert_rules` (threshold config), `alert_recipient_rules` (role routing), `alerts` (instances per vehicle).
