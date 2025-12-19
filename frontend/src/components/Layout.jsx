import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Layout({ children }) {
  const { user, loading, logout } = useAuth();
  const { totalCount } = useCart();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">Ojasritu Wellness</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/wellness">Wellness</Link>
          <Link to="/ojas-gurukul">Ojas Gurukul</Link>
          <Link to="/acharyas">Acharyas</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="nav-right">
          <Link to="/cart" className="cart-link" aria-label="Cart">
            🛒 Cart
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="profile-btn">{user.first_name || 'Profile'}</Link>
              <button className="logout-btn" onClick={handleLogout} disabled={loggingOut} aria-label="Logout">
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </nav>

      <main>{children}</main>
    </>
  );
}
