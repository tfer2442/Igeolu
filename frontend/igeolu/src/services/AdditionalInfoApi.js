// src/services/AdditionalInfoApi.js
import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://i12d205.p.ssafy.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('tempToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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

// 백엔드 API 요청
const submitInstance = axios.create({
  baseURL: 'https://i12d205.p.ssafy.io/api',
  headers: {
    'Content-Type': 'application/json',
    // 최재영 38 ROLE_INCOMPLETE_REALTOR
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjM4LCJyb2xlIjoiUk9MRV9JTkNPTVBMRVRFX1JFQUxUT1IiLCJpYXQiOjE3MzkyNDc2NzYsImV4cCI6MTc0MDQ1NzI3Nn0.vjWL_6w0MYPqe6aNMe4NNa4A2-q60uG9MxD1_rYjM4o'
  }
});

submitInstance.interceptors.request.use(
  (config) => {
    console.log('📌 [Submit Request]');
    console.log('➡️ URL:', config.baseURL + config.url);
    console.log('➡️ Method:', config.method);
    console.log('➡️ Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ [Submit Request Error]', error);
    return Promise.reject(error);
  }
);

submitInstance.interceptors.response.use(
  (response) => {
    console.log('✅ [Submit Response]');
    console.log('⬅️ Status:', response.status);
    console.log('⬅️ Data:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ [Submit Response Error]', error.response || error);
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

const AdditionalInfoAPI = {
  submitAdditionalInfo: async (data) => {
    try {
      const response = await submitInstance.post('/users/me/info', data);
      return response;
    } catch (error) {
      console.error('추가 정보 저장 실패:', error);
      throw error;
    }
  },

  searchAddress: async (keyword) => {
    try {
      const params = new URLSearchParams({
        confmKey: 'U01TX0FVVEgyMDI1MDIwMzE1MTIyOTExNTQ0MDQ=',
        currentPage: 1,
        countPerPage: 10,
        keyword: keyword,
        resultType: 'json'
      });

      const response = await instance.get(
        `https://business.juso.go.kr/addrlink/addrLinkApi.do?${params.toString()}`
      );
      
      return response;
    } catch (error) {
      console.error('Error searching address:', error);
      throw error;
    }
  },
  
  getCoordinates: async (address) => {
    try {
      const response = await instance.get('https://business.juso.go.kr/addrlink/addrCoordApi.do', {
        params: {
          confmKey: 'U01TX0FVVEgyMDI1MDIwMzE1MTExNTExNTQ0MDM=',
          admCd: address.admCd,
          rnMgtSn: address.rnMgtSn,
          udrtYn: address.udrtYn,
          buldMnnm: address.buldMnnm,
          buldSlno: address.buldSlno,
          resultType: 'json'
        }
      });
      
      return response;
    } catch (error) {
      console.error('좌표 변환 에러:', error);
      throw error;
    }
  }
};

export default AdditionalInfoAPI;