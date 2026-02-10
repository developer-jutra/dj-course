--------------------------------------------------------------------------------
-- 🔥 HOW TO USE: (un)comment the important bits of the script 🔥
--------------------------------------------------------------------------------

DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS resource_locks CASCADE;
-- cascade needed b/c when foreign keys are present

CREATE TABLE resources (
    id INT PRIMARY KEY,
    resource_type TEXT, -- driver | vehicle
    reference_table TEXT,
    reference_id INT,
    is_active BOOLEAN
);

CREATE TABLE resource_locks (
    id SERIAL PRIMARY KEY,
    resource_id INT REFERENCES resources(id),
    valid_period TSTZRANGE,
    metadata JSONB,
    
    -- Extract origin data as persistent columns for indexing and logic
    origin_type TEXT GENERATED ALWAYS AS (metadata->>'origin_type') STORED,
    origin_id INT GENERATED ALWAYS AS ((metadata->>'origin_id')::INT) STORED
);

--------------------------------------------------------------------------------

-- insert data :)
-- 🔥 insert STATIC data
INSERT INTO resources (id, resource_type, reference_table, reference_id, is_active) VALUES 
(1, 'driver', 'drivers', 10, true), 
(2, 'driver', 'drivers', 11, true),
(3, 'vehicle', 'vehicles', 101, true),
(4, 'vehicle', 'vehicles', 102, true),
(5, 'driver', 'drivers', 12, true),
(6, 'vehicle', 'vehicles', 103, false),
(7, 'driver', 'drivers', 13, true),
(8, 'vehicle', 'vehicles', 104, true),
(9, 'driver', 'drivers', 14, true),
(10, 'vehicle', 'vehicles', 105, true);

-- 🔥 insert DYNAMIC data
-- INSERT INTO resources (id, resource_type, reference_table, reference_id, is_active)
-- SELECT 
--     gs AS id,
--     (ARRAY['driver', 'vehicle'])[floor(random() * 2 + 1)] AS resource_type,
--     (CASE WHEN random() > 0.5 THEN 'drivers' ELSE 'vehicles' END) AS reference_table,
--     floor(random() * 1000 + 1)::INT AS reference_id,
--     (random() > 0.1) AS is_active
-- FROM generate_series(11, 500) AS gs;
-- ANALYZE resources;

--------------------------------------------------------------------------------

-- 🔥 insert STATIC data
-- `origin_type` and `origin_id` get auto-magically populated as well :)
INSERT INTO resource_locks (resource_id, valid_period, metadata) VALUES
(1, '[2026-01-21 08:00, 2026-01-21 16:00]', '{
    "origin_type": "ORDER",
    "origin_id": 5001,
    "notes": "Standard delivery delivery",
    "priority": "high"
}'),
(2, '[2026-01-22 00:00, 2026-01-25 23:59]', '{
    "origin_type": "HR_ABSENCE",
    "origin_id": 202,
    "reason": "Sick leave"
}'),
(3, '[2026-01-21 10:00, 2026-01-21 14:00]', '{
    "origin_type": "MAINTENANCE",
    "origin_id": 99,
    "service_center": "Warsaw North"
}'),
(4, '[2026-01-21 12:00, 2026-01-21 13:00]', '{
    "origin_type": "MANUAL",
    "origin_id": 1024,
    "user_id": 42
}');

-- 🔥 insert DYNAMIC data
-- INSERT INTO resource_locks (resource_id, valid_period, metadata)
-- SELECT 
--     floor(random() * 10 + 1),
--     tstzrange(now(), now() + interval '8 hours'),
--     jsonb_build_object(
--         'origin_type', (ARRAY['ORDER', 'MAINTENANCE', 'HR_ABSENCE', 'MANUAL'])[floor(random() * 4 + 1)],
--         'origin_id', floor(random() * 10000 + 1),
--         'created_at', now()
--     )
-- FROM generate_series(1, 800);

--------------------------------------------------------------------------------

-- 1. Correct UPDATE (JSON change, origin_type column will update itself)
-- Changing the origin from ORDER to MAINTENANCE for lock with ID 1
UPDATE resource_locks 
SET metadata = jsonb_set(metadata, '{origin_type}', '"MAINTENANCE"')
WHERE id = 1;
-- Verification
SELECT id, origin_type, origin_id 
FROM resource_locks 
WHERE origin_type = 'MAINTENANCE';

-- 2. INCORRECT UPDATE:
-- Attempting to directly edit a generated column will result in an error.
-- > ERROR:  column "origin_type" can only be updated to DEFAULT
UPDATE resource_locks 
SET origin_type = 'HR_ABSENCE' 
WHERE id = 1;

-- 3. INCORRECT INSERT - attempt to define a value for a generated column
-- ERROR:  cannot insert a non-DEFAULT value into column "origin_id"
INSERT INTO resource_locks (resource_id, metadata, origin_id) 
VALUES (1, '{"origin_type": "MANUAL", "origin_id": 777}', 777);
