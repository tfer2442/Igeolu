// src/App.js
import './styles/global.css'
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import DesktopLive from './pages/DesktopLivePage/DesktopLive'
import DesktopHome from './pages/DesktopHomePage/DesktopHome'
import Make from './pages/MobileLivePage/Make'
import MobileMainPage from './pages/MobileMainPage/MobileMainPage'
import MobileCalendarPage from './pages/MobileCalendarPage/MobileCalendarPage'
import MobileMyPage from './pages/MobileMyPage/MobileMyPage'
import MobileLivePage from './pages/MobileLivePage/MobileLivePage'

// Page Components
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
  const isMobileChatRoute = location.pathname.startsWith('/mobile-chat');
  const isMobileMainRoute = location.pathname.startsWith('/mobile-main');
  const isMobileCalendarRoute = location.pathname.startsWith('/mobile-calendar');
  const isMobileMyPageRoute = location.pathname.startsWith('/mobile-my-page');
  const isMobileLiveRoute = location.pathname.startsWith('/mobile-live');

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
    if (isMobileMainRoute) return null;
    if (isMobileCalendarRoute) return null;
    if (isMobileMyPageRoute) return null;
    if (isMobileLiveRoute) return null;

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
      <Routes>
        <Route path="/" element={<DesktopHome />} />
        <Route path="/live" element={<DesktopLive />} />
        <Route path="/make" element={<Make />} />
        <Route path="/mobile-main" element={<MobileMainPage />} />
        <Route path="/mobile-calendar" element={<MobileCalendarPage />} />
        <Route path="/mobile-my-page" element={<MobileMyPage />} />
        <Route path="/mobile-live" element={<MobileLivePage />} />
        <Route
          path='/mobile-chat'
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
          path="/mobile-chat/:roomId" 
          element={<MobileChatRoom currentUserId={currentUserId} />} 
        />
      </Routes>
      {!isMobileChatRoute && renderChatInterface()}
    </div>
  );
}

export default App;
