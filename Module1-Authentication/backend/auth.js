// Module 1 - Authentication & Service Browsing Backend Code
// Extracted from server.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =====================
// DATABASE SCHEMA
// =====================
/*
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  base_price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/

// =====================
// JWT MIDDLEWARE
// =====================
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, 'secret_key');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// =====================
// AUTH ROUTES
// =====================

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, phone, role = 'customer' } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)';
  db.run(query, [name, email, hashedPassword, phone, role], function(err) {
    if (err) return res.status(400).json({ error: 'User already exists' });
    const token = jwt.sign({ id: this.lastID, role }, 'secret_key');
    res.json({ token, user: { id: this.lastID, name, email, role } });
  });
};

// POST /api/auth/login
const login = (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key');
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
};

// GET /api/services
const getServices = (req, res) => {
  db.all('SELECT * FROM services', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};
