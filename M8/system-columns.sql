-- @docs: see https://www.postgresql.org/docs/current/ddl-system-columns.html#DDL-SYSTEM-COLUMNS

--------------------------------------------------------------------------------
-- 🔥 HOW TO USE: (un)comment the important bits of the script 🔥
--------------------------------------------------------------------------------

DROP TABLE IF EXISTS carriers CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;

CREATE TABLE carriers (
    id INT PRIMARY KEY,
    company_name TEXT,
    fleet_size INT,
	contract_period DATERANGE
);

CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    details JSONB
);

INSERT INTO carriers (id, company_name, fleet_size, contract_period) VALUES 
(101, 'TransLogistics Sp. z o.o.', 50, '[2023-01-01, 2025-12-31]'), 
(102, 'FastCargo International', 120, '[2024-05-15, 2026-05-15]'),
(103, 'EcoFreight Solutions', 15, '[2023-11-20, 2024-11-20]'),
(104, 'Global Way Transport', 85, '[2024-01-01, 2027-01-01]'),
(105, 'Nordic Express', 40, '[2023-06-01, 2025-06-01]'),
(106, 'Szybka Paczka S.A.', 200, '[2024-03-10, 2026-03-10]'),
(107, 'Baltic Shipments', 33, '[2023-09-15, 2024-12-31]'),
(108, 'Heavy Haulage Ltd', 12, '[2024-02-01, 2025-02-01]'),
(109, 'Alpine Logistics', 55, '[2023-01-15, 2026-01-15]'),
(110, 'Oceanic Carriers', 90, '[2024-07-01, 2028-07-01]');

INSERT INTO shipments (details) VALUES
('{
    "assignment": {"carrier_id": 101, "driver_id": 5},
    "route": {"origin": "Warsaw", "destination": "Berlin"},
    "cargo": {"type": "Electronics", "weight_kg": 1200, "hazardous": false}
}'),
('{
    "assignment": {"carrier_id": 102, "driver_id": 88},
    "route": {"origin": "Kraków", "destination": "Prague"},
    "cargo": {"type": "Furniture", "weight_kg": 4500, "hazardous": false}
}');

--------------------------------------------------------------------------------

-- 🔥 xmin: ID of the transaction that created (insert) or updated the row version.
-- 🔥 xmax: ID of the transaction that deleted the row or created a new version (update). 🔥 If 0, the row is alive.
  -- in naive queries we WON'T see xmax > 0. BUT THEY'RE THERE in MVCC
-- 🔥 ctid: Physical address of the row version within the table (page number and index within it).

SELECT * FROM carriers;
SELECT * FROM shipments;

SELECT ctid, tableoid, xmin, xmax, * FROM carriers;
SELECT ctid, tableoid, xmin, xmax, * FROM shipments;
