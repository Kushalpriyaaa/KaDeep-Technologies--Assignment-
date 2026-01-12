import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Navbar from '../components/Navbar';
import MenuItemCard from '../components/MenuItemCard';
import { useCart } from '../../context/CartContext';
import '../styles/MenuItemCard.css';
import '../styles/pages.css';
import '../styles/UserMenu.css';

export default function UserMenu() {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedMobileItems, setExpandedMobileItems] = useState({});

  useEffect(() => {
    if (location.state?.category) {
      const category = location.state.category;
      setSelectedCategory(category);
      setExpandedCategories(prev => ({
        ...prev,
        [category]: true
      }));
      // Clear state so it doesn't persist on refresh if desired, or keep it.
      // optional: window.history.replaceState({}, document.title) or similar if needed.
    }
  }, [location.state]);

  // Fetch data from Convex
  const allMenuItems = useQuery(api.modules.menu.menu.getAvailableMenuItems);
  const categoriesList = useQuery(api.modules.menu.menu.getCategoryNames);

  const getItemQuantity = (itemId, portionType = 'full') => {
    const uniqueId = `${itemId}_${portionType}`;
    const cartItem = cartItems.find(item => item.id === uniqueId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Check if restaurant is open
  const isRestaurantOpen = () => {
    const savedStatus = localStorage.getItem('restaurantOpen');
    return savedStatus !== null ? savedStatus === 'true' : true;
  };

  // Handle add to cart with restaurant status check
  const handleAddToCart = (item, portionType = 'full') => {
    if (!isRestaurantOpen()) {
      alert('⚠️ Restaurant is temporarily closed. We are not accepting orders at the moment.');
      return;
    }
    
    const price = portionType === 'half' && item.halfPrice ? item.halfPrice : item.fullPrice;
    const uniqueId = `${item._id}_${portionType}`;
    
    addToCart({ 
      ...item, 
      id: uniqueId,
      originalId: item._id,
      portionType: portionType,
      price: price,
      name: portionType === 'half' ? `${item.name} (Half)` : item.name
    });
  };

  // Handle quantity update with restaurant status check
  const handleUpdateQuantity = (itemId, change) => {
    if (!isRestaurantOpen() && change > 0) {
      alert('⚠️ Restaurant is temporarily closed. We are not accepting orders at the moment.');
      return;
    }
    updateQuantity(itemId, change);
  };

  // Better loading state with error detection
  if (allMenuItems === undefined || categoriesList === undefined) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading menu...</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
            If this takes too long, please check your internet connection or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  // Handle empty data
  if (!allMenuItems || allMenuItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="menu-page-container">
            <div className="menu-page-header">
              <h1>🍽️ Our Menu</h1>
              <p>No items available at the moment</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const categories = ['All', ...categoriesList];

  const filteredItems = selectedCategory === 'All'
    ? allMenuItems
    : allMenuItems.filter(item => item.category === selectedCategory);

  // Toggle category expansion for mobile
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group items by category for mobile accordion view
  const getItemsByCategory = (category) => {
    return allMenuItems.filter(item => item.category === category);
  };

  const getCategoryItemCount = (category) => {
    return allMenuItems.filter(item => item.category === category).length;
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <section className="bestsellers-section">
          <div className="menu-page-header">
            <h1>Good Food Starts Here</h1>
            <p>Order what you love</p>
          </div>

          {/* Desktop Category Filter */}
          <div className="category-filter desktop-only">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Desktop Menu Items Grid */}
          <div className="bestsellers-grid desktop-only">
            {filteredItems.map(item => (
              <MenuItemCard
                key={item._id}
                item={item}
                onAddToCart={handleAddToCart}
                quantity={getItemQuantity(item._id)}
                onUpdateQuantity={handleUpdateQuantity}
                showCategory={selectedCategory === 'All'}
              />
            ))}
          </div>

          {/* Mobile Accordion View */}
          <div className="mobile-menu-accordion mobile-only">
            {categoriesList.map(category => {
              const categoryItems = getItemsByCategory(category);
              const isExpanded = expandedCategories[category];

              return (
                <div key={category} className="accordion-category">
                  <div
                    className="accordion-category-header"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="category-info">
                      <h3>{category}</h3>
                      <span className="item-count">({categoryItems.length} items)</span>
                    </div>
                    <span className={`accordion-arrow ${isExpanded ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="accordion-category-content">
                      {categoryItems.map(item => {
                        const hasAnyQuantity = getItemQuantity(item._id, 'half') > 0 || getItemQuantity(item._id, 'full') > 0;
                        const isItemExpanded = hasAnyQuantity || expandedMobileItems[item._id];
                        
                        return (
                          <div key={item._id} className="mobile-menu-item">
                            <img
                              src={item.image || '/image.png'}
                              alt={item.name}
                              className="mobile-item-image"
                              onError={(e) => e.target.src = '/image.png'}
                            />
                            <div className="mobile-item-details">
                              <h4 className="mobile-item-name">{item.name}</h4>
                              <p className="mobile-item-description">{item.description}</p>
                              
                              {!isItemExpanded ? (
                                <div className="mobile-initial-view">
                                  {item.halfPrice ? (
                                    <div className="mobile-price-display">
                                      <span className="mobile-price-item">Half: <strong>₹{item.halfPrice}</strong></span>
                                      <span className="mobile-price-item">Full: <strong>₹{item.fullPrice}</strong></span>
                                    </div>
                                  ) : (
                                    <div className="mobile-price-display">
                                      <span className="mobile-price-item single-price">₹{item.fullPrice}</span>
                                    </div>
                                  )}
                                  <button
                                    className="mobile-add-to-cart-btn"
                                    onClick={() => setExpandedMobileItems(prev => ({...prev, [item._id]: true}))}
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {/* Half Portion */}
                                  {item.halfPrice && (
                                    <div className="mobile-item-portion">
                                      <div className="mobile-portion-header">
                                        <span className="mobile-portion-label">Half</span>
                                        <span className="mobile-item-price">₹{item.halfPrice}</span>
                                      </div>
                                      {getItemQuantity(item._id, 'half') === 0 ? (
                                        <button
                                          className="mobile-add-btn"
                                          onClick={() => {
                                            handleAddToCart(item, 'half');
                                            setExpandedMobileItems(prev => ({...prev, [item._id]: false}));
                                          }}
                                        >
                                          Add
                                        </button>
                                      ) : (
                                        <div className="mobile-quantity-controls">
                                          <button
                                            className="mobile-qty-btn"
                                            onClick={() => {
                                              handleUpdateQuantity(`${item._id}_half`, -1);
                                              if (getItemQuantity(item._id, 'half') === 1 && getItemQuantity(item._id, 'full') === 0) {
                                                setExpandedMobileItems(prev => ({...prev, [item._id]: false}));
                                              }
                                            }}
                                          >
                                            −
                                          </button>
                                          <span className="mobile-qty-number">{getItemQuantity(item._id, 'half')}</span>
                                          <button
                                            className="mobile-qty-btn"
                                            onClick={() => handleUpdateQuantity(`${item._id}_half`, 1)}
                                          >
                                            +
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Full Portion */}
                                  <div className="mobile-item-portion">
                                    <div className="mobile-portion-header">
                                      <span className="mobile-portion-label">Full</span>
                                      <span className="mobile-item-price">₹{item.fullPrice}</span>
                                    </div>
                                    {getItemQuantity(item._id, 'full') === 0 ? (
                                      <button
                                        className="mobile-add-btn"
                                        onClick={() => {
                                          handleAddToCart(item, 'full');
                                          setExpandedMobileItems(prev => ({...prev, [item._id]: false}));
                                        }}
                                      >
                                        Add
                                      </button>
                                    ) : (
                                      <div className="mobile-quantity-controls">
                                        <button
                                          className="mobile-qty-btn"
                                          onClick={() => {
                                            handleUpdateQuantity(`${item._id}_full`, -1);
                                            if (getItemQuantity(item._id, 'full') === 1 && getItemQuantity(item._id, 'half') === 0) {
                                              setExpandedMobileItems(prev => ({...prev, [item._id]: false}));
                                            }
                                          }}
                                        >
                                          −
                                        </button>
                                        <span className="mobile-qty-number">{getItemQuantity(item._id, 'full')}</span>
                                        <button
                                          className="mobile-qty-btn"
                                          onClick={() => handleUpdateQuantity(`${item._id}_full`, 1)}
                                        >
                                          +
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
