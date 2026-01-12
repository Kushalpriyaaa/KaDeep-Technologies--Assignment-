import { useState } from 'react';
import '../styles/AddressModal.css';

export default function AddressModal({ isOpen, onClose, onSave }) {
  const [addressData, setAddressData] = useState({
    deliveryArea: '',
    city: '',
    company: '',
   
   
    landmark: '',
    locality: '',
    mobileNumber: '',
    addressType: 'Home'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(addressData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numbers for mobile number field
    if (name === 'mobileNumber' && value && !/^\d*$/.test(value)) {
      return;
    }
    
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal-header">
          <h2>Add Address</h2>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-section">
            <label className="form-label">DELIVERY AREA</label>
            <div className="delivery-area-input">
              <span className="check-icon">✓</span>
              <input
                type="text"
                name="deliveryArea"
                value={addressData.deliveryArea}
                onChange={handleChange}
                placeholder="Table Space UB City, UB City, 8, 9Vittal Mallaya Roa..."
                required
              />
              <button type="button" className="change-btn">CHANGE</button>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="company"
              value={addressData.company}
              onChange={handleChange}
              placeholder="Company, Building *"
              required
            />
          </div>

          

         

          <div className="form-group">
            <input
              type="text"
              name="landmark"
              value={addressData.landmark}
              onChange={handleChange}
              placeholder="Nearby Landmark (optional)"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="locality"
              value={addressData.locality}
              onChange={handleChange}
              placeholder="Area / Sector / Locality *"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="city"
              value={addressData.city}
              onChange={handleChange}
              placeholder="City *"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="mobileNumber"
              value={addressData.mobileNumber}
              onChange={handleChange}
              placeholder="Mobile Number (10 digits) *"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </div>

          <div className="address-type-section">
            <label className="radio-option">
              <input
                type="radio"
                name="addressType"
                value="Home"
                checked={addressData.addressType === 'Home'}
                onChange={handleChange}
              />
              <span>Home</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="addressType"
                value="Work"
                checked={addressData.addressType === 'Work'}
                onChange={handleChange}
              />
              <span>Work</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="addressType"
                value="Hotel"
                checked={addressData.addressType === 'Hotel'}
                onChange={handleChange}
              />
              <span>Hotel</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="addressType"
                value="Other"
                checked={addressData.addressType === 'Other'}
                onChange={handleChange}
              />
              <span>Other</span>
            </label>
          </div>

          <button type="submit" className="save-address-btn">
            Save and proceed
          </button>
        </form>
      </div>
    </div>
  );
}
