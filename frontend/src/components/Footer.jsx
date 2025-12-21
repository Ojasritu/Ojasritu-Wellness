import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">Ojasritu Wellness</h3>
            <p className="footer-description">
              Bringing authentic Ayurvedic wellness to modern life through premium products and expert guidance.
            </p>
            <div className="footer-contact">
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+919685679251">+91 96856 79251</a>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@ojasritu.co.in">
                  support@ojasritu.co.in
                </a>
              </p>
              <p>
                <strong>Location:</strong> Bhilai, Chhattisgarh, India
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="footer-section">
            <h4 className="footer-section-title">Policies</h4>
            <ul className="footer-links">
              <li>
                <Link to="/shipping-policy">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/cancellation-refund-policy">Refund Policy</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Wellness & Resources */}
          <div className="footer-section">
            <h4 className="footer-section-title">Learn & Explore</h4>
            <ul className="footer-links">
              <li>
                <Link to="/wellness">Wellness Tips</Link>
              </li>
              <li>
                <Link to="/ojas-gurukul">Ojas Gurukul</Link>
              </li>
              <li>
                <Link to="/acharyas">Our Acharyas</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              &copy; {currentYear} Ojasritu Wellness. All rights reserved.
            </p>
            <p className="disclaimer">
              <strong>Disclaimer:</strong> Our products are not intended to diagnose, treat, cure, or prevent any disease. Please consult a healthcare professional before use.
            </p>
          </div>

          <div className="footer-badges">
            <span className="badge">Ayurveda Certified</span>
            <span className="badge">Handpicked Products</span>
            <span className="badge">Fast Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
