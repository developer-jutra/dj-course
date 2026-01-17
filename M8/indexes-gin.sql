--------------------------------------------------------------------------------
-- 🔥 HOW TO USE: (un)comment the important bits of the script 🔥
--------------------------------------------------------------------------------

DROP TABLE IF EXISTS carriers CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
-- cascade needed b/c when foreign keys are present

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

--------------------------------------------------------------------------------

-- 🔥 insert DYNAMIC data
INSERT INTO carriers (id, company_name, fleet_size, contract_period)
SELECT 
    gs AS id,
    (ARRAY['Trans', 'Euro', 'Global', 'Eco', 'Fast', 'Nordic', 'Baltic', 'Sky', 'Rapid', 'Prime'])[floor(random() * 10 + 1)] || 
    (ARRAY['Logistics', 'Cargo', 'Freight', 'Transit', 'Haulage', 'Shipments', 'Way', 'Runners', 'Speed', 'Link'])[floor(random() * 10 + 1)] || 
    ' ' || gs AS company_name,
    floor(random() * 200 + 10)::INT AS fleet_size,
    daterange(
        '2023-01-01'::DATE + (random() * 365)::INT, 
        '2025-01-01'::DATE + (random() * 730)::INT
    ) AS contract_period
FROM generate_series(1, 300) AS gs;
-- Update statistics for the planner
ANALYZE carriers;

--------------------------------------------------------------------------------

-- 🔥 insert DYNAMIC data
INSERT INTO shipments (details)
SELECT 
    jsonb_build_object(
        'assignment', jsonb_build_object(
            'carrier_id', (ARRAY[101, 102, 103])[floor(random() * 3 + 1)],
            'driver_id', floor(random() * 100 + 1)
        ),
        'route', jsonb_build_object(
            'origin', (ARRAY['Warsaw', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'])[floor(random() * 5 + 1)],
            'destination', (ARRAY['Berlin', 'Prague', 'Stockholm', 'Vienna', 'Paris'])[floor(random() * 5 + 1)]
        ),
        'cargo', jsonb_build_object(
            'type', (ARRAY['Electronics', 'Furniture', 'Machinery', 'Food', 'Textiles'])[floor(random() * 5 + 1)],
            'weight_kg', floor(random() * 10000 + 100),
            'hazardous', (random() > 0.8) -- Roughly 20% chance for true
        )
    )
FROM generate_series(1, 10000);

-- Update statistics for the planner
ANALYZE shipments;

--------------------------------------------------------------------------------

-- 👉 jsonb_ops
-- GIN Index (jsonb_ops): Universal, supports @>, ?, ?&, ?| operators. Stores each key and value separately.
CREATE INDEX idx_shipments_details_gin ON shipments USING GIN (details);

EXPLAIN ANALYZE
SELECT * FROM shipments 
WHERE details @> '{"cargo": {"hazardous": true}}'; -- ✅ valid / bitmap scan (🔥 supports @>, ?, ?&, ?| operators 🔥)
-- WHERE details -> 'cargo' ? 'hazardous'; -- ❌ invalid / seq scan
-- WHERE details -> 'cargo' ->> 'type' = 'Electronics'; -- ❌ invalid / seq scan

-- ✅ valid ... OR a preferred way to get into a (sub)nested property is to create
-- a function/expression index (in other file), DEDICATED for this usecase:
CREATE INDEX idx_hazardous_exists 
ON shipments (((details -> 'cargo') ? 'hazardous'));
-- and then:
EXPLAIN ANALYZE
SELECT * FROM shipments 
WHERE details -> 'cargo' ? 'hazardous'; -- ✅ valid / bitmap scan
-- WHERE details -> 'cargo' ->> 'type' = 'Electronics'; -- ❌ invalid / seq scan (WHERE operator DIFFERENT than what index built)

--------------------------------------------------------------------------------


-- 👉 jsonb_path_ops
-- GIN Index (jsonb_path_ops): Optimized for the @> operator. Stores hashes of entire paths; smaller and faster, but less flexible.
-- 👉 `jsonb_path_ops` requires a COMPLETE path including the LEAF VALUE, rather than just intermediate keys
-- also, it relates to what the exact data is in the documents (e.g. you need to check the structure of what exists under `assignment` key)
CREATE INDEX idx_shipments_details_path_gin ON shipments USING GIN (details jsonb_path_ops);

EXPLAIN ANALYZE
SELECT * FROM shipments 
WHERE details @> '{"cargo": {"type": "Electronics"}}'; -- ✅ valid / bitmap scan (only @> supported)
-- WHERE details @> '{"cargo": {}}'; -- ❌ invalid / seq scan (🔥 leaf value not included OR there are no objects with empty object under `cargo` key - in our case all documents have subkeys under `cargo`)
-- WHERE details ? 'assignment'; -- ❌ invalid / seq scan (wrong operator: ?)
-- WHERE details @> '{"assignment": {}}'; -- ❌ invalid / seq scan (🔥 leaf value not included)
-- WHERE details @> '{"assignment": { "carrier_id": 101 }}'; -- ✅ valid / bitmap scan (leaf value included)
-- WHERE details @> '{"assignment": { "driver_id": 52}}'; -- ✅ valid / bitmap scan (leaf value included)

SET enable_seqscan = off;