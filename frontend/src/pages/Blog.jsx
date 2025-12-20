import React, { useEffect, useMemo, useState } from 'react'
import './CommonComingSoon.css'
import { articlesAPI } from '../services/apiService'

const demoPosts = [
  { id: 1, title: 'Ayurvedic Morning Routine', excerpt: 'Start your day the Ayurvedic way with ancient practices designed to balance your mind, body, and spirit.' },
  { id: 2, title: 'Herbal Oils 101', excerpt: 'Discover the therapeutic properties of traditional Ayurvedic oils and their applications.' },
  { id: 3, title: 'Seasonal Wellness Guide', excerpt: 'Adapt your lifestyle to seasonal changes with Ayurvedic recommendations.' },
  { id: 4, title: 'Food as Medicine', excerpt: 'Understanding how to use food as the first line of wellness.' },
  { id: 5, title: 'Meditation Techniques', excerpt: 'Ancient meditation methods for modern stress relief.' },
  { id: 6, title: 'Dosha Balance Mastery', excerpt: 'Learn to recognize and balance your unique constitutional makeup.' },
]

export default function Blog() {
  const [articles, setArticles] = useState(null)

  useEffect(() => {
    let cancelled = false
    articlesAPI.getAll()
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : [])
        setArticles(list)
      })
      .catch(() => {
        if (!cancelled) setArticles([])
      })
    return () => { cancelled = true }
  }, [])

  const cards = useMemo(() => {
    if (Array.isArray(articles) && articles.length > 0) {
      return articles.map((a, idx) => ({
        id: a.id || idx + 1,
        title: a.title || a.hindi_title || `Article #${idx + 1}`,
        excerpt: a.excerpt || 'New article coming soon.'
      }))
    }
    return demoPosts
  }, [articles])

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

  return (
    <div className="blog-wrapper">
      {/* Background with watercolor effects */}
      <div className="blog-background">
        <div className="watercolor blog-watercolor-1"></div>
        <div className="watercolor blog-watercolor-2"></div>
        <div className="watercolor blog-watercolor-3"></div>
      </div>

      {/* Decorative Elements */}
      <div className="blog-decorations">
          <div className="fern-decoration blog-fern"><FernDecoration /></div>
          <div className="lotus-decoration blog-lotus"><LotusDecoration /></div>
      </div>

      {/* Main Content */}
      <div className="blog-container">
        {/* Featured Image */}
        <div className="blog-image-section">
          <img 
            src="/static/images/coming-soon-ayurveda.png"
            alt="Coming Soon Ancient Ayurveda & Nature"
            className="blog-image big-coming-soon"
            style={{width: '100%', maxWidth: '900px', borderRadius: '24px', boxShadow: '0 8px 48px rgba(0,0,0,0.25)', margin: '0 auto', display: 'block'}}
          />
        </div>

        {/* Gold Divider */}
        <div className="gold-divider"></div>

        {/* Content Section */}
        <div className="blog-content">
          <h1 className="blog-title">Wellness Blog</h1>
          <p className="blog-subtitle">Ancient Wisdom for Modern Living</p>
          
          <div className="blog-intro">
            <p className="blog-description">
              Explore in-depth articles on Ayurvedic practices, wellness tips, seasonal guidance, and expert insights from our community of practitioners.
            </p>
          </div>

          {/* Blog Preview Grid */}
          <div className="blog-grid">
            {cards.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-card-header">
                  <span className="blog-number">#{post.id}</span>
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <a href="#" className="blog-card-link" onClick={(e) => e.preventDefault()}>Read Article →</a>
              </article>
            ))}
          </div>

          <div className="coming-year">2026</div>
          
          <button className="blog-cta-button">
            Subscribe to Updates
          </button>
        </div>

        {/* Bottom Divider */}
        <div className="gold-divider"></div>
      </div>
    </div>
  )
}
