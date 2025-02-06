// src/services/chatApi.js

// 실제 코드

// src/services/chatApi.js
import axios from 'axios';

const API_BASE_URL = 'https://i12d205.p.ssafy.io';

const chatApi = {
  // 채팅방 생성
  createChatRoom: async (memberId, realtorId) => {
    try {
      // 요청 데이터 로깅
      console.log('채팅방 생성 요청 데이터:', {
        memberId,
        realtorId
      });
  
      const response = await axios.post(`${API_BASE_URL}/api/chats`, {
        memberId,
        realtorId,
      }, {
        // 요청 헤더 추가
        headers: {
          'Content-Type': 'application/json',
          // 토큰이 필요한 경우 추가
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버 응답 에러의 자세한 정보 출력
        console.error('서버 응답 상태:', error.response.status);
        console.error('서버 응답 데이터:', error.response.data);
        console.error('서버 응답 헤더:', error.response.headers);
      } else if (error.request) {
        console.error('응답을 받지 못했습니다:', error.request);
      } else {
        console.error('요청 설정 중 에러:', error.message);
      }
      throw error;
    }
  },

  // 채팅방 목록 조회
  getChatRooms: async (userId) => {
    try {
      console.log(userId)
      const response = await axios.get(`${API_BASE_URL}/api/chats`, {
        params: { userId }
      });
      console.log('채팅방 목록 응답:', response.data); // 응답 데이터 확인
    return response.data;
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
      throw error;
    }
  },

  // 채팅방 메시지 조회
getChatMessages: async (roomId) => {
  try {
    const url = `${API_BASE_URL}/api/chats/messages/room/${roomId}`;
    console.log('메시지 조회 요청 URL:', url);  // URL 로깅 추가
    
    const response = await axios.get(url);
    console.log('메시지 조회 응답:', response.data);  // 응답 데이터도 함께 로깅
    return response.data;
  } catch (error) {
    console.error('채팅 메시지 조회 실패:', error);
    throw error;
  }
},

  // 메시지 전송
  sendMessage: async (roomId, userId, content) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chats/messages`, {
        roomId,
        userId,
        content
      });
      return response.data;
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      throw error;
    }
  },

  // 메시지 읽음 처리
  markMessagesAsRead: async (roomId, userId) => {
  try {
    console.log("메시지 읽음 처리 전송");
    await axios.post(`${API_BASE_URL}/api/rooms/${roomId}/user/${userId}`);
  } catch (error) {
    console.error('메시지 읽음 처리 실패:', error);
    throw error;
  }
}
};

export default chatApi;