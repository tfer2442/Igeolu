// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Page Components
import Home from './pages/DesktopHomePage/DesktopHome';
import MobileChatList from './pages/MobileChatListPage/MobileChatListPage';
import MobileChatRoom from './pages/MobileChatRoomPage/MobileChatRoomPage';

// Common Components
import ChatButton from './components/common/Button/ChatButton/ChatButton';
import ChatModal from './components/common/Chat/ChatModal/ChatModal';
import ChatRoom from './components/common/Chat/ChatRoom/ChatRoom';
import SlideLayout from './components/common/Chat/SlideLayout/SlideLayout';

// Services
import chatApi from './services/chatApi';

function App() {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 추가
  const [error, setError] = useState(null);          // 에러 상태 추가

  // TEST_USER_ID를 props나 context로 관리하도록 변경
  const [currentUserId, setCurrentUserId] = useState(5); // 기본값 5

  // 유저 전환을 위한 토글 버튼 추가
  const toggleUser = () => {
    setCurrentUserId(prevId => prevId === 5 ? 1 : 5);
  };


  // Hooks
  const location = useLocation();
  const isMobileChatRoute = location.pathname.startsWith('/m/chat');

  // API Calls
  const fetchChatRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await chatApi.getChatRooms(currentUserId);
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
              currentUserId={currentUserId} // props 추가
            />
          ) : (
            <ChatRoom room={selectedRoom} onBack={handleBack} currentUserId={currentUserId} />  // props 추가
          )}
        </SlideLayout>
      </>
    );
  };

  return (
    <div className='App'>
      {/* 유저 전환 버튼 추가 */}
      <button onClick={toggleUser}>
          현재 사용자: {currentUserId === 5 ? "사용자 5" : "사용자 1"}로 전환
      </button>

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
              currentUserId={currentUserId} // props 추가
            />
          }
        />
        <Route 
          path="/m/chat/:roomId" 
          element={<MobileChatRoom currentUserId={currentUserId} />} 
        />
      </Routes>
      {!isMobileChatRoute && renderChatInterface()}
    </div>
  );
}

export default App;