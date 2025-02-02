// src/services/chatApi.js

// 실제 코드
/*

// src/services/chatApi.js
import axios from 'axios';

const API_BASE_URL = 'https://i12d205.p.ssafy.io/api';

const chatApi = {
  // 채팅방 생성
  createChatRoom: async (memberId, realtorId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chats`, {
        memberId,
        realtorId,
      });
      return response.data;
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      throw error;
    }
  },

  // 채팅방 목록 조회
  getChatRooms: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
      throw error;
    }
  },

  // 채팅방 메시지 조회
  getChatMessages: async (roomId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats/messages/${roomId}`);
      return response.data.messages;
    } catch (error) {
      console.error('채팅 메시지 조회 실패:', error);
      throw error;
    }
  },

  // 메시지 전송
  sendMessage: async (roomId, userId, content) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chats/messages`, {
        roomId,
        userId,
        content
      });
      return response.data;
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      throw error;
    }
  }

  // 메시지 읽음 처리
  markMessagesAsRead: async (roomId, userId) => {
  try {
    await axios.post(`${API_BASE_URL}/chats/messages/${roomId}/read`, {
      userId
    });
  } catch (error) {
    console.error('메시지 읽음 처리 실패:', error);
    throw error;
  }
}
};

export default chatApi;

*/

// 임시 코드
// services/chatApi.js
import { mockChatRooms, mockChatMessages } from '../mocks/chatData';

const chatApi = {
  // 채팅방 생성
  createChatRoom: async (memberId, realtorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          roomId: Math.floor(Math.random() * 1000),
          userId: memberId,
          realtorId: realtorId
        });
      }, 500); // 0.5초 지연
    });
  },

  // 채팅방 목록 조회
  getChatRooms: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockChatRooms);
      }, 1000); // 1초 지연
    });
  },

  markMessagesAsRead: async (roomId, userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ unreadCount: 0, lastReadAt: new Date().toISOString() });
      }, 300);
    });
  },

  // 채팅방 메시지 조회
  getChatMessages: async (roomId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockChatMessages[roomId] || []);
      }, 800); // 0.8초 지연
    });
  },

  // 메시지 전송
  sendMessage: async (roomId, userId, content) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage = {
          messageId: Math.floor(Math.random() * 1000),
          userId,
          content,
          createdAt: new Date().toISOString()
        };
        resolve(newMessage);
      }, 300); // 0.3초 지연
    });
  }
};

export default chatApi;