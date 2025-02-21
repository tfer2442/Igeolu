// src/pages/MobileMainPage/MobileMainPage/js
import './MobileMainPage.css';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../contexts/UserContext';  // UserContext import 추가
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import MobileLogo from '../../assets/images/모바일로고.png';
import RealEstateRegistration from '../../components/RealEstateRegistration/RealEstateRegistration';
import RealEstateEdit from '../../components/RealEstateEdit/RealEstateEdit';
import poster1 from '../../assets/images/포스터1.jpg';
import poster2 from '../../assets/images/포스터2.jpg';
import poster3 from '../../assets/images/포스터3.jpg';
import LoadingSpinner from '../../components/LoadingSpinner/MobileLoadingSpinner';
import MobileTopBar from '../../components/MobileTopBar/MobileTopBar';
import { appointmentAPI } from '../../services/AppointmentApi';

function MobileMainPage() {
  const { user, isLoading: isUserLoading } = useUser();
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
  const [todayAppointments, setTodayAppointments] = useState([]);

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
    const fetchData = async () => {
      if (isUserLoading) {
        return; // UserContext가 아직 로딩 중이면 대기
      }

      // user 체크는 렌더링 부분에서 처리하므로 여기서는 제거
      try {
        setLoading(true);

        // 공인중개사 정보 가져오기
        const realtorResponse = await fetch(
          `https://i12d205.p.ssafy.io/api/users/${user.userId}/realtor`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!realtorResponse.ok) {
          throw new Error('공인중개사 정보를 가져오는데 실패했습니다');
        }

        const realtorData = await realtorResponse.json();
        setRealtorInfo(realtorData);

        // 예약 정보 가져오기
        const appointmentsResponse = await appointmentAPI.getAppointments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayAppointments = appointmentsResponse.data.filter(
          (appointment) => {
            const appointmentDate = new Date(appointment.scheduledAt);
            appointmentDate.setHours(0, 0, 0, 0);
            return appointmentDate.getTime() === today.getTime();
          }
        );

        todayAppointments.sort(
          (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
        );

        setTodayAppointments(todayAppointments);
        setError(null); // 성공 시 에러 초기화
      } catch (err) {
        setError(err.message);
        console.error('데이터 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchData();
    }
  }, [user, isUserLoading]);

  // useEffect(() => {
  //   const fetchRealtorInfo = async () => {
  //     try {
  //       const cachedUser = localStorage.getItem('user');
  //       if (!cachedUser) {
  //         setError('로그인 정보를 찾을 수 없습니다');
  //         return;
  //       }

  //       const { userId } = JSON.parse(cachedUser);
  //       const response = await fetch(
  //         `https://i12d205.p.ssafy.io/api/users/${userId}/realtor`,
  //         {
  //           method: 'GET',
  //           credentials: 'include',
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error('공인중개사 정보를 가져오는데 실패했습니다');
  //       }

  //       const data = await response.json();
  //       setRealtorInfo(data);
  //     } catch (err) {
  //       setError(err.message);
  //       console.error('공인중개사 정보 조회 실패:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRealtorInfo();
  // }, []);

  // 사용자 인증 상태와 데이터 로딩 상태를 모두 고려
  if (isUserLoading || loading) return <LoadingSpinner />;
  // 인증 체크 (여기서만 리다이렉트 처리)
  if (!user?.userId) {
    window.location.href = '/mobile-login';
    return null;
  }

  // 에러 체크
  if (error) return <div>에러: {error}</div>;

  const formatDate = (date) => {
    return date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '.')
      .slice(0, -1);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

return (
  <div className='mobile-main-page-container'>
    <div className='mobile-main-page'>
      <MobileTopBar logoSrc={MobileLogo} />

      {/* 컨텐츠를 감싸는 wrapper 추가 */}
      <div className='mobile-main-page__content-wrapper'>
        <div className='mobile-main-page__top-name'>
          <div className='mobile-main-page__top-name-left'>
            <p id='Name'>{realtorInfo.username}</p>
            <p>공인중개사님</p>
          </div>
        </div>

        {/* 스케줄 섹션 */}
        <section className='mobile-main-page__today-live-schedule'>
          <p>오늘의 일정</p>
          <div className='mobile-main-page__today-live-schedule-content'>
            <p id='Date'>{formatDate(new Date())}</p>
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment, index) => (
                <div key={index}>
                  <p id='reserve-time'>
                    {formatTime(appointment.scheduledAt)}{' '}
                    {appointment.memberName}님과의
                    {appointment.appointmentType === 'LIVE'
                      ? ' 라이브'
                      : ' 일반'}{' '}
                    일정
                  </p>
                  <p id='appointment-title'>{appointment.title}</p>
                </div>
              ))
            ) : (
              <p id='reserve-time'>오늘은 일정이 없네요!</p>
            )}
          </div>
        </section>

        {/* 부동산 섹션 */}
          <section className='mobile-main-page__real-estate'>
          <div className='mobile-main-page__real-estate-title'>
            <p>나의 부동산</p>
          </div>
          <div className='mobile-main-page__real-estate-buttons'>
            <RealEstateRegistration />
            <RealEstateEdit />
          </div>
        </section>

        {/* 공지 섹션 */}
        <section className='mobile-main-page__notice'>
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
        </section>
      </div>
      <MobileBottomTab />
    </div>
  </div>
);
}

export default MobileMainPage;
