// src/pages/DesktopMyPage/DesktopMyPage.js
import React, { useState, useEffect } from 'react';
import './DesktopMyPage.css';
import DesktopLiveAndMyPage from '../../components/DesktopNav/DesktopLiveAndMyPage';
import LiveCarousel from '../../components/LiveCarousel/LiveCarousel';
import defaultProfile from '../../assets/images/defaultProfileImageIMSI.png';
import KakaoLogo from '../../assets/images/카카오로고.jpg';
import LiveControllerApi from '../../services/LiveControllerApi';
import MyPageModal from '../../components/MyPageModal/MyPageModal';
import PropertySlider from '../../components/PropertySlider/PropertySlider';

function DesktopMyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [liveData, setLiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLiveIndex, setCurrentLiveIndex] = useState(0);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const lives = await LiveControllerApi.getLives();
      const livesWithProperties = await Promise.all(
        lives.map(async (live) => ({
          ...live,
          properties: await LiveControllerApi.getLiveProperties(live.liveId),
        }))
      );
      setLiveData(livesWithProperties);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handlePrevLive = () => {
    setCurrentLiveIndex((prev) =>
      prev === 0 ? liveData.length - 1 : prev - 1
    );
  };

  const handleNextLive = () => {
    setCurrentLiveIndex((prev) =>
      prev === liveData.length - 1 ? 0 : prev + 1
    );
  };

  const renderPropertyCard = (property) => (
    <div
      key={property.propertyId}
      className='property-card'
      onClick={() => handlePropertyClick(property)}
    >
      <div className='property-image'>
        <img src={property.images[0]} alt={property.description} />
      </div>
      <div className='property-info'>
        <p className='property-name'>{property.description}</p>
        <div className='property-actions'>
          <p>음성 요약</p>
          <p>체크리스트</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className='desktop-my-page'>
      <DesktopLiveAndMyPage />
      {/* 기존 회원정보 섹션 */}
      <div className='user-info'>
        <p>회원정보</p>
        <div className='user-info-content'>
          <div className='user-info-content-img'>
            <img src={defaultProfile} alt='프로필 이미지' />
          </div>
          <div className='user-info-content-text'>
            <div className='user-info-content-text-name'>
              <p>이름</p>
              <p>이름</p>
            </div>
            <div className='user-info-content-social'>
              <p>연결된 소셜 계정</p>
              <img src={KakaoLogo} alt='소셜 계정' />
            </div>
          </div>
        </div>
      </div>

      {/* 라이브 일정 섹션 */}
      <div className='user-info-schedule'>
        <p>라이브 일정</p>
        <div className='user-info-schedule-title'>
          <p>일정</p>
          <p>공인중개사</p>
        </div>
        <div className='user-info-schedule-content'>
          <p>2022.01.01</p>
          <p>강동원</p>
        </div>
      </div>

      <div className='user-info-record'>
        <p>내가 본 라이브 매물</p>
        {isLoading ? (
          <p className='loading-message'>라이브 목록을 불러오는 중입니다...</p>
        ) : liveData.length > 0 ? (
          <>
            <LiveCarousel
              liveData={liveData}
              currentIndex={currentLiveIndex}
              onPrev={handlePrevLive}
              onNext={handleNextLive}
            />
            <PropertySlider
              properties={liveData[currentLiveIndex].properties}
              onPropertyClick={handlePropertyClick}
            />
          </>
        ) : (
          <p>라이브 기록이 없습니다.</p>
        )}
      </div>

      {isModalOpen && (
        <MyPageModal
          property={selectedProperty}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default DesktopMyPage;
