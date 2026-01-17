--------------------------------------------------------------------------------
-- 🔥 HOW TO USE: (un)comment the important bits of the script 🔥
--------------------------------------------------------------------------------

DROP TABLE IF EXISTS carriers CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
-- cascade needed b/c when foreign keys are present

CREATE TABLE carriers (
    id INT PRIMARY KEY,
    company_name TEXT NOT NULL,
    fleet_size INT,
    contract_period DATERANGE,
	region_code INT
);

CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    carrier_id INT,
	weight_kg DECIMAL(10,2),
    details JSONB,
    
	CONSTRAINT fk_carrier
		FOREIGN KEY (carrier_id)
		REFERENCES carriers(id)
);

--------------------------------------------------------------------------------

-- 🔥 insert DYNAMIC data
INSERT INTO carriers (id, company_name, fleet_size, contract_period, region_code)
SELECT 
    gs AS id,
    (ARRAY['Trans', 'Euro', 'Global', 'Eco', 'Fast', 'Nordic', 'Baltic', 'Sky', 'Rapid', 'Prime'])[floor(random() * 10 + 1)] || 
    (ARRAY['Logistics', 'Cargo', 'Freight', 'Transit', 'Haulage', 'Shipments', 'Way', 'Runners', 'Speed', 'Link'])[floor(random() * 10 + 1)] || 
    ' ' || gs AS company_name,
    floor(random() * 200 + 10)::INT AS fleet_size,
    daterange(
        '2023-01-01'::DATE + (random() * 365)::INT, 
        '2025-01-01'::DATE + (random() * 730)::INT
    ) AS contract_period,
	(gs % 10) + 1 AS region_code
FROM generate_series(1, 1000) AS gs;
-- Update statistics for the planner
ANALYZE carriers;

--------------------------------------------------------------------------------

-- 🔥 insert DYNAMIC data
INSERT INTO shipments (carrier_id, weight_kg, details)
SELECT 
	floor(random() * 1000 + 1),
	(random() * 1000)::decimal(10,2),
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

CREATE INDEX idx_carriers_fleet_size ON carriers(fleet_size);
ANALYZE carriers;

EXPLAIN ANALYZE
SELECT * FROM carriers 
WHERE fleet_size BETWEEN 10 AND 20; -- ✅ valid, bitmap scan
-- WHERE ABS(fleet_size) < 20; -- ❌ invalid, function call prevents index usage unless it's a functional index (see: function/expression indexes)

--------------------------------------------------------------------------------
-- index over a foreign key - fundamental for efficient JOINs
CREATE INDEX idx_shipments_carrier_id ON shipments(carrier_id);

EXPLAIN ANALYZE
SELECT c.company_name, s.id
FROM carriers c
JOIN shipments s ON c.id = s.carrier_id
WHERE c.id = 100; -- ✅ nested loop / index scan(carriers) + bitmap scan (shipments)
-- -- nested loop (nested for loop) fits rather small datasets OR where indexes apply
-- -- Planner chooses the table with SMALLER filtering COST as the OUTER LOOP (index scan fits very well often here)
-- -- Then, for each record, searches the other table inside the INNER LOOP (bitmap scan often fits very well here, unless e.g. very few records etc.)
-- WHERE s.carrier_id::TEXT = '100'; -- ❌ hash join/seq scan (shipments) + seq scan (carriers) // type mismatch of the indexed column (deliberate casting) makes the index unusable
-- -- hash join often used for big datasets OR where no indexes can be applied

-- 😱😱😱 INVERTED JOIN still works!!!1eleven
-- (FROM carriers c JOIN shipments s -> FROM shipments s JOIN carriers c)
EXPLAIN ANALYZE
SELECT c.company_name, s.id
FROM shipments s
JOIN carriers c ON s.carrier_id = c.id
WHERE c.id = 42; -- ✅ nested loop / index scan(carriers) + bitmap scan (shipments)
-- as you can see: index scan/bitmap scan order is the same as in the previous example
-- => carriers is still the OUTER LOOP

