import instance from '../utils/axiosInstance';

const UserControllerApi = {
  // 공인중개사 단일 조회
  getRealtorInfo: async (userId) => {
    try {
      const response = await instance.get(`/users/${userId}/realtor`);
      return response;
    } catch (error) {
      console.error('Error getting realtor info:', error);
      throw error;
    }
  },

  // 공인중개사 정보 수정
  updateRealtorInfo: async (userId, realtorInfo) => {
    try {
      const response = await instance.put(`/users/${userId}/realtor`, realtorInfo);
      return response;
    } catch (error) {
      console.error('Error updating realtor info:', error);
      throw error;
    }
  },

  // 프로필 이미지 업데이트
  updateProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await instance.put('/users/me/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  },

  // 프로필 이미지 삭제
  deleteProfileImage: async () => {
    try {
      const response = await instance.delete('/users/me/profile');
      return response;
    } catch (error) {
      console.error('Error deleting profile image:', error);
      throw error;
    }
  },

  // 추가 정보 기입
  addUserInfo: async (userInfo) => {
    try {
      const response = await instance.post('/users/me/info', userInfo);
      return response;
    } catch (error) {
      console.error('Error adding user info:', error);
      throw error;
    }
  },

  // 유저 정보 조회
  getUserInfo: async (userId) => {
    try {
      const response = await instance.get(`/users/${userId}/info`);
      return response;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  },

  // 동 공인중개사 리스트 조회
  getRealtorsByDongcode: async (dongcode) => {
    try {
      const response = await instance.get(`/users/${dongcode}/realtors`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error getting realtors by dongcode:', error);
      return [];
    }
  },

  // 공인중개사 리스트 조회
  getRealtors: async () => {
    try {
      const response = await instance.get('/users/realtors');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error getting realtors:', error);
      return [];
    }
  },

  // 자신 로그인 정보 조회
  getMyInfo: async () => {
    try {
      const response = await instance.get('/users/me');
      return response;
    } catch (error) {
      console.error('Error getting my info:', error);
      throw error;
    }
  },
};

export default UserControllerApi;