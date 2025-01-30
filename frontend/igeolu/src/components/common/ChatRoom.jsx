// src/components/common/ChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChatWebSocketService from '../../services/chatWebSocket';
import axios from 'axios';
import './ChatRoom.css';

const ChatRoom = ({ room, onBack, isLeaving }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const webSocketRef = useRef(null);

  // 기존 메시지 로드
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/chat/${room.id}`); // (GET) 기존 메시지 조회
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // WebSocket 연결 설정
  useEffect(() => {
    // 입장 애니메이션
    setTimeout(() => setIsActive(true), 50);

    // WebSocket 연결
    webSocketRef.current = new ChatWebSocketService(
      room.id,
      (message) => {
        setMessages(prev => [...prev, message]);
      }
    );
    webSocketRef.current.connect();

    // 기존 메시지 로드
    fetchMessages();

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
      }
    };
  }, [room.id]);

  // 뒤로가기기
  const handleBack = () => {
    setIsActive(false);
    setTimeout(() => {
      onBack();
    }, 300);
  };

  // 메시지 전송송
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const messageData = {
      id: Date.now(), // 임시 ID (현재 날짜?)
      name: "사용자", // 실제 구현 시 사용자 정보 필요
      message: newMessage
    };

    webSocketRef.current.sendMessage(messageData);
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
            <div 
              key={msg.id} 
              className={`message ${msg.name === "사용자" ? 'message-sent' : 'message-received'}`}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div className="message-input-container">
          <input
            type="text"
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
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
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  isLeaving: PropTypes.bool
};

export default ChatRoom;