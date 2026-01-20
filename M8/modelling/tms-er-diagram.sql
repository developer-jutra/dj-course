-- ============================================================
-- TMS (Transport Management System) - Database Schema
-- PostgreSQL 14+
-- Generated from: tms-er-diagram.mmd
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================

-- Required for GiST index on integer columns (resource_id in EXCLUDE constraint)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================
-- DROP TABLES (in reverse dependency order)
-- ============================================================

DROP TABLE IF EXISTS MANIFEST_ITEM CASCADE;
DROP TABLE IF EXISTS TRANSPORT_RESOURCE CASCADE;
DROP TABLE IF EXISTS TRANSPORT CASCADE;
DROP TABLE IF EXISTS RESOURCE_AVAILABILITY CASCADE;
DROP TABLE IF EXISTS RESOURCE CASCADE;
DROP TABLE IF EXISTS SHIPMENT CASCADE;
DROP TABLE IF EXISTS "ORDER" CASCADE;
DROP TABLE IF EXISTS ORDER_STATUS CASCADE;
DROP TABLE IF EXISTS ADDRESS CASCADE;
DROP TABLE IF EXISTS CONTRAHENT CASCADE;
DROP TABLE IF EXISTS DRIVER_DOCUMENT CASCADE;
DROP TABLE IF EXISTS HR_DRIVER CASCADE;
DROP TABLE IF EXISTS FLEET_VEHICLE CASCADE;
DROP TABLE IF EXISTS VEHICLE_CATEGORY CASCADE;

-- ============================================================
-- CREATE TABLES
-- ============================================================

-- MODUŁ KADROWY (HR)
-- ============================================================

