import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import RestaurantStatus from './user/components/RestaurantStatus';

// App Pages
import LandingPage from './app/pages/LandingPage';
import HomePage from './app/pages/HomePage';

// Auth Pages
import Login from './auth/Login';
import Signup from './auth/Signup';

// User Pages
import UserHome from './user/pages/Home';
import Cart from './user/pages/Cart';
import UserOrders from './user/pages/Orders';
import Profile from './user/pages/Profile';
import UserOffers from './user/pages/Offers';
import ServingHours from './user/pages/ServingHours';
import UserMenu from './user/pages/UserMenu';

// Admin Pages
import AdminDashboard from './admin/pages/Dashboard';
import Menu from './admin/pages/Menu';
import AdminOrders from './admin/pages/Orders';
import Offers from './admin/pages/Offers';
import Reports from './admin/pages/Reports';
import SpecialServingHours from './admin/pages/SpecialServingHours';
import AdminProfile from './admin/pages/Profile';

// Delivery Pages
import AssignedOrders from './delivery/pages/AssignedOrders';
import Pickup from './delivery/pages/Pickup';
import DeliveryConfirm from './delivery/pages/DeliveryConfirm';

function AppContent() {
  const location = useLocation();
  const isUserRoute = location.pathname.startsWith('/user');

  console.log('📍 Current route:', location.pathname, '| Is user route:', isUserRoute);

  return (
    <>
      {/* Restaurant Status Popup - Shows only on user pages */}
      {isUserRoute && <RestaurantStatus />}

      <Routes>
        {/* Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route path="/user" element={<UserHome />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/orders" element={<UserOrders />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/offers" element={<UserOffers />} />
        <Route path="/user/serving-hours" element={<ServingHours />} />
        <Route path="/user/menu" element={<UserMenu />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/menu" element={<Menu />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/offers" element={<Offers />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/special-serving-hours" element={<SpecialServingHours />} />

        {/* Delivery Routes */}
        <Route path="/delivery" element={<AssignedOrders />} />
        <Route path="/delivery/pickup" element={<Pickup />} />
        <Route path="/delivery/confirm" element={<DeliveryConfirm />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <div className="app">
        <AppContent />
      </div>
    </CartProvider>
  );
}

export default App;
