// src/services/NotificationApi.js
import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://i12d205.p.ssafy.io/api',
  headers: {
    // 오승우 userId 33, role realtor
    // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAzMDEzLCJleHAiOjE3NDAxMTI2MTN9.s6tgPhKV61WYbIbjPHPg6crY0gFvc0T-RhQJ-bGVGWg',
    // 이진형 userId 35, role member
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjM1LCJyb2xlIjoiUk9MRV9NRU1CRVIiLCJpYXQiOjE3Mzg5MDQyMjAsImV4cCI6MTc0MDExMzgyMH0.rvdPE4gWoUx9zHUoAWjPe_rmyNH4h2ssNqiTcIRqIpE',
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // console.log('📌 [Request]');
    // console.log('➡️ URL:', config.baseURL + config.url);
    // console.log('➡️ Method:', config.method);
    // console.log('➡️ Params:', config.params);
    // console.log('➡️ Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ [Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    // console.log('✅ [Response]');
    // console.log('⬅️ Status:', response.status);
    // console.log('⬅️ Data:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ [Response Error]', error.response || error);
    return Promise.reject(error);
  }
);

const NotificationApi = {
  // 알림 목록 조회
  getNotifications: async () => {
    try {
      const response = await instance.get('/notifications');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId) => {
    try {
      const response = await instance.patch(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // 알림 삭제
  deleteNotification: async (notificationId) => {
    try {
      const response = await instance.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};

export default NotificationApi;