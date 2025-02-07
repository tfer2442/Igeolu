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
    return response;
  },
  (error) => {
    console.error('❌ [Response Error]', error.response || error);
    return Promise.reject(error);
  }
);

export const appointmentAPI = {
  getAppointments: (userId) =>
    instance.get('/appointments', { params: { userId } }),

  createAppointment: (data) => instance.post('/appointments', data),

  updateAppointment: (appointmentId, data) =>
    instance.put(`/appointments/${appointmentId}`, data),

  deleteAppointment: (appointmentId) =>
    instance.delete(`/appointments/${appointmentId}`),
};
