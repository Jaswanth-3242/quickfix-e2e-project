const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database for project quickfix
const db = new sqlite3.Database(path.join(__dirname, 'quickfix.db'));

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    address TEXT,
    profile_image TEXT,
    rating REAL DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Services table
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    base_price REAL NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    image_url TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Bookings table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    provider_id INTEGER,
    service_id INTEGER NOT NULL,
    urgency TEXT DEFAULT 'normal',
    time_slot TEXT NOT NULL,
    location TEXT NOT NULL,
    scheduled_date DATETIME NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
  )`);

  // Insert sample data
  db.run(`INSERT OR IGNORE INTO services (name, category, description, base_price) VALUES
    ('Electrical Repair', 'Electrical', 'Wiring, switch repairs, electrical installations', 500.00),
    ('Plumbing Service', 'Plumbing', 'Pipe repairs, leak fixing, installations', 400.00),
    ('Carpentry Work', 'Carpentry', 'Furniture repair, custom woodwork', 600.00),
    ('House Painting', 'Painting', 'Interior and exterior painting services', 350.00),
    ('AC Repair', 'Appliance', 'Air conditioner servicing and repair', 450.00),
    ('Home Cleaning', 'Cleaning', 'Deep cleaning and maintenance', 300.00)`);

  // Insert admin user
  db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES
    ('Admin User', 'admin@quickfix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')`);
});

console.log('SQLite database setup complete!');
db.close();
