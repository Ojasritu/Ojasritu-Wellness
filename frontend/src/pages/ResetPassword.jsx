import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function ResetPassword() {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const getCsrf = () => document.cookie.split('; ').find(r => r.startsWith('csrftoken='))?.split('=')[1] || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrf() },
        body: JSON.stringify({ uid, token, password, password_confirm: passwordConfirm }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setMessage(data.message || 'Password reset successful')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        setError(data.error || 'Error resetting password')
      }
    } catch (err) {
      console.error(err)
      setError('Error resetting password')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Set a new password</h2>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>New password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

          <label>Confirm new password</label>
          <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required />

          <div className="auth-actions">
            <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
