DROP TABLE IF EXISTS shipments CASCADE;

CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    tracking_number TEXT,
    metadata JSONB
);

INSERT INTO shipments (tracking_number, metadata) VALUES
(
    'PL12345', 
    '{
        "route": {"origin": "Warszawa", "destination": "Berlin"},
        "tags": ["express", "fragile"],
        "weight_kg": 15.5
    }'
),
(
    'DE67890', 
    '{
        "route": {"origin": "Hamburg", "destination": "Kraków"},
        "tags": ["standard"],
        "weight_kg": 2.0
    }'
);

SELECT 1 + 1; -- `?column?`;
SELECT metadata->'route' || '{"suffix": true}'::jsonb FROM shipments; -- `?column?`
SELECT UPPER(tracking_number) FROM shipments; -- `upper`
SELECT ('ID: ' || UPPER(tracking_number)) FROM shipments; -- `?column?`
-- SELECT ("ID: " || UPPER(tracking_number)) FROM shipments; -- syntax error (' vs ")

SELECT metadata -> 'route', metadata ->> 'route' FROM shipments; -- see jsonb vs text
-- WATCH OUT: client libs / ORMs might return string anyway


-- oh and BTW, we're using the following for fake data generation within pgsql
SELECT generate_series(1,10);
SELECT generate_series(1,10) AS idx;
-- INSERT INTO ... (id, ...) VALUES SELECT generate_series(1,10) AS idx, ...
