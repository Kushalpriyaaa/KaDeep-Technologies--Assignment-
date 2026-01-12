import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import '../styles/Offers.css';

export default function Offers() {
  const offers = [
    {
      id: 1,
      title: '50% OFF on First Order',
      description: 'Get 50% discount on your first order. Maximum discount up to ₹100',
      code: 'FIRST50',
      validity: 'Valid till Jan 31, 2026',
      image: '🎉'
    },
    {
      id: 2,
      title: 'Free Delivery',
      description: 'Free delivery on orders above ₹299',
      code: 'FREEDEL',
      validity: 'Valid till Jan 15, 2026',
      image: '🚚'
    },
    {
      id: 3,
      title: 'Buy 1 Get 1 Free',
      description: 'Buy one pizza and get another one absolutely free',
      code: 'BOGO',
      validity: 'Valid on weekends',
      image: '🍕'
    },
    {
      id: 4,
      title: 'Flat ₹150 OFF',
      description: 'Get flat ₹150 off on orders above ₹500',
      code: 'FLAT150',
      validity: 'Valid till Feb 28, 2026',
      image: '💰'
    },
    {
      id: 5,
      title: 'Student Special',
      description: '30% OFF for students. Show your valid student ID',
      code: 'STUDENT30',
      validity: 'Valid always',
      image: '🎓'
    },
    {
      id: 6,
      title: 'Happy Hours',
      description: '25% OFF on all orders between 2 PM to 5 PM',
      code: 'HAPPY25',
      validity: 'Valid Mon-Fri',
      image: '⏰'
    }
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code ${code} copied to clipboard!`);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>🎁 Special Offers</h1>
            <p className="page-header-subtitle">
              Save more with our exclusive deals and discounts
            </p>
          </div>
        </div>

        <div className="offers-grid">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div className="offer-icon">{offer.image}</div>
              <div className="offer-content">
                <h3>{offer.title}</h3>
                <p className="offer-description">{offer.description}</p>
                <div className="offer-code-section">
                  <div className="offer-code">
                    <span className="code-label">Code:</span>
                    <span className="code-value">{offer.code}</span>
                  </div>
                  <button 
                    className="copy-code-btn"
                    onClick={() => handleCopyCode(offer.code)}
                  >
                    Copy
                  </button>
                </div>
                <p className="offer-validity">{offer.validity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="offers-footer">
          <p>💡 <strong>Pro Tip:</strong> Apply offer codes at checkout to get instant discounts!</p>
        </div>
      </div>
    </>
  );
}
