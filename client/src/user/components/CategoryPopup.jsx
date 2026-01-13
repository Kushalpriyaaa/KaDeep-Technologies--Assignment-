import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex-api/api';
import '../styles/CategoryPopup.css';

export default function CategoryPopup({ isOpen, onClose, onOpenPartyModal }) {
    const navigate = useNavigate();
    const categories = useQuery(api.modules.menu.menu.getAllCategories);

    // Prevent background scrolling when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCategoryClick = (categoryName) => {
        navigate('/user/menu', { state: { category: categoryName } });
        onClose();
    };

    return (
        <div className="category-popup-overlay" onClick={onClose}>
            <div className="category-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <div className="popup-title">
                        <h3>Menu</h3>
                    </div>
                </div>

                <div className="category-list">
                    {/* Book Table / Party Option */}
                    <button
                        className="category-item highlight-item"
                        onClick={() => {
                            onOpenPartyModal();
                            onClose();
                        }}
                        style={{ fontWeight: 'bold' }}
                    >
                        <span className="category-name">🎉 Book your Table / Party</span>
                        <span className="arrow-right">→</span>
                    </button>

                    {/* Dynamic Categories */}
                    {categories ? (
                        categories.map((cat) => (
                            <button
                                key={cat._id}
                                className="category-item"
                                onClick={() => handleCategoryClick(cat.name)}
                            >
                                <span className="category-name">{cat.name}</span>
                                <span className="category-count">{cat.itemCount || 0}</span>
                            </button>
                        ))
                    ) : (
                        <div style={{ padding: '10px', color: '#888' }}>Loading categories...</div>
                    )}

                    {/* Special Static Item from Mockup */}

                </div>

                <div className="popup-footer">
                    <button className="close-btn" onClick={onClose}>
                        <span>×</span> Close
                    </button>
                </div>
            </div>
        </div>
    );
}
