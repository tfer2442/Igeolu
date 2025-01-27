import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ChatRoom.css';

const ChatRoom = ({ room, onBack, isLeaving  }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // 진입 애니메이션
    setTimeout(() => setIsActive(true), 50);
  }, []);

  const handleBack = () => {
    setIsActive(false);
    setTimeout(() => {
      onBack();
    }, 300);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'me'
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="chat-room-overlay">
      <div className={`chat-room-container ${isActive ? 'active' : ''} ${isLeaving ? 'leaving' : ''}`}>
        <header className="chat-room-header">
          <button onClick={handleBack} className="back-button">🔙</button>
          <h3 className="chat-room-title">{room.name}</h3>
        </header>
        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === 'me' ? 'message-sent' : 'message-received'}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="message-input-container">
          <input
            type="text"
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

ChatRoom.propTypes = {
  room: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  isLeaving: PropTypes.bool // PropTypes 추가
};

export default ChatRoom;