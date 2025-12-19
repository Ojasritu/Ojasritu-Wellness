import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

export default function Signup() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const navigate = useNavigate()
  const { signup } = useAuth()

  const validate = () => {
    const errs = {}
    if (!firstName) errs.firstName = 'First name is required'
    if (!email || !/.+@.+\..+/.test(email)) errs.email = 'Valid email required'
    if (!password || password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (password !== passwordConfirm) errs.passwordConfirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const errs = validate()
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }

    setLoading(true)
    const res = await signup({ first_name: firstName, email, password, password_confirm: passwordConfirm })
    setLoading(false)

    if (!res.ok) {
      setError(res.error)
      return
    }

    navigate('/profile')
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create account</h2>
        {error && <div className="alert error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>First name</label>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} className={fieldErrors.firstName ? 'input-error' : ''} />
          {fieldErrors.firstName && <div className="field-error">{fieldErrors.firstName}</div>}

          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={fieldErrors.email ? 'input-error' : ''} />
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}

          <label>Password</label>
          <div className="password-row">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className={fieldErrors.password ? 'input-error' : ''} />
            <button type="button" className="show-hide" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}

          <label>Confirm password</label>
          <input type={showPassword ? 'text' : 'password'} value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} className={fieldErrors.passwordConfirm ? 'input-error' : ''} />
          {fieldErrors.passwordConfirm && <div className="field-error">{fieldErrors.passwordConfirm}</div>}

          <div className="auth-actions">
            <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
            <Link to="/login" className="link">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
