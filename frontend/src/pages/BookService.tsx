import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  base_price: number;
}

interface BookServiceProps {
  user: any;
}

const BookService: React.FC<BookServiceProps> = ({ user }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    urgency: 'normal',
    timeSlot: 'morning',
    location: '',
    scheduledDate: ''
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      calculatePrice();
    }
  }, [selectedService, bookingData]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const calculatePrice = () => {
    if (!selectedService) return;

    let price = selectedService.base_price;
    
    // Apply membership discount first
    const membership = localStorage.getItem('userMembership');
    if (membership) {
      const discounts = { basic: 0.1, premium: 0.2, gold: 0.3 };
      const discount = discounts[membership as keyof typeof discounts] || 0;
      price = price * (1 - discount);
    }

    // Urgency multiplier
    const urgencyMultipliers = { normal: 1, urgent: 1.5, emergency: 2 };
    price *= urgencyMultipliers[bookingData.urgency as keyof typeof urgencyMultipliers] || 1;

    // Time slot multiplier
    if (bookingData.timeSlot === 'evening' || bookingData.timeSlot === 'weekend') {
      price *= 1.2;
    }

    // Location multiplier (premium areas)
    const premiumAreas = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City'];
    if (premiumAreas.some(area => bookingData.location.toLowerCase().includes(area.toLowerCase()))) {
      price *= 1.3;
    }

    setCalculatedPrice(Math.round(price));
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingData({ ...bookingData, serviceId: service.id.toString() });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/bookings', bookingData);
      alert(`Booking confirmed! Booking ID: ${response.data.bookingId}`);
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Book a Service</h1>
        <p>Select a service and schedule your appointment</p>
      </div>

      {!selectedService ? (
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card" onClick={() => handleServiceSelect(service)}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="price">Base Price: ₹{service.base_price}</div>
              <button className="btn btn-primary">Select Service</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Booking Form */}
          <div className="form-container">
            <h3>Service Details</h3>
            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#222222', borderRadius: '5px' }}>
              <strong style={{ color: '#ffffff' }}>{selectedService.name}</strong>
              <p style={{ color: '#cccccc' }}>{selectedService.description}</p>
              <p style={{ color: '#ffffff' }}>Base Price: ₹{selectedService.base_price}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Urgency Level</label>
                <select name="urgency" value={bookingData.urgency} onChange={handleInputChange}>
                  <option value="normal">Normal (24-48 hours)</option>
                  <option value="urgent">Urgent (Same day) - 1.5x price</option>
                  <option value="emergency">Emergency (Within 2 hours) - 2x price</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred Time Slot</label>
                <select name="timeSlot" value={bookingData.timeSlot} onChange={handleInputChange}>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM) - 1.2x price</option>
                  <option value="weekend">Weekend - 1.2x price</option>
                </select>
              </div>

              <div className="form-group">
                <label>Service Location</label>
                <input
                  type="text"
                  name="location"
                  value={bookingData.location}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div className="form-group">
                <label>Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={bookingData.scheduledDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-success" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Booking...' : `Book Service - ₹${calculatedPrice}`}
              </button>
            </form>

            <button 
              onClick={() => setSelectedService(null)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Choose Different Service
            </button>
          </div>

          {/* Price Breakdown */}
          <div className="form-container">
            <h3>Price Breakdown</h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Base Price:</span>
                <span>₹{selectedService.base_price}</span>
              </div>
              
              {localStorage.getItem('userMembership') && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#28a745' }}>
                  <span>Membership Discount:</span>
                  <span>-{localStorage.getItem('userMembership') === 'basic' ? '10%' : 
                           localStorage.getItem('userMembership') === 'premium' ? '20%' : '30%'}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Urgency Multiplier:</span>
                <span>{bookingData.urgency === 'normal' ? '1x' : bookingData.urgency === 'urgent' ? '1.5x' : '2x'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Time Slot Multiplier:</span>
                <span>{(bookingData.timeSlot === 'evening' || bookingData.timeSlot === 'weekend') ? '1.2x' : '1x'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Location Premium:</span>
                <span>{['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City'].some(area => 
                  bookingData.location.toLowerCase().includes(area.toLowerCase())) ? '1.3x' : '1x'}</span>
              </div>
              
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>Total Price:</span>
                <span>₹{calculatedPrice}</span>
              </div>
            </div>

            {!localStorage.getItem('userMembership') && (
              <div style={{ background: '#333333', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>
                <h4 style={{ color: '#ffffff' }}>💡 Save More with Membership!</h4>
                <p style={{ color: '#cccccc', margin: '0.5rem 0' }}>Get up to 30% discount on all services</p>
                <button 
                  className="btn btn-primary" 
                  style={{ fontSize: '0.9rem' }}
                  onClick={() => window.open('/membership', '_blank')}
                >
                  View Membership Plans
                </button>
              </div>
            )}

            <div style={{ background: '#222222', padding: '1rem', borderRadius: '5px' }}>
              <h4 style={{ color: '#ffffff' }}>Dynamic Pricing Features:</h4>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#cccccc' }}>
                <li>Real-time price calculation</li>
                <li>Location-based pricing</li>
                <li>Urgency-based multipliers</li>
                <li>Time slot premiums</li>
                <li>Membership discounts</li>
                <li>Transparent pricing breakdown</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookService;