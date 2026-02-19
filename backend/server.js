const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// Database connection const
const db = new sqlite3.Database(path.join(__dirname, 'quickfix.db'));

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    base_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
  )`);

  // Insert sample data
  db.run(`INSERT OR IGNORE INTO services (id, name, category, description, base_price) VALUES
    (1, 'Electrical Repair', 'Electrical', 'Wiring, switch repairs, electrical installations', 500.00),
    (2, 'Plumbing Service', 'Plumbing', 'Pipe repairs, leak fixing, installations', 400.00),
    (3, 'Carpentry Work', 'Carpentry', 'Furniture repair, custom woodwork', 600.00),
    (4, 'House Painting', 'Painting', 'Interior and exterior painting services', 350.00),
    (5, 'AC Repair', 'Appliance', 'Air conditioner servicing and repair', 450.00),
    (6, 'Home Cleaning', 'Cleaning', 'Deep cleaning and maintenance', 300.00)`);

  db.run(`INSERT OR IGNORE INTO users (id, name, email, password, phone, role) VALUES
    (1, 'Admin User', 'admin@quickfix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9999999999', 'admin')`);
});

// JWT middleware
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

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, role = 'customer' } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const query = 'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)';
  db.run(query, [name, email, hashedPassword, phone, role], function(err) {
    if (err) return res.status(400).json({ error: 'User already exists' });
    
    const token = jwt.sign({ id: this.lastID, role }, 'secret_key');
    res.json({ token, user: { id: this.lastID, name, email, role } });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key');
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

// Service Routes
app.get('/api/services', (req, res) => {
  db.all('SELECT * FROM services', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Dynamic Pricing Calculation
const calculatePrice = (basePrice, urgency, timeSlot, location) => {
  let price = basePrice;
  
  // Urgency multiplier
  const urgencyMultipliers = { normal: 1, urgent: 1.5, emergency: 2 };
  price *= urgencyMultipliers[urgency] || 1;
  
  // Time slot multiplier
  if (timeSlot === 'evening' || timeSlot === 'weekend') price *= 1.2;
  
  // Location multiplier (premium areas)
  const premiumAreas = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli'];
  if (premiumAreas.includes(location)) price *= 1.3;
  
  return Math.round(price);
};

// Booking Routes
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { serviceId, urgency, timeSlot, location, scheduledDate } = req.body;
  const customerId = req.user.id;
  
  // Get service details
  db.get('SELECT * FROM services WHERE id = ?', [serviceId], (err, service) => {
    if (err || !service) return res.status(400).json({ error: 'Service not found' });
    
    const totalPrice = calculatePrice(service.base_price, urgency, timeSlot, location);
    
    const query = `INSERT INTO bookings (customer_id, service_id, urgency, time_slot, location, 
                   scheduled_date, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`;
    
    db.run(query, [customerId, serviceId, urgency, timeSlot, location, scheduledDate, totalPrice], 
      function(err) {
        if (err) return res.status(500).json({ error: 'Booking failed' });
        
        // Emit real-time notification
        io.emit('newBooking', { bookingId: this.lastID, customerId, serviceId });
        
        res.json({ bookingId: this.lastID, totalPrice, status: 'pending' });
      });
  });
});

app.get('/api/bookings/customer/:id', authenticateToken, (req, res) => {
  const query = `SELECT b.*, s.name as service_name, s.category 
                 FROM bookings b JOIN services s ON b.service_id = s.id 
                 WHERE b.customer_id = ? ORDER BY b.created_at DESC`;
  
  db.all(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Service Provider Routes
app.get('/api/bookings/available', authenticateToken, (req, res) => {
  if (req.user.role !== 'provider') return res.status(403).json({ error: 'Access denied' });
  
  const query = `SELECT b.*, s.name as service_name, 'Customer' as customer_name, '9876543210' as phone 
                 FROM bookings b 
                 JOIN services s ON b.service_id = s.id 
                 WHERE b.status = 'pending' ORDER BY b.created_at DESC`;
  
  db.all(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.put('/api/bookings/:id/accept', authenticateToken, (req, res) => {
  const bookingId = req.params.id;
  const providerId = req.user.id;
  
  db.run('UPDATE bookings SET provider_id = ?, status = ? WHERE id = ?', 
    [providerId, 'accepted', bookingId], (err) => {
      if (err) return res.status(500).json({ error: 'Update failed' });
      
      // Emit real-time update
      io.emit('bookingUpdate', { bookingId, status: 'accepted', providerId });
      
      res.json({ message: 'Booking accepted' });
    });
});

// Real-time tracking
app.put('/api/bookings/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const bookingId = req.params.id;
  
  db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, bookingId], (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    
    io.emit('statusUpdate', { bookingId, status });
    res.json({ message: 'Status updated' });
  });
});

// Admin Dashboard Routes
app.get('/api/admin/analytics', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  
  const results = {
    totalBookings: { count: 25 },
    totalRevenue: { revenue: 15000 },
    activeProviders: { count: 8 },
    pendingBookings: { count: 5 }
  };
  
  res.json(results);
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('joinRoom', (userId) => {
    socket.join(`user_${userId}`);
  });
  
  socket.on('trackingUpdate', (data) => {
    socket.to(`user_${data.customerId}`).emit('locationUpdate', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});