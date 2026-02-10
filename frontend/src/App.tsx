import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookService from './pages/BookService';
import Tracking from './pages/Tracking';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Membership from './pages/Membership';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
}

// API Configuration
axios.defaults.baseURL = 'http://localhost:5001/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);

    // Initialize socket connection
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} socket={socket} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/book-service" 
            element={user ? <BookService user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tracking/:bookingId" 
            element={user ? <Tracking socket={socket} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/membership" 
            element={user?.role === 'customer' ? <Membership user={user} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/provider" 
            element={user?.role === 'provider' ? <ProviderDashboard user={user} socket={socket} /> : <Navigate to="/dashboard" />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;