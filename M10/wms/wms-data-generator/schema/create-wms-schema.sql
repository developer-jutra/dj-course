-- Clean up previous tables
DROP TABLE IF EXISTS cargo_event_history CASCADE;
DROP TABLE IF EXISTS cargo_event_type CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS storage_record CASCADE;
DROP TABLE IF EXISTS storage_reservation CASCADE;
DROP TABLE IF EXISTS storage_request CASCADE;
DROP TABLE IF EXISTS employee_warehouse CASCADE;
DROP TABLE IF EXISTS party_role CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS address CASCADE;
DROP TABLE IF EXISTS party_relationship CASCADE;
DROP TABLE IF EXISTS party_contact CASCADE;
DROP TABLE IF EXISTS party CASCADE;
DROP TABLE IF EXISTS capacity CASCADE;
DROP TABLE IF EXISTS shelf CASCADE;
DROP TABLE IF EXISTS rack CASCADE;
DROP TABLE IF EXISTS aisle CASCADE;
DROP TABLE IF EXISTS zone CASCADE;
DROP TABLE IF EXISTS warehouse CASCADE;
DROP TABLE IF EXISTS location CASCADE;

-- 1. LOCATIONS
CREATE TABLE location (
    location_id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL
);

-- 2. WAREHOUSES
CREATE TABLE warehouse (
    warehouse_id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES location(location_id),
    name TEXT NOT NULL,
    description TEXT NOT NULL
);
-- Basic FK index only
CREATE INDEX idx_warehouse_location_id ON warehouse(location_id);

-- 3. ZONES
CREATE TABLE zone (
    zone_id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id),
    name TEXT NOT NULL,
    description TEXT NOT NULL
);
CREATE INDEX idx_zone_warehouse_id ON zone(warehouse_id);

-- 4. AISLES
CREATE TABLE aisle (
    aisle_id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL REFERENCES zone(zone_id),
    label TEXT NOT NULL,
    width INTEGER NOT NULL,
    width_unit TEXT NOT NULL
);
CREATE INDEX idx_aisle_zone_id ON aisle(zone_id);

-- 5. RACKS
CREATE TABLE rack (
    rack_id SERIAL PRIMARY KEY,
    aisle_id INTEGER NOT NULL REFERENCES aisle(aisle_id),
    label TEXT NOT NULL,
    max_height INTEGER NOT NULL,
    height_unit TEXT NOT NULL
);
CREATE INDEX idx_rack_aisle_id ON rack(aisle_id);

-- 6. SHELVES
CREATE TABLE shelf (
    shelf_id SERIAL PRIMARY KEY,
    rack_id INTEGER NOT NULL REFERENCES rack(rack_id),
    level TEXT NOT NULL,
    max_weight NUMERIC NOT NULL,
    max_volume NUMERIC NOT NULL
);
CREATE INDEX idx_shelf_rack_id ON shelf(rack_id);

-- 7. CAPACITY
CREATE TABLE capacity (
    capacity_id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('WAREHOUSE','ZONE','RACK','SHELF')),
    entity_id INTEGER NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    description TEXT
);
-- Composite index exists, but likely insufficient for complex aggregations without covering columns
CREATE INDEX idx_capacity_entity ON capacity(entity_type, entity_id);

-- 8. PARTY
CREATE TABLE party (
    party_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact_email TEXT, -- Important: No index here implies full scan on search
    contact_phone TEXT,
    data JSONB, -- Important: No GIN index here
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. PARTY CONTACTS
CREATE TABLE party_contact (
    contact_id SERIAL PRIMARY KEY,
    party_id INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    details TEXT NOT NULL
);
CREATE INDEX idx_party_contact_party_id ON party_contact(party_id);

-- 10. PARTY RELATIONSHIP
CREATE TABLE party_relationship (
    relationship_id SERIAL PRIMARY KEY,
    party_id_primary INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    party_id_secondary INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    notes TEXT
);
CREATE INDEX idx_party_relationship_primary ON party_relationship(party_id_primary);
CREATE INDEX idx_party_relationship_secondary ON party_relationship(party_id_secondary);

-- 11. ADDRESS
CREATE TABLE address (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    party_id INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    address_type TEXT NOT NULL CHECK (address_type IN ('BILLING','SHIPPING','CORPORATE','PERSONAL','OTHER'))
);
CREATE INDEX idx_address_party_id ON address(party_id);

-- 12. ROLES
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name IN ('DIRECTOR','WAREHOUSE_MANAGER','LOGISTICS_COORDINATOR','STORAGE_APPROVER','OPERATOR')),
    description TEXT NOT NULL
);
CREATE UNIQUE INDEX idx_role_name ON role(name);

