import React from 'react'
import '../pages/Profile.css'

export default function ProfileSidebar({ user, profile, active, setActive, onLogout, onAvatarChange, onRemoveAvatar, preview }) {
  const initials = (user?.first_name || user?.username || '').charAt(0)?.toUpperCase()

  const navItems = [
    { key: 'overview', label: 'Dashboard', icon: '📊' },
    { key: 'personal', label: 'Personal Details', icon: '👤' },
    { key: 'orders', label: 'Orders & Bookings', icon: '🧾' },
    { key: 'tracking', label: 'Order Tracking', icon: '📍' },
    { key: 'history', label: 'Purchase History', icon: '🕒' },
    { key: 'addresses', label: 'Saved Addresses', icon: '🏠' },
    { key: 'settings', label: 'Account & Logout', icon: '⚙️' },
  ]

  return (
    <aside className="pf-sidebar">
      <div className="pf-avatar-wrap">
        {preview ? (
          <img src={preview} alt="avatar" className="pf-avatar" />
        ) : profile?.avatar ? (
          <img src={profile.avatar} alt="avatar" className="pf-avatar" />
        ) : (
          <div className="pf-avatar pf-initials">{initials}</div>
        )}

        <div className="pf-avatar-actions">
          <label className="btn small">Upload
            <input type="file" accept="image/*" onChange={onAvatarChange} style={{ display: 'none' }} />
          </label>
          {(preview || profile?.avatar) && <button className="btn small ghost" onClick={onRemoveAvatar}>Remove</button>}
        </div>
      </div>

      <div className="pf-user">
        <div className="pf-name">{user?.first_name || user?.username}</div>
        <div className="pf-email">{user?.email}</div>
        <button className="btn edit" onClick={() => setActive('personal')}>Edit profile</button>
      </div>

      <nav className="pf-nav">
        {navItems.map(item => (
          <button
            key={item.key}
            className={"nav-item " + (active === item.key ? 'active' : '')}
            onClick={() => setActive(item.key)}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <button className="nav-item logout" onClick={onLogout}>↪ Logout</button>
      </nav>
    </aside>
  )
}
