import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  base_price: number;
}

const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Professional Home Maintenance Services</h1>
          <p>Connect with verified service providers for all your home repair needs with transparent pricing and real-time tracking</p>
          <Link to="/book-service">
            <button className="btn-cta">Get Started Today</button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Premium Services</h2>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={service.id} className="service-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 2rem',
                fontSize: '2rem',
                color: '#FFFFFF',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {service.category === 'Electrical' && '⚡'}
                {service.category === 'Plumbing' && '🔧'}
                {service.category === 'Carpentry' && '🔨'}
                {service.category === 'Painting' && '🎨'}
                {service.category === 'Appliance' && '❄️'}
                {service.category === 'Cleaning' && '✨'}
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="price">Starting at ₹{service.base_price}</div>
              <Link to="/book-service">
                <button className="btn btn-primary">Book Now</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ padding: '8rem 2rem', background: '#E2E8F0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '3rem', fontWeight: '700', color: '#0F172A' }}>
            Why Choose Quick Fix?
          </h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#4F46E5', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                color: '#FFFFFF',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>🏆</div>
              <div className="stat-number">500+</div>
              <div className="stat-label">Verified Professionals</div>
            </div>
            <div className="stat-card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#14B8A6', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                color: '#FFFFFF',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>🕒</div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
            <div className="stat-card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#84CC16', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                color: '#FFFFFF',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>😊</div>
              <div className="stat-number">1000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                color: '#FFFFFF',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>⭐</div>
              <div className="stat-number">4.8★</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section style={{ padding: '8rem 2rem', background: '#EEF2FF' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '700', color: '#0F172A', marginBottom: '2rem' }}>
            Advanced Technology Platform
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#64748B', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
            Experience the future of home maintenance with our cutting-edge features
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <div className="service-card">
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#4F46E5', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 2rem',
                fontSize: '2rem',
                color: '#FFFFFF'
              }}>💰</div>
              <h3>Dynamic Pricing</h3>
              <p>Transparent, real-time pricing based on urgency, location, and time slots</p>
            </div>
            <div className="service-card">
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#14B8A6', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 2rem',
                fontSize: '2rem',
                color: '#FFFFFF'
              }}>📍</div>
              <h3>Real-time Tracking</h3>
              <p>Track your service provider's location and get live updates on progress</p>
            </div>
            <div className="service-card">
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#84CC16', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 2rem',
                fontSize: '2rem',
                color: '#FFFFFF'
              }}>🔔</div>
              <h3>Instant Notifications</h3>
              <p>Get notified instantly about booking confirmations and status updates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;