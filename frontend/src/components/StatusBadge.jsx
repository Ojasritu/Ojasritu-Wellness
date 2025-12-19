import React from 'react'
import '../pages/Profile.css'

export default function StatusBadge({ status }) {
  const s = (status || '').toLowerCase()
  const cls = s.includes('pending') ? 'pending' : s.includes('complete') || s.includes('done') ? 'success' : s.includes('cancel') || s.includes('failed') ? 'danger' : 'info'
  return <span className={"status-badge " + cls}>{status}</span>
}
