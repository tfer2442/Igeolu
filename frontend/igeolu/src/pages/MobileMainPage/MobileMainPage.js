
import './MobileMainPage.css'
import { useState, useEffect } from 'react'
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab'
import MobileLogo from '../../assets/images/모바일로고.png'
import MobileAlarm from '../../assets/images/알림아이콘.png'
import RealEstateRegistration from '../../components/RealEstateRegistration/RealEstateRegistration'
import RealEstateEdit from '../../components/RealEstateEdit/RealEstateEdit'
import poster from '../../assets/images/포스터.jpg'

function MobileMainPage() {
    const [realtorInfo, setRealtorInfo] = useState({
        username: '',
        profileImage: null,
        title: '',
        content: '',
        registrationNumber: '',
        tel: '',
        address: '',
        liveCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRealtorInfo = async () => {
            try {
                const cachedUser = localStorage.getItem('user');
                if (!cachedUser) {
                    setError('로그인 정보를 찾을 수 없습니다');
                    return;
                }

                const { userId } = JSON.parse(cachedUser);
                const response = await fetch(`https://i12d205.p.ssafy.io/api/users/${userId}/realtor`, {
                    method: 'GET',
                    credentials: 'include',
                });

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

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div className="mobile-main-page-container">
            <div className="mobile-main-page">
               <div className="mobile-main-page__top-bar">
                   <img src={MobileLogo} alt="Mobile Logo" />
                   <img src={MobileAlarm} alt="Mobile Alarm" />
               </div>
               <div className="mobile-main-page__top-name">
                <div className="mobile-main-page__top-name-left">
                    <p id="Name">{realtorInfo.username}</p>
                    <p>공인중개사님</p>
                </div>
               </div>
               <div className="mobile-main-page__today-live-schedule">
                <p>오늘의 라이브 일정</p>
                <div className="mobile-main-page__today-live-schedule-content">
                    {/* 수정예정 */}
                    <p id="Date">2025.01.31</p>
                    <p id="reserve-time">9:30분 xxx님과의 라이브 예약</p>
                </div>
               </div>
               <div className="mobile-main-page__real-estate">
                <div className="mobile-main-page__real-estate-title">
                    <p>나의 부동산</p>
                </div>
                <RealEstateRegistration />
                <RealEstateEdit />
               </div>
               <div className="mobile-main-page__notice">
                    <p>공지</p>
                    <img src={poster} alt="poster" />
               </div>
                <MobileBottomTab />
            </div>
        </div>
    )
}

export default MobileMainPage;