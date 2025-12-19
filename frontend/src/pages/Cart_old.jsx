import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, totalPrice, loading, error } = useCart();
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRemove = async (cartItemId) => {
    const res = await removeItem(cartItemId);
    if (!res?.ok) {
      showNotification(res?.error || 'Failed to remove item');
      return;
    }
    showNotification('Item removed from cart');
  };

  const goToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container cart-page">
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}

      <h1>Your Cart</h1>

      {loading && <div className="muted">Loading cart...</div>}
      {error && <div className="muted">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => {
              const price = parseFloat(item.discount_price || item.price || 0);
              const quantity = item.quantity || 1;
              const itemTotal = price * quantity;
              const imageUrl = item.image
                ? (item.image.startsWith('http')
                    ? item.image
                    : `${window.location.origin}${item.image}`)
                : null;

              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.name} loading="lazy" onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x300?text=Product";
                      }} />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </div>
                  
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    {item.category_name && (
                      <span className="cart-item-category">{item.category_name}</span>
                    )}
                  </div>

                  <div className="cart-item-quantity">
                    <span>Qty: {quantity}</span>
                  </div>

                  <div className="cart-item-price">
                    <span className="price">₹{price.toLocaleString('en-IN')}</span>
                    <span className="total">Total: ₹{itemTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <button 
                    className="cart-item-remove"
                    onClick={() => handleRemove(item.id)}
                    title="Remove from cart"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <div className="prebooking-notice">
              <p>🚀 Pre-booking available from <strong>21st December 2025</strong></p>
              <p>Payment will be enabled on launch date</p>
            </div>

            <button 
              className="btn-checkout"
              onClick={goToCheckout}
            >
              Proceed to Checkout
            </button>

            <Link to="/products" className="btn-continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
