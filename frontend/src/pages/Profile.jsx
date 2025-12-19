import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileSidebar from "../components/ProfileSidebar";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import "./Profile.css";
import { ordersAPI, rebookingsAPI } from "../services/apiService";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [tab, setTab] = useState('overview')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState("");
  const [emailField, setEmailField] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetch('/api/profile/', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      ordersAPI.getAll().catch(() => []),
      rebookingsAPI.getAll().catch(() => []),
    ]).then(([p, o, b]) => {
      if (cancelled) return
      setProfile(p)
      setOrders(Array.isArray(o?.results) ? o.results : (Array.isArray(o) ? o : []))
      setBookings(Array.isArray(b?.results) ? b.results : (Array.isArray(b) ? b : []))
      setFirstName(user?.first_name || '')
      setLastName(user?.last_name || '')
      setEmailField(p?.email || user?.email || '')
      setPhone(p?.phone || '')
      setBio(p?.bio || '')
    }).catch(() => {
      // ignore
    }).finally(() => !cancelled && setLoading(false))

    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      form.append('first_name', firstName);
      form.append('last_name', lastName);
      form.append('email', emailField);
      form.append('phone', phone || '');
      form.append('bio', bio || '');
      if (avatarFile) form.append('avatar', avatarFile);

      const res = await fetch('/api/profile/', { method: 'PUT', credentials: 'include', body: form });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setProfile(data);
      setToast({ type: 'success', text: 'Profile updated' })
    } catch {
      setToast({ type: 'error', text: 'Save failed. Try again.' })
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleRemoveAvatar = async () => {
    try {
      await fetch('/api/profile/avatar/', { method: 'DELETE', credentials: 'include' })
      setProfile({ ...profile, avatar: null })
      setAvatarFile(null)
      setAvatarPreview(null)
      setToast({ type: 'success', text: 'Avatar removed' })
    } catch {
      setToast({ type: 'error', text: 'Failed to remove avatar' })
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) return <div className="pf-loading">Loading profile...</div>;
  if (!profile) {
    navigate('/login');
    return null
  }

  return (
    <div className="pf-root">
      <div className="pf-container">
        <ProfileSidebar user={user} profile={profile} active={tab} setActive={setTab} onLogout={handleLogout} onAvatarChange={handleAvatarChange} onRemoveAvatar={handleRemoveAvatar} />

        <main className="pf-main">
          {toast && <div className={"pf-toast " + toast.type}>{toast.text}</div>}

          {tab === 'overview' && (
            <section className="pf-overview">
              <h1>Welcome back, {user.first_name || user.username}</h1>
              <p className="muted">Here’s an overview of your account activity.</p>

              <div className="pf-stats">
                <StatCard label="Total Orders" value={orders?.length || 0} accent="gold" />
                <StatCard label="Active Bookings" value={bookings?.filter(b => b.status?.toLowerCase()?.includes('active') || b.status?.toLowerCase()?.includes('upcoming')).length || 0} />
                <StatCard label="Completed Consultations" value={bookings?.filter(b => b.status?.toLowerCase()?.includes('complete')).length || 0} />
              </div>

              <div className="recent">
                <h3>Recent activity</h3>
                <ul>
                  {orders.slice(0,5).map(o => (
                    <li key={o.id} className="recent-item">Order <strong>{o.order_id}</strong> — ₹{o.final_amount} — <StatusBadge status={o.status} /></li>
                  ))}
                  {orders.length === 0 && <li className="muted">No recent activity</li>}
                </ul>
              </div>
            </section>
          )}

          {tab === 'profile' && (
            <section className="pf-card">
              <h2>Profile details</h2>
              <div className="pf-form">
                <label>First name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} />

                <label>Last name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} />

                <label>Email</label>
                <input value={emailField} onChange={e => setEmailField(e.target.value)} />

                <label>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} />

                <label>Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} />

                <div className="pf-actions">
                  <button className="btn primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
                </div>
              </div>
            </section>
          )}

          {tab === 'orders' && (
            <section className="pf-card">
              <h2>My Orders</h2>
              <div className="orders-table">
                <table>
                  <thead>
                    <tr><th>Order</th><th>Amount</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td>{o.order_id}</td>
                        <td>₹{o.final_amount}</td>
                        <td><StatusBadge status={o.status} /></td>
                        <td><Link className="btn small" to={`/orders/${o.id}`}>View</Link></td>
                      </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={4} className="muted">No orders</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === 'bookings' && (
            <section className="pf-card">
              <h2>My Bookings</h2>
              <div className="bookings-list">
                {bookings.map(b => (
                  <div className="booking-row" key={b.id}>
                    <div>
                      <div className="booking-type">{b.consultation_type}</div>
                      <div className="booking-date muted">{b.scheduled_date} {b.scheduled_time || ''}</div>
                    </div>
                    <div className="booking-actions">
                      <StatusBadge status={b.status} />
                      <Link className="btn small" to={`/rebookings/${b.id}`}>Track</Link>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <div className="muted">No bookings</div>}
              </div>
            </section>
          )}

          {tab === 'settings' && (
            <section className="pf-card">
              <h2>Account settings</h2>
              <p className="muted">Manage account preferences and security.</p>
              <div className="pf-actions">
                <button className="btn ghost" onClick={handleLogout}>Logout</button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
