// src/services/ChatApi.js
import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://i12d205.p.ssafy.io/api',
  headers: {
    // 오승우 userId 33, role realtor
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAzMDEzLCJleHAiOjE3NDAxMTI2MTN9.s6tgPhKV61WYbIbjPHPg6crY0gFvc0T-RhQJ-bGVGWg',
    // 이진형 userId 35, role member
    // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjM1LCJyb2xlIjoiUk9MRV9NRU1CRVIiLCJpYXQiOjE3Mzg5MDQyMjAsImV4cCI6MTc0MDExMzgyMH0.rvdPE4gWoUx9zHUoAWjPe_rmyNH4h2ssNqiTcIRqIpE',
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    console.log('📌 [Request]');
    console.log('➡️ URL:', config.baseURL + config.url);
    console.log('➡️ Method:', config.method);
    console.log('➡️ Params:', config.params);
    console.log('➡️ Data:', config.data);
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
    console.log('✅ [Response]');
    console.log('⬅️ Status:', response.status);
    console.log('⬅️ Data:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ [Response Error]', error.response || error);
    return Promise.reject(error);
  }
);

const chatAPI = {
  createChatRoom: async (memberId, realtorId) => {
    try {
      const response = await instance.post('/chats', { memberId, realtorId });
      return response;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  },

  getChatRooms: async (userId) => {
    try {
      const response = await instance.get('/chats', { params: { userId } });
      // response가 배열인지 확인하고, 아니라면 빈 배열 반환
      // return Array.isArray(response) ? response : [];
      return response
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  },

  getChatMessages: async (roomId) => {
    try {
      const response = await instance.get(`/chats/messages/room/${roomId}`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  },

  sendMessage: async (roomId, userId, content) => {
    try {
      const response = await instance.post('/chats/messages', { roomId, userId, content });
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  markMessagesAsRead: async (roomId, userId) => {
    try {
      const response = await instance.post(`/rooms/${roomId}/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },
};

export default chatAPI;