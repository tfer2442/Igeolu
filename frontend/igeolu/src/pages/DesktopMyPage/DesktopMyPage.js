// src/pages/DesktopMyPage/DesktopMyPage.js
import React, { useState, useEffect } from 'react';
import './DesktopMyPage.css';
import DesktopLiveAndMyPage from '../../components/DesktopNav/DesktopLiveAndMyPage';
import LiveCarousel from '../../components/LiveCarousel/LiveCarousel';
import defaultProfile from '../../assets/images/defaultProfileImageIMSI.png';
import KakaoLogo from '../../assets/images/카카오로고.jpg';
import LiveControllerApi from '../../services/LiveControllerApi';
import UserControllerApi from '../../services/UserControllerApi';
import MyPageModal from '../../components/MyPageModal/MyPageModal';
import PropertySlider from '../../components/PropertySlider/PropertySlider';
import { appointmentAPI } from '../../services/AppointmentApi';

function DesktopMyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [liveData, setLiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLiveIndex, setCurrentLiveIndex] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [realtorInfos, setRealtorInfos] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchAppointments(),
          fetchAllData()
        ]);
        await fetchUserInfo();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchInitialData();
  }, []);

  const fetchRealtorInfo = async (realtorId) => {
    try {
      const response = await UserControllerApi.getUserInfo(realtorId);
      setRealtorInfos((prev) => ({
        ...prev,
        [realtorId]: response,
      }));
    } catch (error) {
      console.error('Error fetching realtor info:', error);
    }
  };

  useEffect(() => {
    const fetchRealtorsInfo = async () => {
      try {
        const realtorPromises = liveData
          .filter((live) => live.realtorId && !realtorInfos[live.realtorId])
          .map((live) => fetchRealtorInfo(live.realtorId));

        await Promise.all(realtorPromises);
      } catch (error) {
        console.error('Error fetching realtors info:', error);
      }
    };

    if (liveData.length > 0) {
      fetchRealtorsInfo();
    }
  }, [liveData, realtorInfos]);

  const fetchUserInfo = async () => {
    try {
      const cachedUser = localStorage.getItem('user');
      if (!cachedUser) return;

      const { userId } = JSON.parse(cachedUser);
      const response = await UserControllerApi.getUserInfo(userId);
      setUserInfo(response);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const cachedUser = localStorage.getItem('user');
      if (!cachedUser) return;
  
      const { userId } = JSON.parse(cachedUser);
      const response = await appointmentAPI.getAppointments(userId);
      // 날짜순으로 정렬 (최신 날짜가 위로)
      const sortedAppointments = response.data.sort((a, b) => 
        new Date(a.scheduledAt) - new Date(b.scheduledAt)
      );
      setAppointments(sortedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  
  const fetchAllData = async () => {
    try {
      const lives = await LiveControllerApi.getLives();
      const livesWithProperties = await Promise.all(
        lives.map(async (live) => ({
          ...live,
          properties:
            (await LiveControllerApi.getLiveProperties(live.liveId)) || [],
        }))
      );
      setLiveData(livesWithProperties);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
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

  return (
    <div className='desktop-my-page'>
      <DesktopLiveAndMyPage />
      <div className='user-info'>
        <p>회원정보</p>
        <div className='user-info-content'>
          <div className='user-info-content-img'>
            <img
              src={userInfo?.imageUrl || defaultProfile}
              alt='프로필 이미지'
            />
          </div>
          <div className='user-info-content-text'>
            <div className='user-info-content-text-name'>
              <p>이름</p>
              <p>{userInfo?.username || '이름 없음'}</p>
            </div>
            <div className='user-info-content-social'>
              <p>연결된 소셜 계정</p>
              <img src={KakaoLogo} alt='소셜 계정' />
            </div>
          </div>
        </div>
      </div>

      <div className='user-info-schedule'>
        <div className='user-info-schedule-title'>
          <p>라이브일정</p>
          <p>공인중개사</p>
        </div>
        <div className='user-info-schedule-list'>
          {appointments.map((appointment) => (
            <div
              key={appointment.appointmentId}
              className='user-info-schedule-content'
            >
              <p>{formatDate(appointment.scheduledAt)}</p>
              <p>{appointment.realtorName}</p>
            </div>
          ))}
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
            {liveData[currentLiveIndex]?.properties && (
              <PropertySlider
                properties={liveData[currentLiveIndex].properties}
                onPropertyClick={handlePropertyClick}
              />
            )}
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
