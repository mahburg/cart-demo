DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    -- auth_id TEXT,
    username TEXT
);
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    price REAL
);

CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    prod_id INTEGER REFERENCES products(id),
    quantity INTEGER
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_ts TIMESTAMP,
    fulfilled TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    prod_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    price REAL
);

INSERT INTO users (username)
VALUES 
('test'),
('try'),
('attempt'),
('trial');

INSERT INTO products (title, description, price)
VALUES 
('iPhone X', 'Apple Flagship Smartphone', 1000.99 ),
('Pixel 2 XL', 'Google Flagship Smartphone', 950.99 ),
('Alienware 17 (new)', 'Gaming laptop from Dell. UHD screen, GTX 1070, i7, 500GB SSD, 1TB HHD, 32GB RAM', 2924.99 ),
('Mouse Pad', 'used', 7.99 ),
('iPhone 8', 'Apple Flagship Smartphone', 800.99 ),
('Pixel 2', 'Google Flagship Smartphone', 750.99 ),
('Mouse', 'new', 17.99 );