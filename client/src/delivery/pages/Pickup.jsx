import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function Pickup() {
  return (
    <>
      <Navbar />
      <div className="delivery-container">
        <div className="delivery-header">
          <h1>🏪 Pickup Orders</h1>
        </div>

      <div className="pickup-details">
        <div className="detail-card">
          <h3>Order #12345</h3>
          <div className="detail-row">
            <span className="label">Restaurant:</span>
            <span className="value">🏪 Pizza Palace</span>
          </div>
          <div className="detail-row">
            <span className="label">Items:</span>
            <span className="value">2 Pizzas, 1 Burger</span>
          </div>
          <div className="detail-row">
            <span className="label">Amount:</span>
            <span className="value">₹847</span>
          </div>
          <button className="btn-confirm-pickup">Confirm Pickup</button>
        </div>
      </div>
      </div>
    </>
  );
}
