import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function DeliveryConfirm() {
  return (
    <>
      <Navbar />
      <div className="delivery-container">
        <div className="delivery-header">
          <h1>✅ Confirm Delivery</h1>
        </div>

      <div className="confirm-details">
        <div className="detail-card">
          <h3>Order #12345</h3>
          <div className="detail-row">
            <span className="label">Customer:</span>
            <span className="value">👤 John Doe</span>
          </div>
          <div className="detail-row">
            <span className="label">Address:</span>
            <span className="value">📍 123 Main St, City</span>
          </div>
          <div className="detail-row">
            <span className="label">Amount:</span>
            <span className="value">₹847</span>
          </div>
          <div className="detail-row">
            <span className="label">Payment:</span>
            <span className="value">💳 Online Paid</span>
          </div>
          <button className="btn-complete-delivery">Complete Delivery</button>
        </div>
      </div>
      </div>
    </>
  );
}
