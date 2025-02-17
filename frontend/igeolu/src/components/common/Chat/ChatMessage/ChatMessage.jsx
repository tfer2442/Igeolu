// src/components/common/Chat/ChatMessage/ChatMessage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import defaultProfile from '../../../../assets/images/testprofile.jpg';
import LiveControllerApi from '../../../../services/LiveControllerApi';
import './ChatMessage.css';
import { Copy, Video } from 'lucide-react';

const ChatMessage = ({
  message,
  isCurrentUser,
  userProfile = {
    userName: '',
    profileUrl: '',
  },
}) => {
  const navigate = useNavigate(); // useNavigate 추가
  const [copyText, setCopyText] = useState('세션 ID'); // 상위 레벨로 이동
  const [isCopied, setIsCopied] = useState(false);
  const { content, createdAt, senderType } = message;
  const messageTime = format(new Date(message.createdAt), 'HH:mm');
  const isSystemMessage = senderType === 'SYSTEM';

  const handleCopy = async (sessionId) => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setIsCopied(true);
      setCopyText('복사됨!');

      // 2초 후에 버튼 상태 복원
      setTimeout(() => {
        setIsCopied(false);
        setCopyText('세션 ID');
      }, 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

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
    if (message.senderType === 'SYSTEM') {
      if (message.content.includes('세션 ID:')) {
        const sessionId = message.content.match(/세션 ID: (.*)/)[1];
        return (
          <div data-type='live' className='live-message'>
            <p>라이브 방송이 시작됐어요!</p>
            <div className='live-buttons'>
              <button
                className={`copy-button ${isCopied ? 'copied' : ''}`}
                onClick={() => handleCopy(sessionId)}
              >
                <Copy className='copy-icon' size={14} />
                {copyText}
              </button>
              <button
                className='live-join-button'
                onClick={() => handleJoinLive(sessionId)}
              >
                <Video className='video-icon' size={14} />
                방송 참여하기
              </button>
            </div>
          </div>
        );
      } else if (message.content.includes('새로운 약속')) {
        return <div data-type='schedule'>{message.content}</div>;
      }
    }
    return message.content;
  };

  return (
    <div
      className={`message-wrapper ${isCurrentUser ? 'sent' : 'received'} ${isSystemMessage ? 'system' : ''}`}
    >
      {/* 시스템 메시지 */}
      {isSystemMessage && (
        <div className='message-content system-content'>
          <div className='message-bubble system-bubble'>
            <div className='system-message-header'>알림 메세지</div>
            <div className='message-text system-text'>{renderContent()}</div>
          </div>
          <span className='message-time'>{messageTime}</span>
        </div>
      )}

      {/* 받은 메시지 */}
      {!isCurrentUser && !isSystemMessage && (
        <div className='message-profile-container'>
          <div className='message-profile'>
            {userProfile?.profileUrl ? (
              <img
                src={userProfile.profileUrl}
                alt={`${userProfile.userName} 프로필`}
                className='profile-image'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultProfile;
                }}
              />
            ) : (
              <div className='profile-placeholder'>
                {userProfile?.userName?.charAt(0)}
              </div>
            )}
          </div>
          <div className='message-user-content'>
            <span className='profile-name'>{userProfile?.userName}</span>
            <div className='message-content'>
              <div className='message-bubble'>
                <div className='message-text'>{renderContent()}</div>
              </div>
              <span className='message-time'>{messageTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* 보낸 메시지 */}
      {isCurrentUser && !isSystemMessage && (
        <div className='message-content'>
          <div className='message-bubble'>
            <div className='message-text'>{renderContent()}</div>
          </div>
          <span className='message-time'>{messageTime}</span>
        </div>
      )}
    </div>
  );
};

// PropTypes는 그대로 유지
ChatMessage.propTypes = {
  message: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    senderType: PropTypes.oneOf(['USER', 'SYSTEM']).isRequired,
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  userProfile: PropTypes.shape({
    userName: PropTypes.string,
    profileUrl: PropTypes.string,
  }),
};

export default ChatMessage;
