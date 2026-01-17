--------------------------------------------------------------------------------
-- 🔥 HOW TO USE: (un)comment the important bits of the script 🔥
--------------------------------------------------------------------------------

-- Required for GiST to work with standard types like INT inside JSONB or standalone
CREATE EXTENSION IF NOT EXISTS btree_gist;

DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS carriers;

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

-- 🔥 insert DYNAMIC data
INSERT INTO carriers (id, company_name, fleet_size, contract_period)
SELECT 
    gs AS id,
    (ARRAY['Trans', 'Euro', 'Global', 'Eco', 'Fast', 'Nordic', 'Baltic', 'Sky', 'Rapid', 'Prime'])[floor(random() * 10 + 1)] || ' ' ||
    (ARRAY['Logistics', 'Cargo', 'Freight', 'Transit', 'Haulage', 'Shipments', 'Way', 'Runners', 'Speed', 'Link'])[floor(random() * 10 + 1)] || 
    ' ' || gs AS company_name,
    floor(random() * 200 + 10)::INT AS fleet_size,
    daterange(
        '2023-01-01'::DATE + (random() * 365)::INT,
        '2025-01-01'::DATE + (random() * 730)::INT
    ) AS contract_period
FROM generate_series(1, 1000) AS gs;

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
            'hazardous', (random() > 0.8)
        )
    )
FROM generate_series(1, 10000);

--------------------------------------------------------------------------------
-- GiST Index Creation
-- Standard GiST for range types
CREATE INDEX idx_carriers_contract_gist ON carriers USING gist (contract_period);

ANALYZE carriers;
--------------------------------------------------------------------------------
-- 🔥 CHEATSHEET 🔥
-- &&	Overlaps		True if the ranges have any common point.
-- @>	Contains		True if the left range contains the right range (inclusion)
-- <@	Is contained by	True if the left range is contained within the right range.
--------------------------------------------------------------------------------
-- 🔥 IMPORTANT 🔥
-- all `contract_period` have randomized values:
-- FROM: 2023-01-01 - 2023-12-31
-- TO: 2025-01-01 - 2026-12-31
-- hence, 2024 is pretty much included everywhere. For GiST index it matters A LOT.
--------------------------------------------------------------------------------
-- Using range inclusion operator (@>) matches the GiST index

EXPLAIN ANALYZE
SELECT * FROM carriers 
WHERE contract_period @> '2024-06-01'::DATE; -- ❌ seq scan; super low selectivity (potentially 100% records used)
-- WHERE contract_period @> '2023-06-01'::DATE; -- ❌ seq scan; little higher selectivity (closer to 5/12; "Rows Removed by Filter: ~600 / 1000")
-- WHERE contract_period @> '2023-02-01'::DATE; -- ✅ bitmap scan; high selectivity (closer to 1/12; Rows: ~90 / 1000)
-- WHERE contract_period @> '2023-01-08'::DATE; -- ✅ bitmap scan; high selectivity (closer to 1/12; Rows: ~20 / 1000)
-- WHERE lower(contract_period) > '2023-01-08'::DATE; -- ❌ seq scan; (obviously) using a function on the column prevents the planner from using the raw index
-- -- OR a RANGE OVERLAP (True if the ranges have any common point):
-- WHERE contract_period && daterange('2023-03-01'::DATE, '2023-03-02'::DATE); -- ✅ bitmap scan; high selectivity (closer to 1/12; Rows: ~170 / 1000)
-- WHERE contract_period && daterange('2024-03-01'::DATE, '2024-03-02'::DATE); -- ❌ seq scan; super low selectivity (potentially 100% records used)

--------------------------------------------------------------------------------
-- Functional GiST for JSONB fields
-- Note: Explicit casting to int is crucial for the index to match specific queries
-- ... as the ``->>` operator always returns text. 🤷
CREATE INDEX idx_shipments_details_gist ON shipments USING gist (
    ((details -> 'assignment' ->> 'carrier_id')::int),
    ((details -> 'cargo' ->> 'weight_kg')::int)
);

ANALYZE shipments;
--------------------------------------------------------------------------------

EXPLAIN ANALYZE
SELECT * FROM shipments 
WHERE (details -> 'assignment' ->> 'carrier_id')::int = 101; -- ✅ bitmap scan
-- WHERE (details -> 'assignment' ->> 'carrier_id') = 101; -- ❌ ERROR:  operator does not exist: text = integer
-- WHERE (details -> 'assignment' ->> 'carrier_id') = '101'; -- ❌ seq scan; Type mismatch: index is on (int), query compares against (text)

--------------------------------------------------------------------------------
-- Full Text Search using tsvector

-- preparation, obviously
ALTER TABLE carriers ADD COLUMN company_name_ts tsvector;
UPDATE carriers SET company_name_ts = to_tsvector('english', company_name);
CREATE INDEX idx_carriers_name_fts_gist ON carriers USING gist (company_name_ts);
ANALYZE carriers;
-- and the fun part now
-- look at how the company_name looks like (e.g. "Sky Way %d", "Trans Logistics %d" etc)

-- 🔥 CHEATSHEET: `to_tsquery` requires operators BETWEEN words: &, |, !, <->
-- or you can use utility functions such as `plainto_tsquery`

EXPLAIN ANALYZE -- comment/uncomment to see actual results
SELECT company_name
FROM carriers 
WHERE company_name_ts @@ to_tsquery('english', 'SkyWay'); -- ✅ index scan (no space, NO MATCH)
-- WHERE company_name_ts @@ to_tsquery('english', 'Logist'); -- ✅ bitmap scan
-- WHERE company_name_ts @@ to_tsquery('english', 'Logistics & Trans'); -- ✅ bitmap scan
-- WHERE company_name_ts @@ to_tsquery('english', 'Trans | Euro | Global | Eco | Fast | Nordic | Baltic | Sky | Rapid | Prime'); -- ❌ seq scan, super low selectivity (100% MATCH)
-- WHERE company_name_ts @@ to_tsquery('polish',  'Logistics & Trans'); -- ❌ ERROR: text search configuration "polish" does not exist

-- BTW, tsvector (Text Search) != pgvector (semantic search, embeddings, etc.)


SELECT metadata->'route' || '{ "suffix": true }'::jsonb FROM shipments;
