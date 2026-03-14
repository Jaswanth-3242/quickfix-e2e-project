import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Analytics {
  totalBookings: { count: number };
  totalRevenue: { revenue: number };
  activeProviders: { count: number };
  pendingBookings: { count: number };
}

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchAllBookings();
    fetchAllUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchAllBookings = async () => {
    try {
      // Mock data for demo - in real app, create admin endpoint
      const mockBookings = [
        { id: 1, service_name: 'Electrical Repair', status: 'completed', total_price: 750, created_at: '2024-01-15' },
        { id: 2, service_name: 'Plumbing Service', status: 'in_progress', total_price: 600, created_at: '2024-01-16' },
        { id: 3, service_name: 'House Painting', status: 'pending', total_price: 1200, created_at: '2024-01-17' },
        { id: 4, service_name: 'AC Repair', status: 'completed', total_price: 900, created_at: '2024-01-18' },
        { id: 5, service_name: 'Carpentry Work', status: 'accepted', total_price: 800, created_at: '2024-01-19' }
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      // Mock data for demo
      const mockUsers = [
        { id: 1, name: 'John Customer', email: 'john@customer.com', role: 'customer', created_at: '2024-01-10' },
        { id: 2, name: 'Mike Provider', email: 'mike@provider.com', role: 'provider', created_at: '2024-01-12' },
        { id: 3, name: 'Sarah Customer', email: 'sarah@customer.com', role: 'customer', created_at: '2024-01-14' },
        { id: 4, name: 'Tom Electrician', email: 'tom@provider.com', role: 'provider', created_at: '2024-01-15' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const bookingStatusData = [
    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#ffc107' },
    { name: 'Accepted', value: bookings.filter(b => b.status === 'accepted').length, color: '#17a2b8' },
    { name: 'In Progress', value: bookings.filter(b => b.status === 'in_progress').length, color: '#007bff' },
    { name: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: '#28a745' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 22000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 30000 },
    { month: 'Jun', revenue: 28000 }
  ];

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Comprehensive analytics and management panel</p>
      </div>

      {/* Key Metrics */}
      {analytics && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{analytics.totalBookings?.count || 0}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">₹{analytics.totalRevenue?.revenue || 0}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{analytics.activeProviders?.count || 0}</div>
            <div className="stat-label">Active Providers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{analytics.pendingBookings?.count || 0}</div>
            <div className="stat-label">Pending Bookings</div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Revenue Chart */}
        <div className="booking-card">
          <h3>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Distribution */}
        <div className="booking-card">
          <h3>Booking Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Management Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Recent Bookings */}
        <div className="booking-card">
          <h3>Recent Bookings</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Service</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map(booking => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '0.5rem' }}>#{booking.id}</td>
                    <td style={{ padding: '0.5rem' }}>{booking.service_name}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span className={`booking-status status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>₹{booking.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management */}
        <div className="booking-card">
          <h3>User Management</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Joined</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '0.5rem' }}>{user.name}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '15px', 
                        fontSize: '0.8rem',
                        background: user.role === 'provider' ? '#e7f3ff' : '#f8f9fa',
                        color: user.role === 'provider' ? '#004085' : '#495057'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem' }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn btn-primary">Add New Service</button>
          <button className="btn btn-success">Verify Provider</button>
          <button className="btn btn-primary">Send Notifications</button>
          <button className="btn btn-primary">Generate Report</button>
        </div>
      </div>

      {/* System Health */}
      <div className="booking-card" style={{ marginTop: '2rem' }}>
        <h3>System Health & Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#28a745' }}>✓</div>
            <p>Real-time Tracking</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#28a745' }}>✓</div>
            <p>Dynamic Pricing</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#28a745' }}>✓</div>
            <p>Push Notifications</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#28a745' }}>✓</div>
            <p>Analytics Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;