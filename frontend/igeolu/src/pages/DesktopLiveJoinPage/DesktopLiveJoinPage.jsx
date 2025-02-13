// src/pages/DesktopLiveJoinPage/DesktopLiveJoinPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import mobileLogo from '../../assets/images/모바일로고.png';
import DesktopMainPageNav from '../../components/DesktopNav/DesktopMainPageNav';
import LiveControllerApi from '../../services/LiveControllerApi';
import './DesktopLiveJoinPage.css';

const DesktopLiveJoinPage = () => {
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!sessionId.trim()) {
      setError('세션 ID를 입력해주세요.');
      return;
    }

    try {
      const response = await LiveControllerApi.joinLive(sessionId);
      // Desktop으로 접속하는 경우 'viewer' 역할로 참가
      navigate('/live', {
        state: {
          sessionId: response.sessionId,
          token: response.token,
          liveUrl: response.liveUrl,
          role: 'viewer', // host가 아닌 viewer로 설정
        },
      });
    } catch (error) {
      setError('세션 참여에 실패했습니다. 세션 ID를 확인해주세요.');
    }
  };

  return (
    <>
      <DesktopMainPageNav />
      <div className='join-container'>
        <div className='join-logo'>
          <img src={mobileLogo} alt='다봄 로고' className='logo-image' />
        </div>

        <div className='join-header'>
          <h1>라이브 방송 참여하기</h1>
          <p>세션 ID를 입력하여 라이브 방송에 참여하세요</p>
        </div>

        <form onSubmit={handleSubmit} className='join-form'>
          <div className='input-group'>
            <input
              type='text'
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder='세션 ID를 입력하세요'
              className='session-input'
            />
            {error && <p className='error-message'>{error}</p>}
          </div>

          <button type='submit' className='join-button'>
            <span>방송 참여하기</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </>
  );
};

export default DesktopLiveJoinPage;
