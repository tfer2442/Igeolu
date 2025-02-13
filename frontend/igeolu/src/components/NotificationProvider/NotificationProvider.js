// src/components/NotificationProvider/NotificationProvider.js
import React, { useState, useEffect, useRef } from 'react';
import NotificationWebSocket from '../../services/webSocket/NotificationWebSocket';
import NotificationApi from '../../services/NotificationApi';

const NotificationProvider = ({ user, onInitialized }) => {
    const notificationSocketRef = useRef(null);
  
    // 알림 목록 조회
    const fetchNotifications = async () => {
      try {
        const notificationList = await NotificationApi.getNotifications();
        console.log('📌 초기 알림 목록:', notificationList);
        
        // 읽지 않은 알림 개수 계산
        const unreadNotifications = notificationList.filter(notification => !notification.isRead);
        console.log('📌 읽지 않은 알림 개수:', unreadNotifications.length);
      } catch (error) {
        console.error('❌ 알림 목록 조회 실패:', error);
      }
    };
  
    // WebSocket을 통한 실시간 알림 처리
    const handleNotification = (notification) => {
      console.log('🔔 새로운 알림 도착:', {
        notificationId: notification.notificationId,
        message: notification.message,
        createdAt: notification.createdAt,
        isRead: notification.isRead
      });
    };
  
    // WebSocket 연결 설정
    useEffect(() => {
      if (!user?.userId) {
        console.log('⚠️ 사용자 정보 없음');
        return;
      }
  
      const initializeWebSocket = async () => {
        try {
          console.log('🔄 알림 WebSocket 연결 시도...');
          if (!notificationSocketRef.current) {
            notificationSocketRef.current = new NotificationWebSocket(
              user.userId,
              handleNotification
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
  
      const initialize = async () => {
        console.log('🚀 알림 시스템 초기화 시작');
        await fetchNotifications();
        await initializeWebSocket();
        if (onInitialized) {
          console.log('✅ 알림 시스템 초기화 완료');
          onInitialized();
        }
      };
      
      initialize();
  
      return () => {
        if (notificationSocketRef.current) {
          console.log('🔄 WebSocket 연결 해제');
          notificationSocketRef.current.disconnect();
          notificationSocketRef.current = null;
        }
      };
    }, [user?.userId, onInitialized]);
  
    // children을 그대로 반환
    return null;
  };
  
  export default NotificationProvider;