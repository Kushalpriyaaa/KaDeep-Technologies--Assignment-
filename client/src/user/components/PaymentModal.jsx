import { useState } from 'react';
import '../styles/PaymentModal.css';

export default function PaymentModal({ isOpen, onClose, totalAmount, onPaymentSuccess }) {
  const [selectedPayment, setSelectedPayment] = useState('googlepay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onPaymentSuccess();
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  const paymentMethods = [
    { id: 'googlepay', name: 'Google Pay', icon: '💳' },
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'paytm', name: 'Paytm', icon: '💰' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' }
  ];

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Complete Payment</h2>
          <button className="payment-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="payment-modal-body">
          <div className="payment-method-section">
            <label className="payment-label">PAY USING</label>
            <div className="payment-dropdown">
              <select 
                value={selectedPayment} 
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="payment-select"
              >
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.icon} {method.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="payment-amount-section">
            <div className="amount-details">
              <span>Total Amount</span>
              <span className="amount-value">₹{totalAmount}</span>
            </div>
          </div>

          <button 
            className="pay-btn" 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
}
