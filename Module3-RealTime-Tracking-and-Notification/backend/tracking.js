// Module 3 - Real-Time Tracking & Notifications Backend Code
// Extracted from server.js

// =====================
// TRACKING ROUTES
// =====================

// PUT /api/bookings/:id/accept
const acceptBooking = (req, res) => {
  const bookingId = req.params.id;
  const providerId = req.user.id;
  db.run('UPDATE bookings SET provider_id = ?, status = ? WHERE id = ?',
    [providerId, 'accepted', bookingId], (err) => {
      if (err) return res.status(500).json({ error: 'Update failed' });
      io.emit('bookingUpdate', { bookingId, status: 'accepted', providerId });
      res.json({ message: 'Booking accepted' });
    });
};

// PUT /api/bookings/:id/status
const updateStatus = (req, res) => {
  const { status } = req.body;
  const bookingId = req.params.id;
  db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, bookingId], (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    io.emit('statusUpdate', { bookingId, status });
    res.json({ message: 'Status updated' });
  });
};

// =====================
// SOCKET.IO EVENTS
// =====================
/*
io.on('connection', (socket) => {

  // Join user-specific room
  socket.on('joinRoom', (userId) => {
    socket.join(`user_${userId}`);
  });

  // Provider sends GPS location update
  socket.on('trackingUpdate', (data) => {
    socket.to(`user_${data.customerId}`).emit('locationUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
*/

// =====================
// EVENTS REFERENCE
// =====================
/*
Server → Client:
  - newBooking       : New booking created
  - bookingUpdate    : Booking accepted by provider
  - statusUpdate     : Service status changed
  - locationUpdate   : Provider GPS coordinates

Client → Server:
  - joinRoom         : Join user notification room
  - trackingUpdate   : Provider sends location data
*/