--------------------------------------------------------------------------------
-- missing appropriate index 🤷

-- (#2) add MULTICOLUMN index (🔥 Left-Prefix Rule 🔥)
-- CREATE INDEX idx_carriers_region_company ON carriers(region_code, company_name); -- ❌ seq scan
-- -- region_code has to be FIRST to be used
-- CREATE INDEX idx_carriers_region_company ON carriers(company_name, region_code); -- ✅ index scan

-- (#1) no index, ❌ seq scan
EXPLAIN ANALYZE
SELECT * FROM carriers 
WHERE company_name = 'Carrier 42';

--------------------------------------------------------------------------------
-- 🔥 very low selectivity 🤷
-- even though the INDEX EXISTS, the results would include so many records
-- that it'd be faster to just run 'seq scan' (as index scan is additional I/O)
-- (BTW LOW selectivity - LOTS of results / HIGH selectivity - very LITTLE results)

EXPLAIN ANALYZE
SELECT * FROM shipments 
WHERE carrier_id > 0; -- ❌ seq scan

--------------------------------------------------------------------------------
-- LIMIT - a "special case"

EXPLAIN ANALYZE SELECT * FROM shipments LIMIT 10; -- WHY? seq scan
-- (🔥 LIMIT 10 tells the planner to stop after 10 records so why bother with ADDITIONALindex scan?)

--------------------------------------------------------------------------------
CREATE INDEX idx_shipments_weight ON shipments(weight_kg);
-- ANALYZE shipments;

-- EXPLAIN ANALYZE SELECT weight_kg FROM shipments WHERE weight_kg > 500; -- ❌ seq scan; too low selectivity
EXPLAIN ANALYZE SELECT weight_kg FROM shipments WHERE weight_kg > 999; -- ✅ INDEX ONLY SCAN 🔥; high selectivity
-- EXPLAIN SELECT * FROM shipments WHERE weight_kg > 998;  -- ✅ bitmap scan (needed more columns than index has); high selectivity

-- PS if you keep on getting "bitmap scan" for where "index only scan is expected" (could happen)
-- then make sure that postgres' visibility map is up to date by running the following separately (!)
-- (and make sure you don't clear the table before)
-- 👉 FIRST (separately) this:
-- VACUUM ANALYZE shipments;
-- 👉 AND THEN (separately):
-- EXPLAIN ANALYZE SELECT weight_kg FROM shipments WHERE weight_kg > 999; -- ✅ now it should be INDEX ONLY SCAN 🔥

--------------------------------------------------------------------------------
-- A tak swoją drogą... jak czytać QUERY PLAN? 🤔
-- width? To średnia liczba bajtów, jaką zajmuje jeden wiersz wynikowy (wszystkie kolumny wybrane w SELECT).
-- rows? (najważniejszy parametr dla optymalizatora) To liczba wierszy, którą optymalizator spodziewa się "wyprodukować" w tym kroku. W Twoim przykładzie: rows=969.
-- cost? Postgres nie operuje na sekundach, bo te zależą od obciążenia procesora czy szybkości dysku. Używa jednostek kosztu, gdzie bazą jest 1.0 (koszt odczytu jednej strony danych sekwencyjnie).
--   0.28 (Startup Cost): Koszt przygotowania do pracy (np. otwarcie indeksu).
--   33.23 (Total Cost): Przewidywany koszt wykonania całego kroku.
--   Skąd to się bierze? To suma wag: seq_page_cost, random_page_cost, cpu_tuple_cost i cpu_operator_cost.
-- loops? Mówi o tym, ile razy dany węzeł planu został uruchomiony. Loops=1: Standard dla skanowania tabeli.
--   Kiedy jest ich więcej? Głównie w Nested Loop Join. Jeśli łączysz dwie tabele, Postgres bierze wiersz z pierwszej i dla każdego z nich wykonuje "pętlę" przeszukiwania w drugiej. Wtedy zobaczysz np. loops=1000.

