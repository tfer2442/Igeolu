// src/pages/Home/Home.jsx
import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* 네비게이션 바 */}
      <nav className="nav-bar">
        <div className="logo">이걸루</div>
        <div className="nav-links">
          <button className="nav-button">방찾기</button>
          <button className="nav-button">공인중개사</button>
          <button className="nav-button">라이브</button>
        </div>
        <div className="auth-buttons">
          <button className="login-btn">로그인</button>
          <button className="register-btn">회원가입</button>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <div className="left-content">
          {/* 메인 이미지 */}
          <div className="main-image">
            <img src="https://picsum.photos/800/600" alt="메인 이미지" />
          </div>
        </div>

        {/* 오른쪽 정보 카드들 */}
        <div className="right-cards">
          {/* 라이브 매물구경 카드 */}
          <div className="info-card live-card">
            <h2>라이브 매물구경</h2>
            <ul>
            <li>✓ 허위 매물 Check!</li>
              <li>✓ 독소 조항 Check!</li>
              <li>✓ 거짓 정보 Check!</li>
              </ul>
              <div className="youtube-icon">▶</div>
          </div>

          {/* AI 체크리스트 카드 */}
          <div className="info-card ai-card">
            <h2>AI 체크리스트</h2>
            <ul>
            <li>✓ 허위 매물 Check!</li>
              <li>✓ 독소 조항 Check!</li>
              <li>✓ 거짓 정보 Check!</li>
              </ul>
              <div className="ai-icon">🤖</div>
          </div>

          {/* 3 Check 시스템 카드 */}
          <div className="info-card check-card">
            <h2>3 Check 시스템</h2>
            <ul>
              <li>✓ 허위 매물 Check!</li>
              <li>✓ 독소 조항 Check!</li>
              <li>✓ 거짓 정보 Check!</li>
            </ul>
            <div className="check-icon">✓</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;