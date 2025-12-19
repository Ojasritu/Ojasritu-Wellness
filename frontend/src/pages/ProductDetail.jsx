import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsAPI } from "../services/apiService";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/600x600?text=Product";
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsAPI.getBySlug(slug);
        if (!isMounted) return;
        setProduct(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Unable to load product.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (slug) fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div style={{ fontSize: '18px', color: '#667eea', fontWeight: '600' }}>Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '18px', color: '#b91c1c', marginBottom: '24px' }}>{error || "Product not found."}</p>
          <button onClick={() => navigate("/products")} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; }}>Back to Products</button>
        </div>
      </div>
    );
  }

  const isActive = product.status === "active";
  const originalPrice = parseFloat(product.price || 0);
  const discountPrice = parseFloat(product.discount_price || 0);
  const displayPrice = discountPrice > 0 ? discountPrice : originalPrice;

  const handleAddToCart = async () => {
    if (!product?.id) {
      setError('Product not found');
      return;
    }
    const res = await addItem(product, 1);
    if (!res?.ok && res?.status === 401) {
      navigate('/login');
      return;
    }
    if (!res?.ok) {
      setError(res?.error || 'Failed to add to cart');
      return;
    }
    setError(null);
    navigate('/cart');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Professional Header with Back Button */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.3)'; }} onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; }}>
            ← Back to Products
          </button>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{product.name || "Product Details"}</h2>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: '40px', alignItems: 'start' }}>
          {/* Image Section */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
            <img
              src={product.image || PLACEHOLDER_IMAGE}
              alt={product.name || "Product"}
              loading="lazy"
              style={{ width: "100%", borderRadius: '8px', marginBottom: '16px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
            {product.gallery && product.gallery.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {product.gallery.slice(0, 4).map((img, idx) => (
                  <img key={idx} src={img} alt={`Gallery ${idx}`} loading="lazy" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }} onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
            {/* Category & Rating */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              {product.category_name && (
                <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {product.category_name}
                </span>
              )}
              {product.rating > 0 && (
                <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '600' }}>⭐ {product.rating.toFixed(1)} / 5.0</span>
              )}
            </div>

            {/* Name */}
            <h1 style={{ margin: '0 0 20px 0', fontSize: '32px', fontWeight: '800', color: '#1a202c', lineHeight: '1.3' }}>{product.name || "Unnamed Product"}</h1>

            {/* Price */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '40px', fontWeight: '800', color: '#667eea' }}>₹{displayPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                {discountPrice > 0 && discountPrice < originalPrice && (
                  <>
                    <span style={{ fontSize: '18px', color: '#a0aec0', textDecoration: 'line-through' }}>₹{originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    <span style={{ background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '700' }}>-{Math.round(((originalPrice - discountPrice) / originalPrice) * 100)}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div style={{ marginBottom: '24px', lineHeight: '1.7', color: '#4a5568', fontSize: '15px' }}>
                {product.description}
              </div>
            )}

            {/* Availability */}
            <div style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '8px', background: isActive ? '#ecfdf5' : '#fee2e2' }}>
              <p style={{ margin: 0, color: isActive ? '#065f46' : '#b91c1c', fontWeight: '600' }}>
                {isActive ? '✓ In Stock' : '✕ Out of Stock'}
              </p>
            </div>

            {/* Action Button - SINGLE PROMINENT BUTTON */}
            <button
              disabled={!isActive}
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                borderRadius: '8px',
                cursor: isActive ? 'pointer' : 'not-allowed',
                background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#cbd5e0',
                color: 'white',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 6px 20px rgba(102, 126, 234, 0.35)' : 'none',
                opacity: isActive ? 1 : 0.6
              }}
              onMouseOver={(e) => {
                if (isActive) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.45)';
                }
              }}
              onMouseOut={(e) => {
                if (isActive) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.35)';
                }
              }}
            >
              {isActive ? 'Add to Cart' : 'Unavailable'}
            </button>
          </div>
        </div>

        {/* Additional Information Sections */}
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {product.benefits && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>✨ Key Benefits</h3>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#4a5568', fontSize: '14px' }}>
                {product.benefits}
              </p>
            </div>
          )}

          {product.ingredients && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>🌿 Ingredients</h3>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#4a5568', fontSize: '14px' }}>
                {product.ingredients}
              </p>
            </div>
          )}

          {product.usage_instructions && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>📖 How to Use</h3>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#4a5568', fontSize: '14px' }}>
                {product.usage_instructions}
              </p>
            </div>
          )}

          {product.scientific_research && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>🔬 Scientific Research</h3>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#4a5568', fontSize: '14px' }}>
                {product.scientific_research}
              </p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div style={{ marginTop: '40px', background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>💬 Customer Reviews</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {product.reviews.map((review) => (
                <div key={review.id} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <strong style={{ color: '#1a202c' }}>{review.customer_name}</strong>
                    <span style={{ color: '#f59e0b', fontWeight: '600' }}>{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p style={{ fontWeight: '600', marginBottom: '4px', color: '#1a202c' }}>{review.title}</p>
                  <p style={{ margin: '0 0 8px 0', color: '#4a5568' }}>{review.comment}</p>
                  {review.verified_purchase && (
                    <p style={{ fontSize: '0.85rem', color: '#10b981', margin: 0 }}>✓ Verified Purchase</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
