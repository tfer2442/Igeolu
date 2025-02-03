import './MobileMainPage.css'
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab'
import MobileLogo from '../../assets/images/모바일로고.png'
import MobileAlarm from '../../assets/images/알림아이콘.png'
import RealEstateRegistration from '../../components/RealEstateRegistration/RealEstateRegistration'
import RealEstateEdit from '../../components/RealEstateEdit/RealEstateEdit'
import poster from '../../assets/images/포스터.jpg'
function MobileMainPage() {
    return (
        <div className="mobile-main-page-container">
            <div className="mobile-main-page">
               <div className="mobile-main-page__top-bar">
               <img src={MobileLogo} alt="Mobile Logo" />
               <img src={MobileAlarm} alt="Mobile Alarm" />
               </div>
               <div className="mobile-main-page__top-name">
                <div className="mobile-main-page__top-name-left">
                    <p id="Name">송중기</p>
                    <p>공인중개사님</p>
                </div>
               </div>
               <div className="mobile-main-page__today-live-schedule    ">
                <p>오늘의 라이브 일정</p>
                <div className="mobile-main-page__today-live-schedule-content">
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