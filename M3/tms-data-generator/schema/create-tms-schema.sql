DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS order_timeline_events;
DROP TABLE IF EXISTS transportation_orders;
DROP TABLE IF EXISTS driver_availability;
DROP TABLE IF EXISTS vehicle_availability;
DROP TABLE IF EXISTS customers;
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
    status VARCHAR(20),
    CHECK (contract_type IN ('CONTRACTOR', 'FULL_TIME')),
    CHECK (status IN ('ACTIVE', 'ON_ROUTE', 'RESTING', 'OFF_DUTY', 'SICK_LEAVE'))
);

CREATE TABLE driver_availability (
    id INT PRIMARY KEY,
    driver_id INT NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    availability_type VARCHAR(20) NOT NULL,
    notes VARCHAR(255),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    CHECK (availability_type IN ('AVAILABLE', 'ON_SHIFT', 'BREAK', 'OFF_DUTY', 'VACATION', 'SICK_LEAVE', 'TRAINING')),
    CHECK (end_datetime > start_datetime)
);

CREATE TABLE vehicle_availability (
    id INT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    availability_type VARCHAR(20) NOT NULL,
    notes VARCHAR(255),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    CHECK (availability_type IN ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'REPAIR', 'INSPECTION', 'OUT_OF_SERVICE')),
    CHECK (end_datetime > start_datetime)
);

CREATE TABLE customers (
    id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    customer_type VARCHAR(20),
    address VARCHAR(255),
    CHECK (customer_type IN ('INDIVIDUAL', 'BUSINESS', 'VIP'))
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
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    CHECK (status IN ('PENDING', 'PROCESSING', 'IN_TRANSIT', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED')),
    CHECK (amount >= 0)
);

CREATE TABLE order_timeline_events (
    id INT PRIMARY KEY,
    order_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_timestamp TIMESTAMP NOT NULL,
    title VARCHAR(100),
    description TEXT,
    executed_by VARCHAR(100),
    FOREIGN KEY (order_id) REFERENCES transportation_orders(id),
    CHECK (event_type IN ('ORDER_CREATED', 'PAYMENT_CONFIRMED', 'ORDER_APPROVED', 'PREPARING_SHIPMENT', 'READY_FOR_PICKUP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'))
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

CREATE INDEX idx_timeline_order ON order_timeline_events(order_id);
CREATE INDEX idx_items_order ON order_items(order_id);
CREATE INDEX idx_orders_customer ON transportation_orders(customer_id);
CREATE INDEX idx_orders_status ON transportation_orders(status);
CREATE INDEX idx_driver_availability_driver ON driver_availability(driver_id);
CREATE INDEX idx_driver_availability_dates ON driver_availability(start_datetime, end_datetime);
CREATE INDEX idx_driver_availability_type ON driver_availability(availability_type);
CREATE INDEX idx_vehicle_availability_vehicle ON vehicle_availability(vehicle_id);
CREATE INDEX idx_vehicle_availability_dates ON vehicle_availability(start_datetime, end_datetime);
CREATE INDEX idx_vehicle_availability_type ON vehicle_availability(availability_type);
