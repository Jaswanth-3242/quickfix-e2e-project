import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Booking {
  id: number;
  service_name: string;
  category: string;
  urgency: string;
  time_slot: string;
  location: string;
  scheduled_date: string;
  total_price: number;
  status: string;
  created_at: string;
}

interface DashboardProps {
  user: any;
  socket: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user, socket }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    
    // Listen for real-time updates
    if (socket) {
      socket.on('bookingUpdate', (data: any) => {
        setBookings(prev => prev.map(booking => 
          booking.id === data.bookingId 
            ? { ...booking, status: data.status }
            : booking
        ));
      });

      socket.on('statusUpdate', (data: any) => {
        setBookings(prev => prev.map(booking => 
          booking.id === data.bookingId 
            ? { ...booking, status: data.status }
            : booking
        ));
      });
    }

    return () => {
      if (socket) {
        socket.off('bookingUpdate');
        socket.off('statusUpdate');
      }
    };
  }, [socket]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`/bookings/customer/${user.id}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'in_progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
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

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <p>Manage your service bookings and track progress</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{bookings.length}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{bookings.filter(b => b.status === 'pending').length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{bookings.filter(b => b.status === 'in_progress').length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{bookings.filter(b => b.status === 'completed').length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/book-service">
          <button className="btn btn-primary" style={{ marginRight: '1rem' }}>
            Book New Service
          </button>
        </Link>
      </div>

      {/* Bookings List */}
      <div>
        <h2 style={{ marginBottom: '1rem' }}>Your Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="booking-card">
            <p>No bookings yet. <Link to="/book-service">Book your first service</Link></p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card fade-in">
                <div className="booking-header">
                  <h3>{booking.service_name}</h3>
                  <span className={`booking-status ${getStatusClass(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p><strong>Category:</strong> {booking.category}</p>
                  <p><strong>Location:</strong> {booking.location}</p>
                  <p><strong>Scheduled:</strong> {formatDate(booking.scheduled_date)}</p>
                  <p><strong>Urgency:</strong> {booking.urgency}</p>
                  <p><strong>Time Slot:</strong> {booking.time_slot}</p>
                  <p><strong>Total Price:</strong> ₹{booking.total_price}</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {booking.status === 'accepted' || booking.status === 'in_progress' ? (
                    <Link to={`/tracking/${booking.id}`}>
                      <button className="btn btn-primary">Track Service</button>
                    </Link>
                  ) : null}
                  
                  {booking.status === 'completed' && (
                    <button className="btn btn-success">Leave Review</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;