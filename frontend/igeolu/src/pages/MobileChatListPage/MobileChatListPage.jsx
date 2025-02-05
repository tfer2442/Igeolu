// pages/MobileChatListPage/MobileChatListPage.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ChatRoomList from '../../components/common/Chat/ChatRoomList/ChatRoomList';
import './MobileChatListPage.css';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab'

const MobileChatList = ({ chatRooms, isLoading, error, onRetry }) => {
  const navigate = useNavigate();

  const handleSelectRoom = (room) => {
    navigate(`/mobile-chat/${room.roomId}`);
  };

  return (
    <div className="mobile-chat-list-page-container">
    <div className="mobile-chat-list">
      <header className="mobile-header">
        <h1 className="mobile-title">채팅</h1>
      </header>
      
      <div className="mobile-chat-content">
        {isLoading ? (
          <div className="mobile-loading-state">
            로딩 중...
          </div>
        ) : error ? (
          <div className="mobile-error-state">
            <p>{error}</p>
            <button onClick={onRetry} className="retry-button">
              다시 시도
            </button>
          </div>
        ) : chatRooms.length === 0 ? (
          <div className="mobile-empty-state">
            아직 채팅방이 없습니다.
          </div>
        ) : (
          <ChatRoomList rooms={chatRooms} onSelectRoom={handleSelectRoom} isMobile={true} />
        )}
      </div>
      <MobileBottomTab/>
    </div>
    </div>
  );
};

MobileChatList.propTypes = {
  chatRooms: PropTypes.arrayOf(
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
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired
};

export default MobileChatList;