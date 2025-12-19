import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ordersAPI } from '../services/apiService'

export default function Orders() {
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ordersAPI.getAll()
      .then((data) => {
        if (cancelled) return
        setOrders(Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []))
      })
      .catch((err) => {
        console.error('Failed to load orders', err)
        if (!cancelled) setOrders([])
      })
      .finally(() => !cancelled && setLoading(false))

    return () => { cancelled = true }
  }, [])

  if (loading) return <div>Loading orders...</div>
  if (!orders || orders.length === 0) return <div>No orders found.</div>

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            <Link to={`/orders/${o.id}`}>{o.order_id || `Order #${o.id}`}</Link>
            <div>Amount: ₹{o.final_amount}</div>
            <div>Status: {o.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
