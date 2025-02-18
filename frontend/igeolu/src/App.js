// src/App.js
import './styles/global.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PrivateRoute, AuthRoute } from './components/auth/AuthRoutes';

// === 1. Component Imports ===

// Default Page
import DefaultPage from './pages/DefaultPage/DefaultPage';

// Desktop Pages
import DesktopLive from './pages/DesktopLivePage/DesktopLive';
import DesktopLiveJoinPage from './pages/DesktopLiveJoinPage/DesktopLiveJoinPage';
import DesktopHome from './pages/DesktopHomePage/DesktopHome';
import DesktopLogin from './pages/DesktopLoginPage/DesktopLoginPage';
import DesktopRoomSearchPage from './pages/DesktopRoomSearchPage/DesktopRoomSearchPage';
import DesktopMyPage from './pages/DesktopMyPage/DesktopMyPage';

// Mobile Pages
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
import MobileMyPageEdit from './pages/MobileMyPageEdit/MobileMyPageEdit';

// Common Components
import ChatButton from './components/common/Button/ChatButton/ChatButton';
import ChatModal from './components/common/Chat/ChatModal/ChatModal';
import ChatRoom from './components/common/Chat/ChatRoom/ChatRoom';
import SlideLayout from './components/common/Chat/SlideLayout/SlideLayout';

// Services
import ChatRoomsWebSocket from './services/webSocket/chatRoomsWebSocket';
import ChatApi from './services/ChatApi';
import Map from './pages/MapPage/MapPage';
import NotificationProvider from './components/NotificationProvider/NotificationProvider';
import { UserProvider } from './contexts/UserContext';

// ------------- 개발용 유저 변경 버튼 ------------------
// import DevUserToggle from './components/DEVUSERTOGGLE';
// ------------- 개발용 유저 변경 버튼 ------------------

