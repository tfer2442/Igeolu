import React from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import './ChatRoomList.css';

const ChatRoomList = ({ rooms, onSelectRoom }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } catch (error) {
      console.error('날짜 형식 변환 실패:', error);
      return dateString;
    }
  };

  return (
    <ul className="chat-room-list">
      {rooms.map((room) => (
        <li key={room.roomId} className="chat-room-item">
          <button 
            className="chat-room-button" 
            onClick={() => onSelectRoom(room)}
          >
            <div className="chat-room-avatar">
              {room.userProfileUrl ? (
                <img 
                  src={room.userProfileUrl} 
                  alt={`${room.userName} 프로필`} 
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {room.userName.charAt(0)}
                </div>
              )}
              {room.unreadCount > 0 && (
                <span className="unread-badge">{room.unreadCount}</span>
              )}
            </div>
            <div className="chat-room-content">
              <div className="chat-room-header">
                <h3 className="chat-room-name">{room.userName}</h3>
                <span className="chat-room-time">
                  {formatDate(room.createdAt)}
                </span>
              </div>
              {room.lastMessage && (
                <p className="chat-room-message">{room.lastMessage}</p>
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};

ChatRoomList.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number.isRequired,
      roomId: PropTypes.number.isRequired,
      userName: PropTypes.string.isRequired,
      userProfileUrl: PropTypes.string,
      unreadCount: PropTypes.number.isRequired,
      createdAt: PropTypes.string.isRequired,
      lastMessage: PropTypes.string
    })
  ).isRequired,
  onSelectRoom: PropTypes.func.isRequired
};

export default ChatRoomList;