-- 13. PARTY ROLES
CREATE TABLE party_role (
    party_id INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES role(role_id) ON DELETE CASCADE,
    assigned_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (party_id, role_id)
);
CREATE INDEX idx_party_role_party_id ON party_role(party_id);
CREATE INDEX idx_party_role_role_id ON party_role(role_id);

-- 14. EMPLOYEE-WAREHOUSE
CREATE TABLE employee_warehouse (
    party_id INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id) ON DELETE CASCADE,
    assigned_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_until TIMESTAMP,
    PRIMARY KEY (party_id, warehouse_id, assigned_from)
);
CREATE INDEX idx_employee_warehouse_party_id ON employee_warehouse(party_id);
CREATE INDEX idx_employee_warehouse_warehouse ON employee_warehouse(warehouse_id);

-- 15. STORAGE REQUESTS
CREATE TABLE storage_request (
    request_id SERIAL PRIMARY KEY,
    issuing_party_id INTEGER NOT NULL REFERENCES party(party_id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id),
    requested_entry_date TIMESTAMP NOT NULL,
    requested_exit_date TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING','ACCEPTED','REJECTED')) DEFAULT 'PENDING',
    decisive_party_id INTEGER REFERENCES party(party_id),
    decision_date TIMESTAMP
);
CREATE INDEX idx_storage_request_issuing_party_id ON storage_request(issuing_party_id);
CREATE INDEX idx_storage_request_warehouse_id ON storage_request(warehouse_id);
CREATE INDEX idx_storage_request_decisive_party_id ON storage_request(decisive_party_id);

-- 16. STORAGE RESERVATIONS
CREATE TABLE storage_reservation (
    reservation_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES storage_request(request_id) ON DELETE CASCADE,
    party_id INTEGER NOT NULL REFERENCES party(party_id),
    shelf_id INTEGER NOT NULL REFERENCES shelf(shelf_id),
    reserved_weight NUMERIC NOT NULL,
    reserved_volume NUMERIC NOT NULL,
    reserved_from TIMESTAMP NOT NULL,
    reserved_until TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING','ACTIVE','EXPIRED','CANCELLED')) DEFAULT 'PENDING'
);
CREATE INDEX idx_storage_reservation_request_id ON storage_reservation(request_id);
CREATE INDEX idx_storage_reservation_party_id ON storage_reservation(party_id);
CREATE INDEX idx_storage_reservation_shelf_id ON storage_reservation(shelf_id);

-- 17. STORAGE RECORDS
CREATE TABLE storage_record (
    storage_record_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES storage_request(request_id),
    party_id INTEGER NOT NULL REFERENCES party(party_id),
    shelf_id INTEGER NOT NULL REFERENCES shelf(shelf_id),
    actual_entry_date TIMESTAMP NOT NULL,
    actual_exit_date TIMESTAMP,
    cargo_description TEXT NOT NULL,
    cargo_weight NUMERIC NOT NULL,
    cargo_volume NUMERIC NOT NULL
);
CREATE INDEX idx_storage_record_request_id ON storage_record(request_id);
CREATE INDEX idx_storage_record_party_id ON storage_record(party_id);
CREATE INDEX idx_storage_record_shelf_id ON storage_record(shelf_id);

-- 18. PAYMENTS
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    storage_record_id INTEGER NOT NULL REFERENCES storage_record(storage_record_id) ON DELETE CASCADE,
    party_id INTEGER NOT NULL REFERENCES party(party_id),
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING','PAID','FAILED','CANCELLED')) DEFAULT 'PENDING',
    payment_date TIMESTAMP,
    external_reference TEXT
);
CREATE INDEX idx_payment_party_id ON payment(party_id);
CREATE INDEX idx_payment_storage_record_id ON payment(storage_record_id);

-- 19. CARGO EVENT TYPES
CREATE TABLE cargo_event_type (
    event_type_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);
CREATE UNIQUE INDEX idx_cargo_event_type_name ON cargo_event_type(name);

-- 20. CARGO EVENT HISTORY
CREATE TABLE cargo_event_history (
    event_id SERIAL PRIMARY KEY,
    party_id INTEGER NOT NULL REFERENCES party(party_id),
    storage_record_id INTEGER NOT NULL REFERENCES storage_record(storage_record_id) ON DELETE CASCADE,
    event_type_id INTEGER NOT NULL REFERENCES cargo_event_type(event_type_id),
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);
CREATE INDEX idx_cargo_event_history_party_id ON cargo_event_history(party_id);
CREATE INDEX idx_cargo_event_history_storage_record_id ON cargo_event_history(storage_record_id);
CREATE INDEX idx_cargo_event_history_event_type_id ON cargo_event_history(event_type_id);
