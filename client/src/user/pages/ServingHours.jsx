import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex-api/api';
import Navbar from '../components/Navbar';
import { useCart } from '../../context/CartContext';
import '../styles/pages.css';
import '../styles/ServingHours.css';

export default function ServingHours() {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [searchParams] = useSearchParams();
  const slot = searchParams.get('slot');
  const [expandedCategory, setExpandedCategory] = useState(slot || null);

  useEffect(() => {
    if (slot) {
      setExpandedCategory(slot);
    }
  }, [slot]);

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Check if restaurant is open (Global Check)
  const isRestaurantOpen = () => {
    const savedStatus = localStorage.getItem('restaurantOpen');
    return savedStatus !== null ? savedStatus === 'true' : true;
  };

  // Handle add to cart with restaurant status check
  const handleAddToCart = (item) => {
    if (!isRestaurantOpen()) {
      alert('⚠️ Restaurant is temporarily closed. We are not accepting orders at the moment.');
      return;
    }
    addToCart(item);
  };

  // Handle quantity update with restaurant status check
  const handleUpdateQuantity = (itemId, change) => {
    if (!isRestaurantOpen() && change > 0) {
      alert('⚠️ Restaurant is temporarily closed. We are not accepting orders at the moment.');
      return;
    }
    updateQuantity(itemId, change);
  };

  // Get global serving hours
  const specialHours = useQuery(api.modules.servingHours.servingHours.getGlobalServingHours);

  // Loading state
  if (specialHours === undefined) {
    return (
      <>
        <Navbar />
        <div className="page-container loading-container">
          <div className="loading-spinner">Loading serving hours...</div>
        </div>
      </>
    );
  }

  // Construct Categories from Global Schema
  const categories = [];

  if (specialHours && !specialHours.isClosed) {
    if (specialHours.breakfast?.isActive) {
      const activeItems = (specialHours.breakfast.items || []).filter(item => item.isActive !== false);
      if (activeItems.length > 0) {
        categories.push({
          id: 'breakfast',
          name: 'Breakfast',
          icon: '🌅',
          time: `${specialHours.breakfast.startTime} - ${specialHours.breakfast.endTime}`,
          color: '#FF9800',
          items: activeItems
        });
      }
    }
    if (specialHours.lunch?.isActive) {
      const activeItems = (specialHours.lunch.items || []).filter(item => item.isActive !== false);
      if (activeItems.length > 0) {
        categories.push({
          id: 'lunch',
          name: 'Lunch',
          icon: '☀️',
          time: `${specialHours.lunch.startTime} - ${specialHours.lunch.endTime}`,
          color: '#4CAF50',
          items: activeItems
        });
      }
    }
    if (specialHours.dinner?.isActive) {
      const activeItems = (specialHours.dinner.items || []).filter(item => item.isActive !== false);
      if (activeItems.length > 0) {
        categories.push({
          id: 'dinner',
          name: 'Dinner',
          icon: '🌙',
          time: `${specialHours.dinner.startTime} - ${specialHours.dinner.endTime}`,
          color: '#2196F3',
          items: activeItems
        });
      }
    }
  }

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="serving-hours-container">
          <div className="serving-hours-header">
            <h1>🕐 Serving Hours</h1>
            <p>Our Special Menu</p>
          </div>

          <div className="category-sections">
            {/* Closed State */}
            {specialHours?.isClosed && (
              <div className="closed-banner">
                <h2>🚫 Restaurant Closed</h2>
                <p>{specialHours.reason || 'We are closed for today.'}</p>
              </div>
            )}

            {/* Empty State */}
            {!specialHours?.isClosed && categories.length === 0 && (
              <div className="no-hours-message">
                <h3>No special serving menus available for today.</h3>
                <p>Please explore our regular menu!</p>
              </div>
            )}

            {/* List */}
            {/* List */}
            {categories
              .filter(category => !slot || category.id === slot)
              .map(category => {
                const isExpanded = expandedCategory === category.id;

                return (
                  <div key={category.id} className="meal-category">
                    <div
                      className="category-header-bar"
                      onClick={() => toggleCategory(category.id)}
                      style={{ background: category.color }}
                    >
                      <div className="category-info">
                        <span className="category-arrow">{isExpanded ? '▼' : '▶'}</span>
                        <span className="category-icon">{category.icon}</span>
                        <h2>{category.name}</h2>
                        <span className="category-time-badge">{category.time}</span>
                      </div>
                      <span className="item-count-badge">{category.items.length} items</span>
                    </div>

                    {isExpanded && (
                      <div className="category-items-grid">
                        {category.items.length === 0 ? (
                          <div className="empty-slot-message">No items listed for {category.name} today.</div>
                        ) : (
                          category.items.map(item => (
                            <div key={item.id} className="meal-card">
                              <img
                                src={item.image || '/image.png'}
                                alt={item.name}
                                className="meal-card-image"
                                onError={(e) => e.target.src = '/image.png'}
                              />
                              <div className="meal-card-content">
                                <h3 className="meal-card-title">{item.name}</h3>
                                {item.description && <p className="meal-card-description">{item.description}</p>}
                                <div className="meal-card-footer">
                                  <span className="meal-price">₹{item.price}</span>
                                  {getItemQuantity(item.id) === 0 ? ( // Note: item.id is string from our new schema
                                    <button
                                      className="meal-add-btn"
                                      onClick={() => handleAddToCart({ ...item, fullPrice: item.price })} // Map price to fullPrice for Context
                                    >
                                      Add to Cart
                                    </button>
                                  ) : (
                                    <div className="quantity-controls">
                                      <button
                                        className="qty-btn"
                                        onClick={() => handleUpdateQuantity(item.id, -1)}
                                      >
                                        −
                                      </button>
                                      <span className="qty-number">{getItemQuantity(item.id)}</span>
                                      <button
                                        className="qty-btn"
                                        onClick={() => handleUpdateQuantity(item.id, 1)}
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
