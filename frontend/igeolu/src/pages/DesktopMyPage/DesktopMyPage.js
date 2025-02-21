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
import LiveHistory from '../../components/LiveHistory/LiveHistory';
import { appointmentAPI } from '../../services/AppointmentApi';
import { FaCamera, FaTimes } from 'react-icons/fa';

function DesktopMyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [liveData, setLiveData] = useState([]);
  const [currentLiveIndex, setCurrentLiveIndex] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [realtorInfos, setRealtorInfos] = useState({});
  const [appointments, setAppointments] = useState([]);

  // 각 섹션별 로딩 상태 관리
  const [loading, setLoading] = useState({
    user: true,
    appointments: true,
    lives: true,
  });

  // 전체 로딩 상태 계산
  const isLoading = Object.values(loading).some((status) => status);

  useEffect(() => {
    const fetchInitialData = async () => {
      const cachedUser = localStorage.getItem('user');
      if (!cachedUser) {
        setLoading({
          user: false,
          appointments: false,
          lives: false,
        });
        return;
      }

      const { userId } = JSON.parse(cachedUser);

      try {
        // 병렬로 데이터 fetch
        await Promise.all([
          // 유저 정보 fetch
          (async () => {
            try {
              const response = await UserControllerApi.getUserInfo(userId);
              setUserInfo(response);
            } finally {
              setLoading((prev) => ({ ...prev, user: false }));
            }
          })(),

          // 예약 정보 fetch
          (async () => {
            try {
              const response = await appointmentAPI.getAppointments(userId);
              const sortedAppointments = response.data.sort(
                (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
              );
              setAppointments(sortedAppointments);
            } finally {
              setLoading((prev) => ({ ...prev, appointments: false }));
            }
          })(),

          // 라이브 데이터 fetch
          (async () => {
            try {
              const lives = await LiveControllerApi.getLives();
              const livesWithProperties = await Promise.all(
                lives.map(async (live) => ({
                  ...live,
                  properties:
                    (await LiveControllerApi.getLiveProperties(live.liveId)) ||
                    [],
                }))
              );
              setLiveData(livesWithProperties);
            } finally {
              setLoading((prev) => ({ ...prev, lives: false }));
            }
          })(),
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // 에러 발생시에도 로딩 상태 해제
        setLoading({
          user: false,
          appointments: false,
          lives: false,
        });
      }
    };

    fetchInitialData();
  }, []);

  // 중개사 정보 fetch
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

  // 나머지 핸들러 함수들...
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

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      setLoading((prev) => ({ ...prev, user: true }));
      await UserControllerApi.updateProfileImage(formData);
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        const { userId } = JSON.parse(cachedUser);
        const response = await UserControllerApi.getUserInfo(userId);
        setUserInfo(response);
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      alert('프로필 이미지 업데이트에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  };

  const handleImageDelete = async () => {
    try {
      setLoading((prev) => ({ ...prev, user: true }));
      await UserControllerApi.deleteProfileImage();
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        const { userId } = JSON.parse(cachedUser);
        const response = await UserControllerApi.getUserInfo(userId);
        setUserInfo(response);
      }
    } catch (error) {
      console.error('Error deleting profile image:', error);
      alert('프로필 이미지 삭제에 실패했습니다.');
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  };

  // 전체 페이지 로딩 중일 때
  if (isLoading) {
    return (
      <div className='desktop-my-page loading'>
        <DesktopLiveAndMyPage />
        <div className='loading-spinner'>데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className='desktop-my-page'>
      <DesktopLiveAndMyPage />

      {/* 회원 정보 섹션 */}
      <div className='user-info'>
        <p>회원정보</p>
        <div className='user-info-content'>
          <div className='user-info-content-img'>
            <div className='profile-image-container'>
              <img
                src={userInfo?.imageUrl || defaultProfile}
                alt='프로필 이미지'
              />
              {userInfo?.imageUrl && (
                <div className='delete-overlay'>
                  <FaTimes
                    className='delete-icon'
                    onClick={handleImageDelete}
                  />
                </div>
              )}
            </div>
            <label htmlFor='profile-image-input' className='image-edit-button'>
              <FaCamera />
              <input
                type='file'
                id='profile-image-input'
                accept='image/*'
                onChange={handleImageUpdate}
                style={{ display: 'none' }}
              />
            </label>
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

      {/* 일정 섹션 */}
      <div className='user-info-schedule'>
        <div className='user-info-schedule-title'>
          <p>일정</p>
          <p>내용</p>
          <p>공인중개사</p>
        </div>
        <div className='user-info-schedule-list'>
          {appointments.map((appointment) => (
            <div
              key={appointment.appointmentId}
              className='user-info-schedule-content'
            >
              <div className='date-container'>
                <p>{formatDate(appointment.scheduledAt)}</p>
                {appointment.appointmentType === 'LIVE' && (
                  <span className='live-badge'>LIVE</span>
                )}
              </div>
              <p>{appointment.title || '일정 내용 없음'}</p>
              <p>{appointment.realtorName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 라이브 매물 섹션 */}
      <div className='user-info-record'>
        {liveData.length > 0 ? (
          <LiveHistory
            liveData={liveData}
            onSelectLive={(live) => {
              const index = liveData.findIndex((l) => l.liveId === live.liveId);
              setCurrentLiveIndex(index);
            }}
            selectedLiveId={liveData[currentLiveIndex]?.liveId}
          />
        ) : (
          <p>라이브 기록이 없습니다.</p>
        )}
      </div>

        {/* -------------------- 기존 스타일 -----------------------------*/}
      {/* <div className='user-info-record'>
        {liveData.length > 0 ? (
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
      </div> */}

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
