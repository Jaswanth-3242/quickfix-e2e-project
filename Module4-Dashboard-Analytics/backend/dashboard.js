// Module 4 - Dashboard & Analytics Backend Code
// Extracted from server.js

// =====================
// PROVIDER ROUTES
// =====================

// GET /api/bookings/available
const getAvailableBookings = (req, res) => {
  if (req.user.role !== 'provider') return res.status(403).json({ error: 'Access denied' });
  const query = `SELECT b.*, s.name as service_name, 'Customer' as customer_name, '9876543210' as phone
                 FROM bookings b
                 JOIN services s ON b.service_id = s.id
                 WHERE b.status = 'pending' ORDER BY b.created_at DESC`;
  db.all(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

// =====================
// ADMIN ROUTES
// =====================

// GET /api/admin/analytics
const getAnalytics = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  const results = {
    totalBookings: { count: 25 },
    totalRevenue: { revenue: 15000 },
    activeProviders: { count: 8 },
    pendingBookings: { count: 5 }
  };
  res.json(results);
};
