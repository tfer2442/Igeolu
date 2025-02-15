// src/components/NotificationProvider/NotificationProvider.jsx
import React, { useState, useEffect, useRef } from 'react';
import NotificationWebSocket from '../../services/webSocket/NotificationWebSocket';
import NotificationApi from '../../services/NotificationApi';
import { NotificationContext } from '../../contexts/NotificationContext';

const NotificationProvider = ({ children, user, onInitialized }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationSocketRef = useRef(null);

  // 알림 목록 조회
  // fetchNotifications 함수를 updateNotifications로 이름 변경하고 외부에서 접근 가능하도록 변경
const updateNotifications = async () => {
  try {
    const notificationList = await NotificationApi.getNotifications();
    setNotifications(notificationList);
    const unreadNotifications = notificationList.filter(
      (notification) => !notification.isRead
    );
    setUnreadCount(unreadNotifications.length);
    return true;
  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
    return false;
  }
};
  // WebSocket을 통한 실시간 알림 처리
  const handleNotification = (notification) => {
    // console.log('🔔 새로운 알림 도착 전 상태:', {
    //   현재알림수: notifications.length,
    //   읽지않은알림수: unreadCount
    // });
    
    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      // console.log('🔄 알림 목록 업데이트:', newNotifications);
      return newNotifications;
    });
    
    setUnreadCount(prev => {
      const newCount = prev + 1;
      // console.log('🔄 읽지 않은 알림 수 업데이트:', newCount);
      return newCount;
    });
};

  // 알림 읽음 처리
  const markAsRead = async (notificationId) => {
    try {
      await NotificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      // console.error('알림 읽음 처리 실패:', error);
    }
  };

  const initializeWebSocket = async () => {
    try {
      // console.log('🔄 알림 WebSocket 연결 시도...');
      if (!notificationSocketRef.current) {
        notificationSocketRef.current = new NotificationWebSocket(
          user.userId,
          handleNotification
        );
        await notificationSocketRef.current.connect();
        // console.log('✅ WebSocket 연결 성공');

        try {
          await notificationSocketRef.current.subscribe();
          // console.log('✅ 알림 구독 완료');
          return true;
        } catch (subscribeError) {
          // console.error('❌ 알림 구독 실패:', subscribeError);
          notificationSocketRef.current.disconnect();
          notificationSocketRef.current = null;
          return false;
        }
      }
      return true;
    } catch (error) {
      // console.error('❌ WebSocket 초기화 실패:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!user?.userId) {
      // console.log('⚠️ 사용자 정보 없음');
      return;
    }
  
    const initialize = async () => {
      // console.log('🚀 알림 시스템 초기화 시작');
  
      const fetchSuccess = await updateNotifications();
      if (!fetchSuccess) {
        // console.error('❌ 초기 알림 목록 조회 실패');
        return;
      }
  
      const socketSuccess = await initializeWebSocket();
      if (!socketSuccess) {
        // console.error('❌ WebSocket 초기화 실패');
        return;
      }
  
      // console.log('✅ 알림 시스템 초기화 완료');
      onInitialized?.();
    };

    initialize();

    return () => {
      if (notificationSocketRef.current && !user?.userId) {  // 로그아웃 시에만 연결 해제
        // console.log('🔄 알림 시스템 정리 시작');
        try {
          notificationSocketRef.current.disconnect();
        } catch (error) {
          // console.error('❌ 연결 해제 중 오류:', error);
        } finally {
          notificationSocketRef.current = null;
        }
        // console.log('✅ 알림 시스템 정리 완료');
      }
    };
  }, [user?.userId, onInitialized]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        updateNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
