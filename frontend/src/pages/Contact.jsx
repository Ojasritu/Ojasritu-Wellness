import React, { useState } from 'react'
import './Contact.css'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa'
import { contactAPI, faqsAPI } from '../services/apiService'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [faqs, setFaqs] = useState(null)

  React.useEffect(() => {
    let cancelled = false
    faqsAPI.getAll()
      .then((data) => {
        if (cancelled) return
        setFaqs(Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []))
      })
      .catch(() => {
        if (!cancelled) setFaqs(null)
      })
    return () => { cancelled = true }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await contactAPI.submit({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        category: 'general',
      })
      setSubmitted(true)
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setSubmitted(false)
      }, 2500)
    } catch (err) {
      setError(err?.data?.detail || err?.message || 'Failed to send message')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-header">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We're here to help. Reach out with any questions about our products or services.</p>
        </div>
      </div>

      <div className="container contact-content">
        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {error && (
            <div className="success-message" style={{ borderLeftColor: '#b91c1c' }}>
              <p>✕ {error}</p>
            </div>
          )}
          {submitted ? (
            <div className="success-message">
              <p>✓ Thank you! We've received your message and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <aside className="contact-info-section">
          <div className="info-card">
            <div className="info-icon"><FaMapMarkerAlt /></div>
            <h3>Address</h3>
            <p>Raipur, Chhattisgarh</p>
          </div>

          <div className="info-card">
            <div className="info-icon"><FaPhoneAlt /></div>
            <h3>Phone</h3>
            <p>8305569539<br /><small>Mon-Fri: 9 AM - 6 PM IST</small></p>
          </div>

          <div className="info-card">
            <div className="info-icon"><FaEnvelope /></div>
            <h3>Email</h3>
            <p>support@ojasritu.co.in<br /><small>We aim to respond within 48 hours</small></p>
          </div>

          <div className="info-card">
            <div className="info-icon"><FaClock /></div>
            <h3>Hours</h3>
            <p>Monday - Friday: 9 AM - 6 PM<br />Saturday: 10 AM - 4 PM<br />Sunday: Closed</p>
          </div>
        </aside>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {Array.isArray(faqs) && faqs.length > 0 ? (
              faqs.slice(0, 8).map((f) => (
                <div className="faq-item" key={f.id || f.question_en}>
                  <h3>{f.question_en || f.question_hi}</h3>
                  <p>{f.answer_en || f.answer_hi}</p>
                </div>
              ))
            ) : (
              <>
                <div className="faq-item">
                  <h3>What are the shipping charges?</h3>
                  <p>We offer free shipping on all orders above ₹500. Orders below ₹500 incur a standard shipping charge of ₹49.</p>
                </div>
                <div className="faq-item">
                  <h3>How long does delivery take?</h3>
                  <p>Standard delivery takes 5-7 business days within India. Express delivery (2-3 days) is available in major cities.</p>
                </div>
                <div className="faq-item">
                  <h3>Do you offer refunds?</h3>
                  <p>Yes, we offer a 30-day money-back guarantee on all products. Contact us if you're not satisfied.</p>
                </div>
                <div className="faq-item">
                  <h3>Are your products certified organic?</h3>
                  <p>All our products are sourced from certified organic suppliers and tested for purity and quality.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
