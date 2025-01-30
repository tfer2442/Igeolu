// src/pages/Mobile/MobileChatList.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileChatList.css';
import PropTypes from 'prop-types';

const MobileChatList = ({ chatRooms, onUpdateRooms }) => {
  const navigate = useNavigate();
  const wsRef = useRef(null);

  useEffect(() => {
    // WebSocket 연결
    wsRef.current = new WebSocket('ws://localhost:8080/ws/chatRooms');

    wsRef.current.onmessage = (event) => {
      const updatedRooms = JSON.parse(event.data);
      onUpdateRooms(updatedRooms); // 부모 컴포넌트의 chatRooms 상태 업데이트
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onUpdateRooms]);

  const handleRoomClick = (roomId) => {
    navigate(`/m/chat/${roomId}`);
  };

  return (
    <div className="mobile-chat-list">
      <header className="mobile-header">
        <h1>채팅</h1>
      </header>
      <div className="chat-rooms">
        {chatRooms.map((room) => (
          <button
            key={room.id}
            className="chat-room-item"
            onClick={() => handleRoomClick(room.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRoomClick(room.id);
              }
            }}
            type="button"
            aria-label={`${room.name} 채팅방으로 이동`}
          >
            <div className="room-info">
              <h3>{room.name}</h3>
              <p className="last-message">{room.lastMessage}</p>
            </div>
            <div className="room-meta">
              <span className="timestamp">{room.lastMessageTime}</span>
              {room.unreadCount > 0 && (
                <span className="unread-badge">{room.unreadCount}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

MobileChatList.propTypes = {
  chatRooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      lastMessage: PropTypes.string,
      lastMessageTime: PropTypes.string,
      unreadCount: PropTypes.number
    })
  ).isRequired,
  onUpdateRooms: PropTypes.func.isRequired,
};

export default MobileChatList;