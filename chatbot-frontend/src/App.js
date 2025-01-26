import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/chat', 
        { message: inputMessage },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 2,
        text: 'Network error. Please try again.',
        sender: 'system',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        CyberSafe India AI
        <button onClick={clearChat} className="clear-button">Clear Chat</button>
      </div>
      
      <div className="messages-container">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`message ${msg.sender}`}
          >
            {msg.text}
            <span className="timestamp">{msg.timestamp}</span>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot loading">
            Generating response...
          </div>
        )}
      </div>
      
      <div className="input-area">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about cybersecurity in India"
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;