// components/common/Chat/ChatModal/ChatModal.jsx
import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import ChatRoomList from '../ChatRoomList/ChatRoomList';
import './ChatModal.css';
import ChatRoomsWebSocket from '../../../../services/webSocket/chatRoomsWebSocket';

/**
 * 📌 ChatModal 컴포넌트
 * - 채팅방 목록을 모달 형식으로 표시
 * - WebSocket 연결은 App 컴포넌트에서 관리
 * - 채팅방을 선택하면 `onSelectChatRoom` 콜백 실행
 */
  const ChatModal = ({ isModalOpen, onSelectChatRoom, onClose, chatRooms, isLoading, error, onRetry, currentUserId }) => {
    const roomsSocketRef = useRef(null);
  
    useEffect(() => {
      if (!isModalOpen || !currentUserId) return;
      console.log("testetetsetsetses")
  
      const initializeChatList = async () => {
        if (roomsSocketRef.current?.isConnected) return;
  
        try {
          roomsSocketRef.current = new ChatRoomsWebSocket(
            currentUserId,
            async () => {
              // 새 메시지 수신 시 채팅방 목록 갱신
              onRetry(); // 기존의 fetchChatRooms 함수 재사용
            }
          );
  
          await roomsSocketRef.current.connect();
          roomsSocketRef.current.subscribeToChatRooms(chatRooms);
        } catch (error) {
          console.error('ChatModal WebSocket 초기화 실패:', error);
        }
      };
  
      initializeChatList();
  
      // Cleanup
      return () => {
        if (roomsSocketRef.current) {
          roomsSocketRef.current.disconnect();
          roomsSocketRef.current = null;
        }
      };
    }, [isModalOpen, currentUserId, chatRooms, onRetry]);



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