import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const getCsrfFromCookie = () =>
  document.cookie.split("; ").find((r) => r.startsWith("csrftoken="))?.split("=")[1] || "";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // On mount, re-check auth state (safe, idempotent endpoint)
    let cancelled = false;
    const check = async () => {
      try {
        const r = await fetch('/api/auth/check/', { credentials: 'include' });
        if (!cancelled) {
          const d = await r.json().catch(() => ({}));
          setUser(d?.user || null);
        }
      } catch (e) {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    check();

    return () => { cancelled = true };
  }, []);

  const ensureCsrf = async () => {
    if (!getCsrfFromCookie()) {
      await fetch("/api/auth/csrf/", { method: "GET", credentials: "include" });
    }
  };

  const checkAuth = async () => {
    try {
      const r = await fetch('/api/auth/check/', { credentials: 'include' });
      const d = await r.json().catch(() => ({}));
      setUser(d?.user || null);
      return d;
    } catch (e) {
      setUser(null);
      return { authenticated: false, user: null };
    }
  };

  const login = async ({ email, password }) => {
    await ensureCsrf();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfFromCookie(),
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, error: data.error || "Login failed" };

      // Re-check auth state explicitly (ensures session cookie is recognized)
      await new Promise((res) => setTimeout(res, 80));
      await checkAuth();

      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ first_name, email, password, password_confirm }) => {
    await ensureCsrf();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfFromCookie(),
        },
        body: JSON.stringify({ first_name, email, password, password_confirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, error: data.error || "Signup failed" };

      // Re-check auth state explicitly
      await new Promise((res) => setTimeout(res, 80));
      await checkAuth();

      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await ensureCsrf();
    try {
      await fetch("/api/auth/logout/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCsrfFromCookie() },
      });
    } catch (e) {
      // ignore
    }
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, signup, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
