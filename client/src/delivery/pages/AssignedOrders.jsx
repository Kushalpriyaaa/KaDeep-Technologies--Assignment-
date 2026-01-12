import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function AssignedOrders() {
  return (
    <>
      <Navbar />
      <div className="delivery-container">
        <div className="delivery-header">
          <h1>🚗 Assigned Orders</h1>
        </div>

      <div className="delivery-list">
        <div className="delivery-card">
          <div className="order-info">
            <h3>Order #12345</h3>
            <p className="restaurant">🏪 Pizza Palace</p>
            <p className="customer">👤 John Doe</p>
            <p className="address">📍 123 Main St, City</p>
          </div>
          <div className="order-actions">
            <Link to="/delivery/pickup" className="btn-pickup">Pickup</Link>
          </div>
        </div>

        <div className="delivery-card">
          <div className="order-info">
            <h3>Order #12346</h3>
            <p className="restaurant">🏪 Burger House</p>
            <p className="customer">👤 Jane Smith</p>
            <p className="address">📍 456 Oak Ave, City</p>
          </div>
          <div className="order-actions">
            <Link to="/delivery/pickup" className="btn-pickup">Pickup</Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
