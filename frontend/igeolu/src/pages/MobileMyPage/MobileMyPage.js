
import "./MobileMyPage.css";
import { useState, useEffect } from "react";
import MobileBottomTab from "../../components/MobileBottomTab/MobileBottomTab";
import { FiEdit } from "react-icons/fi";
import RealEstateRegistration from "../../components/RealEstateRegistration/RealEstateRegistration";
import RealEstateEdit from "../../components/RealEstateEdit/RealEstateEdit";
import LoadingSpinner from '../../components/LoadingSpinner/MobileLoadingSpinner'

function MobileMyPage() {
  const [realtorInfo, setRealtorInfo] = useState(null);
  const [myProperties, setMyProperties] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedUser = localStorage.getItem('user');
        if (!cachedUser) {
          throw new Error('No user data found');
        }
        
        const { userId } = JSON.parse(cachedUser);
        
        // 중개인 정보조회
        const realtorResponse = await fetch(`https://i12d205.p.ssafy.io/api/users/${userId}/realtor`);
        if (!realtorResponse.ok) {
          throw new Error('Failed to fetch realtor data');
        }
        const realtorData = await realtorResponse.json();
        setRealtorInfo(realtorData);

        // 중개인 매물조회
        const propertiesResponse = await fetch(`https://i12d205.p.ssafy.io/api/properties?userId=${userId}`);
        if (!propertiesResponse.ok) {
          throw new Error('Failed to fetch properties data');
        }
        const propertiesData = await propertiesResponse.json();
        setMyProperties(propertiesData);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mobile-my-page-container">
      <div className="mobile-my-page">
        <div className="mobile-my-page__top">
          <p>마이페이지</p>
        </div>
        <div className="mobile-my-page__my-info">
          <p>나의 프로필 정보</p>
          <div className="mobile-my-page__my-info__profile">
            <img 
              src={realtorInfo?.profileImage || "https://via.placeholder.com/120"} 
              alt="profile" 
            />
            <div className="mobile-my-page__my-info__profile__name">
              <div className="mobile-my-page__my-info__profile__edit-icon">
                <FiEdit size={24} color="white" />
              </div>
              <div className="mobile-my-page__my-info__profile__name-text">
                <p id="name">{realtorInfo?.username}</p>
                <div className="mobile-my-page__my-info__profile__name-text__address">
                  <p>주소 : {realtorInfo?.address}</p>
                  <p>전화번호 : {realtorInfo?.tel}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mobile-my-page__my-live-count">
            <p id="live-count">부동산 라이브 횟수</p>
            <p id="live-count-number">{realtorInfo?.liveCount}회</p>
          </div>
          <div className="mobile-my-page__my-real-estate">
            <p>나의 부동산</p>
            <div className="mobile-my-page__my-real-estate-content">
              <p>등록된 매물</p>
              <p id="real-estate-count">{myProperties.length}</p>
            </div>
          </div>
        </div>
        <div className="mobile-my-page__component-container">
          <RealEstateRegistration />
          <RealEstateEdit />
        </div>
        <MobileBottomTab />
      </div>
    </div>
  );
}

export default MobileMyPage;
