// src/components/common/ChatRoomList/ChatRoomList.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './ChatRoomList.css';
import { formatChatTime } from '../../../../utils/dateFormat';
import defaultProfile from '../../../../assets/images/defaultProfileImageIMSI2.png';

const ChatRoomList = ({ rooms, onSelectRoom, isMobile = false, defaultProfileImage = defaultProfile }) => {
  useEffect(() => {
    console.log('rooms 데이터 확인:', rooms);
  }, [rooms]);

  const noun = isMobile ? " 세입자님" : " 중개인님"

  return (
    <ul className={`chat-room-list ${isMobile ? 'mobile' : ''}`}>
      {rooms.map((room) => (
        <li key={room.roomId} className="chat-room-item">
          <button className="chat-room-button" onClick={() => onSelectRoom(room)}>
            <div className="user-profile">
              <img 
                src={room.userProfileUrl || defaultProfileImage}
                alt={`${room.userName} 프로필`} 
                className="profile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultProfileImage;
                }}
              />
            </div>

            <div className='chat-content'>
              <div className='user-name-row'>
                <span className='user-name'>{room.userName}{noun}</span>
                <span className='chat-time'>
                  {formatChatTime(room.updatedAt)}
                </span>
              </div>
              <div className='message-row'>
                <p className='last-message'>{room.lastMessage}</p>
                {room.unreadCount > 0 && (
                  <span className='unread-count'>{room.unreadCount}</span>
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
      lastMessage: PropTypes.string,
    })
  ).isRequired,
  onSelectRoom: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  defaultProfileImage: PropTypes.string,
};

export default ChatRoomList;
