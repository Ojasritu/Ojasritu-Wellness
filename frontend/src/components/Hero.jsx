import React from 'react'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          {/* Sanskrit line - anchored near heading */}
          <div className="slok-banner" aria-hidden="false">
            <p className="slok-line">शरीरमाद्यं खलु धर्मसाधनम्।</p>
          </div>

          <h1>Ojasritu — Ayurveda for Modern Life</h1>
          <p>Natural products, authentic practices, and guided wellness plans.</p>
        </div>

        <div className="hero-illustration" role="presentation">
          {/* Chat bubble next to Acharya (desktop/tablet overlay, mobile stacks) */}
          <div className="acharya-bubble" aria-live="polite">
            <span className="bubble-icon" aria-hidden="true">
              {/* simple chat icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 5.5C4 4.12 5.12 3 6.5 3h11C18.88 3 20 4.12 20 5.5v7c0 1.38-1.12 2.5-2.5 2.5H11l-4.5 4v-4H6.5C5.12 15 4 13.88 4 12.5v-7Z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
              </svg>
            </span>
            <p className="bubble-text">
              Ojasritu — Ayurveda for Modern Life. Natural products, authentic practices, and guided wellness plans.
            </p>
          </div>

          <img src="/static/images/acharya-hero.png" alt="Calm Acharya welcoming you to Ojasritu" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
