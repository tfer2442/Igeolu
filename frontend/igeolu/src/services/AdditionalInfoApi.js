// src/services/AdditionalInfoApi.js
import axios from 'axios';

// 백엔드 API 요청
// export const instance = axios.create({
//   baseURL: 'https://i12d205.p.ssafy.io/api',
//   headers: {
//     'Authorization': JSON.parse(localStorage.getItem('user'))?.token || 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjM1LCJyb2xlIjoiUk9MRV9NRU1CRVIiLCJpYXQiOjE3Mzg5MDQyMjAsImV4cCI6MTc0MDExMzgyMH0.rvdPE4gWoUx9zHUoAWjPe_rmyNH4h2ssNqiTcIRqIpE',
//     'Content-Type': 'application/json',
//   },
// });

export const submitInstance = axios.create({
  baseURL: 'https://i12d205.p.ssafy.io/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
      const response = await submitInstance.post('/users/me/info', data);
      return response;
    } catch (error) {
      console.error('추가 정보 저장 실패:', error);
      throw error;
    }
  },

  searchAddress: (keyword) => {
    return new Promise((resolve, reject) => {
      const callback = 'addrCallback_' + Math.random().toString(36).substr(2, 9);
      
      // 콜백 함수 정의
      window[callback] = function(data) {
        delete window[callback]; // 콜백 함수 제거
        document.head.removeChild(script); // script 태그 제거
        resolve(data);
      };

      // script 태그 생성
      const script = document.createElement('script');
      const params = new URLSearchParams({
        confmKey: 'U01TX0FVVEgyMDI1MDIwMzE1MTIyOTExNTQ0MDQ=',
        currentPage: 1,
        countPerPage: 10,
        keyword: keyword,
        resultType: 'json',
        callback: callback
      });

      script.src = `https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do?${params.toString()}`;
      script.onerror = () => {
        delete window[callback];
        document.head.removeChild(script);
        reject(new Error('주소 검색 실패'));
      };

      document.head.appendChild(script);
    });
  },
  
  getCoordinates: (address) => {
    return new Promise((resolve, reject) => {
      const callback = 'coordCallback_' + Math.random().toString(36).substr(2, 9);
      
      // 콜백 함수 정의
      window[callback] = function(data) {
        delete window[callback];
        document.head.removeChild(script);
        resolve(data);
      };

      // script 태그 생성
      const script = document.createElement('script');
      const params = new URLSearchParams({
        confmKey: 'U01TX0FVVEgyMDI1MDIwMzE1MTExNTExNTQ0MDM=',
        admCd: address.admCd,
        rnMgtSn: address.rnMgtSn,
        udrtYn: address.udrtYn,
        buldMnnm: address.buldMnnm,
        buldSlno: address.buldSlno,
        resultType: 'json',
        callback: callback
      });

      script.src = `https://business.juso.go.kr/addrlink/addrCoordApiJsonp.do?${params.toString()}`;
      script.onerror = () => {
        delete window[callback];
        document.head.removeChild(script);
        reject(new Error('좌표 변환 실패'));
      };

      document.head.appendChild(script);
    });
  },

  // GET: 공인중개사 정보 조회
  getAgentInfo: async (userId) => {
    try {
      console.log('Requesting info for userId:', userId);
      
      const response = await submitInstance.get(`/users/${userId}/realtor`);
      console.log('GET Response:', response);
      return response;
    } catch (error) {
      console.error('GET Error:', error.response?.data);
      throw error;
    }
  },

  // PUT: 공인중개사 정보 업데이트
  updateAgentInfo: async (userId, data) => {
    try {
      const requestData = {
        title: data.title || "",
        content: data.content || "",
        registrationNumber: data.registrationNumber || "",
        tel: data.tel || "",
        address: data.address || "",
        y: String(data.y || ""),
        x: String(data.x || ""),
        dongcode: data.dongcode || ""
      };

      console.log('PUT Request data:', requestData);
      
      const response = await submitInstance.put(
        `/users/${userId}/realtor`,
        requestData
      );
      
      console.log('PUT Response:', response);
      return response;
    } catch (error) {
      console.error('PUT Error:', error.response?.data);
      throw error;
    }
  }
};

export default AdditionalInfoAPI;