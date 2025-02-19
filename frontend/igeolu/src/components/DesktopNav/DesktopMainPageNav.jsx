// src/components/DesktopNav/DesktopMainPageNav.jsx
import logo from '../../assets/images/logo.png';
import defaultProfile from '../../assets/images/defaultProfileImageIMSI.png';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './DesktopMainPageNav.css';
import UserControllerApi from '../../services/UserControllerApi';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationApi from '../../services/NotificationApi';
import { useUser } from '../../contexts/UserContext';

const NAV_ITEMS = [
  { id: 1, title: '방찾기', path: '/map?type=room' },
  { id: 2, title: '공인중개사', path: '/map?type=agent' },
  { id: 3, title: '라이브', path: '/live-join' },
];

function DesktopMainPageNav() {
  const { user, logout, isLoading } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const { notifications, unreadCount, markAsRead, updateNotifications } =
    useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // 알림 삭제 핸들러 추가
  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation(); // 상위 요소로의 이벤트 전파 방지
    try {
      await NotificationApi.deleteNotification(notificationId);
      // 삭제 후 알림 목록 갱신
      await updateNotifications();
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  // 알림 클릭 핸들러
  const handleNotificationClick = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  // 알림 드롭다운 토글 핸들러 (새로운 기능)
const toggleNotification = () => {
  setIsNotificationOpen(!isNotificationOpen);
  // 프로필 메뉴가 열려있다면 닫기
  if (isDropdownOpen) {
    setIsDropdownOpen(false);
  }
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (user) {
      const fetchUserInfo = async () => {
        try {
          const response = await UserControllerApi.getUserInfo(user.userId);
          if (response.imageUrl) {
            setProfileImage(response.imageUrl);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };

      fetchUserInfo();
    } else {
      setProfileImage(defaultProfile);
    }
  }, [user]);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    // 알림 드롭다운이 열려있다면 닫기
    if (isNotificationOpen) {
      setIsNotificationOpen(false);
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout(); // UserContext의 logout 함수 사용
    setProfileImage(defaultProfile);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationApi.markAllAsRead();
      await updateNotifications(); // 알림 목록 갱신
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  };

  if (isLoading) {
    return <nav className="desktop-main-nav">
      <div className='desktop-main-nav__left-logo'>
        <Link to='/desktop-main'>
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
    </nav>;
  }

  return (
    <nav className='desktop-main-nav'>
      <div className='desktop-main-nav__left-logo'>
        <Link to='/desktop-main'>
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
            <div className='profile-actions'>
              <button
                className='notification-button'
                onClick={toggleNotification}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'></path>
                  <path d='M13.73 21a2 2 0 0 1-3.46 0'></path>
                </svg>
                {unreadCount > 0 && (
                  <span className='notification-badge'>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className='notification-dropdown'>
                  <div className='notification-header'>
                    <h3>알림</h3>
                    <div className='notification-header-actions'>
                      {notifications.length > 0 && (
                        <button
                          className='mark-all-read-button'
                          onClick={handleMarkAllAsRead}
                        >
                          모두 읽음
                        </button>
                      )}
                      <button
                        className='close-button'
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        ×
                      </button>
                    </div>
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
                          onClick={() =>
                            handleNotificationClick(notification.notificationId)
                          }
                        >
                          <button
                            className='notification-delete-btn'
                            onClick={(e) =>
                              handleDeleteNotification(
                                e,
                                notification.notificationId
                              )
                            }
                            aria-label='알림 삭제'
                          >
                            ×
                          </button>

                          <p className='notification-message'>
                            {notification.message}
                          </p>
                          <p className='notification-date'>
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              <button className='profile-button' onClick={handleProfileClick}>
                <img src={profileImage} alt='profile' />
              </button>
            </div>

            {isDropdownOpen && (
              <div className='dropdown-menu'>
                <Link to='/desktop-my-page' onClick={closeDropdown}>
                  마이페이지
                </Link>
                <button onClick={handleLogoutClick}>로그아웃</button>
              </div>
            )}

            {isModalOpen && (
              <div className='logout-modal'>
                <div className='logout-modal-content'>
                  <h3>로그아웃 확인</h3>
                  <p>정말 로그아웃 하시겠습니까?</p>
                  <div className='modal-buttons'>
                    <button onClick={handleLogoutConfirm}>예</button>
                    <button onClick={closeModal}>아니오</button>
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
