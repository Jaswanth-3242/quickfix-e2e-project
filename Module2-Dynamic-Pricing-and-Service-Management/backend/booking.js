// Module 2 - Booking & Dynamic Pricing Backend Code
// Extracted from server.js

// =====================
// DATABASE SCHEMA
// =====================
/*
CREATE TABLE IF NOT EXISTS bookings (
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/

// =====================
// DYNAMIC PRICING
// =====================
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

// =====================
// BOOKING ROUTES
// =====================

// POST /api/bookings
const createBooking = (req, res) => {
  const { serviceId, urgency, timeSlot, location, scheduledDate } = req.body;
  const customerId = req.user.id;
  db.get('SELECT * FROM services WHERE id = ?', [serviceId], (err, service) => {
    if (err || !service) return res.status(400).json({ error: 'Service not found' });
    const totalPrice = calculatePrice(service.base_price, urgency, timeSlot, location);
    const query = `INSERT INTO bookings (customer_id, service_id, urgency, time_slot, location,
                   scheduled_date, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`;
    db.run(query, [customerId, serviceId, urgency, timeSlot, location, scheduledDate, totalPrice],
      function(err) {
        if (err) return res.status(500).json({ error: 'Booking failed' });
        io.emit('newBooking', { bookingId: this.lastID, customerId, serviceId });
        res.json({ bookingId: this.lastID, totalPrice, status: 'pending' });
      });
  });
};

// GET /api/bookings/customer/:id
const getCustomerBookings = (req, res) => {
  const query = `SELECT b.*, s.name as service_name, s.category
                 FROM bookings b JOIN services s ON b.service_id = s.id
                 WHERE b.customer_id = ? ORDER BY b.created_at DESC`;
  db.all(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};
