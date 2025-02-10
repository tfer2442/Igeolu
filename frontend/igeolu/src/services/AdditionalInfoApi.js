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
  submitAdditionalInfo: async (additionalInfo) => {
    try {
      const response = await instance.post('/users/me/info', additionalInfo);
      return response;
    } catch (error) {
      console.error('Error submitting additional info:', error);
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

      const response = await axios.get(
        `https://business.juso.go.kr/addrlink/addrLinkApi.do?${params.toString()}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error searching address:', error);
      throw error;
    }
  },
  
  // 좌표변환 API
  getCoordinates: async (address) => {
    try {
      const response = await axios.get('https://business.juso.go.kr/addrlink/addrCoordApi.do', {
        params: {
          confmKey: 'U01TX0FVVEgyMDI1MDIwMzE1MTExNTExNTQ0MDM=', // 실제 발급받은 키로 교체 필요
          admCd: '', // 행정구역코드
          rnMgtSn: '', // 도로명코드
          udrtYn: '', // 지하여부
          buldMnnm: '', // 건물본번
          buldSlno: '', // 건물부번
          resultType: 'json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting coordinates:', error);
      throw error;
    }
  }
};

export default AdditionalInfoAPI;