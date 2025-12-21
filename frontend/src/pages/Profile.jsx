import React, { useEffect, useMemo, useState } from "react";
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

  const savedAddresses = useMemo(() => {
    if (Array.isArray(profile?.addresses)) return profile.addresses
    if (profile?.address) return [profile.address]
    return []
  }, [profile])

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
        <ProfileSidebar
          user={user}
          profile={profile}
          active={tab}
          setActive={setTab}
          onLogout={handleLogout}
          onAvatarChange={handleAvatarChange}
          onRemoveAvatar={handleRemoveAvatar}
          preview={avatarPreview}
        />

        <main className="pf-main">
          {toast && <div className={"pf-toast " + toast.type}>{toast.text}</div>}

          {tab === 'overview' && (
            <section className="pf-card pf-overview">
              <div className="pf-header">
                <div>
                  <p className="eyebrow">Welcome back</p>
                  <h1>{user.first_name || user.username}</h1>
                  <p className="muted">Your wellness hub with orders, consultations, and saved details.</p>
                </div>
                <div className="pf-quick-actions">
                  <button className="pill" onClick={() => setTab('personal')}>Edit Profile</button>
                  <button className="pill ghost" onClick={() => setTab('orders')}>View Orders</button>
                </div>
              </div>

              <div className="pf-stats-grid">
                <StatCard label="Total Orders" value={orders?.length || 0} accent="gold" />
                <StatCard label="Active Bookings" value={bookings?.filter(b => b.status?.toLowerCase()?.includes('active') || b.status?.toLowerCase()?.includes('upcoming')).length || 0} />
                <StatCard label="Completed Consultations" value={bookings?.filter(b => b.status?.toLowerCase()?.includes('complete')).length || 0} />
              </div>

              <div className="pf-grid">
                <div className="pf-card nested">
                  <div className="pf-card-title">
                    <span aria-hidden="true">🧾</span>
                    Recent Orders
                  </div>
                  <ul className="pf-list">
                    {orders.slice(0,5).map(o => (
                      <li key={o.id} className="pf-list-item">
                        <div>
                          <div className="pf-list-label">Order {o.order_id}</div>
                          <div className="muted">₹{o.final_amount}</div>
                        </div>
                        <StatusBadge status={o.status} />
                      </li>
                    ))}
                    {orders.length === 0 && <li className="muted">No recent orders</li>}
                  </ul>
                </div>

                <div className="pf-card nested">
                  <div className="pf-card-title">
                    <span aria-hidden="true">📍</span>
                    Upcoming / Active Bookings
                  </div>
                  <ul className="pf-list">
                    {bookings.slice(0,4).map(b => (
                      <li key={b.id} className="pf-list-item">
                        <div>
                          <div className="pf-list-label">{b.consultation_type}</div>
                          <div className="muted">{b.scheduled_date} {b.scheduled_time || ''}</div>
                        </div>
                        <StatusBadge status={b.status} />
                      </li>
                    ))}
                    {bookings.length === 0 && <li className="muted">No bookings yet</li>}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {tab === 'personal' && (
            <section className="pf-card">
              <div className="pf-card-title">
                <span aria-hidden="true">👤</span>
                Personal Details
              </div>
              <div className="pf-form pf-two-col">
                <label>First name
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} />
                </label>

                <label>Last name
                  <input value={lastName} onChange={e => setLastName(e.target.value)} />
                </label>

                <label>Email
                  <input value={emailField} onChange={e => setEmailField(e.target.value)} />
                </label>

                <label>Phone
                  <input value={phone} onChange={e => setPhone(e.target.value)} />
                </label>

                <label className="pf-span-2">Bio
                  <textarea value={bio} onChange={e => setBio(e.target.value)} />
                </label>

                <div className="pf-actions pf-span-2">
                  <button className="btn primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
                  <button className="btn ghost" type="button" onClick={() => setTab('overview')}>Cancel</button>
                </div>
              </div>
            </section>
          )}

          {tab === 'orders' && (
            <section className="pf-card">
              <div className="pf-card-title">
                <span aria-hidden="true">🧾</span>
                Orders & Bookings
              </div>
              <div className="pf-split">
                <div className="orders-table">
                  <h3>Orders</h3>
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

                <div className="bookings-list">
                  <h3>Bookings</h3>
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
              </div>
            </section>
          )}

          {tab === 'tracking' && (
            <section className="pf-card">
              <div className="pf-card-title">
                <span aria-hidden="true">📍</span>
                Order Tracking
              </div>
              <div className="pf-timeline">
                {bookings.map(b => (
                  <div key={b.id} className="pf-timeline-item">
                    <div className="pf-timeline-dot" />
                    <div>
                      <div className="pf-list-label">{b.consultation_type}</div>
                      <div className="muted">{b.scheduled_date} {b.scheduled_time || ''}</div>
                    </div>
                    <div className="pf-timeline-status">
                      <StatusBadge status={b.status} />
                      <Link className="btn small" to={`/rebookings/${b.id}`}>Track</Link>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <div className="muted">No tracking items</div>}
              </div>
            </section>
          )}

          {tab === 'history' && (
            <section className="pf-card">
              <div className="pf-card-title">
                <span aria-hidden="true">🕒</span>
                Purchase History
              </div>
              <div className="pf-timeline">
                {orders.map(o => (
                  <div key={o.id} className="pf-timeline-item">
                    <div className="pf-timeline-dot" />
                    <div>
                      <div className="pf-list-label">Order {o.order_id}</div>
                      <div className="muted">₹{o.final_amount}</div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                ))}
                {orders.length === 0 && <div className="muted">No purchase history</div>}
              </div>
            </section>
          )}

          {tab === 'addresses' && (
            <section className="pf-card">
              <div className="pf-card-title">
                <span aria-hidden="true">🏠</span>
                Saved Addresses
              </div>
              <div className="pf-addresses">
                {savedAddresses.map((addr, idx) => (
                  <div className="pf-address-card" key={idx}>
                    <div className="pf-address-header">
                      <span className="nav-icon" aria-hidden="true">📍</span>
                      Address {idx + 1}
                    </div>
                    <div className="pf-address-text">{addr}</div>
                  </div>
                ))}
                {savedAddresses.length === 0 && (
                  <div className="pf-address-empty">
                    <p className="muted">No saved addresses yet.</p>
                    <button className="btn ghost" type="button" onClick={() => setTab('personal')}>Add details</button>
                  </div>
                )}
              </div>
            </section>
          )}

          {tab === 'settings' && (
            <section className="pf-card">
              <div className="pf-card-title">
                <span aria-hidden="true">⚙️</span>
                Account & Logout
              </div>
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
