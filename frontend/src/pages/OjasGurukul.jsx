import React, { useState } from 'react'
import './OjasGurukul.css'
import { ojasGurukulAPI } from '../services/apiService'

const visionItems = [
  'Restore ancient Indian holistic education',
  'Integrate Ayurveda, Yoga, and spiritual sciences',
  'Preserve Guru–Shishya discipline and devotion',
  'Build self-sustainable campuses in harmony with nature',
]

const educationDimensions = [
  'Vedas & Upanishads',
  'Ayurveda & Herbology',
  'Yoga & Meditation',
  'Martial Arts (Astra–Shastra)',
  'Sanskrit & Philosophy',
  'Gau & Krishi Vidya',
  'Arts, Music & Culture',
]

const campusFeatures = [
  'Forest-based eco-campus',
  'Kutiyas (eco-huts)',
  'Herbal gardens',
  'Gaushala',
  'Meditation & Yajna halls',
  'Organic farming fields',
]

const OjasGurukul = () => {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [status, setStatus] = useState({ loading: false, success: '', error: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: '', error: '' })
    try {
      await ojasGurukulAPI.notify(formData)
      setStatus({ loading: false, success: 'You are now on the list. Check your email for confirmation.', error: '' })
      setFormData({ name: '', email: '' })
    } catch (error) {
      const message = error?.data?.error || error.message || 'Could not save your request. Please try again.'
      setStatus({ loading: false, success: '', error: message })
    }
  }

  return (
    <div className="gurukul-page">
      <div className="gurukul-hero">
        <p className="gurukul-eyebrow">🌺 OJAS GURUKUL</p>
        <h1 className="gurukul-title">The Revival of Ancient Indian Wisdom</h1>
        <p className="gurukul-lead">
          Where education is not just for livelihood, but for enlightenment. A sacred center where Nature, Ayurveda, Yoga,
          Vedas, Martial Arts, and Cultural Values unite into a complete journey of the body, mind, and soul.
        </p>

        <div className="cta-buttons">
          <a className="cta primary" href="#notify">Join the Movement</a>
          <a className="cta subtle" href="mailto:support@ojasritu.co.in?subject=Ojas%20Gurukul%20Support">Donate / Support</a>
          <a className="cta outline" href="#notify">Get Updates</a>
        </div>
      </div>

      <div className="gurukul-sections">
        <section className="gurukul-section">
          <div className="section-header">
            <h2>About Ojas Gurukul</h2>
            <p>Learning here is a journey of body, mind, and soul toward inner awakening.</p>
          </div>
          <div className="section-card">
            <p>
              Ojas Gurukul revives the ancient Guru–Shishya (Teacher–Disciple) tradition for the modern age, weaving together
              nature-led living, Ayurveda, Yoga, the Vedas, martial discipline, and cultural values into one living system.
            </p>
          </div>
        </section>

        <section className="gurukul-section">
          <div className="section-header">
            <h2>Our Vision</h2>
            <p>Not just a Gurukul — a way of life.</p>
          </div>
          <div className="pill-grid">
            {visionItems.map((item) => (
              <div key={item} className="pill-card">{item}</div>
            ))}
          </div>
        </section>

        <section className="gurukul-section">
          <div className="section-header">
            <h2>The Education System</h2>
            <p>Training in seven dimensions of life:</p>
          </div>
          <div className="pill-grid seven">
            {educationDimensions.map((item, index) => (
              <div key={item} className="pill-card">{index + 1}. {item}</div>
            ))}
          </div>
        </section>

        <section className="gurukul-section">
          <div className="section-header">
            <h2>The Campus</h2>
            <p>"Nature is the teacher, life is the classroom."</p>
          </div>
          <div className="feature-grid">
            {campusFeatures.map((feature) => (
              <div key={feature} className="feature-card">{feature}</div>
            ))}
          </div>
        </section>

        <section className="gurukul-section">
          <div className="section-header">
            <h2>National Vision</h2>
            <p>"One Gurukul – One State"</p>
          </div>
          <div className="section-card">
            <p>Goal: Establish one 500-acre Gurukul Tapovan in every Indian state.</p>
          </div>
        </section>

        <section className="gurukul-section" id="notify">
          <div className="section-header">
            <h2>Join the Vision</h2>
            <p>Sign up to be notified about admissions, events, and announcements.</p>
          </div>
          <div className="notify-card">
            <form className="notify-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="notify-btn" disabled={status.loading}>
                {status.loading ? 'Sending...' : 'Notify Me'}
              </button>
              {status.success && <p className="status success">{status.success}</p>}
              {status.error && <p className="status error">{status.error}</p>}
            </form>

            <div className="contact-card">
              <h3>Contact</h3>
              <p>Email: <a href="mailto:support@ojasritu.co.in">support@ojasritu.co.in</a></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default OjasGurukul
