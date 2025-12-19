import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";
import { isGoogleEnabled, getGoogleClientId } from '../config';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, checkAuth, user, loading: authLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login({ email, password });

    if (!res.ok) {
      // Minimal logging for debugging
      console.error('Login failed', res);
      setError(res.error || 'Login failed');
      return;
    }

    // Navigate to profile after successful login
    navigate("/profile");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Welcome back</h2>

        {error && <div className="alert error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password</label>
          <div className="password-row">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="show-hide" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>

          <div className="auth-actions">
            <button className="btn primary" type="submit" disabled={authLoading}>{authLoading ? 'Signing in...' : 'Sign in'}</button>
            <Link to="/forgot-password" className="link">Forgot password?</Link>
          </div>
        </form>

        <div className="divider">OR</div>

        <div className="oauth">
          {/* Check availability dynamically in component state to handle runtime injections */}
          {(() => {
            const runtimeId = getGoogleClientId();
            if (runtimeId) {
              return (
                <GoogleLogin
                  onSuccess={async (res) => {
                    try {
                      await fetch('/api/auth/csrf/', { method: 'GET', credentials: 'include' });
                      const gres = await fetch('/api/auth/google/', {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': document.cookie.split('; ').find(r => r.startsWith('csrftoken='))?.split('=')[1] || '' },
                        body: JSON.stringify({ id_token: res.credential }),
                      });
                      const gresJson = await gres.json().catch(() => ({}));
                      if (!gres.ok) {
                        console.error('Google login failed', gres.status, gresJson);
                        setError(gresJson.error || gresJson.detail || 'Google sign-in failed');
                        return;
                      }
                      await new Promise((r) => setTimeout(r, 80));
                      await checkAuth();
                      navigate('/profile');
                    } catch (err) {
                      console.error('Google login error', err);
                      setError('Google sign-in failed');
                    }
                  }}
                  onError={() => { console.error('Google Sign In was unsuccessful'); setError('Google sign-in failed'); }}
                />
              )
            }
            return (
              <div className="google-unavailable">
                <button className="btn google-disabled" disabled aria-disabled="true">Google sign-in unavailable</button>
                <p className="google-note">If you expected Google login here, please ensure your environment variable <code>VITE_GOOGLE_CLIENT_ID</code> is set (build or runtime).</p>
              </div>
            )
          })()}
        </div>

        <div className="signup-link">Don't have an account? <Link to="/signup">Create new account</Link></div>
      </div>
    </div>
  );
}
