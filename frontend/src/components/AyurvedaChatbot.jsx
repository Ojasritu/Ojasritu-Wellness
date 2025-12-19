import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generativeai';
import { FiSend, FiX } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'नमस्ते! 🙏 मैं आपकी आयुर्वेद स्वास्थ्य सहायक हूँ। कृपया अपने स्वास्थ्य संबंधी प्रश्न पूछें।',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const genAI = useRef(null);

  useEffect(() => {
    // Initialize Google Generative AI
    genAI.current = new GoogleGenerativeAI(
      process.env.REACT_APP_GOOGLE_API_KEY
    );
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAyurvedicResponse = async (userMessage) => {
    try {
      const model = genAI.current.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `आप एक प्राचीन आयुर्वेद विशेषज्ञ हैं। उपयोगकर्ता के सवाल का जवाब दें:

यूजर: ${userMessage}

कृपया आयुर्वेद के सिद्धांतों के आधार पर, त्रिदोष (वात, पित्त, कफ) को ध्यान में रखते हुए उत्तर दें। हिंदी में उत्तर दें और सरल रखें।`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('API Error:', error);
      return 'माफी चाहता हूँ। कृपया फिर से कोशिश करें।';
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Get bot response
    const botResponse = await generateAyurvedicResponse(input);
    const botMessage = {
      id: messages.length + 2,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      {/* Chat Toggle Button */}
      <button
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <FiX size={24} /> : <BsRobot size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BsRobot size={20} />
              <span>आयुर्वेद सहायक</span>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message msg-${msg.sender}`}>
                <div className="bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message msg-bot">
                <div className="bubble">
                  <div className="spinner"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="अपना सवाल पूछें..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              <FiSend size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
