// pages/MobileLoginPage/MobileLoginPage.jsx
import React from 'react';
import { MessageCircle } from 'lucide-react';
import mobileLogo from '../../assets/images/모바일로고.png';
import './MobileLoginPage.css';

const MobileLoginPage = () => {
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