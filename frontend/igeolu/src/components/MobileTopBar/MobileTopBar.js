import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MobileAlarm from '../../assets/images/알림아이콘.png';
import { useNotification } from '../../contexts/NotificationContext';
import './MobileTopBar.css';

const MobileTopBar = ({ title, logoSrc }) => {
  const { notifications, unreadCount, markAsRead } = useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
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

  const handleNotificationItemClick = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  return (
    <>
      <div className='mobile-top-bar'>
        {logoSrc ? (
          <img src={logoSrc} alt='로고' className='mobile-top-bar__logo' />
        ) : (
          <span className='mobile-top-bar__title'>{title}</span>
        )}
        <div className="notification-wrapper">
          <button className="mobile-top-bar__alarm-button" onClick={handleNotificationClick}>
            <img src={MobileAlarm} alt='알림' className='mobile-top-bar__alarm' />
            {unreadCount > 0 && (
              <span className='mobile-notification-badge'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {isNotificationOpen && (
        <div className="mobile-notification-overlay">
          <div className="mobile-notification-drawer">
            <div className="mobile-notification-header">
              <h3>알림</h3>
              <button 
                className="close-button"
                onClick={() => setIsNotificationOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="mobile-notification-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  새로운 알림이 없습니다
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`mobile-notification-item ${!notification.isRead ? 'unread' : ''}`}
                    onClick={() => handleNotificationItemClick(notification.notificationId)}
                  >
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <p className="notification-date">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

MobileTopBar.propTypes = {
  title: PropTypes.string,
  logoSrc: PropTypes.string,
};

export default MobileTopBar;