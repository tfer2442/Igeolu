// src/services/ChatApi.js
import axios from 'axios';

// export const instance = axios.create({
//   baseURL: 'https://i12d205.p.ssafy.io/api',
//   headers: {
//     'Authorization': JSON.parse(localStorage.getItem('user'))?.token || 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjM1LCJyb2xlIjoiUk9MRV9NRU1CRVIiLCJpYXQiOjE3Mzg5MDQyMjAsImV4cCI6MTc0MDExMzgyMH0.rvdPE4gWoUx9zHUoAWjPe_rmyNH4h2ssNqiTcIRqIpE',
//     'Content-Type': 'application/json',
//   },
// });

export const instance = axios.create({
  baseURL: 'https://i12d205.p.ssafy.io/api',
  withCredentials: true,
  headers: {
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

const ChatApi = {
  createChatRoom: async (memberId, realtorId) => {
    try {
      const response = await instance.post('/chats', { memberId, realtorId });
      return response;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  },

  getChatRooms: async (userId, userRole) => {
    try {
      const response = await instance.get('/chats', { params: { userId } });
      
      // 필터링 전 전체 채팅방 데이터 확인
      console.log('필터링 전 전체 채팅방:', response);
      console.log('---------', userId, '-----------', userRole)
      
      const filteredRooms = response.filter(room => {
        // 각 room의 roomStatus 값 확인
        console.log(`Room ${room.roomId} status:`, room.roomStatus);
        
        if (userRole === 'ROLE_REALTOR') {
          return room.roomStatus === 'BOTH' || room.roomStatus === 'REALTOR';
        } else if (userRole === 'ROLE_MEMBER') {
          return room.roomStatus === 'BOTH' || room.roomStatus === 'MEMBER';
        }
        return false;
      });
      
      // 필터링 후 결과 확인
      console.log('필터링 후 채팅방:', filteredRooms);
      
      return filteredRooms;
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      return [];
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

export default ChatApi;