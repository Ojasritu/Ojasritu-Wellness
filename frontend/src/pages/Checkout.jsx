import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { useCart } from "../context/CartContext";
import { prebookAPI } from "../services/apiService";

export default function Checkout() {
  const { items, totalPrice, refresh } = useCart();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const placePrebooking = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await prebookAPI.createFromCart();
      setPaymentStatus("success");
      setReceipt(res?.order_id || res?.receipt || "PRE-BOOKED");
      await refresh();
    } catch (e) {
      if (e?.status === 401) {
        navigate('/login');
        return;
      }
      setError(e?.data?.error || e?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  const enrichedItems = useMemo(() => items || [], [items]);

  if (enrichedItems.length === 0 && !paymentStatus) {
    return (
      <div className="container checkout-page">
        <h1>Checkout</h1>
        <div className="empty-checkout">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>

      {error && <div className="alert error" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="checkout-content">
        <div className="checkout-main">
          <div className="checkout-section">
            <h2>Order Summary</h2>
            <div className="order-items">
              {paymentStatus === "success" ? (
                <div className="payment-success">
                  <h3>🎉 Payment Successful</h3>
                  <p>Receipt: <strong>{receipt}</strong></p>
                  <p>Your pre-booking is confirmed. We will notify you before launch.</p>
                </div>
              ) : (
                enrichedItems.map((item) => {
                  const price = parseFloat(item.discount_price || item.price || 0);
                  const quantity = item.quantity || 1;
                  const itemTotal = price * quantity;
                  const imageUrl = item.image
                    ? (item.image.startsWith('http')
                        ? item.image
                        : `${window.location.origin}${item.image}`)
                    : null;

                  return (
                    <div key={item.id} className="order-item">
                      <div className="order-item-image">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.name} loading="lazy" onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/300x300?text=Product";
                          }} />
                        ) : (
                          <div className="no-image">📦</div>
                        )}
                      </div>
                      <div className="order-item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {quantity}</p>
                      </div>
                      <div className="order-item-price">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="checkout-section prebooking-info">
            <h2>🚀 Pre-booking Information</h2>
            <div className="info-box">
              <p><strong>Launch Date:</strong> 21st December 2025</p>
              <p><strong>Payment:</strong> Simulation only (no real charges)</p>
              <p><strong>Status:</strong> Pre-booking phase</p>
            </div>
            <div className="info-notice">
              <p>Your order details are saved locally. On launch day, complete payment to finalize.</p>
              <p>We'll notify you once payments are live!</p>
            </div>
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="price-summary">
            <h3>Price Details</h3>
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="price-row">
              <span>Delivery Charges</span>
              <span className="free">FREE</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {paymentStatus === "success" ? (
            <button className="btn-place-order disabled" disabled>
              Payment Completed
            </button>
          ) : (
            <button 
              className="btn-place-order"
              onClick={placePrebooking}
              disabled={submitting}
            >
              {submitting ? 'Placing order...' : 'Confirm Pre-booking'}
            </button>
          )}

          <div className="secure-payment">
            <p>🔒 100% Secure (placeholder)</p>
            <p>💳 Payment opens on launch day</p>
            <p>📦 Free Delivery Across India</p>
          </div>
        </div>
      </div>
    </div>
  );
}
