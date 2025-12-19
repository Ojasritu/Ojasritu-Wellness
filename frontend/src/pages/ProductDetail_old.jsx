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
      <div className="container product-detail">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container product-detail">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container product-detail">
        <p>Product not found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
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

  const handleBuyNow = async () => {
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
    navigate('/checkout');
  };

  return (
    <div className="container product-detail">
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Back
      </button>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <div>
          <img
            src={product.image || PLACEHOLDER_IMAGE}
            alt={product.name || "Product"}
            loading="lazy"
            style={{ width: "100%", maxWidth: 520, borderRadius: 8 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        <div>
          <h2>{product.name || "Unnamed Product"}</h2>
          {product.category_name && <p>{product.category_name}</p>}

          <p className="price">
            ₹{displayPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            {discountPrice > 0 && discountPrice < originalPrice && (
              <span style={{ marginLeft: 10, textDecoration: "line-through", opacity: 0.7 }}>
                ₹{originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            )}
          </p>

          {product.description && <p>{product.description}</p>}

          {!isActive && (
            <p style={{ color: "#b91c1c" }}>
              This product is not available.
            </p>
          )}

          <div className="actions" style={{ marginTop: 12 }}>
            <button disabled={!isActive} onClick={handleBuyNow}>
              Buy Now
            </button>
            <button disabled={!isActive} onClick={handleAddToCart}>
              Add to cart
            </button>
          </div>

          {/* Benefits */}
          {product.benefits && (
            <section style={{ marginTop: 24 }}>
              <h3>Benefits</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {product.benefits}
              </p>
            </section>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <section style={{ marginTop: 24 }}>
              <h3>Ingredients</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {product.ingredients}
              </p>
            </section>
          )}

          {/* Usage Instructions */}
          {product.usage_instructions && (
            <section style={{ marginTop: 24 }}>
              <h3>Usage Instructions</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {product.usage_instructions}
              </p>
            </section>
          )}

          {/* Scientific Research */}
          {product.scientific_research && (
            <section style={{ marginTop: 24 }}>
              <h3>Scientific Research</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {product.scientific_research}
              </p>
            </section>
          )}

          {/* Gallery Images */}
          {product.gallery && product.gallery.length > 0 && (
            <section style={{ marginTop: 24 }}>
              <h3>Gallery</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                {product.gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    loading="lazy"
                    style={{ width: '100%', borderRadius: 8, objectFit: 'cover', aspectRatio: '1' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <section style={{ marginTop: 24 }}>
              <h3>Customer Reviews</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {product.reviews.map((review) => (
                  <div key={review.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <strong>{review.customer_name}</strong>
                      <span style={{ color: '#f59e0b' }}>{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{review.title}</p>
                    <p>{review.comment}</p>
                    {review.verified_purchase && (
                      <p style={{ fontSize: '0.85rem', color: '#10b981' }}>✓ Verified Purchase</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
