// src/pages/Mobile/MobileChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatWebSocketService from '../../services/chatWebSocket';
import './MobileChatRoom.css';

const MobileChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState(null);
  const webSocketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/chat/${roomId}`);
        setRoom(response.data.room);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch room data:', error);
      }
    };

    fetchRoom();
    
    webSocketRef.current = new ChatWebSocketService(
      roomId,
      (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    );
    webSocketRef.current.connect();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const messageData = {
      id: Date.now(),
      name: "사용자",
      message: newMessage
    };

    webSocketRef.current.sendMessage(messageData);
    setNewMessage('');
  };

  return (
    <div className="mobile-chat-room">
      <header className="mobile-chat-header">
        <button className="back-btn" onClick={() => navigate('/m/chat')}>
          <span>←</span>
        </button>
        <h2>{room?.name}</h2>
      </header>
      
      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.name === "사용자" ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default MobileChatRoom;