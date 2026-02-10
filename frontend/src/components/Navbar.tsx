import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: any;
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, logout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">Quick Fix</Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user.role === 'customer' && (
                <>
                  <Link to="/book-service">Book Service</Link>
                  <Link to="/membership">Membership</Link>
                </>
              )}
              {user.role === 'provider' && <Link to="/provider">Provider Panel</Link>}
              {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
              <span>Hi, {user.name}</span>
              <button className="btn btn-danger" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">
              <button className="btn btn-primary">Login</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;