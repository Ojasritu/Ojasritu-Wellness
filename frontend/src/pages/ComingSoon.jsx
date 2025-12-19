import React, { useState } from 'react'
import './ComingSoon.css'

const ComingSoon = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <div className="coming-soon-page">
      {/* Premium Background with Gold Pattern */}
      <div className="coming-soon-bg-wrapper">
        {/* Watercolor Effects */}
        <div className="watercolor-effect watercolor-1"></div>
        <div className="watercolor-effect watercolor-2"></div>
        <div className="watercolor-effect watercolor-3"></div>

        {/* Main Content Container */}
        <div className="coming-soon-container">
          {/* Left Decorative - Fern */}
          <div className="decoration-element decoration-left">
            <svg viewBox="0 0 100 150" className="fern-icon">
              <path d="M50,10 Q45,30 50,50 Q45,70 50,90 Q45,110 50,140" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.6"/>
              <path d="M40,30 Q30,35 25,45 M60,30 Q70,35 75,45 M40,50 Q30,55 25,65 M60,50 Q70,55 75,65 M40,70 Q30,75 25,85 M60,70 Q70,75 75,85" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.5"/>
            </svg>
            <div className="leaf-accent leaf-1"></div>
            <div className="leaf-accent leaf-2"></div>
          </div>

          {/* Right Decorative - Botanical */}
          <div className="decoration-element decoration-right">
            <div className="lotus-decoration">
              <div className="lotus-petal p1"></div>
              <div className="lotus-petal p2"></div>
              <div className="lotus-petal p3"></div>
              <div className="lotus-petal p4"></div>
              <div className="lotus-petal p5"></div>
              <div className="lotus-center"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="coming-soon-content">
            {/* Gold Line Top */}
            <div className="gold-divider top"></div>

            {/* Main Title */}
            <div className="title-section">
              <h1 className="coming-soon-main-title">Coming Soon</h1>
              <p className="coming-soon-subtitle">Ancient Ayurveda & Nature</p>
            </div>

            {/* Launch Date */}
            <div className="launch-info">
              <span className="launch-label">Launching</span>
              <span className="launch-year">2026</span>
            </div>

            {/* Description */}
            <p className="coming-soon-description">
              We are crafting something extraordinary for you. 
              Our new collection brings together the ancient wisdom of Ayurveda 
              with modern wellness solutions to transform your life.
            </p>

            {/* Subscribe Section */}
            <div className="subscribe-section">
              <h3 className="subscribe-title">Be the First to Know</h3>
              <form className="subscribe-form" onSubmit={handleSubmit}>
                <div className="email-input-wrapper">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="subscribe-input"
                  />
                  <button type="submit" className="subscribe-btn">
                    {subscribed ? '✓ Subscribed' : 'Notify Me'}
                  </button>
                </div>
                {subscribed && (
                  <p className="subscribe-success">Thank you! We'll notify you soon.</p>
                )}
              </form>
            </div>

            {/* Features Preview */}
            <div className="features-preview">
              <div className="feature-item">
                <span className="feature-icon">🌿</span>
                <p>100% Organic</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🧘</span>
                <p>Authentic Ayurveda</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <p>Nature's Best</p>
              </div>
            </div>

            {/* Gold Line Bottom */}
            <div className="gold-divider bottom"></div>

            {/* Navigation */}
            <div className="coming-soon-navigation">
              <a href="/" className="btn-home">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
