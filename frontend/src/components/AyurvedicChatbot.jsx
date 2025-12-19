import React, { useState, useRef, useEffect } from 'react';
import './AyurvedicChatbot.css';
import PanditRobotLogo from './PanditRobotLogo';

const AyurvedicChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'नमस्ते! 🙏 Ojasritu Wellness में आपका स्वागत है। मैं आपकी आयुर्वेद संबंधित सभी प्रश्नों का उत्तर देने के लिए यहाँ हूँ।',
      slok: 'शरीरमाद्यं खलु धर्मसाधनम्।',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const csrfToken = getCookie('csrftoken');
      
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRFToken': csrfToken }),
        },
        credentials: 'include',
        body: JSON.stringify({
          message: userText,
          language: language,
          history: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: data.message,
          timestamp: new Date(),
          isResponse: true,
          slok: data.slok
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'API Error');
      }
    } catch (error) {
      console.error('Chatbot Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: language === 'hi' 
          ? '⚠️ कृपया दोबारा कोशिश करें।' 
          : '⚠️ Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: language === 'hi' ? 'दोष विश्लेषण' : 'Dosha Analysis', value: 'dosha', emoji: '🧘' },
    { label: language === 'hi' ? 'आयुर्वेद टिप्स' : 'Ayurveda Tips', value: 'tips', emoji: '🌿' },
    { label: language === 'hi' ? 'उत्पाद सुझाव' : 'Product Tips', value: 'products', emoji: '💊' },
    { label: language === 'hi' ? 'परामर्श' : 'Consultation', value: 'booking', emoji: '📅' }
  ];

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (
    <div className="ayurvedic-chatbot-container">
      {/* Chatbot Widget Toggle Button with Pandit Robot Logo */}
      <button 
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close Chat' : 'Open Chat'}
      >
        <PanditRobotLogo size={40} className="chatbot-pandit-logo" />
        <span className="chatbot-status">Vaidya</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="chatbot-header-logo">
                <PanditRobotLogo size={32} />
              </div>
              <h3>Vaidya AI</h3>
              <p className="chatbot-subtitle">आयुर्वेद विशेषज्ञ • Powered by Gemini</p>
            </div>
            <button 
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Language Selector */}
          <div className="language-selector">
            <button
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हिंदी
            </button>
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'} ${
                  message.isError ? 'error-message' : ''
                }`}
              >
                <div className="message-avatar">
                  {message.type === 'user' ? '👤' : <PanditRobotLogo size={24} />}
                </div>
                <div className="message-content">
                  <p>{message.content}</p>
                  {message.slok && (
                    <div className="slok-display">
                      <p className="slok-text">{message.slok}</p>
                    </div>
                  )}
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot-message typing">
                <div className="message-avatar">
                  <PanditRobotLogo size={24} />
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="quick-actions">
              {quickActions.map((action) => (
                <button
                  key={action.value}
                  className="quick-action-btn"
                  onClick={() => {
                    setInput(`${action.emoji} ${action.label}`);
                    setTimeout(() => {
                      document.querySelector('.chatbot-send-btn')?.click();
                    }, 100);
                  }}
                  title={action.label}
                >
                  {action.emoji}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="chatbot-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'hi' ? 'अपना सवाल पूछें...' : 'Ask your question...'}
              disabled={loading}
              className="chatbot-input"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="chatbot-send-btn"
            >
              {loading ? '...' : '📤'}
            </button>
          </form>

          {/* Footer */}
          <div className="chatbot-footer">
            <p className="footer-disclaimer">
              {language === 'hi'
                ? '⚠️ यह चिकित्सा सलाह का विकल्प नहीं है।'
                : '⚠️ Not a medical advice substitute.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AyurvedicChatbot;
