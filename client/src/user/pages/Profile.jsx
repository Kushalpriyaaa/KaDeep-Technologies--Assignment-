import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex-api/api';
import '../styles/pages.css';
import '../styles/Profile.css';

export default function Profile() {
  const { currentUser } = useAuth();

  // Fetch user data from Convex
  const user = useQuery(api.modules.users.users.getUserByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );

  const updateUser = useMutation(api.modules.users.users.updateUser);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    name: ''
  });

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      // Check for saved address from AddressModal
      const savedAddress = localStorage.getItem('userAddress');
      let addressText = user.address || '';
      let phoneNumber = user.phone || '';
      
      if (savedAddress) {
        const addressData = JSON.parse(savedAddress);
        addressText = `${addressData.deliveryArea}, ${addressData.locality}, ${addressData.city}`;
        phoneNumber = addressData.mobileNumber || user.phone || '';
      }
      
      setFormData({
        phone: phoneNumber,
        address: addressText,
        name: user.name || ''
      });
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUser({
        firebaseUid: user.firebaseUid,
        phone: formData.phone,
        address: formData.address,
        name: formData.name
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (!currentUser) return <div>Please login first</div>;
  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>👤 Profile</h1>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="profile-edit-form">
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full delivery address"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="profile-section">
              <div className="profile-avatar">👤</div>
              <h2>{user.name || 'User'}</h2>
              <p className="profile-email">{user.email}</p>
            </div>

            <div className="profile-options">
              <div className="option-item">
                <span className="option-icon">📍</span>
                <div>
                  <h3>Delivery Address</h3>
                  <p>{user.address || 'No address added'}</p>
                </div>
              </div>

              <div className="option-item">
                <span className="option-icon">📱</span>
                <div>
                  <h3>Phone Number</h3>
                  <p>{user.phone || 'No phone number added'}</p>
                </div>
              </div>

              <div className="option-item">
                <span className="option-icon">💳</span>
                <div>
                  <h3>Payment Methods</h3>
                  <p>Cash on Delivery (Standard)</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
