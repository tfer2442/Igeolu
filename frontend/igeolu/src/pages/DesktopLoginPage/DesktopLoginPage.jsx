import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import './DesktopLoginPage.css';

const LoginPage = () => {
  return (
      <div className="login-container">
        <div className="login-logo">다봄</div>
        
        <div className="login-header">
          <h1>로그인하시고</h1>
          <p>이걸루 함께 방 찾기 여정을 떠나보세요!</p>
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