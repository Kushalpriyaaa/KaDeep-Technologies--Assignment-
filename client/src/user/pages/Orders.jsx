import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import '../styles/Orders.css';

export default function Orders() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>📦 My Orders</h1>
        </div>

      <div className="orders-list">
        <div className="order-card">
          <div className="order-header">
            <span className="order-id">#12345</span>
            <span className="order-status delivering">Delivering</span>
          </div>
          <div className="order-items">
            <p>🍕 Pizza x2, 🍔 Burger x1</p>
          </div>
          <div className="order-footer">
            <span className="order-total">₹847</span>
            <button className="track-btn">Track Order</button>
          </div>
        </div>

        <div className="order-card">
          <div className="order-header">
            <span className="order-id">#12344</span>
            <span className="order-status delivered">Delivered</span>
          </div>
          <div className="order-items">
            <p>🍜 Noodles x1, 🍰 Cake x1</p>
          </div>
          <div className="order-footer">
            <span className="order-total">₹448</span>
            <button className="reorder-btn">Reorder</button>
          </div>
        </div>

        <div className="order-card">
          <div className="order-header">
            <span className="order-id">#12343</span>
            <span className="order-status delivered">Delivered</span>
          </div>
          <div className="order-items">
            <p>🍕 Pizza x1</p>
          </div>
          <div className="order-footer">
            <span className="order-total">₹349</span>
            <button className="reorder-btn">Reorder</button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
