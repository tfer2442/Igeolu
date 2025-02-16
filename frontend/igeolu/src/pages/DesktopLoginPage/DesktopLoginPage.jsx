import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import mobileLogo from '../../assets/images/모바일로고.png';
import './DesktopLoginPage.css';

const LoginPage = () => {
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
    setError(''); // 새로운 입력이 있을 때 에러 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://i12d205.p.ssafy.io/api/test/login?role=member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      const data = await response.json();
      // 로그인 성공 시 처리
      console.log('로그인 성공:', data);
      // 여기에 로그인 성공 후 리다이렉션 등의 처리를 추가하세요
      
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      console.error('로그인 에러:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={mobileLogo} alt="다봄 로고" className="logo-image" />
      </div>
      
      <div className="login-header">
        <h1>로그인하시고</h1>
        <p>이걸루 함께 방 찾기 여정을 떠나보세요!</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            placeholder="아이디"
            className="login-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호"
            className="login-input"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-submit-btn">
          로그인
        </button>
      </form>

      <div className="divider">
        <span>또는</span>
      </div>

      <div className="login-buttons">
        <a 
          href="https://i12d205.p.ssafy.io/api/oauth2/authorization/kakao?state=member"
          className="kakao-button"
        >
          <MessageCircle size={20} />
          <span>카카오로 3초 만에 매물보기</span>
        </a>
      </div>
    </div>
  );
};

export default LoginPage;