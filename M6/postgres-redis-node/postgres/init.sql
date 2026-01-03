-- Create categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category_id INT REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Books', 'Books and publications'),
('Home & Garden', 'Items for home and garden'),
('Sports', 'Sports equipment and accessories');

-- Insert sample products
INSERT INTO products (name, description, price, stock, category_id) VALUES
('Smartphone X', 'Latest model with advanced features', 799.99, 50, 1),
('Laptop Pro', 'Professional laptop for developers', 1299.99, 30, 1),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 100, 1),
('T-shirt Basic', 'Cotton basic t-shirt', 19.99, 200, 2),
('Jeans Classic', 'Classic blue jeans', 49.99, 150, 2),
('The Great Novel', 'Award-winning fiction novel', 24.99, 75, 3),
('Cooking Guide', 'Comprehensive cooking guide for beginners', 34.99, 40, 3),
('Garden Chair', 'Comfortable outdoor garden chair', 79.99, 60, 4),
('Plant Pot Set', 'Set of 3 decorative plant pots', 29.99, 90, 4),
('Tennis Racket', 'Professional tennis racket', 89.99, 25, 5),
('Yoga Mat', 'Non-slip exercise yoga mat', 24.99, 120, 5);

-- Create index for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
