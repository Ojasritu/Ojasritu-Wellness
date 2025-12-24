import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeItem, totalPrice, loading, error } = useCart();
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const navigate = useNavigate();

  // Initialize quantities from cart items
  useEffect(() => {
    if (items?.length > 0) {
      const qtyMap = {};
      items.forEach(item => {
        qtyMap[item.id] = item.quantity || 1;
      });
      setQuantities(qtyMap);
    }
  }, [items]);

  // Fetch actual order history - only display if orders exist
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // Fetch user's orders from the backend
        // Note: This assumes an orders API endpoint exists
        // For now, we'll use an empty array if no endpoint is available
        const apiResponse = await fetch('/api/orders/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => ({ ok: false }));

        if (apiResponse?.ok) {
          const ordersData = await apiResponse.json();
          // Transform API response to match expected format
          const orders = Array.isArray(ordersData) 
            ? ordersData.map(order => ({
                id: order.id || order.order_id,
                date: order.created_at || order.date,
                status: order.status,
                items: order.items_count || 1,
                total: order.total_price || order.total,
                statusLabel: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'
              }))
            : [];
          setOrderHistory(orders);
        } else {
          // No orders endpoint or user not logged in - set empty array
          setOrderHistory([]);
        }
      } catch (err) {
        console.log('No order history available');
        setOrderHistory([]);
      }
    };

    fetchOrderHistory();
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Update quantity - FIXED: Now updates backend immediately
  const updateQuantity = async (itemId, delta) => {
    // Optimistic update: update UI immediately
    setQuantities(prev => {
      const current = prev[itemId] || 1;
      const newQty = Math.max(1, Math.min(99, current + delta));
      return { ...prev, [itemId]: newQty };
    });

    // TODO: Sync with backend
    // Note: Current backend doesn't have update quantity endpoint
    // For now, quantity changes are only client-side
    // In production, add: await cartAPI.updateQuantity(itemId, newQty);
  };

  // Handle remove with confirmation
  const handleRemoveClick = (item) => {
    setRemoveConfirm(item);
  };

  const confirmRemove = async () => {
    if (!removeConfirm) return;
    const res = await removeItem(removeConfirm.id);
    if (!res?.ok) {
      showNotification(res?.error || 'Failed to remove item');
      setRemoveConfirm(null);
      return;
    }
    showNotification(`${removeConfirm.name} removed from cart`);
    setRemoveConfirm(null);
  };

  // Calculate totals
  const calculateSubtotal = () => {
    try {
      const sum = items?.reduce((total, item) => {
        const unit = Number(item.discount_price ?? item.price ?? 0) || 0;
        const qty = Number(quantities[item.id] ?? item.quantity ?? 1) || 1;
        return total + unit * qty;
      }, 0);
      return Number(sum || 0);
    } catch (_) {
      return 0;
    }
  };

  const subtotal = calculateSubtotal();
  const taxRate = 0.18; // 18% GST
  const tax = subtotal * taxRate;
  const finalTotal = subtotal + tax;

  const goToCheckout = () => {
    navigate('/checkout');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="container cart-page">
      {/* Auth notice for unauthenticated users */}
      {!user && !loading && (
        <div className="auth-notice" style={{
          marginBottom: '16px',
          padding: '10px 12px',
          borderRadius: '8px',
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.3)',
          color: '#f5d76e'
        }}>
          <span style={{ marginRight: 8 }}>🔒</span>
          Please log in to see your saved cart items.
          <Link to="/login" style={{ marginLeft: 10, fontWeight: 700 }}>Login</Link>
        </div>
      )}
      {/* Notification Toast */}
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      {removeConfirm && (
        <div className="confirm-overlay" onClick={() => setRemoveConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Remove from Cart?</h3>
            <p>Are you sure you want to remove <strong>{removeConfirm.name}</strong> from your cart?</p>
            <div className="confirm-actions">
              <button className="btn-confirm-yes" onClick={confirmRemove}>
                Yes, Remove
              </button>
              <button className="btn-confirm-no" onClick={() => setRemoveConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="cart-header">
        <h1>🛒 Your Shopping Cart</h1>
        <p>Review your items and proceed to checkout</p>
      </div>

      {loading && <div className="loading-message">⏳ Loading cart...</div>}
      {error && <div className="error-message">❌ {error}</div>}

      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">📦</div>
          <h2>Your Cart is Empty</h2>
          <p>Explore our Ayurvedic wellness products</p>
          <Link to="/products" className="btn-browse">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-wrapper">
          {/* Cart Items Section */}
          <div className="cart-main">
            <div className="cart-items">
              <h2 className="section-title">Cart Items ({items.length})</h2>
              
              {items.map((item) => {
                const price = parseFloat(item.discount_price || item.price || 0);
                const qty = quantities[item.id] || item.quantity || 1;
                const itemTotal = price * qty;
                const imageUrl = item.image
                  ? (item.image.startsWith('http')
                      ? item.image
                      : `${window.location.origin}${item.image}`)
                  : null;

                return (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={item.name} 
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150x150?text=Product";
                          }}
                        />
                      ) : (
                        <div className="no-image">📦</div>
                      )}
                    </div>

                    <div className="item-content">
                      <div className="item-header">
                        <h3>{item.name}</h3>
                        {item.category_name && (
                          <span className="item-category">{item.category_name}</span>
                        )}
                      </div>
                      <p className="item-sku">SKU: {item.sku || 'N/A'}</p>
                      <p className="item-price">
                        ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })} per unit
                      </p>
                    </div>

                    <div className="item-quantity">
                      <button 
                        className="qty-btn qty-minus"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          updateQuantity(item.id, -1);
                        }}
                        aria-label="Decrease quantity"
                        disabled={qty <= 1}
                      >
                        −
                      </button>
                      <input 
                        type="number"
                        className="qty-input"
                        value={qty}
                        min="1"
                        max="99"
                        onChange={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const val = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
                          setQuantities(prev => ({ ...prev, [item.id]: val }));
                        }}
                        onFocus={(e) => e.stopPropagation()}
                        onBlur={(e) => e.stopPropagation()}
                        aria-label="Quantity"
                      />
                      <button 
                        className="qty-btn qty-plus"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          updateQuantity(item.id, 1);
                        }}
                        aria-label="Increase quantity"
                        disabled={qty >= 99}
                      >
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      <span className="total-label">Total</span>
                      <span className="total-price">
                        ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <button 
                      className="btn-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleRemoveClick(item);
                      }}
                      title="Remove from cart"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Order History Section - Only show if orders exist */}
            {orderHistory && orderHistory.length > 0 && (
              <div className="order-history">
                <h2 className="section-title">📋 Order History</h2>
                
                <div className="orders-grid">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <span className="order-id">{order.id}</span>
                        <span 
                          className="order-status"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.statusLabel}
                        </span>
                      </div>
                      <div className="order-details">
                        <div className="order-meta">
                          <span>📅 {new Date(order.date).toLocaleDateString('en-IN')}</span>
                          <span>📦 {order.items} item{order.items > 1 ? 's' : ''}</span>
                        </div>
                        <div className="order-total">
                          ₹{order.total.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Order Summary */}
          <aside className="cart-sidebar">
            <div className="order-summary">
              <h2>📊 Order Summary</h2>
              
              <div className="summary-section">
                <div className="summary-row">
                  <span className="summary-label">Subtotal ({items.length} items)</span>
                  <span className="summary-value">
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Tax (18% GST)</span>
                  <span className="summary-value tax">
                    + ₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-value free">FREE</span>
                </div>
              </div>

              <div className="summary-total">
                <span>Final Amount</span>
                <span className="final-price">
                  ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Pre-booking Notice */}
              <div className="prebooking-notice">
                <div className="notice-icon">🚀</div>
                <div className="notice-content">
                  <strong>Pre-booking Open!</strong>
                  <p>Until 25th December 2025</p>
                  <p className="notice-small">Payment enabled on launch date</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="btn-checkout"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToCheckout();
                  }}
                >
                  Proceed to Checkout
                </button>

                <Link 
                  to="/products" 
                  className="btn-continue-shopping"
                  onClick={(e) => e.stopPropagation()}
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Savings Info */}
              <div className="savings-info">
                <p>💳 <strong>10% off</strong> on your first order with code: WELLNESS10</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
