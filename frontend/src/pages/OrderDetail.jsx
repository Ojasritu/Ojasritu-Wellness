import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ordersAPI } from '../services/apiService'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ordersAPI.get(id)
      .then((data) => {
        if (!cancelled) setOrder(data)
      })
      .catch((err) => {
        console.error(err)
        if (!cancelled) setOrder(null)
      })
      .finally(() => !cancelled && setLoading(false))

    return () => { cancelled = true }
  }, [id])

  if (loading) return <div>Loading order...</div>
  if (!order) return <div>Order not found.</div>

  return (
    <div className="order-detail">
      <h2>Order {order.order_id || order.id}</h2>
      <div><strong>Status:</strong> {order.status}</div>
      <div><strong>Amount:</strong> ₹{order.final_amount}</div>
      <div><strong>Created:</strong> {order.created_at || order.created}</div>

      {order.items && order.items.length > 0 && (
        <div>
          <h3>Items</h3>
          <ul>
            {order.items.map((it, idx) => (
              <li key={idx}>{it.name || it.product_name} × {it.quantity} — ₹{it.price}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Link to="/orders">Back to orders</Link>
      </div>
    </div>
  )
}
