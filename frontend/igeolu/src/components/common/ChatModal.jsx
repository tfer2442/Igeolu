import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import chatApi from '../../services/chatApi';
import ChatRoomList from './ChatRoomList/ChatRoomList';
import './ChatModal.css';

const ChatModal = ({ isModalOpen, onSelectChatRoom}) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 실제 환경에서는 로그인된 사용자의 ID를 사용
  const TEST_USER_ID = 123456;

  const fetchChatRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await chatApi.getChatRooms(TEST_USER_ID);
      setChatRooms(response);
    } catch (error) {
      setError('채팅방 목록을 불러오는데 실패했습니다.');
      console.error('채팅방 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchChatRooms();
    }
  }, [isModalOpen]);

  return (
    <div className={`chat-modal ${isModalOpen ? 'active' : ''}`}>
      <header className="modal-header">
        <h1 className="modal-title">채팅방 목록</h1>
      </header>
      
      <div className="modal-content">
        {isLoading ? (
          <div className="loading-state">로딩 중...</div>
        ) : error ? (
          <div className="error-state">
            {error}
            <button onClick={fetchChatRooms} className="retry-button">
              다시 시도
            </button>
          </div>
        ) : chatRooms.length === 0 ? (
          <div className="empty-state">
            아직 채팅방이 없습니다.
          </div>
        ) : (
          <ChatRoomList 
            rooms={chatRooms} 
            onSelectRoom={onSelectChatRoom} 
          />
        )}
      </div>
    </div>
  );
};

ChatModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onSelectChatRoom: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatModal;