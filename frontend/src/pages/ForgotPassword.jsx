import React, { useState } from 'react'
import '../styles/auth.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const getCsrf = () => document.cookie.split('; ').find(r => r.startsWith('csrftoken='))?.split('=')[1] || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/auth/forgot-password/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrf() },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) setMessage(data.message || 'If the email exists, a reset link has been sent')
      else setError(data.error || 'Error sending reset link')
    } catch (err) {
      console.error(err)
      setError('Error sending reset link')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Reset password</h2>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <div className="auth-actions">
            <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
