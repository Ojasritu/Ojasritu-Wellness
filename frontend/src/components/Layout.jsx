import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Footer from "./Footer";
import "./Navbar.css";

export default function Layout({ children }) {
  const { user, loading, logout } = useAuth();
  const { totalCount } = useCart();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="site-navbar">
        <div className="site-nav-left">
          <Link to="/" className="site-logo" onClick={closeMobileMenu}>Ojasritu Wellness</Link>
          <button 
            className="hamburger-menu" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`site-nav-right ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/products" onClick={closeMobileMenu}>Products</Link>
          <Link to="/about" onClick={closeMobileMenu}>About</Link>
          <Link to="/blog" onClick={closeMobileMenu}>Blog</Link>
          <Link to="/wellness" onClick={closeMobileMenu}>Wellness</Link>
          <Link to="/ojas-gurukul" onClick={closeMobileMenu}>Ojas Gurukul</Link>
          <Link to="/acharyas" onClick={closeMobileMenu}>Acharyas</Link>
          <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
          
          <Link to="/cart" className="site-cart-link" onClick={closeMobileMenu} aria-label="Cart">
            🛒 Cart
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="profile-btn" onClick={closeMobileMenu}>{user.first_name || 'Profile'}</Link>
              <button className="logout-btn" onClick={() => { handleLogout(); closeMobileMenu(); }} disabled={loggingOut} aria-label="Logout">
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn" onClick={closeMobileMenu}>Login</Link>
          )}
        </div>
      </nav>

      <main>{children}</main>
      
      <Footer />
    </>
  );
}
