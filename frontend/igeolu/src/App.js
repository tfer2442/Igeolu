// src/App.js
import './styles/global.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// === 1. Component Imports ===
// Desktop Pages
import DesktopLive from './pages/DesktopLivePage/DesktopLive';
import DesktopLiveJoinPage from './pages/DesktopLiveJoinPage/DesktopLiveJoinPage';
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
import ChatRoomsWebSocket from './services/webSocket/chatRoomsWebSocket';
import ChatApi from './services/ChatApi';
import Map from './pages/MapPage/MapPage';
import NotificationProvider from './components/NotificationProvider/NotificationProvider';
import {UserProvider} from './contexts/UserContext'

// ------------- 개발용 유저 변경 버튼 ------------------
import DevUserToggle from './components/DEVUSERTOGGLE';
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
  const isDesktopHomePage = location.pathname === '/';
  const isDesktopMyPage = location.pathname === '/my-page';

  const isMobileChatRoute = location.pathname.startsWith('/mobile-chat');

  // === 4. User Authentication (Development Mode) ===

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const devUser = savedUser
      ? JSON.parse(savedUser)
      : { userId: 35, role: 'member' };
    setUser(devUser);
    setIsUserInitialized(true);

    setIsAppMounted(true);
    return () => setIsAppMounted(false);
  }, []);

  const handleDevUserChange = (newUser) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser)); // localStorage도 업데이트
  };

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

  const updateChatRoomInfo = useCallback(
    async (roomId) => {
      try {
        // 전체 채팅방 목록을 새로 불러옵니다
        const updatedRooms = await ChatApi.getChatRooms(user.userId);
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
        const rooms = await ChatApi.getChatRooms(user.userId);
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
    if (!user?.userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await ChatApi.getChatRooms(user.userId);
      setChatRooms(response);
    } catch (error) {
      setError('채팅방 목록을 불러오는데 실패했습니다.');
      console.error('채팅방 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

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
    if (isDesktopHomePage || isDesktopMyPage)
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
          onInitialized={() => {
            // console.log('🔄 App.js: 알림 초기화 완료, 채팅 WebSocket 연결 시작');
            setIsNotificationInitialized(true);
          }}
        >
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* <DevUserToggle onUserChange={handleDevUserChange} /> */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          {/* ------------------------------ 개발용 유저 변경(이진형/오승우) --------------------------- */}
          <Routes>
            <Route path='/' element={<DesktopHome />} />
            <Route path='/login' element={<DesktopLogin />} />
            <Route 
              path='/live' 
              element={<DesktopLive onLoginSigninClick={handleLoginClick} />} 
            />
            <Route 
              path='/live-join' 
              element={<DesktopLiveJoinPage onLoginSigninClick={handleLoginClick} />} 
            />
            <Route 
              path='/map' 
              element={<Map onLoginSigninClick={handleLoginClick} />} 
            />
            <Route 
              path='/mypage' 
              element={<DesktopMyPage onLoginSigninClick={handleLoginClick} />} 
            />

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
        </NotificationProvider>
      </UserProvider>
    </div>
  );
}

export default App;
