// src/components/common/ChatRoomList/ChatRoomList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './ChatRoomList.css';
import { formatChatTime } from '../../../../utils/dateFormat';

/* "약 N시간 전" 날짜 형식
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
*/

const ChatRoomList = ({ rooms, onSelectRoom, isMobile = false  }) => {

  // "약 N시간 전" 같은 형식
  // const formatDate = (dateString) => {
  //   try {
  //     const date = new Date(dateString);
  //     return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  //   } catch (error) {
  //     console.error('날짜 형식 변환 실패:', error);
  //     return dateString;
  //   }
  // };

  return (
    <ul className={`chat-room-list ${isMobile ? 'mobile' : ''}`}>
      {rooms.map((room) => (
        <li key={room.roomId} className="chat-room-item">
          <button className="chat-room-button" onClick={() => onSelectRoom(room)}>
            <div className="user-profile">
              {room.userProfileUrl ? (
                <img 
                  src={room.userProfileUrl} 
                  alt={`${room.userName} 프로필`} 
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  {room.userName.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="chat-content">
              <div className="user-name-row">
                <span className="user-name">{room.userName}님</span>
                <span className="chat-time">{formatChatTime(room.updatedAt)}</span>
              </div>
              <div className="message-row">
                <p className="last-message">{room.lastMessage}</p>
                {room.unreadCount > 0 && (
                  <span className="unread-count">{room.unreadCount}</span>
                )}
              </div>
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
      roomId: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      userName: PropTypes.string.isRequired,
      userProfileUrl: PropTypes.string,
      unreadCount: PropTypes.number.isRequired,
      updatedAt: PropTypes.string.isRequired,
      lastMessage: PropTypes.string
    })
  ).isRequired,
  onSelectRoom: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};


export default ChatRoomList;