import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Lottie from 'lottie-react'
import animationData from '../assets/ayurveda-hero.json'
import Chatbot from '../components/Chatbot'
import { useTranslation } from 'react-i18next'
import './Home.css'

function Home() {
  const { t } = useTranslation()
  return (
    <div>
      <Hero />
      <section className="container intro">
        <h2>{t('welcome')}</h2>
        <p className="lead">Discover our premium wellness products, expert guidance and timeless Ayurvedic wisdom — rooted in classical Ayurveda and crafted for modern life.</p>
        <div className="intro-ctas">
          <Link to="/products" className="cta-btn primary">Explore Products</Link>
          <Link to="/contact" className="cta-btn secondary">Book a Consultation</Link>
        </div>
      </section>

      {/* Ancient Ayurveda animation section (replaces video gallery) */}
      <section className="ancient-section">
        <div className="container ancient-inner">
          <div className="ancient-text">
            <h3>प्राचीन आयुर्वेद - Ancient Wisdom</h3>
            <p>Experience ancient Ayurvedic principles brought to life with immersive animation and gentle visuals inspired by classical Sanskrit manuscripts.</p>
          </div>
          {/* Side box with Chanakya meditation image */}
          <div className="ancient-sidebox" aria-hidden="false">
            <img
              src="/images/chanakya-image.png"
              alt="Chanakya - Ancient Ayurveda Sage"
              className="chanakya-img"
              loading="lazy"
            />
            <p className="chanakya-caption">चाणक्य</p>
          </div>
          <div className="ancient-anim">
            <Lottie animationData={animationData} loop />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="featured-section" aria-labelledby="featured-heading">
        <div className="container">
          <h2 className="section-title">Featured Wellness Products</h2>
          <p className="section-subtitle">Handpicked Ayurvedic remedies for holistic health</p>
          <div className="featured-grid">
            <div className="featured-card">
              <div className="card-icon">🌿</div>
              <h3>Herbal Supplements</h3>
              <p>Pure, organic formulations from ancient recipes</p>
            </div>
            <div className="featured-card">
              <div className="card-icon">🧘</div>
              <h3>Wellness Oils</h3>
              <p>Therapeutic oils for balance and rejuvenation</p>
            </div>
            <div className="featured-card">
              <div className="card-icon">💆</div>
              <h3>Personal Care</h3>
              <p>Natural skincare and body care products</p>
            </div>
            <div className="featured-card">
              <div className="card-icon">🍵</div>
              <h3>Herbal Teas</h3>
              <p>Blended for specific dosha balancing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section" aria-labelledby="testimonials-heading">
        <div className="container">
          <h2 id="testimonials-heading" className="section-title">What Our Community Says</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Ojasritu changed my wellness journey. The products are authentic and the guidance is invaluable."</p>
              <h4>Priya Sharma</h4>
              <span>Delhi, India</span>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"The dosha analyzer helped me understand my body constitution perfectly. Highly recommended!"</p>
              <h4>Arun Kumar</h4>
              <span>Mumbai, India</span>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Best Ayurvedic products online. Fast shipping and excellent customer service."</p>
              <h4>Neha Patel</h4>
              <span>Bangalore, India</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section" aria-labelledby="cta-heading">
        <div className="container cta-content">
          <h2 id="cta-heading">Ready to Transform Your Wellness?</h2>
          <p>Join thousands of satisfied customers discovering authentic Ayurveda</p>
          <div className="cta-buttons">
            <Link to="/products" className="cta-btn primary" aria-label="Explore Products">Explore Products</Link>
            <Link to="/contact" className="cta-btn secondary" aria-label="Book Consultation">Book a Consultation</Link>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  )
}

export default Home