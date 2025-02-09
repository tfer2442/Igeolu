import "./MobileMyPage.css";
import MobileBottomTab from "../../components/MobileBottomTab/MobileBottomTab";
import { FiEdit } from "react-icons/fi";
import RealEstateRegistration from "../../components/RealEstateRegistration/RealEstateRegistration";
import RealEstateEdit from "../../components/RealEstateEdit/RealEstateEdit";

function MobileMyPage() {
  return (
    <div className="mobile-my-page-container">
      <div className="mobile-my-page">
        <div className="mobile-my-page__top">
          <p>마이페이지</p>
        </div>
        <div className="mobile-my-page__my-info">
          <p>나의 프로필 정보</p>
          <div className="mobile-my-page__my-info__profile">
            <img src="" alt="profile" />
            <div className="mobile-my-page__my-info__profile__name">
              <div className="mobile-my-page__my-info__profile__edit-icon">
                <FiEdit size={24} />
              </div>
              <div className="mobile-my-page__my-info__profile__name-text">
                <p id="name">송중기</p>
                <div className="mobile-my-page__my-info__profile__name-text__address">
                  <p>주소 : 서울시 강남구 강남대로 123</p>
                  <p>전화번호 : 010-1234-5678</p>
                </div>
              </div>
            </div>
          </div>
        <div className="mobile-my-page__my-live-count">
            <p id="live-count">부동산 라이브 횟수</p>
            <p id="live-count-number">0회</p>
          </div>
          <div className="mobile-my-page__my-real-estate">
            <p>나의 부동산</p>
            <div className="mobile-my-page__my-real-estate-content">
              <p>월세</p>
              <p id="real-estate-count">10</p>
            </div>
            <div className="mobile-my-page__my-real-estate-content">
              <p>전세</p>
              <p id="real-estate-count">10</p>
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
