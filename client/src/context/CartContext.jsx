import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // Initialize cart items from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(0, newQuantity) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' ? 
        parseInt(item.price.replace('₹', '')) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
