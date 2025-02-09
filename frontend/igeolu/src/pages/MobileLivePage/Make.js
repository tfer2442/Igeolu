import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 프록시를 사용하므로 상대 경로로 변경
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': '*/*',
    'Content-Type': 'application/json'
  }
});

function Make() {
  const [inputSessionId, setInputSessionId] = useState('');
  const navigate = useNavigate();

  const createSession = async () => {
    try {
      console.log('Sending request to:', `${API_BASE_URL}/lives`);
      
      const response = await api.post('/lives', {
        realtorId: 2,
        role: 'host'
      });
      
      console.log('Full response:', response);
      
      const { sessionId, token, liveUrl } = response.data;
      console.log('Session created successfully:', { sessionId, token, liveUrl });
      
      navigate('/mobile-live', { 
        state: { 
          sessionId, 
          token,
          liveUrl,
          role: 'host'
        } 
      });
    } catch (error) {
      console.error('Error creating session:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      alert('세션 생성에 실패했습니다. 개발자 도구의 콘솔을 확인해주세요.');
    }
  };

  const joinSession = async () => {
    if (!inputSessionId) {
      alert('세션 ID를 입력해주세요.');
      return;
    }

    try {
      console.log('Joining session with ID:', inputSessionId);
      
      const response = await api.post('/lives/join', {
        sessionId: inputSessionId
      });
      
      console.log('Join response:', response.data);
      
      const { token, liveUrl, hostId } = response.data;
      
      if (!token) {
        throw new Error('Token not received from server');
      }

      navigate('/live', { 
        state: { 
          sessionId: inputSessionId, 
          token,
          liveUrl,
          role: 'participant',
          hostId
        } 
      });
    } catch (error) {
      console.error('Error joining session:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert('세션 참여에 실패했습니다. 세션 ID를 확인해주세요.');
    }
  };

  return (
    <div>
      <h1>Make</h1>
      <button onClick={createSession}>Create Session as Host</button>
      <div>
        <input
          type="text"
          value={inputSessionId}
          onChange={(e) => setInputSessionId(e.target.value)}
          placeholder="Enter Session ID"
        />
        <button onClick={joinSession}>Join Session</button>
      </div>
    </div>
  );
}

export default Make;
