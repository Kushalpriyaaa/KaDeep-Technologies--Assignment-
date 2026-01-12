import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import CategoryPopup from '../components/CategoryPopup';
import PaymentModal from '../components/PaymentModal';
import '../styles/pages.css';
import '../styles/cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { currentUser } = useAuth();
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set(cartItems.map(item => item.id)));
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const user = useQuery(api.modules.users.users.getUserByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );

  const createOrder = useMutation(api.modules.orders.orders.createOrder);

  // Check if restaurant is open
  const isRestaurantOpen = () => {
    const savedStatus = localStorage.getItem('restaurantOpen');
    return savedStatus !== null ? savedStatus === 'true' : true;
  };

  // Handle quantity update with restaurant status check
  const handleUpdateQuantity = (itemId, change) => {
    if (!isRestaurantOpen() && change > 0) {
      alert('⚠️ Restaurant is temporarily closed. Cannot increase item quantity.');
      return;
    }
    updateQuantity(itemId, change);
  };
  const navigate = useNavigate();
  const deliveryCharge = 50;

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const toggleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.has(item.id)) {
        const price = typeof item.price === 'string' ?
          parseInt(item.price.replace('₹', '')) : item.price;
        return total + (price * item.quantity);
      }
      return total;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + deliveryCharge;
  };

  const handleCheckout = () => {
    if (!currentUser) {
      alert("Please login to checkout");
      navigate('/login');
      return;
    }

    // Check for saved address from AddressModal
    const savedAddress = localStorage.getItem('userAddress');
    
    if (!savedAddress) {
      alert("Please add your delivery address by clicking the location button in the navbar.");
      return;
    }

    const addressData = JSON.parse(savedAddress);
    
    // Validate that required fields are filled
    if (!addressData.mobileNumber || !addressData.city || !addressData.deliveryArea) {
      alert("Please complete your delivery address with all required fields.");
      return;
    }

    // Open payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Get saved address
      const savedAddress = localStorage.getItem('userAddress');
      const addressData = savedAddress ? JSON.parse(savedAddress) : {};
      
      // Format address string
      const deliveryAddress = `${addressData.deliveryArea || ''}, ${addressData.company || ''}, Floor: ${addressData.floor || ''}, ${addressData.locality || ''}, ${addressData.city || ''}, Mobile: ${addressData.mobileNumber || ''}`;
      
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        itemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        portion: item.selectedPortion || 'Full',
        image: item.image || ''
      }));
      
      // Create order in database
      await createOrder({
        userId: user._id,
        items: orderItems,
        totalAmount: calculateTotal(),
        deliveryAddress: deliveryAddress,
        customerName: user.name || '',
        customerPhone: addressData.mobileNumber || user.phone || '',
        customerEmail: user.email || '',
        paymentMethod: 'Online',
        deliveryCharge: deliveryCharge,
        subtotal: calculateSubtotal()
      });
      
      // Clear cart after successful order
      cartItems.forEach(item => removeFromCart(item.id));
      
      alert('✅ Payment successful! Order placed.');
      navigate('/user/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('❌ Failed to place order. Please try again.');
    }
  };

  return (
    <>
      <div className="cart-backdrop" onClick={() => navigate(-1)}></div>
      <div className="cart-sidebar">
        <div className="cart-sidebar-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>My Cart</h1>
          <button className="menu-btn">⋮</button>
        </div>

        {cartItems.length > 0 && (
          <div className="cart-select-all">
            <span>{cartItems.length} items</span>
            <button 
              className="select-all-btn"
              onClick={toggleSelectAll}
            >
              <span className="select-icon"></span> Select all
            </button>
          </div>
        )}

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Add some delicious items from our menu!</p>
              <button
                className="browse-menu-btn"
                onClick={() => setShowCategoryPopup(true)}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                </div>
                <img
                  src={item.image || '/image.png'}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => e.target.src = '/image.png'}
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-portion">
                    {item.portionType === 'half' ? 'Half Portion' : 'Full Portion'}
                  </p>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">
                      ₹{typeof item.price === 'string' ? item.price : item.price}
                    </span>
                    <div className="cart-item-controls">
                      <button
                        className="cart-qty-btn minus"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="cart-qty">{item.quantity}</span>
                      <button
                        className="cart-qty-btn plus"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  className="cart-item-delete"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>

      {/* Reused Category Popup */}
      <CategoryPopup
        isOpen={showCategoryPopup}
        onClose={() => setShowCategoryPopup(false)}
        onOpenPartyModal={() => navigate('/user')}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={calculateTotal()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