CREATE TABLE HR_DRIVER (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    contact_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DRIVER_DOCUMENT (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL,
    doc_type VARCHAR(50) NOT NULL,
    doc_number VARCHAR(100) NOT NULL,
    expiry_date DATE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_driver_document_driver FOREIGN KEY (driver_id) 
        REFERENCES HR_DRIVER(id) ON DELETE CASCADE
);

-- MODUŁ FLOTY (FLEET)
-- ============================================================

CREATE TABLE VEHICLE_CATEGORY (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE FLEET_VEHICLE (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    plates VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE NOT NULL,
    technical_specs JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fleet_vehicle_category FOREIGN KEY (category_id) 
        REFERENCES VEHICLE_CATEGORY(id) ON DELETE RESTRICT
);

-- MODUŁ ZASOBÓW I DOSTĘPNOŚCI
-- ============================================================

CREATE TABLE RESOURCE (
    id SERIAL PRIMARY KEY,
    resource_type VARCHAR(20) NOT NULL CHECK (resource_type IN ('DRIVER', 'VEHICLE', 'WAREHOUSE')),
    metadata JSONB,
    external_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RESOURCE_AVAILABILITY (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER NOT NULL,
    busy_range TSRANGE NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('TRANSPORT', 'MAINTENANCE', 'HOLIDAY', 'OTHER')),
    reference_transport_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resource_availability_resource FOREIGN KEY (resource_id) 
        REFERENCES RESOURCE(id) ON DELETE CASCADE,
    CONSTRAINT chk_no_overlap EXCLUDE USING GIST (resource_id WITH =, busy_range WITH &&)
);

-- MODUŁ ZAMÓWIEŃ (SALES)
-- ============================================================

CREATE TABLE CONTRAHENT (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    internal_code VARCHAR(50) UNIQUE,
    contact_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ADDRESS (
    id SERIAL PRIMARY KEY,
    contrahent_id INTEGER NOT NULL,
    label VARCHAR(100),
    full_address_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_address_contrahent FOREIGN KEY (contrahent_id) 
        REFERENCES CONTRAHENT(id) ON DELETE CASCADE
);

CREATE TABLE ORDER_STATUS (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ORDER" (
    id SERIAL PRIMARY KEY,
    contrahent_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    customer_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline TIMESTAMP,
    total_agreed_price DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'PLN',
    internal_notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_contrahent FOREIGN KEY (contrahent_id) 
        REFERENCES CONTRAHENT(id) ON DELETE RESTRICT,
    CONSTRAINT fk_order_status FOREIGN KEY (status_id) 
        REFERENCES ORDER_STATUS(id) ON DELETE RESTRICT
);

CREATE TABLE SHIPMENT (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    pickup_address_snapshot JSONB NOT NULL,
    delivery_address_snapshot JSONB NOT NULL,
    weight DECIMAL(10, 2),
    pallets_count INTEGER,
    goods_description TEXT,
    requirements JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shipment_order FOREIGN KEY (order_id) 
        REFERENCES "ORDER"(id) ON DELETE CASCADE
);

-- MODUŁ TRANSPORTU (OPERATIONS)
-- ============================================================

CREATE TABLE TRANSPORT (
    id SERIAL PRIMARY KEY,
    transport_status_id INTEGER NOT NULL CHECK (transport_status_id IN (1, 2, 3, 4)),
    scheduled_range TSRANGE,
    route_notes TEXT,
    estimated_km DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TRANSPORT_RESOURCE (
    id SERIAL PRIMARY KEY,
    transport_id INTEGER NOT NULL,
    resource_id INTEGER NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('PRIMARY_DRIVER', 'SUPPORT_DRIVER', 'VEHICLE', 'TRAILER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transport_resource_transport FOREIGN KEY (transport_id) 
        REFERENCES TRANSPORT(id) ON DELETE CASCADE,
    CONSTRAINT fk_transport_resource_resource FOREIGN KEY (resource_id) 
        REFERENCES RESOURCE(id) ON DELETE RESTRICT,
    CONSTRAINT uq_transport_resource UNIQUE (transport_id, resource_id, role)
);

CREATE TABLE MANIFEST_ITEM (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL,
    transport_id INTEGER NOT NULL,
    sequence_order INTEGER NOT NULL,
    action_type VARCHAR(10) NOT NULL CHECK (action_type IN ('LOAD', 'UNLOAD')),
    actual_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_manifest_item_shipment FOREIGN KEY (shipment_id) 
        REFERENCES SHIPMENT(id) ON DELETE RESTRICT,
    CONSTRAINT fk_manifest_item_transport FOREIGN KEY (transport_id) 
        REFERENCES TRANSPORT(id) ON DELETE CASCADE,
    CONSTRAINT uq_transport_sequence UNIQUE (transport_id, sequence_order)
);

-- ============================================================
-- CREATE INDEXES
-- ============================================================

-- HR Module Indexes
CREATE INDEX idx_driver_document_driver_id ON DRIVER_DOCUMENT(driver_id);
CREATE INDEX idx_driver_document_expiry_date ON DRIVER_DOCUMENT(expiry_date) WHERE expiry_date IS NOT NULL;

-- Fleet Module Indexes
CREATE INDEX idx_fleet_vehicle_category_id ON FLEET_VEHICLE(category_id);
CREATE INDEX idx_fleet_vehicle_plates ON FLEET_VEHICLE(plates);

-- Resource Module Indexes
CREATE INDEX idx_resource_type ON RESOURCE(resource_type);
CREATE INDEX idx_resource_external_id ON RESOURCE(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX idx_resource_availability_resource_id ON RESOURCE_AVAILABILITY(resource_id);
CREATE INDEX idx_resource_availability_busy_range ON RESOURCE_AVAILABILITY USING GIST(busy_range);
CREATE INDEX idx_resource_availability_reason ON RESOURCE_AVAILABILITY(reason);
CREATE INDEX idx_resource_availability_ref_transport ON RESOURCE_AVAILABILITY(reference_transport_id) WHERE reference_transport_id IS NOT NULL;

-- Sales Module Indexes
CREATE INDEX idx_address_contrahent_id ON ADDRESS(contrahent_id);
CREATE INDEX idx_contrahent_tax_id ON CONTRAHENT(tax_id) WHERE tax_id IS NOT NULL;
CREATE INDEX idx_order_contrahent_id ON "ORDER"(contrahent_id);
CREATE INDEX idx_order_status_id ON "ORDER"(status_id);
CREATE INDEX idx_order_created_at ON "ORDER"(created_at);
CREATE INDEX idx_order_deadline ON "ORDER"(deadline) WHERE deadline IS NOT NULL;
CREATE INDEX idx_shipment_order_id ON SHIPMENT(order_id);

-- Transport Module Indexes
CREATE INDEX idx_transport_status ON TRANSPORT(transport_status_id);
CREATE INDEX idx_transport_scheduled_range ON TRANSPORT USING GIST(scheduled_range);
CREATE INDEX idx_transport_resource_transport_id ON TRANSPORT_RESOURCE(transport_id);
CREATE INDEX idx_transport_resource_resource_id ON TRANSPORT_RESOURCE(resource_id);
CREATE INDEX idx_manifest_item_shipment_id ON MANIFEST_ITEM(shipment_id);
CREATE INDEX idx_manifest_item_transport_id ON MANIFEST_ITEM(transport_id);
CREATE INDEX idx_manifest_item_sequence ON MANIFEST_ITEM(transport_id, sequence_order);

-- ============================================================
-- INSERT SAMPLE DATA
-- ============================================================

-- VEHICLE_CATEGORY
INSERT INTO VEHICLE_CATEGORY (name, code) VALUES
('Ciężarówka 3.5t', 'TRUCK_3.5T'),
('Ciężarówka 12t', 'TRUCK_12T'),
('Naczepa Standard', 'TRAILER_STD'),
('Naczepa Chłodnia', 'TRAILER_COOL'),
('Kontener 20ft', 'CONTAINER_20');

-- HR_DRIVER
INSERT INTO HR_DRIVER (first_name, last_name, employee_id, contact_info) VALUES
('Jan', 'Kowalski', 'DRV-001', '{"phone": "+48 500 100 200", "email": "jan.kowalski@tms.pl"}'),
('Piotr', 'Nowak', 'DRV-002', '{"phone": "+48 500 100 201", "email": "piotr.nowak@tms.pl"}'),
('Anna', 'Wiśniewska', 'DRV-003', '{"phone": "+48 500 100 202", "email": "anna.wisniewska@tms.pl"}'),
('Marek', 'Kamiński', 'DRV-004', '{"phone": "+48 500 100 203", "email": "marek.kaminski@tms.pl"}');

-- DRIVER_DOCUMENT
INSERT INTO DRIVER_DOCUMENT (driver_id, doc_type, doc_number, expiry_date, metadata) VALUES
(1, 'DRIVING_LICENSE', 'PL12345/67/8901', '2028-12-31', '{"categories": ["B", "C", "CE"]}'),
(1, 'ADR_CERTIFICATE', 'ADR/2024/001234', '2026-06-30', '{"class": "1,3,4,5,6,8,9"}'),
(2, 'DRIVING_LICENSE', 'PL98765/43/2100', '2027-08-15', '{"categories": ["B", "C"]}'),
(3, 'DRIVING_LICENSE', 'PL55555/22/3333', '2029-03-20', '{"categories": ["B", "C", "CE"]}'),
(4, 'DRIVING_LICENSE', 'PL77777/88/9999', '2026-11-10', '{"categories": ["B", "C"]}');

-- FLEET_VEHICLE
INSERT INTO FLEET_VEHICLE (category_id, plates, vin, technical_specs) VALUES
(2, 'WX 12345', '1HGBH41JXMN109186', '{"max_load": 12000, "fuel_type": "DIESEL", "euro_norm": "EURO6"}'),
(2, 'WX 23456', '2HGBH41JXMN209187', '{"max_load": 12000, "fuel_type": "DIESEL", "euro_norm": "EURO6"}'),
(3, 'WX 34567', '3HGBH41JXMN309188', '{"max_load": 24000, "length": 13.6, "type": "CURTAIN_SIDER"}'),
(4, 'WX 45678', '4HGBH41JXMN409189', '{"max_load": 24000, "length": 13.6, "type": "REFRIGERATED", "temp_range": "-25/+25"}');

-- RESOURCE
INSERT INTO RESOURCE (resource_type, metadata, external_id) VALUES
('DRIVER', '{"name": "Jan Kowalski", "employee_id": "DRV-001"}', 1),
('DRIVER', '{"name": "Piotr Nowak", "employee_id": "DRV-002"}', 2),
('DRIVER', '{"name": "Anna Wiśniewska", "employee_id": "DRV-003"}', 3),
('DRIVER', '{"name": "Marek Kamiński", "employee_id": "DRV-004"}', 4),
('VEHICLE', '{"plates": "WX 12345", "type": "TRUCK_12T"}', 1),
('VEHICLE', '{"plates": "WX 23456", "type": "TRUCK_12T"}', 2),
('VEHICLE', '{"plates": "WX 34567", "type": "TRAILER_STD"}', 3),
('VEHICLE', '{"plates": "WX 45678", "type": "TRAILER_COOL"}', 4);

-- RESOURCE_AVAILABILITY
INSERT INTO RESOURCE_AVAILABILITY (resource_id, busy_range, reason, reference_transport_id) VALUES
(1, '[2026-01-20 08:00:00, 2026-01-20 16:00:00)', 'TRANSPORT', NULL),
(2, '[2026-01-21 06:00:00, 2026-01-22 18:00:00)', 'TRANSPORT', NULL),
(3, '[2026-01-25 00:00:00, 2026-01-27 00:00:00)', 'HOLIDAY', NULL),
(5, '[2026-01-18 00:00:00, 2026-01-19 12:00:00)', 'MAINTENANCE', NULL);

-- CONTRAHENT
INSERT INTO CONTRAHENT (name, tax_id, internal_code, contact_details) VALUES
('ABC Logistics Sp. z o.o.', '1234567890', 'CLI-001', '{"phone": "+48 22 123 45 67", "email": "contact@abc.pl"}'),
('XYZ Transport SA', '0987654321', 'CLI-002', '{"phone": "+48 12 987 65 43", "email": "biuro@xyztransport.pl"}'),
('MegaHurt Polska', '1111222233', 'CLI-003', '{"phone": "+48 61 111 22 33", "email": "zamowienia@megahurt.pl"}'),
('Express Delivery Ltd', 'GB123456789', 'CLI-004', '{"phone": "+44 20 1234 5678", "email": "orders@expressdelivery.co.uk"}');

-- ADDRESS
INSERT INTO ADDRESS (contrahent_id, label, full_address_data) VALUES
(1, 'Magazyn Główny - Warszawa', '{"city": "Warszawa", "street": "ul. Transportowa 15", "post_code": "02-222", "country": "PL", "contact_person": "Jan Kowalski", "phone": "+48 500 111 222"}'),
(1, 'Oddział - Kraków', '{"city": "Kraków", "street": "ul. Przemysłowa 8", "post_code": "30-333", "country": "PL", "contact_person": "Anna Nowak", "phone": "+48 500 333 444"}'),
(2, 'Centrala - Poznań', '{"city": "Poznań", "street": "ul. Logistyczna 42", "post_code": "60-555", "country": "PL", "contact_person": "Piotr Zieliński", "phone": "+48 500 555 666"}'),
(3, 'Hurtownia - Łódź', '{"city": "Łódź", "street": "ul. Składowa 99", "post_code": "90-777", "country": "PL", "contact_person": "Maria Kwiatkowska", "phone": "+48 500 777 888"}'),
(4, 'Warehouse - London', '{"city": "London", "street": "123 Logistics Road", "post_code": "SW1A 1AA", "country": "GB", "contact_person": "John Smith", "phone": "+44 20 9999 8888"}');

-- ORDER_STATUS
INSERT INTO ORDER_STATUS (code, display_name) VALUES
('DRAFT', 'Wersja robocza'),
('CONFIRMED', 'Potwierdzone'),
('IN_PROGRESS', 'W realizacji'),
('COMPLETED', 'Zrealizowane'),
('CANCELLED', 'Anulowane');

-- ORDER
INSERT INTO "ORDER" (contrahent_id, status_id, customer_ref, deadline, total_agreed_price, currency, internal_notes) VALUES
(1, 2, 'ABC/2026/001', '2026-01-25 18:00:00', 2500.00, 'PLN', 'Priorytetowe zamówienie - klient VIP'),
(2, 3, 'XYZ/001/2026', '2026-01-22 12:00:00', 1800.00, 'PLN', 'Wymagana chłodnia'),
(3, 2, 'MH-2026-0015', '2026-01-28 10:00:00', 3200.00, 'PLN', NULL),
(1, 3, 'ABC/2026/002', '2026-01-24 15:00:00', 1500.00, 'PLN', 'Dostawa express'),
(4, 1, 'ED-UK-20260117', '2026-02-05 09:00:00', 4500.00, 'EUR', 'Transport międzynarodowy - wymagane dokumenty celne');

-- SHIPMENT
INSERT INTO SHIPMENT (order_id, pickup_address_snapshot, delivery_address_snapshot, weight, pallets_count, goods_description, requirements) VALUES
(1, '{"city": "Warszawa", "street": "ul. Transportowa 15", "post_code": "02-222", "country": "PL"}', 
    '{"city": "Kraków", "street": "ul. Przemysłowa 8", "post_code": "30-333", "country": "PL"}', 
    5000.00, 10, 'Materiały budowlane', '{"loading_dock": true}'),
(1, '{"city": "Warszawa", "street": "ul. Transportowa 15", "post_code": "02-222", "country": "PL"}', 
    '{"city": "Gdańsk", "street": "ul. Portowa 22", "post_code": "80-888", "country": "PL"}', 
    3500.00, 7, 'Części samochodowe', '{"fragile": true}'),
(2, '{"city": "Poznań", "street": "ul. Logistyczna 42", "post_code": "60-555", "country": "PL"}', 
    '{"city": "Wrocław", "street": "ul. Handlowa 5", "post_code": "50-111", "country": "PL"}', 
    8000.00, 16, 'Produkty mrożone', '{"temperature": "-18C", "refrigerated": true}'),
(3, '{"city": "Łódź", "street": "ul. Składowa 99", "post_code": "90-777", "country": "PL"}', 
    '{"city": "Katowice", "street": "ul. Przemysłowa 77", "post_code": "40-222", "country": "PL"}', 
    6500.00, 13, 'Artykuły spożywcze', NULL),
(4, '{"city": "Warszawa", "street": "ul. Transportowa 15", "post_code": "02-222", "country": "PL"}', 
    '{"city": "Kraków", "street": "ul. Przemysłowa 8", "post_code": "30-333", "country": "PL"}', 
    2000.00, 4, 'Dokumentacja techniczna', '{"express": true, "signature_required": true}');

-- TRANSPORT
INSERT INTO TRANSPORT (transport_status_id, scheduled_range, route_notes, estimated_km) VALUES
(3, '[2026-01-20 08:00:00, 2026-01-20 16:00:00)', 'Warszawa → Kraków, trasa A4', 290.5),
(2, '[2026-01-21 06:00:00, 2026-01-22 18:00:00)', 'Poznań → Wrocław → Katowice, z przeładunkiem', 385.2),
(3, '[2026-01-24 10:00:00, 2026-01-24 15:00:00)', 'Warszawa → Kraków, express', 290.5),
(1, '[2026-01-28 07:00:00, 2026-01-28 17:00:00)', 'Łódź → Katowice', 150.0);

-- TRANSPORT_RESOURCE
INSERT INTO TRANSPORT_RESOURCE (transport_id, resource_id, role) VALUES
(1, 1, 'PRIMARY_DRIVER'),
(1, 5, 'VEHICLE'),
(2, 2, 'PRIMARY_DRIVER'),
(2, 6, 'VEHICLE'),
(2, 8, 'TRAILER'),
(3, 4, 'PRIMARY_DRIVER'),
(3, 5, 'VEHICLE');

-- MANIFEST_ITEM
INSERT INTO MANIFEST_ITEM (shipment_id, transport_id, sequence_order, action_type, actual_time) VALUES
(1, 1, 1, 'LOAD', '2026-01-20 08:15:00'),
(1, 1, 2, 'UNLOAD', '2026-01-20 13:45:00'),
(5, 3, 1, 'LOAD', '2026-01-24 10:10:00'),
(5, 3, 2, 'UNLOAD', '2026-01-24 14:30:00'),
(3, 2, 1, 'LOAD', '2026-01-21 06:20:00'),
(3, 2, 2, 'UNLOAD', '2026-01-22 16:15:00'),
(4, 2, 3, 'LOAD', '2026-01-22 09:00:00'),
(4, 2, 4, 'UNLOAD', '2026-01-22 17:45:00');

-- ============================================================
-- END OF SCRIPT
-- ============================================================
