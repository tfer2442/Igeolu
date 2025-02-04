import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import defaultProfile from '../../../../assets/images/testprofile.jpg';
import './ChatMessage.css';

const ChatMessage = ({
  message,
  isCurrentUser,
  userProfile = {
    userName: '',
    profileUrl: ''
  }
}) => {
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
              onError={(e) => {
                e.target.onerror = null; // 무한 루프 방지
                e.target.src = defaultProfile;
              }}
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

// PropTypes는 그대로 유지
ChatMessage.propTypes = {
  message: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  userProfile: PropTypes.shape({
    userName: PropTypes.string,
    profileUrl: PropTypes.string
  })
};

export default ChatMessage;