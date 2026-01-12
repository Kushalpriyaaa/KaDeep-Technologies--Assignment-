import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Navbar from '../components/Navbar';
import '../styles/profile.css'; // We'll need to make sure this exists or reuse user profile styles

export default function AdminProfile() {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    const adminProfile = useQuery(api.modules.auth.admins.getAdmin,
        currentUser ? { firebaseUid: currentUser.uid } : "skip"
    );

    const updateAdmin = useMutation(api.modules.auth.admins.updateAdmin);

    useEffect(() => {
        if (adminProfile) {
            setFormData({
                name: adminProfile.name || '',
                phone: adminProfile.phone || '',
                email: adminProfile.email || '',
            });
        }
    }, [adminProfile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAdmin({
                firebaseUid: currentUser.uid,
                name: formData.name,
                phone: formData.phone,
            });
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (!adminProfile) {
        return (
            <div className="admin-container">
                <Navbar />
                <div className="admin-content">
                    <div className="loading">Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <Navbar />
            <div className="admin-content">
                <header className="admin-header">
                    <div className="header-content">
                        <h1>👤 Admin Profile</h1>
                        <p>Manage your account settings and personal details.</p>
                    </div>
                    <div className="header-actions">
                        {!isEditing && (
                            <button
                                className="edit-profile-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                ✏️ Edit Profile
                            </button>
                        )}
                    </div>
                </header>

                <div className="profile-container">
                    <div className="profile-card">
                        <div className="profile-avatar-section">
                            <div className="avatar-circle">
                                {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <span className="role-badge">Administrator</span>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="form-input disabled"
                                    />
                                    <small>Email cannot be changed.</small>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-details">
                                <div className="detail-row">
                                    <span className="detail-label">Full Name</span>
                                    <span className="detail-value">{adminProfile.name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email Address</span>
                                    <span className="detail-value">{adminProfile.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Phone Number</span>
                                    <span className="detail-value">{adminProfile.phone || 'Not set'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Date Joined</span>
                                    <span className="detail-value">
                                        {new Date(adminProfile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
