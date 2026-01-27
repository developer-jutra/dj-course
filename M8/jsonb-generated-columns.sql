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
    details JSONB,
    -- Extract carrier_id as a persistent column for indexing and FK
    carrier_id INT GENERATED ALWAYS AS ((details->'assignment'->>'carrier_id')::INT) STORED,

    CONSTRAINT fk_carrier
        FOREIGN KEY (carrier_id)
        REFERENCES carriers(id)
);

--------------------------------------------------------------------------------

-- insert data :)
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
-- FROM generate_series(1, 500) AS gs;
-- -- Update statistics for the planner
-- ANALYZE carriers;

--------------------------------------------------------------------------------

-- 🔥 insert STATIC data
-- `carrier_id` gets auto-magically populated as well :)
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
}'),
('{
    "assignment": {"carrier_id": 101, "driver_id": 12},
    "route": {"origin": "Gdańsk", "destination": "Stockholm"},
    "cargo": {"type": "Machinery", "weight_kg": 8900, "hazardous": true}
}'),
('{
    "assignment": {"carrier_id": 103, "driver_id": 2},
    "route": {"origin": "Wrocław", "destination": "Vienna"},
    "cargo": {"type": "Food", "weight_kg": 500, "hazardous": false}
}');

-- 🔥 insert DYNAMIC data
-- INSERT INTO shipments (details)
-- SELECT 
--     jsonb_build_object(
--         'assignment', jsonb_build_object(
--             'carrier_id', (ARRAY[101, 102, 103])[floor(random() * 3 + 1)],
--             'driver_id', floor(random() * 100 + 1)
--         ),
--         'route', jsonb_build_object(
--             'origin', (ARRAY['Warsaw', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'])[floor(random() * 5 + 1)],
--             'destination', (ARRAY['Berlin', 'Prague', 'Stockholm', 'Vienna', 'Paris'])[floor(random() * 5 + 1)]
--         ),
--         'cargo', jsonb_build_object(
--             'type', (ARRAY['Electronics', 'Furniture', 'Machinery', 'Food', 'Textiles'])[floor(random() * 5 + 1)],
--             'weight_kg', floor(random() * 10000 + 100),
--             'hazardous', (random() > 0.8) -- Roughly 20% chance for true
--         )
--     )
-- FROM generate_series(1, 800);

--------------------------------------------------------------------------------

-- 1. Correct UPDATE (JSON change, carrier_id column will update itself)
-- We change the carrier from 101 to 102 for transport with ID 1
UPDATE shipments 
SET details = jsonb_set(details, '{assignment, carrier_id}', '102')
WHERE id = 1;

-- 2. INCORRECT UPDATE:
-- Attempting to directly edit a generated column will result in an error.
-- > ERROR:  column "carrier_id" can only be updated to DEFAULT
-- > Column "carrier_id" is a generated column. 
UPDATE shipments 
SET carrier_id = 103 
WHERE id = 1;

-- 3. INCORRECT INSERT - attempt to define a value for a generated column
-- ERROR:  cannot insert a non-DEFAULT value into column "carrier_id"
-- Column "carrier_id" is a generated column. 
> INSERT INTO shipments (details, carrier_id) 
> VALUES ('{"assignment": {"carrier_id": 101}, "route": {"origin": "Łódź", "destination": "Paryż"}}', 101);

-- 4. INCORRECT UPDATE - FK violation via JSON
-- If we set a carrier_id in the JSON that does not exist (e.g., 999),
-- the FK constraint will block the transaction because the generated column will assume this value.
-- > ERROR:  insert or update on table "shipments" violates foreign key constraint "fk_carrier"
-- > Key (carrier_id)=(999) is not present in table "carriers". 
UPDATE shipments 
SET details = jsonb_set(details, '{assignment, carrier_id}', '999')
WHERE id = 2;
