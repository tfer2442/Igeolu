import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://i12d205.p.ssafy.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const appointmentAPI = {
  getAppointments: (userId) =>
    instance.get('/appointments', { params: { userId } }),

  createAppointment: (data) => instance.post('/appointments', data),

  updateAppointment: (appointmentId, data) =>
    instance.put(`/appointments/${appointmentId}`, data),

  deleteAppointment: (appointmentId) =>
    instance.delete(`/appointments/${appointmentId}`),
};
