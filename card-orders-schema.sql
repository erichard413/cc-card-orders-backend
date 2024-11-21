CREATE TABLE users (
    username TEXT NOT NULL CHECK (position('@' IN email) > 1) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    join_date TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_cc_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) REFERENCES users ON DELETE SET NULL,
    order_date TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    order_status TEXT NOT NULL,
    note VARCHAR(255)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE order_details (
    order_id INTEGER REFERENCES orders ON DELETE CASCADE,
    username TEXT REFERENCES users ON DELETE CASCADE,
    product_id INTEGER REFERENCES products ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price INTEGER NOT NULL
);

CREATE TABLE banks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    city TEXT,
    state VARCHAR(2),
    address TEXT    
);
