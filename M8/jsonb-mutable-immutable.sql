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

SELECT metadata->'route' || '{"suffix": true}'::jsonb
FROM shipments;

-- open separate terminal/tab to see `shipments` full content
-- then run the following query and RE-RUN `shipments` to see the changes

UPDATE shipments
SET metadata = jsonb_set(
    metadata, 
    '{route}', 
    (metadata->'route') || '{"suffix": true}'::jsonb
);
