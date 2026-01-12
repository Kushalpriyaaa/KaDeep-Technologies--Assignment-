import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConvexProvider } from './context/ConvexProvider';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './styles.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => console.log('Service Worker registered:', registration))
      .catch(error => console.log('Service Worker registration failed:', error));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConvexProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConvexProvider>
    </BrowserRouter>
  </React.StrictMode>
);