function App() {
  // === 2. State Management ===
  // Chat States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserInitialized, setIsUserInitialized] = useState(false);
  const roomsSocketRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isAppMounted, setIsAppMounted] = useState(false);
  const [isNotificationInitialized, setIsNotificationInitialized] =
    useState(false);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);

  // === 3. Route Management ===
  const location = useLocation();
  const isDesktopHomePage = location.pathname === '/desktop-main';
  const isDesktopMapPage = location.pathname === '/map';
  const isDesktopMyPage = location.pathname === '/my-page';

  const isMobileChatRoute = location.pathname.startsWith('/mobile-chat');

  // === 4. User Authentication (Development Mode) ===

  // useEffect(() => {
  //   const savedUser = localStorage.getItem('user');
  //   const devUser = savedUser
  //     ? JSON.parse(savedUser)
  //     : { userId: 35, role: 'member' };
  //   setUser(devUser);
  //   setIsUserInitialized(true);

  //   setIsAppMounted(true);
  //   return () => setIsAppMounted(false);
  // }, []);

  // const currentUserId = user?.userId || null;

  // === 4. User Authentication ===
  useEffect(() => {
    const handleUserAuthentication = async () => {
      try {
        setIsAppMounted(true);
        const response = await fetch(
          'https://i12d205.p.ssafy.io/api/users/me',
          {
            method: 'GET',
            credentials: 'include',
            withCredentials: true,
          }
        );

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();

        if (data.userId) {
          setUser({ userId: data.userId, role: data.role });
          localStorage.setItem(
            'user',
            JSON.stringify({
              userId: data.userId,
              role: data.role,
            })
          );
          setIsUserInitialized(true);
        } else {
          localStorage.removeItem('user');
          setUser(null);
          setIsUserInitialized(true);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('user');
        setUser(null);
        setIsUserInitialized(true);
      }
    };

    handleUserAuthentication();
    return () => setIsAppMounted(false);
  }, []);

  const currentUserId = user?.userId || null;

  // === 5. Chat Room Management ===

  const updateChatRoomInfo = useCallback(
    async (roomId) => {
      try {
        // 전체 채팅방 목록을 새로 불러옵니다
        const updatedRooms = await ChatApi.getChatRooms(user.userId, user.role);
        setChatRooms(updatedRooms);
      } catch (error) {
        console.error('채팅방 정보 업데이트 실패:', error);
      }
    },
    [user?.userId]
  );

  const handleRoomsUpdate = useCallback((updatedRooms) => {
    setChatRooms((prev) => {
      const mergedRooms = [...prev];
      updatedRooms.forEach((newRoom) => {
        const index = mergedRooms.findIndex((r) => r.roomId === newRoom.roomId);
        if (index > -1) {
          mergedRooms[index] = { ...mergedRooms[index], ...newRoom };
        } else {
          mergedRooms.unshift(newRoom);
        }
      });
      return mergedRooms;
    });
  }, []);

  // WebSocket 연결 관리
  useEffect(() => {
    if (
      !isAppMounted ||
      !isUserInitialized ||
      !user?.userId ||
      !isNotificationInitialized
    )
      return;

    const initializeWebSocket = async () => {
      if (roomsSocketRef.current?.isConnected) return;

      try {
        // 1. 먼저 채팅방 목록을 가져옴
        const rooms = await ChatApi.getChatRooms(user.userId, user.role);
        setChatRooms(rooms);

        // 2. WebSocket 연결 및 모든 채팅방 구독
        roomsSocketRef.current = new ChatRoomsWebSocket(
          user.userId,
          async () => {
            // 새 메시지 수신 시 채팅방 목록 갱신
            const updatedRooms = await ChatApi.getChatRooms(user.userId);
            setChatRooms(updatedRooms);
          }
        );

        // 3. WebSocket 연결
        await roomsSocketRef.current.connect();

        // 4. 모든 채팅방 구독
        roomsSocketRef.current.subscribeToChatRooms(rooms);

        console.log('WebSocket 초기화 및 채팅방 구독 완료');
      } catch (error) {
        console.error('WebSocket 초기화 실패:', error);
        setError('실시간 업데이트 연결에 실패했습니다.');
      }
    };

    initializeWebSocket();
  }, [user?.userId, isUserInitialized, isNotificationInitialized]);

  // 채팅방 목록 초기 로드
  const fetchChatRooms = useCallback(async () => {
    if (!user?.userId || !user?.role) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await ChatApi.getChatRooms(user.userId, user.role); // role 전달
      setChatRooms(response);
    } catch (error) {
      setError('채팅방 목록을 불러오는데 실패했습니다.');
      console.error('채팅방 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId, user?.role]);

  useEffect(() => {
    if (isUserInitialized && user?.userId) {
      fetchChatRooms();
    }
  }, [isUserInitialized, user?.userId, fetchChatRooms]);

  // === 6. Event Handlers ===
  const handleToggleChat = () => setIsOpen(!isOpen);
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setActiveRoomId(room.roomId);
    setIsChatRoomOpen(true); // 채팅방 열기
  };
  const handleBack = () => {
    console.log('----------너 동작하니?');
    setSelectedRoom(null);
    setActiveRoomId(null);
    setIsChatRoomOpen(false); // 채팅방 닫기
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedRoom(null);
    setActiveRoomId(null);
    setIsChatRoomOpen(false); // 채팅방 닫기
  };

  useEffect(() => {
    console.log('activeRoomId 변경:', activeRoomId);
  }, [activeRoomId]);

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  // 로그아웃 핸들러에서 WebSocket 연결 해제
  const handleLogout = () => {
    if (roomsSocketRef.current) {
      roomsSocketRef.current.disconnect();
      roomsSocketRef.current = null;
    }
    // 로그아웃 관련 다른 처리들...
  };

  const chatModalProps = {
    isModalOpen: isOpen,
    onSelectChatRoom: handleSelectRoom,
    onClose: handleClose,
    currentUserId: user?.userId,
    chatRooms,
    isLoading,
    error,
    onRetry: fetchChatRooms,
  };

  // === 7. UI Rendering Methods ===
  const renderChatInterface = () => {
    if (isDesktopHomePage || isDesktopMyPage || isDesktopMapPage)
      return (
        <>
          <ChatButton onClick={handleToggleChat} />
          <SlideLayout isOpen={isOpen} onClose={handleClose}>
            {!selectedRoom ? (
              <ChatModal {...chatModalProps} />
            ) : (
              <ChatRoom
                room={selectedRoom}
                onBack={handleBack}
                currentUserId={user?.userId}
                activeRoomId={activeRoomId}
                onRoomUpdate={updateChatRoomInfo}
                isChatRoomOpen={isChatRoomOpen}
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
      <UserProvider>
        <NotificationProvider
          user={user}
          onInitialized={() => setIsNotificationInitialized(true)}
        >
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* <DevUserToggle onUserChange={handleDevUserChange} /> */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          <Routes>
            {/* 공용 라우트 */}
            <Route path='/' element={<DefaultPage />} />

            {/* 인증이 필요한 데스크톱 라우트 */}
            <Route
              path='/desktop-main'
              element={
                <PrivateRoute user={user}>
                  <DesktopHome />
                </PrivateRoute>
              }
            />
            <Route
              path='/map'
              element={
                <PrivateRoute user={user}>
                  <Map
                    onLoginSigninClick={handleLoginClick}
                    setIsOpen={setIsOpen}
                    setSelectedRoom={setSelectedRoom}
                    setChatRooms={setChatRooms}
                    currentUserId={currentUserId}
                    userRole={user?.role}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path='/mypage'
              element={
                <PrivateRoute user={user}>
                  <DesktopMyPage onLoginSigninClick={handleLoginClick} />
                </PrivateRoute>
              }
            />
            <Route
              path='/live'
              element={
                <PrivateRoute user={user}>
                  <DesktopLive onLoginSigninClick={handleLoginClick} />
                </PrivateRoute>
              }
            />
            <Route
              path='/live-join'
              element={
                <PrivateRoute user={user}>
                  <DesktopLiveJoinPage onLoginSigninClick={handleLoginClick} />
                </PrivateRoute>
              }
            />

            {/* 인증이 필요한 모바일 라우트 */}
            <Route
              path='/mobile-main'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileMainPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/mobile-calendar'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileCalendarPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/mobile-my-page'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileMyPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/mobile-my-page-edit'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileMyPageEdit />
                </PrivateRoute>
              }
            />
            <Route
              path='/mobile-live'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileLivePage />
                </PrivateRoute>
              }
            />
            <Route
              path='/mobile-edit'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileEditPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/mobile-estate-list'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileEstateList />
                </PrivateRoute>
              }
            />
            <Route
              path='/mobile-live-setting'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileLiveSettingPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/mobile-chat'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileChatList
                    chatRooms={chatRooms}
                    isLoading={isLoading}
                    error={error}
                    onRetry={fetchChatRooms}
                    currentUserId={currentUserId}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path='/mobile-chat/:roomId'
              element={
                <PrivateRoute user={user} isMobile>
                  <MobileChatRoom currentUserId={currentUserId} />
                </PrivateRoute>
              }
            />

            {/* 로그인 라우트 */}
            <Route
              path='/login'
              element={
                <AuthRoute user={user}>
                  <DesktopLogin />
                </AuthRoute>
              }
            />
            <Route
              path='/mobile-login'
              element={
                <AuthRoute user={user} isMobile>
                  <MobileLoginPage />
                </AuthRoute>
              }
            />
            <Route
              path='/mobile-register'
              element={
                <AuthRoute user={user} isMobile>
                  <MobileRegisterPage />
                </AuthRoute>
              }
            />
            <Route
              path='/mobile-additional-info'
              element={
                <AuthRoute user={user} isMobile>
                  <MobileAdditionalInfoPage />
                </AuthRoute>
              }
            />
          </Routes>
          {!isMobileChatRoute && renderChatInterface()}
        </NotificationProvider>
      </UserProvider>
    </div>
  );
}

export default App;
