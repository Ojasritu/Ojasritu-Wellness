import React from 'react'
import '../pages/Profile.css'

export default function ProfileSidebar({ user, profile, active, setActive, onLogout, onAvatarChange, onRemoveAvatar, preview }) {
  const initials = (user?.first_name || user?.username || '').charAt(0)?.toUpperCase()

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
        <button className="btn edit" onClick={() => setActive('profile')}>Edit profile</button>
      </div>

      <nav className="pf-nav">
        <button className={"nav-item " + (active === 'overview' ? 'active' : '')} onClick={() => setActive('overview')}>Dashboard</button>
        <button className={"nav-item " + (active === 'orders' ? 'active' : '')} onClick={() => setActive('orders')}>My Orders</button>
        <button className={"nav-item " + (active === 'bookings' ? 'active' : '')} onClick={() => setActive('bookings')}>My Bookings</button>
        <button className={"nav-item " + (active === 'settings' ? 'active' : '')} onClick={() => setActive('settings')}>Account Settings</button>
        <button className="nav-item logout" onClick={onLogout}>Logout</button>
      </nav>
    </aside>
  )
}
