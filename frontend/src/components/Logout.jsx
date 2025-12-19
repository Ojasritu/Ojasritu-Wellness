import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await fetch('/api/logout/', { method: 'POST', credentials: 'include' })
    // redirect to home
    navigate('/')
    window.location.reload()
  }

  return (
    <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
  )
}
