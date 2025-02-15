// src/services/LiveControllerApi.js
import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://i12d205.p.ssafy.io/api',
  headers: {
    'Authorization': JSON.parse(localStorage.getItem('user'))?.token || 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjM1LCJyb2xlIjoiUk9MRV9NRU1CRVIiLCJpYXQiOjE3Mzg5MDQyMjAsImV4cCI6MTc0MDExMzgyMH0.rvdPE4gWoUx9zHUoAWjPe_rmyNH4h2ssNqiTcIRqIpE',
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

const LiveControllerApi = {
  // 라이브 목록 조회
  getLives: async () => {
    try {
      const response = await instance.get('/lives');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error getting lives:', error);
      return [];
    }
  },

  // 라이브별 매물 목록 조회
  getLiveProperties: async (liveId) => {
    try {
      const response = await instance.get(`/lives/${liveId}/properties`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error getting live properties:', error);
      return [];
    }
  },

  // 라이브 매물 요약 조회
  getLivePropertySummary: async (livePropertyId) => {
    try {
      const response = await instance.post(
        `/live-properties/${livePropertyId}/summary`
      );
      return response;
    } catch (error) {
      console.error('Error getting live property summary:', error);
      throw error;
    }
  },

  // 녹화 정보 조회
  getRecordingInfo: async (recordingId) => {
    try {
      const response = await instance.get(`/recordings/${recordingId}`);
      return response;
    } catch (error) {
      console.error('Error getting recording info:', error);
      throw error;
    }
  },

  // 라이브 참여
  joinLive: async (sessionId) => {
    try {
      const response = await instance.post('/lives/join', { sessionId });
      return response;
    } catch (error) {
      console.error('Error joining live:', error);
      throw error;
    }
  },
};

export default LiveControllerApi;
