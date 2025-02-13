// components/common/Chat/ChatModal/ChatModal.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ChatRoomList from '../ChatRoomList/ChatRoomList';
import './ChatModal.css';

/**
 * 📌 ChatModal 컴포넌트
 * - 채팅방 목록을 모달 형식으로 표시
 * - WebSocket 연결은 App 컴포넌트에서 관리
 * - 채팅방을 선택하면 `onSelectChatRoom` 콜백 실행
 */
const ChatModal = ({
  isModalOpen,
  onSelectChatRoom,
  onClose,
  chatRooms,
  isLoading,
  error,
  onRetry
}) => {
  return (
    <div className={`chat-modal ${isModalOpen ? 'active' : ''}`}>
      {/* 📌 모달 헤더 */}
      <header className='chat-modal-header'>
        <h1 className='chat-modal-title'>채팅방 목록</h1>
        <button
          className='close-button'
          onClick={onClose}
          aria-label='채팅창 닫기'
        >
          ✕
        </button>
      </header>

      {/* 📌 모달 본문 */}
      <div className='chat-modal-content'>
        {isLoading ? (
          <div className='loading-state'>로딩 중...</div>
        ) : error ? (
          <div className='error-state'>
            {error}
            <button onClick={onRetry} className='retry-button'>
              다시 시도
            </button>
          </div>
        ) : chatRooms.length === 0 ? (
          <div className='empty-state'>아직 채팅방이 없습니다.</div>
        ) : (
          <ChatRoomList rooms={chatRooms} onSelectRoom={onSelectChatRoom} />
        )}
      </div>
    </div>
  );
};

/* 📌 PropTypes 설정 */
ChatModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onSelectChatRoom: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  chatRooms: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired
};

export default ChatModal;