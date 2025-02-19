import "./MobileMyPage.css";
import { useState, useEffect } from "react";
import MobileBottomTab from "../../components/MobileBottomTab/MobileBottomTab";
import { FiEdit } from "react-icons/fi";
import RealEstateRegistration from "../../components/RealEstateRegistration/RealEstateRegistration";
import RealEstateEdit from "../../components/RealEstateEdit/RealEstateEdit";
import LoadingSpinner from '../../components/LoadingSpinner/MobileLoadingSpinner'
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';

function MobileMyPage() {
  const [realtorInfo, setRealtorInfo] = useState(null);
  const [myProperties, setMyProperties] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);  // Swagger 문서에 따라 'file'로 지정

    try {
      setIsLoading(true); // 로딩 상태 시작

      const response = await axios.put('/api/users/me/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Swagger 응답 형식에 맞춰 처리
      if (response.data && response.data.imageUrl) {
        setRealtorInfo(prev => ({
          ...prev,
          profileImage: response.data.imageUrl
        }));
        
        alert('프로필 이미지가 성공적으로 업데이트되었습니다.');
        window.location.reload();
      }
    } catch (error) {
      console.error('프로필 이미지 업데이트 실패:', error.response?.data || error);
      
      // 서버 응답의 구체적인 에러 메시지가 있다면 그것을 표시
      const errorMessage = error.response?.data?.error || '이미지 업로드에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

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
            <div className="profile-image-wrapper">
              <img 
                src={realtorInfo?.profileImage || "https://via.placeholder.com/120"} 
                alt="profile"  
              />
              <label className="profile-edit-overlay" htmlFor="profile-image-input">
                <FaCamera size={24} />
              </label>
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="mobile-my-page__my-info__profile__name">
              <div className="mobile-my-page__my-info__profile__edit-icon"
                onClick={() => navigate('/mobile-my-page-edit')}
                style={{ cursor: 'pointer' }}
              >
                <FiEdit size={20} color="#01ADFF" />
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
            <div className="live-info">
              <p id="live-count">부동산 라이브 횟수</p>
              <p id="live-count-number">{realtorInfo?.liveCount}회</p>
            </div>
            <div className="rating-info">
              <p id="rating">나의 평점</p>
              <p id="rating-number">{realtorInfo?.ratingAvg?.toFixed(1) || '0.0'}</p>
            </div>
          </div>
          <div className="mobile-my-page__my-real-estate">
            <p>나의 부동산</p>
            <div className="mobile-my-page__my-real-estate-content">
              <p>등록된 매물</p>
              <p id="real-estate-count" style={{ color: '#01ADFF' }}>{myProperties.length}</p>
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