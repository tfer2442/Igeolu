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
  const { content, createdAt, senderType } = message;
  const messageTime = format(new Date(message.createdAt), 'HH:mm');

  const isSystemMessage = senderType === "SYSTEM";

  return (
   <div className={`message-wrapper ${isCurrentUser ? 'sent' : 'received'} ${isSystemMessage ? 'system' : ''}`}>
      {!isCurrentUser && !isSystemMessage && (
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
      <div className={`message-content ${isSystemMessage ? 'system-content' : ''}`}>
        <div className={`message-bubble ${isSystemMessage ? 'system-bubble' : ''}`}>
          <p className={`message-text ${isSystemMessage ? 'system-text' : ''}`}>{content}</p>
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
    createdAt: PropTypes.string.isRequired,
    senderType: PropTypes.oneOf(['USER', 'SYSTEM']).isRequired
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  userProfile: PropTypes.shape({
    userName: PropTypes.string,
    profileUrl: PropTypes.string
  })
};

export default ChatMessage;