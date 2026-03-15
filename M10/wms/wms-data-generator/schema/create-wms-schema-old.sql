--XXX
DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS warehouse CASCADE;
DROP TABLE IF EXISTS zone CASCADE;
DROP TABLE IF EXISTS aisle CASCADE;
DROP TABLE IF EXISTS rack CASCADE;
DROP TABLE IF EXISTS shelf CASCADE;
DROP TABLE IF EXISTS capacity CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS employee_role CASCADE;
DROP TABLE IF EXISTS storage_request CASCADE;
DROP TABLE IF EXISTS storage_reservation CASCADE;
DROP TABLE IF EXISTS storage_record CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS storage_event_type CASCADE;
DROP TABLE IF EXISTS storage_event_history CASCADE;
DROP TABLE IF EXISTS employee_warehouse CASCADE;

-- LOCATIONS
CREATE TABLE location (
    location_id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL
);

-- WAREHOUSES
CREATE TABLE warehouse (
    warehouse_id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES location(location_id),
    name TEXT NOT NULL
);

CREATE INDEX idx_warehouse_location_id ON warehouse(location_id);

-- ZONES
CREATE TABLE zone (
    zone_id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id),
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE INDEX idx_zone_warehouse_id ON zone(warehouse_id);

-- AISLES
CREATE TABLE aisle (
    aisle_id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL REFERENCES zone(zone_id),
    label TEXT NOT NULL,
    width INTEGER NOT NULL,
    width_unit TEXT NOT NULL
);

CREATE INDEX idx_aisle_zone_id ON aisle(zone_id);

-- RACKS
CREATE TABLE rack (
    rack_id SERIAL PRIMARY KEY,
    aisle_id INTEGER NOT NULL REFERENCES aisle(aisle_id),
    label TEXT NOT NULL,
    max_height INTEGER NOT NULL,
    height_unit TEXT NOT NULL
);

CREATE INDEX idx_rack_aisle_id ON rack(aisle_id);

-- SHELVES
CREATE TABLE shelf (
    shelf_id SERIAL PRIMARY KEY,
    rack_id INTEGER NOT NULL REFERENCES rack(rack_id),
    level TEXT NOT NULL,
    max_weight NUMERIC NOT NULL,
    max_volume NUMERIC NOT NULL
);

CREATE INDEX idx_shelf_rack_id ON shelf(rack_id);

-- CAPACITY (Polymorphic association)
CREATE TABLE capacity (
    capacity_id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('WAREHOUSE','ZONE','RACK','SHELF')),
    entity_id INTEGER NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    description TEXT
);

CREATE INDEX idx_capacity_entity ON capacity(entity_type, entity_id);

-- CUSTOMERS
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
);

-- EMPLOYEES
CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    hire_date DATE NOT NULL
);

-- ROLES
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- EMPLOYEE ROLES
CREATE TABLE employee_role (
    employee_id INTEGER NOT NULL REFERENCES employee(employee_id),
    role_id INTEGER NOT NULL REFERENCES role(role_id),
    assigned_date DATE NOT NULL,
    PRIMARY KEY (employee_id, role_id)
);

-- EMPLOYEE-WAREHOUSE RELATION (many-to-many)
CREATE TABLE employee_warehouse (
    employee_id INTEGER NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id) ON DELETE CASCADE,
    assigned_from DATE NOT NULL,
    assigned_until DATE,
    PRIMARY KEY (employee_id, warehouse_id, assigned_from)
);

CREATE INDEX idx_employee_warehouse_employee ON employee_warehouse(employee_id);
CREATE INDEX idx_employee_warehouse_warehouse ON employee_warehouse(warehouse_id);

ALTER TABLE employee_warehouse ADD CONSTRAINT chk_assigned_dates CHECK (assigned_until IS NULL OR assigned_from < assigned_until);

-- STORAGE REQUESTS
CREATE TABLE storage_request (
    request_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id),
    requested_entry_date TIMESTAMP NOT NULL,
    requested_exit_date TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending','accepted','rejected')),
    decision_employee_id INTEGER REFERENCES employee(employee_id),
    decision_date TIMESTAMP
);

CREATE INDEX idx_storage_request_customer_id ON storage_request(customer_id);
CREATE INDEX idx_storage_request_warehouse_id ON storage_request(warehouse_id);

-- STORAGE RESERVATIONS
CREATE TABLE storage_reservation (
    reservation_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES storage_request(request_id),
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    shelf_id INTEGER NOT NULL REFERENCES shelf(shelf_id),
    reserved_weight NUMERIC NOT NULL,
    reserved_volume NUMERIC NOT NULL,
    reserved_from TIMESTAMP NOT NULL,
    reserved_until TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending','active','expired','cancelled'))
);

CREATE INDEX idx_storage_reservation_request_id ON storage_reservation(request_id);
CREATE INDEX idx_storage_reservation_customer_id ON storage_reservation(customer_id);
CREATE INDEX idx_storage_reservation_shelf_id ON storage_reservation(shelf_id);

-- STORAGE RECORDS
CREATE TABLE storage_record (
    storage_record_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES storage_request(request_id),
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    shelf_id INTEGER NOT NULL REFERENCES shelf(shelf_id),
    actual_entry_date TIMESTAMP NOT NULL,
    actual_exit_date TIMESTAMP,
    cargo_description TEXT NOT NULL,
    cargo_weight NUMERIC NOT NULL,
    cargo_volume NUMERIC NOT NULL
);

CREATE INDEX idx_storage_record_customer_id ON storage_record(customer_id);
CREATE INDEX idx_storage_record_shelf_id ON storage_record(shelf_id);

-- PAYMENTS
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    storage_record_id INTEGER NOT NULL REFERENCES storage_record(storage_record_id),
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending','paid','failed','cancelled')),
    payment_date TIMESTAMP,
    external_reference TEXT
);

CREATE INDEX idx_payment_customer_id ON payment(customer_id);
CREATE INDEX idx_payment_storage_record_id ON payment(storage_record_id);

-- STORAGE EVENT TYPES
CREATE TABLE storage_event_type (
    event_type_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE UNIQUE INDEX idx_storage_event_type_name ON storage_event_type(name);

-- STORAGE EVENT HISTORY
CREATE TABLE storage_event_history (
    event_id SERIAL PRIMARY KEY,
    storage_record_id INTEGER NOT NULL REFERENCES storage_record(storage_record_id),
    event_type_id INTEGER NOT NULL REFERENCES storage_event_type(event_type_id),
    event_time TIMESTAMP NOT NULL,
    employee_id INTEGER REFERENCES employee(employee_id),
    details JSONB
);

CREATE INDEX idx_storage_event_history_storage_record_id ON storage_event_history(storage_record_id);
CREATE INDEX idx_storage_event_history_event_type_id ON storage_event_history(event_type_id);
