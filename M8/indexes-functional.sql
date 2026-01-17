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

-- 🔥 insert STATIC data
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

-- 🔥 insert DYNAMIC data
-- INSERT INTO carriers (id, company_name, fleet_size, contract_period)
-- SELECT 
--     gs AS id,
--     (ARRAY['Trans', 'Euro', 'Global', 'Eco', 'Fast', 'Nordic', 'Baltic', 'Sky', 'Rapid', 'Prime'])[floor(random() * 10 + 1)] || 
--     (ARRAY['Logistics', 'Cargo', 'Freight', 'Transit', 'Haulage', 'Shipments', 'Way', 'Runners', 'Speed', 'Link'])[floor(random() * 10 + 1)] || 
--     ' ' || gs AS company_name,
--     floor(random() * 200 + 10)::INT AS fleet_size,
--     daterange(
--         '2023-01-01'::DATE + (random() * 365)::INT, 
--         '2025-01-01'::DATE + (random() * 730)::INT
--     ) AS contract_period
-- FROM generate_series(1, 300) AS gs;
-- -- Update statistics for the planner
-- ANALYZE carriers;

--------------------------------------------------------------------------------

-- 🔥 insert STATIC data

-- INSERT INTO shipments (details) VALUES
-- ('{
--     "assignment": {"carrier_id": 101, "driver_id": 5},
--     "route": {"origin": "Warsaw", "destination": "Berlin"},
--     "cargo": {"type": "Electronics", "weight_kg": 1200, "hazardous": false}
-- }'),
-- ('{
--     "assignment": {"carrier_id": 102, "driver_id": 88},
--     "route": {"origin": "Kraków", "destination": "Prague"},
--     "cargo": {"type": "Furniture", "weight_kg": 4500, "hazardous": false}
-- }'),
-- ('{
--     "assignment": {"carrier_id": 101, "driver_id": 12},
--     "route": {"origin": "Gdańsk", "destination": "Stockholm"},
--     "cargo": {"type": "Machinery", "weight_kg": 8900, "hazardous": true}
-- }'),
-- ('{
--     "assignment": {"carrier_id": 103, "driver_id": 2},
--     "route": {"origin": "Wrocław", "destination": "Vienna"},
--     "cargo": {"type": "Food", "weight_kg": 500, "hazardous": false}
-- }');

-- 🔥 insert DYNAMIC data
-- `carrier_id` gets auto-magically populated as well :)
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
FROM generate_series(1, 800);

-- Update statistics for the planner
ANALYZE shipments;

--------------------------------------------------------------------------------

-- 🔥 Functional Indexes
-- Example 1: Extracting the year from the beginning of a date range (DATERANGE)
-- Allows you to quickly filter carriers that started working with you in a given year.
CREATE INDEX idx_carriers_contract_start_year ON carriers (
    -- lower/FROM, upper/TO
    EXTRACT(YEAR FROM lower(contract_period))
);
-- (#3) replace above index with the one below (no expression within index)
-- CREATE INDEX idx_carriers_contract ON carriers (contract_period); -- (#3) seq scan

-- 🔥 look at "INSERT INTO carriers" static/dynamic above
-- (when inserting rows, up to ~200 - seq scan, 300+ - bitmap scan)
EXPLAIN ANALYZE
SELECT company_name 
FROM carriers 
WHERE EXTRACT(YEAR FROM lower(contract_period)) = 2023; -- (#1, #3) bitmap scan
-- WHERE EXTRACT(YEAR FROM upper(contract_period)) = 2023; -- (#2) seq scan

--------------------------------------------------------------------------------

-- 🔥 Functional Indexes
-- Example 2: Index on a Deeply Embedded JSONB Field
CREATE INDEX idx_shipments_hazardous ON shipments (
    ((details -> 'cargo' ->> 'hazardous')::BOOLEAN)
);

-- -- ❌ invalid, perform a full table scan (if the query does not explicitly cast to BOOLEAN, as in the index definition)
-- EXPLAIN ANALYZE
-- SELECT * FROM shipments 
-- WHERE (details -> 'cargo' ->> 'hazardous') = 'true';

-- ✅ valid (small things matter 😇)
-- 🔥 look at "INSERT INTO shipments" static/dynamic above
-- (when inserting rows, up to ~700 - seq scan, 800+ - bitmap scan)
EXPLAIN ANALYZE
SELECT * FROM shipments 
WHERE (details -> 'cargo' ->> 'hazardous')::BOOLEAN = true;