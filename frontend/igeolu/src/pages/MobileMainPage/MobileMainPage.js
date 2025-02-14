import './MobileMainPage.css';
import { useState, useEffect, useRef } from 'react';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import MobileLogo from '../../assets/images/모바일로고.png';
import MobileAlarm from '../../assets/images/알림아이콘.png';
import RealEstateRegistration from '../../components/RealEstateRegistration/RealEstateRegistration';
import RealEstateEdit from '../../components/RealEstateEdit/RealEstateEdit';
import poster1 from '../../assets/images/포스터1.jpg';
import poster2 from '../../assets/images/포스터2.jpg';
import poster3 from '../../assets/images/포스터3.jpg';
import LoadingSpinner from '../../components/LoadingSpinner/MobileLoadingSpinner'
import MobileTopBar from '../../components/MobileTopBar/MobileTopBar';

function MobileMainPage() {
  const [realtorInfo, setRealtorInfo] = useState({
    username: '',
    profileImage: null,
    title: '',
    content: '',
    registrationNumber: '',
    tel: '',
    address: '',
    liveCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------ 공지 관련 ------------
  const [currentPoster, setCurrentPoster] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);

  const posters = [poster1, poster2, poster3];

  // 포스터 변경 함수 수정
  const changePoster = (newIndex) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPoster(newIndex);
      setIsTransitioning(false);
    }, 300); // transition 시간의 절반으로 설정
  };

  // 자동 슬라이드 효과
  useEffect(() => {
    if (isAutoPlaying && !isTransitioning) {
      autoPlayRef.current = setInterval(() => {
        const nextPoster = (currentPoster + 1) % posters.length;
        changePoster(nextPoster);
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentPoster, isTransitioning]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    setIsAutoPlaying(false);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // 왼쪽으로 스와이프
        const nextPoster = (currentPoster + 1) % posters.length;
        changePoster(nextPoster);
      } else {
        // 오른쪽으로 스와이프
        const nextPoster =
          (currentPoster - 1 + posters.length) % posters.length;
        changePoster(nextPoster);
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // ------------ 공지 관련 ------------

  useEffect(() => {
    const fetchRealtorInfo = async () => {
      try {
        const cachedUser = localStorage.getItem('user');
        if (!cachedUser) {
          setError('로그인 정보를 찾을 수 없습니다');
          return;
        }

        const { userId } = JSON.parse(cachedUser);
        const response = await fetch(
          `https://i12d205.p.ssafy.io/api/users/${userId}/realtor`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('공인중개사 정보를 가져오는데 실패했습니다');
        }

        const data = await response.json();
        setRealtorInfo(data);
      } catch (err) {
        setError(err.message);
        console.error('공인중개사 정보 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealtorInfo();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className='mobile-main-page-container'>
      <div className='mobile-main-page'>
      <MobileTopBar logoSrc={MobileLogo} />
        <div className='mobile-main-page__top-name'>
          <div className='mobile-main-page__top-name-left'>
            <p id='Name'>{realtorInfo.username}</p>
            <p>공인중개사님</p>
          </div>
        </div>
        <div className='mobile-main-page__today-live-schedule'>
          <p>오늘의 라이브 일정</p>
          <div className='mobile-main-page__today-live-schedule-content'>
            {/* 수정예정 */}
            <p id='Date'>2025.01.31</p>
            <p id='reserve-time'>9:30분 xxx님과의 라이브 예약</p>
          </div>
        </div>
        <div className='mobile-main-page__real-estate'>
          <div className='mobile-main-page__real-estate-title'>
            <p>나의 부동산</p>
          </div>
          <RealEstateRegistration />
          <RealEstateEdit />
        </div>
        <div className='mobile-main-page__notice'>
          <p>공지</p>
          <div
            className='mobile-main-page__notice-slider'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={posters[currentPoster]}
              alt={`poster ${currentPoster + 1}`}
              className={isTransitioning ? 'fade' : ''}
            />
            <div className='mobile-main-page__notice-dots'>
              {posters.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentPoster ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
        <MobileBottomTab />
      </div>
    </div>
  );
}

export default MobileMainPage;
