import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    // TODO: Implement cart functionality
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="product-image-wrapper">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.image || 'https://via.placeholder.com/300x300?text=Product'}
            alt={product.name}
            className="product-image"
          />
        </Link>

        {/* Badges */}
        <div className="product-badges">
          {product.is_bestseller && (
            <span className="badge bestseller">🏆 Bestseller</span>
          )}
          {discountPercentage > 0 && (
            <span className="badge discount">-{discountPercentage}%</span>
          )}
          {product.status === 'new' && (
            <span className="badge new">🆕 New</span>
          )}
        </div>

        {/* Dosha Tags */}
        {product.dosha_type && (
          <div className="dosha-tags">
            {(Array.isArray(product.dosha_type) 
              ? product.dosha_type 
              : product.dosha_type.split(',')).map((dosha) => (
              <span key={dosha.trim()} className={`dosha-tag ${dosha.trim().toLowerCase()}`}>
                {dosha.trim().toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Overlay on Hover */}
        {isHovered && (
          <div className="product-overlay">
            <Link
              to={`/products/${product.slug}`}
              className="view-details-btn"
            >
              View Details
            </Link>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Hindi Name */}
        {product.hindi_name && (
          <h4 className="product-hindi-name">{product.hindi_name}</h4>
        )}

        {/* English Name */}
        <h3 className="product-name">{product.name}</h3>

        {/* Rating */}
        {product.average_rating && (
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < Math.round(product.average_rating) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-value">
              {product.average_rating.toFixed(1)} ({product.review_count || 0})
            </span>
          </div>
        )}

        {/* Description */}
        <p className="product-description">
          {product.description?.substring(0, 60)}...
        </p>

        {/* Pricing */}
        <div className="product-pricing">
          <div className="price">
            <span className="current-price">₹{product.price?.toLocaleString()}</span>
            {product.original_price && (
              <span className="original-price">₹{product.original_price?.toLocaleString()}</span>
            )}
          </div>
          {product.bulk_discount && (
            <div className="bulk-discount">
              <small>Bulk discount available</small>
            </div>
          )}
        </div>

        {/* Category & Stock */}
        <div className="product-meta">
          {product.category && (
            <span className="category-tag">{product.category.name}</span>
          )}
          {product.stock_quantity && (
            <span className={`stock-badge ${product.stock_quantity > 5 ? 'in-stock' : 'low-stock'}`}>
              {product.stock_quantity > 5 ? `${product.stock_quantity} in stock` : 'Low stock'}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className={`add-to-cart-btn ${isAddedToCart ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={product.status === 'out_of_stock'}
        >
          {isAddedToCart ? '✓ Added' : '🛒 Add to Cart'}
        </button>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action wishlist-btn" title="Add to Wishlist">
            ❤️
          </button>
          <button className="quick-action share-btn" title="Share">
            📤
          </button>
          <button className="quick-action compare-btn" title="Compare">
            ⚖️
          </button>
        </div>
      </div>

      {/* Hover Animation */}
      {isHovered && <div className="card-shine"></div>}
    </div>
  );
};

export default ProductCard;
