// src/contexts/NotificationContext.js
import React, { createContext, useContext } from 'react';

export const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  updateNotifications: () => {} // 여기에 updateNotifications 추가
});

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};