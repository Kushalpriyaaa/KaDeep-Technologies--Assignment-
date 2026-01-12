import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/servingHours.css';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

export default function SpecialServingHours() {
  // Initial Slot State Helper
  const initialSlotState = (startTime, endTime) => ({
    isActive: false,
    startTime,
    endTime,
    items: []
  });

  const [formData, setFormData] = useState({
    isClosed: false,
    reason: '',
    breakfast: initialSlotState('08:00', '11:00'),
    lunch: initialSlotState('12:00', '16:00'),
    dinner: initialSlotState('19:00', '23:00')
  });

  // activeAccordion state to manage which section is open (breakfast, lunch, dinner)
  const [activeAccordion, setActiveAccordion] = useState(null);

  // New Item Form State (temporary holder before adding to a slot)
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });
  const [addingToSlot, setAddingToSlot] = useState(null); // 'breakfast', 'lunch', 'dinner' or null

  // Image Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Queries & Mutations
  const globalConfig = useQuery(api.modules.servingHours.servingHours.getGlobalServingHours);
  const updateGlobalServingHours = useMutation(api.modules.servingHours.servingHours.updateGlobalServingHours);

  // Update form data when data is fetched
  useEffect(() => {
    if (globalConfig) {
      setFormData({
        isClosed: globalConfig.isClosed,
        reason: globalConfig.reason || '',
        breakfast: globalConfig.breakfast || initialSlotState('08:00', '11:00'),
        lunch: globalConfig.lunch || initialSlotState('12:00', '16:00'),
        dinner: globalConfig.dinner || initialSlotState('19:00', '23:00')
      });
    }
  }, [globalConfig]);

  const handleSlotToggle = (slotName) => {
    setFormData(prev => ({
      ...prev,
      [slotName]: {
        ...prev[slotName],
        isActive: !prev[slotName].isActive
      }
    }));
  };

  const handleTimeChange = (slotName, field, value) => {
    setFormData(prev => ({
      ...prev,
      [slotName]: {
        ...prev[slotName],
        [field]: value
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const cloudinaryUrl = await uploadImageToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      setNewItem(prev => ({ ...prev, image: cloudinaryUrl }));
      setUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      setUploading(false);
    }
  };

  const addItemToSlot = (slotName) => {
    if (!newItem.name || !newItem.price) {
      alert("Name and Price are required!");
      return;
    }

    const itemToAdd = {
      id: Date.now().toString(), // Simple ID generation
      name: newItem.name,
      price: parseFloat(newItem.price),
      description: newItem.description,
      image: newItem.image,
      isActive: true // Default to active
    };

    setFormData(prev => ({
      ...prev,
      [slotName]: {
        ...prev[slotName],
        items: [...prev[slotName].items, itemToAdd]
      }
    }));

    setNewItem({ name: '', price: '', description: '', image: '' });
    setAddingToSlot(null);
  };

  const removeItemFromSlot = (slotName, itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setFormData(prev => ({
      ...prev,
      [slotName]: {
        ...prev[slotName],
        items: prev[slotName].items.filter(item => item.id !== itemId)
      }
    }));
  };

  const toggleItemActive = (slotName, itemId) => {
    setFormData(prev => ({
      ...prev,
      [slotName]: {
        ...prev[slotName],
        items: prev[slotName].items.map(item =>
          item.id === itemId ? { ...item, isActive: !item.isActive } : item
        )
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateGlobalServingHours(formData);
      alert("Serving hours configuration updated successfully!");
    } catch (error) {
      console.error("Error saving hours:", error);
      alert("Failed to update.");
    }
  };

  const toggleAccordion = (slot) => {
    setActiveAccordion(activeAccordion === slot ? null : slot);
    setAddingToSlot(null);
  };

  // Helper to render a Slot Section (Accordion Item)
  // Helper to render a Slot Section (Accordion Item)
  const renderSlotSection = (slotName, label, colorClass) => {
    const slot = formData[slotName];
    const isOpen = activeAccordion === slotName;

    return (
      <div className={`slot-card ${colorClass} ${!slot.isActive ? 'inactive' : ''} ${isOpen ? 'open' : ''}`}>
        <div
          className="slot-header"
          onClick={() => toggleAccordion(slotName)}
        >
          <div className="slot-title-group">
            <span className="slot-icon">{isOpen ? '▼' : '▶'}</span>
            <h2>{label}</h2>
            {slot.isActive ? (
              <span className="time-pill">
                {slot.startTime} - {slot.endTime}
              </span>
            ) : (
              <span className="status-pill inactive">Inactive</span>
            )}
          </div>

          <div className="slot-header-actions" onClick={(e) => e.stopPropagation()}>
            <span className="item-count-badge">{slot.items.length} Items</span>
            <label className="toggle-switch small">
              <input
                type="checkbox"
                checked={slot.isActive}
                onChange={() => handleSlotToggle(slotName)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {isOpen && (
          <div className="category-content">
            {/* Time Settings */}
            <div className="time-section">
              <h3>⏰ Timing</h3>
              <div className="time-controls">
                <div className="time-input-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleTimeChange(slotName, 'startTime', e.target.value)}
                  />
                </div>
                <span className="time-separator">to</span>
                <div className="time-input-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleTimeChange(slotName, 'endTime', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="items-section">
              <div /* Header */ style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>🍽️ Menu Items</h3>
                <button
                  className="add-item-btn-small"
                  onClick={() => setAddingToSlot(addingToSlot === slotName ? null : slotName)}
                >
                  {addingToSlot === slotName ? 'Cancel' : '+ Add Special Item'}
                </button>
              </div>

              {/* Add Item Form */}
              {addingToSlot === slotName && (
                <div className="add-item-form-card">
                  <h4>New Special Item for {label}</h4>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Description (Optional)"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </div>
                  {/* Image Upload instead of URL input */}
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '0.9rem' }}>Item Image</label>
                    {newItem.image ? (
                      <div className="uploaded-image-preview">
                        <img src={newItem.image} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                        <button
                          className="remove-image-btn"
                          onClick={() => setNewItem({ ...newItem, image: '' })}
                          style={{ marginLeft: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="upload-wrapper">
                        <label className="image-upload-btn">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                          />
                          <span style={{ cursor: 'pointer', color: '#2196F3', fontWeight: '500' }}>
                            {uploading ? `Uploading... ${uploadProgress}%` : '📤 Upload Image'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                  <button className="save-btn" onClick={() => addItemToSlot(slotName)}>Add Item</button>
                </div>
              )}

              {/* Items List */}
              {slot.items.length === 0 ? (
                <div className="empty-category">
                  <p>No special items added for this slot yet.</p>
                </div>
              ) : (
                <div className="category-items">
                  {slot.items.map(item => (
                    <div key={item.id} className={`admin-item ${!item.isActive ? 'inactive-item-bg' : ''}`}>
                      <img
                        src={item.image || '/image.png'}
                        alt={item.name}
                        className="item-image"
                        onError={(e) => e.target.src = '/image.png'}
                        style={{ opacity: item.isActive ? 1 : 0.5 }}
                      />
                      <div className="item-details" style={{ opacity: item.isActive ? 1 : 0.6 }}>
                        <h3>
                          {item.name}
                          <span className="item-price">₹{item.price}</span>
                          {!item.isActive && <span className="item-inactive-label">(Hidden)</span>}
                        </h3>
                        <p>{item.description}</p>
                      </div>
                      <div className="item-actions">
                        <label className="toggle-switch-small" title={item.isActive ? "Hide from users" : "Show to users"}>
                          <input
                            type="checkbox"
                            checked={!!item.isActive}
                            onChange={() => toggleItemActive(slotName, item.id)}
                          />
                          <span className="toggle-slider-small"></span>
                        </label>
                        <button className="delete-btn" onClick={() => removeItemFromSlot(slotName, item.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <header className="admin-header">
          <div className="header-content">
            <h1>🕰️ Serving Hours & Special Menu</h1>
            <p>Configure your restaurant's daily schedule and special menu items.</p>
          </div>
          <div className="header-actions">
            <button className="save-btn-primary" onClick={handleSubmit}>
              <span className="btn-icon">💾</span> Save Changes
            </button>
          </div>
        </header>

        <div className="hours-layout-single">
          <div className="global-settings-card">
            <div className="settings-row">
              <div className="setting-info">
                <h3>Restaurant Status</h3>
                <p>Toggle to temporarily close the restaurant for the day.</p>
              </div>
              <label className="toggle-switch large">
                <input
                  type="checkbox"
                  checked={formData.isClosed}
                  onChange={(e) => setFormData({ ...formData, isClosed: e.target.checked })}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label-side">{formData.isClosed ? 'CLOSED 🔴' : 'OPEN 🟢'}</span>
              </label>
            </div>

            {formData.isClosed && (
              <div className="closure-reason-input">
                <label>Reason for Closure</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Off, Public Holiday, Maintenance"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
            )}
          </div>

          {!formData.isClosed && (
            <div className="slots-container">
              {renderSlotSection('breakfast', 'Breakfast', 'slot-breakfast')}
              {renderSlotSection('lunch', 'Lunch', 'slot-lunch')}
              {renderSlotSection('dinner', 'Dinner', 'slot-dinner')}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
