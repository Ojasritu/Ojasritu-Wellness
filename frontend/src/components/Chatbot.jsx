import React, { useState } from 'react'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi, I am Ojasritu assistant. How can I help you today?' },
  ])
  const [text, setText] = useState('')

  function send() {
    if (!text.trim()) return
    setMessages((m) => [...m, { from: 'user', text }])
    setText('')
    // stub: in production we would call an AI API or send the message to support@ojasritu.co.in
    setTimeout(() => setMessages((m) => [...m, { from: 'bot', text: "Thanks — we'll get back to you via email or WhatsApp." }]), 800)
  }

  return (
    <div className={`chatbot ${open ? 'open' : ''}`}>
      <button className="chat-toggle" onClick={() => setOpen((s) => !s)}>
        {open ? (
          <span className="chat-icon">✕</span>
        ) : (
          <>
            <span className="chat-icon">💬</span>
            <span className="chat-label">Chat Us</span>
          </>
        )}
      </button>
      {open && (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about products, bookings..." />
            <button onClick={send}>Send</button>
          </div>
        </div>
      )}
    </div>
  )
}
