import React from 'react'
import './CommonComingSoon.css'

// Fern SVG Component
const FernDecoration = () => (
  <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" className="fern-svg">
    <defs>
      <linearGradient id="fernGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#d4af37', stopOpacity: 0.9}} />
        <stop offset="100%" style={{stopColor: '#a8a8a8', stopOpacity: 0.6}} />
      </linearGradient>
    </defs>
    <path d="M 100 10 Q 90 40 85 70 Q 80 100 78 130 M 100 10 Q 110 40 115 70 Q 120 100 122 130" stroke="url(#fernGrad)" strokeWidth="2" fill="none" />
    <path d="M 85 50 Q 75 55 70 65" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 85 50 Q 95 55 100 65" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 90 80 Q 80 85 75 95" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 90 80 Q 100 85 105 95" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 115 50 Q 125 55 130 65" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 115 50 Q 105 55 100 65" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 110 80 Q 120 85 125 95" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 110 80 Q 100 85 95 95" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 78 150 L 70 170 M 78 150 L 85 170 M 122 150 L 130 170 M 122 150 L 115 170" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
  </svg>
)

// Lotus SVG Component
const LotusDecoration = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="lotus-svg">
    <defs>
      <radialGradient id="lotusGrad">
        <stop offset="0%" style={{stopColor: '#f0d9a0', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#d4af37', stopOpacity: 0.8}} />
      </radialGradient>
    </defs>
    {/* Petals */}
    <ellipse cx="100" cy="60" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.9" />
    <ellipse cx="145" cy="80" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.85" transform="rotate(72 100 100)" />
    <ellipse cx="145" cy="80" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.8" transform="rotate(144 100 100)" />
    <ellipse cx="145" cy="80" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.85" transform="rotate(216 100 100)" />
    <ellipse cx="145" cy="80" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.9" transform="rotate(288 100 100)" />
    {/* Center */}
    <circle cx="100" cy="100" r="20" fill="#d4af37" opacity="0.95" />
    <circle cx="100" cy="100" r="15" fill="#f0d9a0" opacity="0.8" />
  </svg>
)

export default function Acharyas() {

  return (
    <div className="acharyas-wrapper">
      {/* Background with watercolor effects */}
      <div className="acharyas-background">
        <div className="watercolor acharyas-watercolor-1"></div>
        <div className="watercolor acharyas-watercolor-2"></div>
        <div className="watercolor acharyas-watercolor-3"></div>
      </div>

      {/* Decorative Elements */}
      <div className="acharyas-decorations">
          <div className="fern-decoration acharyas-fern"><FernDecoration /></div>
          <div className="lotus-decoration acharyas-lotus"><LotusDecoration /></div>
      </div>

      {/* Main Content */}
      <div className="acharyas-container">
        {/* Featured Image */}
        <div className="acharyas-image-section">
          <img 
            src="/images/coming-soon-ayurveda.png"
            alt="Coming Soon Ancient Ayurveda & Nature"
            className="acharyas-image big-coming-soon"
            style={{width: '100%', maxWidth: '900px', borderRadius: '24px', boxShadow: '0 8px 48px rgba(0,0,0,0.25)', margin: '0 auto', display: 'block'}}
          />
        </div>

        {/* Gold Divider */}
        <div className="gold-divider"></div>

        {/* Content Section */}
        <div className="acharyas-content">
          <h1 className="acharyas-title">Our Acharyas</h1>
          <p className="acharyas-subtitle">Masters of Ancient Wisdom</p>
          
          <div className="acharyas-info">
            <p className="acharyas-description">
              Connect with world-renowned Ayurvedic practitioners and traditional healers. 
              Our network of certified Vaidyas bring decades of expertise, blending ancestral knowledge with evidence-based healing practices.
            </p>
          </div>

          {/* Features */}
          <div className="acharyas-features">
            <div className="feature-card acharyas-feature">
              <div className="feature-icon"></div>
              <h3>Expert Consultations</h3>
              <p>Direct access to certified Vaidyas and Ayurvedic specialists</p>
            </div>
            <div className="feature-card acharyas-feature">
              <div className="feature-icon"></div>
              <h3>Knowledge Sharing</h3>
              <p>Live sessions, Q&A forums, and traditional wisdom classes</p>
            </div>
            <div className="feature-card acharyas-feature">
              <div className="feature-icon"></div>
              <h3>Global Network</h3>
              <p>Connect with traditional healers from around the world</p>
            </div>
          </div>

          <div className="coming-year">2026</div>
          
          <button className="acharyas-cta-button">
            Reserve Your Slot
          </button>
        </div>

        {/* Bottom Divider */}
        <div className="gold-divider"></div>
      </div>
    </div>
  )
}
