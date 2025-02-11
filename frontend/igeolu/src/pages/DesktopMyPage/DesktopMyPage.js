import React from 'react';
import './DesktopMyPage.css';
import DesktopLiveAndMyPage from '../../components/DesktopNav/DesktopLiveAndMyPage';
import defaultProfile from '../../assets/images/defaultProfileImageIMSI.png';
import KakaoLogo from '../../assets/images/카카오로고.jpg';
function DesktopMyPage() {
  return (
    <div className="desktop-my-page">
      <DesktopLiveAndMyPage />
      <div className="user-info">
        <p>회원정보</p>
        <div className="user-info-content">
            <div className="user-info-content-img">
                <img src={defaultProfile} alt="프로필 이미지" />
            </div>
            <div className="user-info-content-text">
                <div className="user-info-content-text-name">
                    <p>이름</p>
                    <p>이름</p>
                </div>
                <div className="user-info-content-social">
                    <p>연결된 소셜 계정</p>
                    <img src={KakaoLogo} alt="소셜 계정" />
                </div>
            </div>
        </div>
      </div>
      <div className="user-info-schedule">
        <p>라이브 일정</p>
        <div className="user-info-schedule-title">
            <p>일정</p>
            <p>공인중개사</p>
        </div>
        <div className="user-info-schedule-content">
            <p>2022.01.01</p>
            <p>강동원</p>
        </div>
      </div>
      <div className="user-info-record">
        <p>내가 본 라이브 매물</p>
        <p>2022.01.01</p>
        <div className="user-info-record-content">
          <div className="user-info-record-content-img"> 
          </div>
          <div className="user-info-record-content-text">
            <p>남경앳홈비앙채</p>
            <p>음성 요약</p>
            <p>체크리스트</p>
          </div>
        </div>
      </div>


    </div>

  );
}



export default DesktopMyPage;
