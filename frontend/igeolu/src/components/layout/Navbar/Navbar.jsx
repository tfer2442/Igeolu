// src/components/layout/Navbar/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleFindRoom = () => {
    navigate('/map');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          className="logo-button"
          onClick={handleLogoClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleLogoClick();
            }
          }}
        >
          이걸루
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="지역, 매물번호"
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
      <div className="navbar-right">
        <button className="nav-button" onClick={handleFindRoom}>방찾기</button>
        <button className="nav-button">공인중개사</button>
        <button className="nav-button">라이브</button>
        <button className="nav-button login">로그인</button>
        <button className="nav-button register">회원가입</button>
      </div>
    </nav>
  );
};

export default Navbar;