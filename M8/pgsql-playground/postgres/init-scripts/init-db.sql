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