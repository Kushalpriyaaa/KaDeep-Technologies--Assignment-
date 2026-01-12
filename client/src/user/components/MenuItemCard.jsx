import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import '../styles/MenuItemCard.css';

export default function MenuItemCard({ item, onAddToCart, quantity, onUpdateQuantity, showCategory = true }) {
  const { cartItems, updateQuantity: updateCartQuantity } = useCart();
  const [showPortionControls, setShowPortionControls] = useState(false);

  const getPortionQuantity = (portionType) => {
    const uniqueId = `${item._id}_${portionType}`;
    const cartItem = cartItems.find(i => i.id === uniqueId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handlePortionAdd = (portionType) => {
    onAddToCart && onAddToCart(item, portionType);
  };

  const handlePortionUpdate = (portionType, change) => {
    const uniqueId = `${item._id}_${portionType}`;
    const currentQty = getPortionQuantity(portionType);
    
    // Update quantity
    updateCartQuantity(uniqueId, change);
    
    // If we're reducing to 0, check if both portions will be 0
    if (change < 0 && currentQty === 1) {
      const otherPortionType = portionType === 'half' ? 'full' : 'half';
      const otherQty = getPortionQuantity(otherPortionType);
      if (otherQty === 0) {
        setShowPortionControls(false);
      }
    }
  };

  const handleAddToCartClick = () => {
    if (item.hasHalfPortion && item.halfPrice) {
      setShowPortionControls(true);
    } else {
      handlePortionAdd('full');
    }
  };

  const halfQty = getPortionQuantity('half');
  const fullQty = getPortionQuantity('full');
  const hasAnyInCart = halfQty > 0 || fullQty > 0;

  // If any portion is in cart, always show controls
  const shouldShowControls = showPortionControls || hasAnyInCart;

  return (
    <div className="menu-item-card menu-card-v2">
      <div className="menu-item-image-wrapper">
        <img
          src={item.image || '/image.png'}
          alt={item.name}
          onError={(e) => e.target.src = '/image.png'}
        />
      </div>
      
      <div className="menu-item-content">
        <h3 className="menu-item-name">{item.name}</h3>
        
        {showCategory && item.category && (
          <p className="menu-item-category">{item.category}</p>
        )}
        
        {item.description && (
          <p className="menu-item-description">{item.description}</p>
        )}
        
        <div className="menu-item-footer">
          {item.hasHalfPortion && item.halfPrice ? (
            shouldShowControls ? (
              // Show both portion types with quantity controls
              <div className="portion-controls-container">
                <div className="portion-row">
                  <div className="portion-info">
                    <span className="portion-label-small">Half</span>
                    <span className="portion-price-small">₹{item.halfPrice}</span>
                  </div>
                  {halfQty > 0 ? (
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => handlePortionUpdate('half', -1)}>−</button>
                      <span className="qty-number">{halfQty}</span>
                      <button className="qty-btn" onClick={() => handlePortionUpdate('half', 1)}>+</button>
                    </div>
                  ) : (
                    <button className="add-portion-btn-text" onClick={() => handlePortionAdd('half')}>Add</button>
                  )}
                </div>
                
                <div className="portion-row">
                  <div className="portion-info">
                    <span className="portion-label-small">Full</span>
                    <span className="portion-price-small">₹{item.fullPrice}</span>
                  </div>
                  {fullQty > 0 ? (
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => handlePortionUpdate('full', -1)}>−</button>
                      <span className="qty-number">{fullQty}</span>
                      <button className="qty-btn" onClick={() => handlePortionUpdate('full', 1)}>+</button>
                    </div>
                  ) : (
                    <button className="add-portion-btn-text" onClick={() => handlePortionAdd('full')}>Add</button>
                  )}
                </div>
              </div>
            ) : (
              // Show prices and Add to Cart button initially
              <div className="initial-price-display">
                <div className="price-info-section">
                  <div className="price-item">
                    <span className="price-label">Half:</span>
                    <span className="price-value">₹{item.halfPrice}</span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">Full:</span>
                    <span className="price-value">₹{item.fullPrice}</span>
                  </div>
                </div>
                <button className="add-to-cart-btn" onClick={handleAddToCartClick}>
                  Add to Cart
                </button>
              </div>
            )
          ) : (
            // Single price item
            <>
              <p className="menu-item-price">₹{item.fullPrice}</p>
              
              {fullQty > 0 ? (
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => handlePortionUpdate('full', -1)}>−</button>
                  <span className="qty-number">{fullQty}</span>
                  <button className="qty-btn" onClick={() => handlePortionUpdate('full', 1)}>+</button>
                </div>
              ) : (
                <button className="add-to-cart-btn" onClick={() => handlePortionAdd('full')}>
                  Add to Cart
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
