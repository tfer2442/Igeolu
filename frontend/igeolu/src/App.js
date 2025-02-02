// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Page Components
import Home from './pages/Home/Home';
import MobileChatList from './pages/Mobile/MobileChatList';
import MobileChatRoom from './pages/Mobile/MobileChatRoom';

// Common Components
import ChatButton from './components/common/Button/ChatButton/ChatButton';
import ChatModal from './components/common/Chat/ChatModal/ChatModal';
import ChatRoom from './components/common/Chat/ChatRoom/ChatRoom';
import SlideLayout from './components/common/Chat/SlideLayout/SlideLayout';

// Services
import chatApi from './services/chatApi';

// Constants (나중에 constants 파일로 분리)
const TEST_USER_ID = 123456;

function App() {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 추가
  const [error, setError] = useState(null);          // 에러 상태 추가

  // Hooks
  const location = useLocation();
  const isMobileChatRoute = location.pathname.startsWith('/m/chat');

  // API Calls
  const fetchChatRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await chatApi.getChatRooms(TEST_USER_ID);
      setChatRooms(response);
    } catch (error) {
      setError('채팅방 목록을 불러오는데 실패했습니다.');
      console.error('채팅방 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []); // TEST_USER_ID가 상수이므로 의존성이 필요 없음

  const initializeChatRooms = useCallback(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  useEffect(() => {
    initializeChatRooms();
  }, [initializeChatRooms]);

  // Event Handlers
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  const handleBack = () => {
    setSelectedRoom(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedRoom(null);
  };

  // Render Methods
  const renderChatInterface = () => {
    if (isMobileChatRoute) return null;

    return (
      <>
        <ChatButton onClick={handleToggleChat} />
        <SlideLayout isOpen={isOpen} onClose={handleClose}>
          {!selectedRoom ? (
            <ChatModal
              chatRooms={chatRooms}
              onSelectChatRoom={handleSelectRoom}
              onClose={handleClose}
              isModalOpen={isOpen}
            />
          ) : (
            <ChatRoom room={selectedRoom} onBack={handleBack} />
          )}
        </SlideLayout>
      </>
    );
  };

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/m/chat'
          element={
            <MobileChatList 
              chatRooms={chatRooms} 
              isLoading={isLoading}
              error={error}
              onRetry={fetchChatRooms}
            />
          }
        />
        <Route 
          path="/m/chat/:roomId" 
          element={<MobileChatRoom />} 
        />
      </Routes>
      {!isMobileChatRoute && renderChatInterface()}
    </div>
  );
}

export default App;