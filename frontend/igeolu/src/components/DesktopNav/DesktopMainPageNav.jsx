import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import defaultProfile from '../../assets/images/defaultProfileImageIMSI.png';
import UserControllerApi from '../../services/UserControllerApi';
import NotificationApi from '../../services/NotificationApi';
import NotificationWebSocket from '../../services/webSocket/NotificationWebSocket';

const NAV_ITEMS = [
  { id: 1, title: '방찾기', path: '/map?type=room' },
  { id: 2, title: '공인중개사', path: '/map?type=agent' },
  { id: 3, title: '라이브', path: '/live-join' },
];

function DesktopMainPageNav() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationSocketRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      const fetchUserInfo = async () => {
        try {
          const response = await UserControllerApi.getUserInfo(parsedUser.userId);
          if (response.imageUrl) {
            setProfileImage(response.imageUrl);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
  
      fetchUserInfo();
    }
  }, []);

  // 실시간 알림 처리 함수
  const handleNewNotification = (notification) => {
    console.log('🔔 새로운 알림 도착:', notification);
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // WebSocket 연결 설정
  useEffect(() => {
    if (!user?.userId) return;

    const initializeWebSocket = async () => {
      try {
        console.log('🔄 알림 WebSocket 연결 시도...');
        if (!notificationSocketRef.current) {
          notificationSocketRef.current = new NotificationWebSocket(
            user.userId,
            handleNewNotification
          );
          await notificationSocketRef.current.connect();
          console.log('✅ WebSocket 연결 성공');
          notificationSocketRef.current.subscribe();
          console.log('✅ 알림 구독 완료');
        }
      } catch (error) {
        console.error('❌ WebSocket 초기화 실패:', error);
      }
    };

    initializeWebSocket();

    return () => {
      if (notificationSocketRef.current) {
        console.log('🔄 WebSocket 연결 해제');
        notificationSocketRef.current.disconnect();
        notificationSocketRef.current = null;
      }
    };
  }, [user?.userId]);

  // 알림 목록 조회
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationList = await NotificationApi.getNotifications();
        setNotifications(notificationList);
        const unreadNotifications = notificationList.filter(notification => !notification.isRead);
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error('알림 목록 조회 실패:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleNotificationClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    setIsNotificationModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('user');
    setUser(null);
    setProfileImage(defaultProfile);
    window.location.href = 'https://i12d205.p.ssafy.io/api/logout';
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNotificationRead = async (notificationId) => {
    try {
      await NotificationApi.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  return (
    <nav className='desktop-main-nav'>
      <div className='desktop-main-nav__left-logo'>
        <Link to='/'>
          <img src={logo} alt='logo' />
        </Link>
      </div>

      <div className='desktop-main-nav__middle-links'>
        {NAV_ITEMS.map((item) => (
          <Link to={item.path} key={item.id}>
            {item.title}
          </Link>
        ))}
      </div>

      <div className='desktop-main-nav__right-login'>
        {user ? (
          <div className='profile-container'>
            <button className='profile-button' onClick={handleProfileClick}>
              <img src={profileImage} alt='profile' />
              {unreadCount > 0 && (
                <span className='notification-badge'>{unreadCount}</span>
              )}
            </button>

            {isDropdownOpen && (
              <div className='dropdown-menu'>
                <Link to='/desktop-my-page' onClick={closeDropdown}>
                  마이페이지
                </Link>
                <button onClick={handleNotificationClick}>
                  알림
                  {unreadCount > 0 && (
                    <span className='dropdown-notification-badge'>{unreadCount}</span>
                  )}
                </button>
                <button onClick={handleLogoutClick}>로그아웃</button>
              </div>
            )}

            {isLogoutModalOpen && (
              <div className='logout-modal'>
                <div className='logout-modal-content'>
                  <h3>로그아웃 확인</h3>
                  <p>정말 로그아웃 하시겠습니까?</p>
                  <div className='modal-buttons'>
                    <button onClick={handleLogoutConfirm}>예</button>
                    <button onClick={closeLogoutModal}>아니오</button>
                  </div>
                </div>
              </div>
            )}

            {isNotificationModalOpen && (
              <div className='notification-modal'>
                <div className='notification-modal-content'>
                  <div className='notification-header'>
                    <h3>알림</h3>
                    <button onClick={closeNotificationModal} className='close-button'>×</button>
                  </div>
                  <div className='notification-list'>
                    {notifications.length === 0 ? (
                      <div className='no-notifications'>
                        새로운 알림이 없습니다
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.notificationId}
                          className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                          onClick={() => handleNotificationRead(notification.notificationId)}
                        >
                          <p className='notification-message'>{notification.message}</p>
                          <p className='notification-date'>{formatDate(notification.createdAt)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to='/login' className='desktop-main-nav__login-signin-btn'>
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}

export default DesktopMainPageNav;