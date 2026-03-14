import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface TrackingProps {
  socket: any;
}

interface TrackingData {
  id: number;
  booking_id: number;
  provider_id: number;
  latitude: number;
  longitude: number;
  status_message: string;
  estimated_arrival: string;
  created_at: string;
}

const Tracking: React.FC<TrackingProps> = ({ socket }) => {
  const { bookingId } = useParams();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackingData();
    
    // Listen for real-time location updates
    if (socket) {
      socket.on('locationUpdate', (data: any) => {
        if (data.bookingId === parseInt(bookingId!)) {
          setTrackingData(prev => ({
            ...prev!,
            latitude: data.latitude,
            longitude: data.longitude,
            status_message: data.statusMessage,
            estimated_arrival: data.estimatedArrival
          }));
        }
      });

      socket.on('statusUpdate', (data: any) => {
        if (data.bookingId === parseInt(bookingId!)) {
          setBookingDetails((prev: any) => ({
            ...prev,
            status: data.status
          }));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('locationUpdate');
        socket.off('statusUpdate');
      }
    };
  }, [socket, bookingId]);

  const fetchTrackingData = async () => {
    try {
      // Fetch booking details
      const bookingResponse = await axios.get(`/bookings/customer/${localStorage.getItem('userId')}`);
      const booking = bookingResponse.data.find((b: any) => b.id === parseInt(bookingId!));
      setBookingDetails(booking);

      // Simulate tracking data (in real app, this would come from GPS)
      const mockTrackingData: TrackingData = {
        id: 1,
        booking_id: parseInt(bookingId!),
        provider_id: booking?.provider_id || 1,
        latitude: 17.4065,
        longitude: 78.4772,
        status_message: 'On the way to your location',
        estimated_arrival: new Date(Date.now() + 30 * 60000).toISOString(),
        created_at: new Date().toISOString()
      };
      
      setTrackingData(mockTrackingData);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateServiceStatus = async (status: string) => {
    try {
      await axios.put(`/bookings/${bookingId}/status`, { status });
      setBookingDetails((prev: any) => ({ ...prev, status }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading tracking information...</div>;
  }

  if (!bookingDetails) {
    return <div className="dashboard">Booking not found</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Track Your Service</h1>
        <p>Real-time tracking for Booking #{bookingId}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Booking Details */}
        <div className="booking-card">
          <h3>Service Details</h3>
          <div style={{ marginBottom: '1rem' }}>
            <p><strong>Service:</strong> {bookingDetails.service_name}</p>
            <p><strong>Location:</strong> {bookingDetails.location}</p>
            <p><strong>Scheduled:</strong> {new Date(bookingDetails.scheduled_date).toLocaleString()}</p>
            <p><strong>Status:</strong> 
              <span className={`booking-status ${bookingDetails.status}`} style={{ marginLeft: '0.5rem' }}>
                {bookingDetails.status.replace('_', ' ').toUpperCase()}
              </span>
            </p>
            <p><strong>Total Price:</strong> ₹{bookingDetails.total_price}</p>
          </div>

          {/* Status Timeline */}
          <div>
            <h4>Service Progress</h4>
            <div style={{ marginTop: '1rem' }}>
              <div className={`status-step ${['pending', 'accepted', 'in_progress', 'completed'].includes(bookingDetails.status) ? 'completed' : ''}`}>
                ✓ Booking Confirmed
              </div>
              <div className={`status-step ${['accepted', 'in_progress', 'completed'].includes(bookingDetails.status) ? 'completed' : ''}`}>
                ✓ Service Provider Assigned
              </div>
              <div className={`status-step ${['in_progress', 'completed'].includes(bookingDetails.status) ? 'completed' : ''}`}>
                {bookingDetails.status === 'in_progress' ? '🔄' : '○'} Service In Progress
              </div>
              <div className={`status-step ${bookingDetails.status === 'completed' ? 'completed' : ''}`}>
                {bookingDetails.status === 'completed' ? '✓' : '○'} Service Completed
              </div>
            </div>
          </div>
        </div>

        {/* Live Tracking */}
        <div className="booking-card">
          <h3>Live Tracking</h3>
          
          {trackingData && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <p><strong>Current Status:</strong> {trackingData.status_message}</p>
                <p><strong>Estimated Arrival:</strong> {formatTime(trackingData.estimated_arrival)}</p>
                <p><strong>Last Updated:</strong> {formatTime(trackingData.created_at)}</p>
              </div>

              {/* Mock Map Display */}
              <div style={{ 
                height: '200px', 
                background: '#f0f0f0', 
                borderRadius: '5px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
                  <p>Service Provider Location</p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Lat: {trackingData.latitude.toFixed(4)}, 
                    Lng: {trackingData.longitude.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Real-time Updates */}
              <div style={{ background: '#e7f3ff', padding: '1rem', borderRadius: '5px' }}>
                <h4>Real-time Features:</h4>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  <li>Live GPS tracking</li>
                  <li>Instant status updates</li>
                  <li>ETA calculations</li>
                  <li>Push notifications</li>
                  <li>Direct communication</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button className="btn btn-primary">Contact Provider</button>
        <button className="btn btn-success">Call Support</button>
        {bookingDetails.status === 'completed' && (
          <button className="btn btn-success">Rate Service</button>
        )}
      </div>

      <style>{`
        .status-step {
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-left: 3px solid #ddd;
          padding-left: 1rem;
        }
        .status-step.completed {
          border-left-color: #28a745;
          color: #28a745;
        }
      `}</style>
    </div>
  );
};

export default Tracking;