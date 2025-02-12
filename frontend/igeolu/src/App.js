// src/App.js
import './styles/global.css';
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';

// === 1. Component Imports ===
// Desktop Pages
import DesktopLive from './pages/DesktopLivePage/DesktopLive';
import DesktopHome from './pages/DesktopHomePage/DesktopHome';
import DesktopLogin from './pages/DesktopLoginPage/DesktopLoginPage';
import DesktopRoomSearchPage from './pages/DesktopRoomSearchPage/DesktopRoomSearchPage';
import DesktopMyPage from './pages/DesktopMyPage/DesktopMyPage';

// Mobile Pages
import Make from './pages/MobileLivePage/Make';
import MobileMainPage from './pages/MobileMainPage/MobileMainPage';
import MobileCalendarPage from './pages/MobileCalendarPage/MobileCalendarPage';
import MobileMyPage from './pages/MobileMyPage/MobileMyPage';
import MobileLivePage from './pages/MobileLivePage/MobileLivePage';
import MobileChatList from './pages/MobileChatListPage/MobileChatListPage';
import MobileChatRoom from './pages/MobileChatRoomPage/MobileChatRoomPage';
import MobileLoginPage from './pages/MobileLoginPage/MobileLoginPage';
import MobileRegisterPage from './pages/MobileRegisterPage/MobileRegisterPage';
import MobileEditPage from './pages/MobileEditPage/MobileEditPage';
import MobileEstateList from './pages/MobileEstateList/MobileEstateList';
import MobileLiveSettingPage from './pages/MobileLiveSettingPage/MobileLiveSettingPage';
import MobileAdditionalInfoPage from './pages/MobileAdditionalInfoPage/MobileAdditionalInfo';

// Common Components
import ChatButton from './components/common/Button/ChatButton/ChatButton';
import ChatModal from './components/common/Chat/ChatModal/ChatModal';
import ChatRoom from './components/common/Chat/ChatRoom/ChatRoom';
import SlideLayout from './components/common/Chat/SlideLayout/SlideLayout';

// Services
import ChatApi from './services/ChatApi';
import Map from './pages/MapPage/MapPage';

function App() {
  // === 2. State Management ===
  // Chat States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserInitialized, setIsUserInitialized] = useState(false);

  // User States
  const [user, setUser] = useState(null);

  // === 3. Route Management ===
  const location = useLocation();
  const isDesktopHomePage = location.pathname === '/';
  const isDesktopMyPage = location.pathname === '/my-page';

  const isMobileChatRoute = location.pathname.startsWith('/mobile-chat');

  // === 4. User Authentication (Development Mode) ===
  useEffect(() => {
    const devUser = { userId: 33, role: 'realtor' }; // 오승우
    // const devUser = { userId: 35, role: 'member' }; // 이진형
    setUser(devUser);
    localStorage.setItem('user', JSON.stringify(devUser));
    setIsUserInitialized(true);
  }, []);

  const currentUserId = user?.userId || null;

  // === 4. User Authentication ===
  // useEffect(() => {
  //   const handleUserAuthentication = async () => {
  //     const cachedUser = localStorage.getItem('user');

  //     if (!cachedUser || cachedUser === 'null' || cachedUser === 'undefined') {
  //       console.warn('로그인된 사용자가 없습니다.');
  //       localStorage.removeItem('user');
  //       return;
  //     }

  //     const parsedUser = JSON.parse(cachedUser);
  //     if (!parsedUser.userId) {
  //       console.warn('유효하지 않은 사용자 데이터입니다.');
  //       localStorage.removeItem('user');
  //       return;
  //     }

  //     try {
  //       const response = await fetch(
  //         'https://i12d205.p.ssafy.io/api/users/me',
  //         {
  //           method: 'GET',
  //           credentials: 'include',
  //           withCredentials: true,
  //         }
  //       );
  //       const data = await response.json();

  //       if (data.userId) {
  //         setUser({ userId: data.userId, role: data.role });
  //         localStorage.setItem(
  //           'user',
  //           JSON.stringify({
  //             userId: data.userId,
  //             role: data.role,
  //           })
  //         );
  //       } else {
  //         localStorage.removeItem('user');
  //         setUser(null);
  //       }
  //     } catch (err) {
  //       console.error('Error fetching user:', err);
  //     }
  //   };

  //   handleUserAuthentication();
  // }, []);

  // const currentUserId = user?.userId || null;

  // === 5. Chat Room Management ===
  const fetchChatRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ChatApi.getChatRooms(currentUserId);
      setChatRooms(response);
    } catch (error) {
      setError('채팅방 목록을 불러오는데 실패했습니다.');
      console.error('채팅방 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (isUserInitialized) {
      fetchChatRooms();
    }
  }, [isUserInitialized, fetchChatRooms]);

  // === 6. Event Handlers ===
  const handleToggleChat = () => setIsOpen(!isOpen);
  const handleSelectRoom = (room) => setSelectedRoom(room);
  const handleBack = () => setSelectedRoom(null);
  const handleClose = async () => {
    if (selectedRoom) {
      try {
        await ChatApi.markMessagesAsRead(selectedRoom.roomId, currentUserId);
      } catch (error) {
        console.error('메시지 읽음 처리 실패:', error);
      }
    }
    setIsOpen(false);
    setSelectedRoom(null);
  };

  // === 7. UI Rendering Methods ===
  const renderChatInterface = () => {
    if (isDesktopHomePage || isDesktopMyPage)
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
                currentUserId={currentUserId}
              />
            ) : (
              <ChatRoom
                room={selectedRoom}
                onBack={handleBack}
                currentUserId={currentUserId}
              />
            )}
          </SlideLayout>
        </>
      );
    return null;
  };

  // === 8. Main Render ===
  return (
    <div className='App'>
      <Routes>
        {/* Desktop Routes */}
        <Route path='/' element={<DesktopHome />} />
        <Route path='/login' element={<DesktopLogin />} />
        <Route path='/live' element={<DesktopLive />} />
        <Route
          path='/desktop-room-search'
          element={<DesktopRoomSearchPage />}
        />
        <Route path='/map' element={<Map />}></Route>
        <Route path='/mypage' element={<DesktopMyPage />} />

        <Route path='/desktop-my-page' element={<DesktopMyPage />} />
        {/* Mobile Routes */}
        <Route path='/mobile-login' element={<MobileLoginPage />} />
        <Route
          path='/mobile-additional-info'
          element={<MobileAdditionalInfoPage />}
        />
        <Route path='/make' element={<Make />} />
        <Route path='/mobile-main' element={<MobileMainPage />} />
        <Route path='/mobile-calendar' element={<MobileCalendarPage />} />
        <Route path='/mobile-my-page' element={<MobileMyPage />} />
        <Route path='/mobile-live' element={<MobileLivePage />} />
        <Route path='/mobile-register' element={<MobileRegisterPage />} />
        <Route path='/mobile-edit' element={<MobileEditPage />} />
        <Route path='/mobile-estate-list' element={<MobileEstateList />} />
        <Route
          path='/mobile-live-setting'
          element={<MobileLiveSettingPage />}
        />
        <Route
          path='/mobile-chat'
          element={
            <MobileChatList
              chatRooms={chatRooms}
              isLoading={isLoading}
              error={error}
              onRetry={fetchChatRooms}
              currentUserId={currentUserId}
            />
          }
        />
        <Route
          path='/mobile-chat/:roomId'
          element={<MobileChatRoom currentUserId={currentUserId} />}
        />
      </Routes>
      {!isMobileChatRoute && renderChatInterface()}
    </div>
  );
}

export default App;
