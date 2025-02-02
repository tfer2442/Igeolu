// src/components/common/ChatMessage/ChatMessage.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import './ChatMessage.css';

const ChatMessage = ({ message, isCurrentUser, userProfile }) => {
  const messageTime = format(new Date(message.createdAt), 'HH:mm');

  return (
    <div className={`message-wrapper ${isCurrentUser ? 'sent' : 'received'}`}>
      {!isCurrentUser && (
        <div className="message-profile">
          {userProfile?.profileUrl ? (
            <img 
              src={userProfile.profileUrl} 
              alt={`${userProfile.userName} 프로필`} 
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">
              {userProfile?.userName?.charAt(0)}
            </div>
          )}
        </div>
      )}
      <div className="message-content">
        <div className="message-bubble">
          <p className="message-text">{message.content}</p>
        </div>
        <span className="message-time">{messageTime}</span>
      </div>
    </div>
  );
};

// ChatMessage.jsx
ChatMessage.propTypes = {
  message: PropTypes.shape({
    messageId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  userProfile: PropTypes.shape({
    userName: PropTypes.string,
    profileUrl: PropTypes.string
  })
};

// 기본값 설정
ChatMessage.defaultProps = {
  userProfile: {
    userName: '',
    profileUrl: ''
  }
};

export default ChatMessage;