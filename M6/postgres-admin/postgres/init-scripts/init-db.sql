CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (name, price) VALUES
    ('Laptop Pro X1', 1299.99),
    ('Smartphone Galaxy S25', 899.99),
    ('Wireless Earbuds Pro', 149.99),
    ('Smart Watch Series 7', 299.99),
    ('Tablet Ultra Thin', 499.99);
