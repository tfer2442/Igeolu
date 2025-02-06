// components/common/Modal/LoginModal.jsx
import React from 'react';
import { MessageCircle } from 'lucide-react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-container">
          <div className="modal-logo">다봄</div>
          
          <div className="modal-header">
            <h2>로그인하시고</h2>
            <p>다봄과 함께 방 찾기 여정을 떠나보세요!</p>
          </div>

          <a 
            href="https://i12d205.p.ssafy.io/api/oauth2/authorization/kakao"
            className="kakao-button"
          >
            <MessageCircle size={20} />
            <span>카카오로 3초 만에 매물보기</span>
          </a>

          <button 
            onClick={onClose}
            className="close-button"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;