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
      const response = await axios.post('https://i12d205.p.ssafy.io/api/users/me/info', data, {
        headers: {
          'Content-Type': 'application/json',
          // 오승우 userId 33, role realtor
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAzMDEzLCJleHAiOjE3NDAxMTI2MTN9.s6tgPhKV61WYbIbjPHPg6crY0gFvc0T-RhQJ-bGVGWg'
        }
      });
      return response.data;
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