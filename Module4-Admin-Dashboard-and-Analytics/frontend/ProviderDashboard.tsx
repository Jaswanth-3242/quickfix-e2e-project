import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ProviderDashboardProps {
  user: any;
  socket: any;
}

interface Booking {
  id: number;
  service_name: string;
  customer_name: string;
  phone: string;
  location: string;
  scheduled_date: string;
  total_price: number;
  status: string;
  urgency: string;
  time_slot: string;
}

const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ user, socket }) => {
  const [availableBookings, setAvailableBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableBookings();
    fetchMyBookings();

    // Listen for new booking notifications
    if (socket) {
      socket.on('newBooking', (data: any) => {
        fetchAvailableBookings(); // Refresh available bookings
      });
    }

    return () => {
      if (socket) {
        socket.off('newBooking');
      }
    };
  }, [socket]);

  const fetchAvailableBookings = async () => {
    try {
      const response = await axios.get('/bookings/available');
      setAvailableBookings(response.data);
    } catch (error) {
      console.error('Error fetching available bookings:', error);
    }
  };

  const fetchMyBookings = async () => {
    try {
      // Mock data for accepted bookings
      const mockMyBookings: Booking[] = [
        {
          id: 2,
          service_name: 'Electrical Repair',
          customer_name: 'John Doe',
          phone: '9876543210',
          location: 'Banjara Hills, Hyderabad',
          scheduled_date: '2024-01-20T10:00:00',
          total_price: 750,
          status: 'accepted',
          urgency: 'normal',
          time_slot: 'morning'
        }
      ];
      setMyBookings(mockMyBookings);
    } catch (error) {
      console.error('Error fetching my bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptBooking = async (bookingId: number) => {
    try {
      await axios.put(`/bookings/${bookingId}/accept`);
      
      // Move booking from available to my bookings
      const acceptedBooking = availableBookings.find(b => b.id === bookingId);
      if (acceptedBooking) {
        setAvailableBookings(prev => prev.filter(b => b.id !== bookingId));
        setMyBookings(prev => [...prev, { ...acceptedBooking, status: 'accepted' }]);
      }
      
      alert('Booking accepted successfully!');
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Failed to accept booking');
    }
  };

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await axios.put(`/bookings/${bookingId}/status`, { status });
      
      // Update local state
      setMyBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));
      
      // Simulate location update for tracking
      if (socket && status === 'in_progress') {
        socket.emit('trackingUpdate', {
          bookingId,
          customerId: 1, // In real app, get from booking data
          latitude: 17.4065 + Math.random() * 0.01,
          longitude: 78.4772 + Math.random() * 0.01,
          statusMessage: 'Service in progress',
          estimatedArrival: new Date(Date.now() + 60 * 60000).toISOString()
        });
      }
      
      alert(`Booking status updated to ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '#dc3545';
      case 'urgent': return '#ffc107';
      default: return '#28a745';
    }
  };

  if (loading) {
    return <div className="loading">Loading provider dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Provider Dashboard</h1>
        <p>Welcome, {user.name}! Manage your service bookings</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{availableBookings.length}</div>
          <div className="stat-label">Available Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{myBookings.length}</div>
          <div className="stat-label">My Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{myBookings.filter(b => b.status === 'completed').length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₹{myBookings.reduce((sum, b) => sum + b.total_price, 0)}</div>
          <div className="stat-label">Total Earnings</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Available Bookings */}
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Available Bookings</h2>
          
          {availableBookings.length === 0 ? (
            <div className="booking-card">
              <p>No available bookings at the moment.</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {availableBookings.map(booking => (
                <div key={booking.id} className="booking-card fade-in">
                  <div className="booking-header">
                    <h3>{booking.service_name}</h3>
                    <span 
                      className="booking-status"
                      style={{ 
                        backgroundColor: getUrgencyColor(booking.urgency),
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {booking.urgency.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <p><strong>Customer:</strong> {booking.customer_name}</p>
                    <p><strong>Phone:</strong> {booking.phone}</p>
                    <p><strong>Location:</strong> {booking.location}</p>
                    <p><strong>Scheduled:</strong> {formatDate(booking.scheduled_date)}</p>
                    <p><strong>Time Slot:</strong> {booking.time_slot}</p>
                    <p><strong>Payment:</strong> ₹{booking.total_price}</p>
                  </div>

                  <button 
                    className="btn btn-success"
                    style={{ width: '100%' }}
                    onClick={() => acceptBooking(booking.id)}
                  >
                    Accept Booking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Bookings */}
        <div>
          <h2 style={{ marginBottom: '1rem' }}>My Bookings</h2>
          
          {myBookings.length === 0 ? (
            <div className="booking-card">
              <p>No accepted bookings yet.</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {myBookings.map(booking => (
                <div key={booking.id} className="booking-card fade-in">
                  <div className="booking-header">
                    <h3>{booking.service_name}</h3>
                    <span className={`booking-status status-${booking.status}`}>
                      {booking.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <p><strong>Customer:</strong> {booking.customer_name}</p>
                    <p><strong>Phone:</strong> {booking.phone}</p>
                    <p><strong>Location:</strong> {booking.location}</p>
                    <p><strong>Scheduled:</strong> {formatDate(booking.scheduled_date)}</p>
                    <p><strong>Payment:</strong> ₹{booking.total_price}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {booking.status === 'accepted' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                      >
                        Start Service
                      </button>
                    )}
                    
                    {booking.status === 'in_progress' && (
                      <button 
                        className="btn btn-success"
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                      >
                        Complete Service
                      </button>
                    )}
                    
                    <button className="btn btn-primary">Call Customer</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Provider Features */}
      <div className="booking-card" style={{ marginTop: '2rem' }}>
        <h3>Provider Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#007bff' }}>📱</div>
            <p>Real-time Notifications</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#28a745' }}>💰</div>
            <p>Dynamic Pricing Benefits</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#ffc107' }}>⭐</div>
            <p>Rating System</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#17a2b8' }}>📍</div>
            <p>GPS Tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;