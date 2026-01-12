import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize restaurant status from localStorage or default to true (open)
  const [restaurantOpen, setRestaurantOpen] = useState(() => {
    const savedStatus = localStorage.getItem('restaurantOpen');
    return savedStatus !== null ? savedStatus === 'true' : true;
  });

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleRestaurant = () => {
    const newStatus = !restaurantOpen;
    setRestaurantOpen(newStatus);

    // Save status to localStorage so it persists and is accessible to user side
    localStorage.setItem('restaurantOpen', newStatus.toString());

    // Dispatch custom event to notify other parts of the app
    window.dispatchEvent(new CustomEvent('restaurantStatusChanged', {
      detail: { isOpen: newStatus }
    }));

    // Show notification to admin
    if (newStatus) {
      alert('🟢 Restaurant is now OPEN. Users can browse and place orders.');
    } else {
      alert('🔴 Restaurant is now CLOSED. Users can browse but cannot place orders.');
    }
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-left">
        <img src="/LOGO.png" alt="SAH_ONE Admin" className="admin-logo" />
        <button
          className={`restaurant-toggle-btn ${restaurantOpen ? 'open' : 'closed'}`}
          onClick={toggleRestaurant}
          title={`Click to ${restaurantOpen ? 'close' : 'open'} restaurant`}
        >
          <span className="toggle-icon">{restaurantOpen ? '🟢' : '🔴'}</span>
          <span className="toggle-text">
            Admin Panel
            <span className="toggle-status">{restaurantOpen ? 'OPEN' : 'CLOSED'}</span>
          </span>
        </button>
      </div>

      <div className="admin-nav-center">
        <Link to="/admin" className={`admin-nav-link ${isActive('/admin')}`}>
          Dashboard
        </Link>
        <Link to="/admin/menu" className={`admin-nav-link ${isActive('/admin/menu')}`}>
          Menu
        </Link>
        <Link to="/admin/orders" className={`admin-nav-link ${isActive('/admin/orders')}`}>
          Orders
        </Link>
        <Link to="/admin/offers" className={`admin-nav-link ${isActive('/admin/offers')}`}>
          Offers
        </Link>
        <Link to="/admin/reports" className={`admin-nav-link ${isActive('/admin/reports')}`}>
          Reports
        </Link>
        <Link to="/admin/profile" className={`admin-nav-link ${isActive('/admin/profile')}`}>
          Profile
        </Link>
      </div>

      <div className="admin-nav-right">
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
