import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MembershipProps {
  user: any;
}

const Membership: React.FC<MembershipProps> = ({ user }) => {
  const [currentMembership, setCurrentMembership] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load current membership from localStorage or user data
    const membership = localStorage.getItem('userMembership');
    setCurrentMembership(membership);
  }, []);

  const selectMembership = async (plan: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be a payment API call
      localStorage.setItem('userMembership', plan);
      setCurrentMembership(plan);
      
      alert(`${plan.charAt(0).toUpperCase() + plan.slice(1)} membership activated!`);
    } catch (error) {
      alert('Failed to activate membership');
    } finally {
      setLoading(false);
    }
  };

  const membershipPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 199,
      discount: 10,
      features: [
        '10% discount on all services',
        'Priority booking',
        '24/7 customer support',
        'Free service consultation'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 399,
      discount: 20,
      features: [
        '20% discount on all services',
        'Priority booking',
        '24/7 customer support',
        'Free emergency calls',
        'Free annual maintenance',
        'Dedicated account manager'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 699,
      discount: 30,
      features: [
        '30% discount on all services',
        'Highest priority booking',
        '24/7 premium support',
        'Free emergency calls',
        'Free quarterly maintenance',
        'Dedicated account manager',
        'Home inspection service'
      ]
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Membership Plans</h1>
        <p>Choose a plan that suits your needs and save on all services</p>
      </div>

      {currentMembership && (
        <div style={{ 
          background: '#333333', 
          color: '#ffffff', 
          padding: '1rem', 
          borderRadius: '5px', 
          marginBottom: '2rem',
          textAlign: 'center',
          border: '1px solid #666666'
        }}>
          <strong>Current Plan: {currentMembership.charAt(0).toUpperCase() + currentMembership.slice(1)}</strong>
        </div>
      )}

      <div className="services-grid">
        {membershipPlans.map(plan => (
          <div key={plan.id} className={`service-card ${currentMembership === plan.id ? 'current-plan' : ''}`}>
            <h3>{plan.name}</h3>
            <div className="price" style={{ fontSize: '2rem', margin: '1rem 0' }}>
              ₹{plan.price}<span style={{ fontSize: '1rem' }}>/month</span>
            </div>
            
            <div style={{ 
              background: '#e7f3ff', 
              padding: '0.5rem', 
              borderRadius: '5px', 
              marginBottom: '1rem',
              fontWeight: 'bold',
              color: '#004085'
            }}>
              Save {plan.discount}% on all services
            </div>

            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              {plan.features.map((feature, index) => (
                <li key={index} style={{ 
                  padding: '0.5rem 0', 
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#28a745', marginRight: '0.5rem' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {currentMembership === plan.id ? (
              <button className="btn btn-success" style={{ width: '100%' }} disabled>
                Current Plan
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => selectMembership(plan.id)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Choose Plan'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Membership Benefits */}
      <div className="booking-card" style={{ marginTop: '3rem' }}>
        <h3>Why Choose Membership?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h4>Save Money</h4>
            <p>Get significant discounts on all services with our membership plans</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h4>Priority Service</h4>
            <p>Skip the queue and get faster service booking and execution</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h4>Premium Support</h4>
            <p>24/7 dedicated customer support for all your service needs</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h4>Exclusive Benefits</h4>
            <p>Access to exclusive services and special member-only offers</p>
          </div>
        </div>
      </div>

      {/* Pricing Comparison */}
      <div className="booking-card" style={{ marginTop: '2rem' }}>
        <h3>See Your Savings</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Service</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Regular Price</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Basic (10% off)</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Premium (20% off)</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Gold (30% off)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>Electrical Repair</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>₹500</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#28a745' }}>₹450</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#28a745' }}>₹400</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#28a745' }}>₹350</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>Plumbing Service</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>₹400</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#28a745' }}>₹360</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#28a745' }}>₹320</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#28a745' }}>₹280</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>House Painting</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>₹350</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#28a745' }}>₹315</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#28a745' }}>₹280</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#28a745' }}>₹245</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .current-plan {
          border: 2px solid #ffffff;
          background: #222222;
        }
      `}</style>
    </div>
  );
};

export default Membership;