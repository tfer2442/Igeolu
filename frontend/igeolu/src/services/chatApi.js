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
};

export default chatApi;