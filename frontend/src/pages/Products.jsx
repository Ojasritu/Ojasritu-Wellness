import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Products.css";
import { useCart } from "../context/CartContext";
import { productsAPI, prebookAPI } from "../services/apiService";

const Products = () => {
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x400?text=Product";
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [prebookingModal, setPrebookingModal] = useState(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  // Fetch both products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products using API service
        const productData = await productsAPI.getAll();
        
        // Log response for debugging (log once)
        console.log("✅ Products API Response:", productData);

        // Ensure data is array and filter active products
        const activeProducts = Array.isArray(productData)
          ? productData.filter((p) => p.status === "active")
          : [];

        setAllProducts(activeProducts);

        // Extract unique category names from products
        const uniqueCats = [
          ...new Set(
            activeProducts
              .map((p) => p.category_name)
              .filter(Boolean)
          ),
        ].sort();
        
        console.log("✅ Categories extracted from products:", uniqueCats);
        setCategories(uniqueCats);
      } catch (err) {
        console.error("❌ Error fetching products:", err.message);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by category using category_name (backend-aware)
    if (selectedCategory !== "all") {
      products = products.filter((p) => {
        const categoryName = p.category_name
          ? p.category_name.toLowerCase()
          : "";
        const selected = selectedCategory.toLowerCase();
        return categoryName === selected;
      });
    }

    // Filter by search term
    if (searchTerm) {
      products = products.filter((p) =>
        (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by price
    if (sortBy === "price-low") {
      products.sort((a, b) => {
        const priceA = parseFloat(a.discount_price || a.price || 0);
        const priceB = parseFloat(b.discount_price || b.price || 0);
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      products.sort((a, b) => {
        const priceA = parseFloat(a.discount_price || a.price || 0);
        const priceB = parseFloat(b.discount_price || b.price || 0);
        return priceB - priceA;
      });
    }

    return products;
  }, [allProducts, selectedCategory, searchTerm, sortBy]);

  // ========== CART INTEGRATION (BACKEND CART) ==========
  const addToCart = async (product) => {
    try {
      let productToAdd = product;
      // If the product has no id (edge case), retrieve it by slug
      if (!productToAdd?.id && productToAdd?.slug) {
        try {
          const detail = await productsAPI.getBySlug(productToAdd.slug);
          if (detail?.id) {
            productToAdd = detail;
          }
        } catch (_) {
          // ignore; will fall back to error messaging below
        }
      }

      if (!productToAdd?.id) {
        showNotification("Product is unavailable. Please refresh and try again.");
        return;
      }

      const res = await addItem(productToAdd, 1);
      if (!res?.ok && res?.status === 401) {
        showNotification("Please login to add items to cart");
        navigate("/login");
        return;
      }
      if (!res?.ok && res?.status === 404) {
        showNotification("This product is not available to add right now.");
        return;
      }
      if (!res?.ok) {
        showNotification(res?.error || "Failed to add to cart");
        return;
      }
      showNotification(`${productToAdd.name} added to cart`);
      navigate("/cart");
    } catch (e) {
      showNotification("Failed to add to cart. Please try again.");
    }
  };

  // ========== PRE-BOOKING NOTIFICATION ==========
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  // ========== PAYMENT INTEGRATION (FUTURE-READY) ==========
  // This function prepares for Razorpay integration
  // Currently, it only shows a placeholder message
  const openPrebookingModal = (product) => {
    setPrebookingModal(product);
  };

  const closePrebookingModal = () => {
    setPrebookingModal(null);
  };

  const handlePrebookingConfirm = async () => {
    if (!prebookingModal) return;
    try {
      const res = await prebookAPI.create(prebookingModal.id, 1);
      showNotification(`Pre-booking confirmed: ${res?.order_id || prebookingModal.name}`);
      closePrebookingModal();
    } catch (e) {
      if (e?.status === 401) {
        showNotification("Please login to pre-book");
        closePrebookingModal();
        navigate("/login");
        return;
      }
      showNotification(e?.message || "Pre-booking failed");
    }
  };

  return (
    <div className="products-page">
      {/* PRE-BOOKING MODAL */}
      {prebookingModal && (
        <div className="modal-overlay" onClick={closePrebookingModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closePrebookingModal}>×</button>
            <h2>🚀 Pre-Book Now</h2>
            <div className="modal-product">
              <img
                src={prebookingModal.image || PLACEHOLDER_IMAGE}
                alt={prebookingModal.name || "Product"}
                className="product-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <h3>{prebookingModal.name}</h3>
              <p className="modal-price">
                ₹{parseFloat(prebookingModal.discount_price || prebookingModal.price).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="modal-info">
              <p className="modal-notice">
                <strong>Pre-booking Period:</strong> Now until 21st December 2025
              </p>
              <p className="modal-notice">
                <strong>Payment Opens:</strong> 21st December 2025
              </p>
              <p className="modal-notice">
                <strong>Delivery:</strong> Free shipping across India
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handlePrebookingConfirm}>
                Confirm Pre-Booking
              </button>
              <button className="btn-secondary" onClick={closePrebookingModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#10b981",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease",
          }}
        >
          {notification}
        </div>
      )}

      {/* HEADER */}
      <div className="products-header">
        <div className="container">
          <h1>Our Wellness Products</h1>
          <p>
            Handpicked Ayurvedic remedies for your complete wellness journey
          </p>
        </div>
      </div>

      <div className="container products-content">
        {/* SIDEBAR */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3>Search</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <h3>Category</h3>
            <div className="filter-options">
              <label>
                <input
                  type="radio"
                  checked={selectedCategory === "all"}
                  onChange={() => setSelectedCategory("all")}
                />
                All Products
              </label>

              {categories.map((catName) => (
                <label key={catName}>
                  <input
                    type="radio"
                    checked={selectedCategory === catName}
                    onChange={() => setSelectedCategory(catName)}
                  />
                  {catName}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="products-section">
          {loading && <p>Loading products...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <>
              <p className="products-info">{filteredProducts.length} products found</p>

              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>No products found. Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map((product) => {
                    const discountPrice = parseFloat(
                      product.discount_price || 0
                    );
                    const originalPrice = parseFloat(product.price || 0);
                    const displayPrice = discountPrice > 0 ? discountPrice : originalPrice;
                    const rating = product.rating || 0;
                    const imageUrl = product.image || PLACEHOLDER_IMAGE;

                    return (
                      <div key={product.id} className="product-card">
                        {/* Product Image (link to detail) */}
                        <Link 
                          to={product.slug ? `/products/${product.slug}` : "/products"} 
                          className="product-image" 
                          aria-label={product.name || "Product image"}
                        >
                          <img
                            src={imageUrl}
                            alt={product.name || "Product"}
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = PLACEHOLDER_IMAGE;
                            }}
                          />
                        </Link>

                        {/* Product Name (link to detail) */}
                        <h3>
                          <Link 
                            to={product.slug ? `/products/${product.slug}` : "/products"} 
                            aria-label={product.name || "Product details"}
                          >
                            {product.name || "Unnamed Product"}
                          </Link>
                        </h3>

                        {/* Product Rating */}
                        {rating > 0 && (
                          <div className="product-rating">
                            ⭐ {rating.toFixed(1)} / 5.0
                          </div>
                        )}

                        {/* Product Price and Category */}
                        <div className="product-meta">
                          {product.category_name && (
                            <span className="product-category">
                              {product.category_name}
                            </span>
                          )}
                        </div>

                        {/* Short description */}
                        {product.description && (
                          <p className="product-desc">
                            {String(product.description).length > 120
                              ? `${String(product.description).slice(0, 120)}…`
                              : String(product.description)}
                          </p>
                        )}

                        {/* Product Footer: Price & Buttons - VERTICAL LAYOUT */}
                        <div className="product-footer">
                          <div className="product-prices">
                            {discountPrice > 0 && discountPrice < originalPrice && (
                              <span className="original-price">
                                ₹{originalPrice.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            )}
                            <span className="product-price">
                              ₹{displayPrice.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>

                          {/* All buttons in single action container - vertical stack */}
                          <div className="product-actions">
                            {/* View Details Button */}
                            <Link 
                              to={product.slug ? `/products/${product.slug}` : "/products"}
                              className="btn-view-details"
                              title="View full product details"
                            >
                              👁️ View Details
                            </Link>

                            {/* Pre-Book Button */}
                            <button
                              className="btn-prebook"
                              onClick={() => openPrebookingModal(product)}
                              title="Pre-book this product"
                            >
                              🚀 Pre-Book
                            </button>

                            {/* Add to Cart Button */}
                            <button
                              className="btn-cart"
                              onClick={() => addToCart(product)}
                              title="Add to cart"
                            >
                              🛒 Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PREBOOKING BANNER */}
              <div className="prebooking-banner">
                <div className="prebooking-inner">
                  <span className="prebooking-icon">🚀</span>
                  <span>Pre-booking starts from <strong>21st December 2025</strong></span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
