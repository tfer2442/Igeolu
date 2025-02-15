// src/components/common/Chat/ChatMessage/ChatMessage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import defaultProfile from '../../../../assets/images/testprofile.jpg';
import LiveControllerApi from '../../../../services/LiveControllerApi';
import './ChatMessage.css';

const ChatMessage = ({
  message,
  isCurrentUser,
  userProfile = {
    userName: '',
    profileUrl: ''
  }
}) => {
  const navigate = useNavigate(); // useNavigate 추가
  const { content, createdAt, senderType } = message;
  const messageTime = format(new Date(message.createdAt), 'HH:mm');
  const isSystemMessage = senderType === "SYSTEM";

  const handleJoinLive = async (sessionId) => {
    try {
      const response = await LiveControllerApi.joinLive(sessionId);
      navigate('/live', {
        state: {
          sessionId: response.sessionId,
          token: response.token,
          liveUrl: response.liveUrl,
          role: 'viewer',
        },
      });
    } catch (error) {
      console.error('라이브 참여 실패:', error);
      // 에러 처리 (필요한 경우 사용자에게 알림)
    }
  };

  const renderContent = () => {
    if (message.senderType === 'SYSTEM' && message.content.includes('세션 ID:')) {
      const sessionId = message.content.match(/세션 ID: (.*)/)[1];
      return (
        <div>
          <p>라이브 방송이 시작되었습니다!</p>
          <button 
            className="live-join-button"
            onClick={() => handleJoinLive(sessionId)}
          >
            방송 참여하기
          </button>
        </div>
      );
    }
    return message.content;
  };

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
          <div className={`message-text ${isSystemMessage ? 'system-text' : ''}`}>
            {renderContent()}
          </div>
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