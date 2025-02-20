import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import mobileLogo from '../../assets/images/모바일로고.png';
import './MobileLoginPage.css';

const MobileLoginPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 요청 데이터 로깅
    console.log('로그인 요청 데이터:', {
      url: 'https://i12d205.p.ssafy.io/api/test/login?role=realtor',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: formData
    });
    
    try {
      const response = await fetch('https://i12d205.p.ssafy.io/api/test/login?role=realtor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      // HTTP 상태 코드 로깅
      console.log('HTTP 상태 코드:', response.status);
      
      // 응답 헤더 전체 로깅
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('응답 헤더:', headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 응답 데이터 먼저 텍스트로 받기
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        // 텍스트가 JSON인 경우에만 파싱
        data = responseText ? JSON.parse(responseText) : {};
        console.log('파싱된 응답 데이터:', data);
      } catch (parseError) {
        console.log('JSON 파싱 실패, 텍스트 응답:', responseText);
        data = responseText;
      }
      
      // 로그인 성공 처리 및 리다이렉트
      console.log('로그인 성공! 최종 데이터:', data);
      window.location.href = 'https://i12d205.p.ssafy.io/mobile-main';
      
    } catch (err) {
      // 에러 상세 로깅
      console.error('로그인 에러 상세:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      setError('로그인 실패. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="mobile-login-page-container">
      <div className="mobile-login-page">
        <div className="mobile-login-content">
          <div className="mobile-login-logo">
            <img src={mobileLogo} alt="다봄 로고" className="mobile-logo-image" />
          </div>
          
          <div className="mobile-login-header">
            <h1>로그인하시고</h1>
            <p>이걸루 함께 방 찾기 여정을 떠나보세요!</p>
          </div>

          <form onSubmit={handleSubmit} className="mobile-login-form">
            <div className="mobile-form-group">
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="아이디"
                className="mobile-login-input"
              />
            </div>
            <div className="mobile-form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호"
                className="mobile-login-input"
              />
            </div>
            {error && <div className="mobile-error-message">{error}</div>}
            <button type="submit" className="mobile-login-submit-btn">
              로그인
            </button>
          </form>

          <div className="mobile-divider">
            <span>또는</span>
          </div>

          <div className="mobile-login-buttons">
            <a 
              href="https://i12d205.p.ssafy.io/api/oauth2/authorization/kakao?state=realtor"
              className="mobile-kakao-button"
            >
              <MessageCircle size={20} />
              <span>카카오로 로그인하기</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLoginPage;