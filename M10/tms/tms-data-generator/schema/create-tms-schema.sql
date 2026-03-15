DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS order_timeline_events;
DROP TABLE IF EXISTS transportation_orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS driver_licenses;
DROP TABLE IF EXISTS driver_license_types;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS vehicles;

CREATE TABLE vehicles (
    id INT PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    year INT,
    fuel_tank_capacity DECIMAL(5,1)
);

CREATE TABLE drivers (
    id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    contract_type VARCHAR(20),
    status VARCHAR(20)
);

CREATE TABLE customers (
    id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    customer_type VARCHAR(20),
    address VARCHAR(255),
    version INT NOT NULL DEFAULT 1
);

CREATE TABLE transportation_orders (
    id INT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP NOT NULL,
    expected_delivery DATE,
    shipping_address VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(50),
    shipping_zip_code VARCHAR(20),
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_timeline_events (
    id INT PRIMARY KEY,
    order_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_timestamp TIMESTAMP NOT NULL,
    title VARCHAR(100),
    description TEXT,
    executed_by VARCHAR(100),
    FOREIGN KEY (order_id) REFERENCES transportation_orders(id)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES transportation_orders(id)
);

CREATE TABLE driver_license_types (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(50)  UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE driver_licenses (
    id              SERIAL PRIMARY KEY,
    driver_id       INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    license_type_id INTEGER NOT NULL REFERENCES driver_license_types(id),
    document_number VARCHAR(50),
    issue_date      DATE,
    expiry_date     DATE NOT NULL,
    status          VARCHAR(20) DEFAULT 'active',

    CONSTRAINT unique_driver_license UNIQUE(driver_id, license_type_id)
);

CREATE TABLE notifications (
    id          INT PRIMARY KEY,
    user_id     INT          NOT NULL,
    type        VARCHAR(20)  NOT NULL,
    message     TEXT         NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    is_read     BOOLEAN      NOT NULL DEFAULT false
);

CREATE INDEX idx_timeline_order ON order_timeline_events(order_id);
CREATE INDEX idx_items_order ON order_items(order_id);
CREATE INDEX idx_orders_customer ON transportation_orders(customer_id);
CREATE INDEX idx_orders_status ON transportation_orders(status);
CREATE INDEX idx_customers_first_name_lower_pattern ON customers (LOWER(first_name) text_pattern_ops);
CREATE INDEX idx_customers_last_name_lower_pattern ON customers (LOWER(last_name) text_pattern_ops);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_driver_licenses_expiry ON driver_licenses(expiry_date);
