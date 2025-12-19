import React from 'react'
import '../pages/Profile.css'

export default function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className={"stat-accent " + (accent || '')} />
    </div>
  )
}
