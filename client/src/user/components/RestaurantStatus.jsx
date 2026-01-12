import React, { useState, useEffect } from 'react';
import './RestaurantStatus.css';

export default function RestaurantStatus() {
  const [showPopup, setShowPopup] = useState(false);
  const [restaurantOpen, setRestaurantOpen] = useState(true);

  useEffect(() => {
    // Check restaurant status when component mounts
    const checkRestaurantStatus = () => {
      const savedStatus = localStorage.getItem('restaurantOpen');
      const isOpen = savedStatus !== null ? savedStatus === 'true' : true;
      
      console.log('🔍 RestaurantStatus Check:', { savedStatus, isOpen });
      console.log('📋 Session popup shown:', sessionStorage.getItem('closedPopupShown'));
      
      setRestaurantOpen(isOpen);
      
      // If restaurant is closed and user hasn't seen the popup yet (in this session)
      if (!isOpen && !sessionStorage.getItem('closedPopupShown')) {
        console.log('✅ Showing popup - restaurant is closed');
        setShowPopup(true);
      } else {
        console.log('❌ Not showing popup:', { isOpen, hasSeenPopup: sessionStorage.getItem('closedPopupShown') });
      }
    };

    checkRestaurantStatus();

    // Listen for restaurant status changes from admin
    const handleStatusChange = (event) => {
      const isOpen = event.detail.isOpen;
      console.log('🔔 Status changed event received:', isOpen);
      setRestaurantOpen(isOpen);
      
      // Show popup immediately when restaurant closes
      if (!isOpen) {
        console.log('🔴 Restaurant closed - showing popup');
        setShowPopup(true);
        sessionStorage.removeItem('closedPopupShown'); // Allow popup to show again
      }
    };

    window.addEventListener('restaurantStatusChanged', handleStatusChange);
    
    // Also check on storage change (in case admin changes it in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'restaurantOpen') {
        const isOpen = e.newValue === 'true';
        setRestaurantOpen(isOpen);
        if (!isOpen) {
          setShowPopup(true);
          sessionStorage.removeItem('closedPopupShown');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('restaurantStatusChanged', handleStatusChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    // Mark that user has seen the popup in this session
    sessionStorage.setItem('closedPopupShown', 'true');
  };

  // Function to check if user can add to cart (export this or use context)
  const canAddToCart = () => {
    return restaurantOpen;
  };

  // Make the status available globally
  window.restaurantStatus = {
    isOpen: restaurantOpen,
    canAddToCart: canAddToCart
  };

  if (!showPopup) return null;

  return (
    <div className="restaurant-status-overlay">
      <div className="restaurant-status-modal">
        <div className="status-icon">🔴</div>
        <h2>Temporarily Unavailable</h2>
        <p>We're currently not accepting orders at the moment.</p>
        <p className="status-subtitle">
          You can still browse our menu and explore what we offer!
        </p>
        <button className="status-ok-btn" onClick={handleClosePopup}>
          OK, Let me browse
        </button>
      </div>
    </div>
  );
}
