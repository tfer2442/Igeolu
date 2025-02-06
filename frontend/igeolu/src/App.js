// src/App.js
import './styles/global.css'
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import DesktopLive from './pages/DesktopLivePage/DesktopLive'
import DesktopHome from './pages/DesktopHomePage/DesktopHome'
import DesktopLogin from './pages/DesktopLoginPage/DesktopLoginPage'
import Make from './pages/MobileLivePage/Make'
import MobileMainPage from './pages/MobileMainPage/MobileMainPage'
import MobileCalendarPage from './pages/MobileCalendarPage/MobileCalendarPage'
import MobileMyPage from './pages/MobileMyPage/MobileMyPage'
import MobileLivePage from './pages/MobileLivePage/MobileLivePage'
import axios from 'axios';

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

  

  // Hooks
  const location = useLocation();
  const isMobileChatRoute = location.pathname.startsWith('/mobile-chat');
  const isMobileMainRoute = location.pathname.startsWith('/mobile-main');
  const isMobileCalendarRoute = location.pathname.startsWith('/mobile-calendar');
  const isMobileMyPageRoute = location.pathname.startsWith('/mobile-my-page');
  const isMobileLiveRoute = location.pathname.startsWith('/mobile-live');

  // 유저 정보 받아오는 부분
  const [user, setUser] = useState(null); // 로그인 상태 저장

  useEffect(() => {
    console.log("유저 정보 받아옵니당.")
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
        setUser(JSON.parse(cachedUser)); // 캐시된 데이터로 상태 업데이트
    }

    if (!cachedUser || cachedUser === "null" || cachedUser === "undefined") {
      console.warn("로그인된 사용자가 없습니다.");
      localStorage.removeItem("user"); // 잘못된 데이터 삭제
      return;
  }
  
  const parsedUser = JSON.parse(cachedUser);
  
  if (!parsedUser.userId) {  // userId 값이 없으면 로그인이 되지 않은 상태
      console.warn("유효하지 않은 사용자 데이터입니다.");
      localStorage.removeItem("user");
      return;
  }

    // 백엔드에서 로그인 상태 확인
    
    

    fetch("https://i12d205.p.ssafy.io/api/users/me", {
        method: "GET",
        credentials: "include",
        withCredentials: true
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.userId) {
          console.log("니아이디", data.userID);
            console.log("니 역할", data.role);
            setUser({ userId: data.userId, role: data.role });
            localStorage.setItem("user", JSON.stringify({ userId: data.userId, role: data.role })); // 캐싱
            console.log("니아이디", data.userID);
            console.log("니 역할", data.role);
        } else {
            localStorage.removeItem("user"); // 로그아웃되었으면 캐시 삭제
            setUser(null);
        }
    })
    .catch((err) => console.error("Error fetching user:", err));
}, []);

const currentUserId= user?.userId || null;

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
  }, [currentUserId]);

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
        <Route path="/login" element={<DesktopLogin />} />
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
