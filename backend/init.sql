-- Create database (run this separately if needed)
-- CREATE DATABASE hardware_store;

-- Connect to hardware_store database before running the rest

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    pin VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Employees table for salary management
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    salary DECIMAL(10, 2) NOT NULL DEFAULT 0,
    phone VARCHAR(20),
    email VARCHAR(255),
    hire_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Machinery (Tool Shop) table
CREATE TABLE IF NOT EXISTS machinery (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),                       -- model code, used to match price updates
    category VARCHAR(100) NOT NULL DEFAULT 'Other',
    power VARCHAR(100),                       -- e.g. "2200W", "5.5 HP Petrol"
    condition VARCHAR(20) NOT NULL DEFAULT 'New',
    price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    warranty_months INTEGER,
    image_url TEXT,
    description TEXT,
    price_updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_machinery_model
    ON machinery (LOWER(model)) WHERE model IS NOT NULL;

-- Every price change is logged here
CREATE TABLE IF NOT EXISTS machinery_price_history (
    id SERIAL PRIMARY KEY,
    machinery_id INTEGER NOT NULL REFERENCES machinery(id) ON DELETE CASCADE,
    old_price DECIMAL(12, 2),
    new_price DECIMAL(12, 2) NOT NULL,
    source VARCHAR(50) DEFAULT 'manual',      -- manual | bulk | antigravity
    changed_at TIMESTAMP DEFAULT NOW()
);
