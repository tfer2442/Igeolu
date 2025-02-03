import "./MobileMyPage.css";
import MobileBottomTab from "../../components/MobileBottomTab/MobileBottomTab";
function MobileMyPage() {
  return <div className="mobile-my-page-container">
    <div className="mobile-my-page">
      <div className="mobile-my-page__top">
        <p>마이페이지</p>
      </div>
      <MobileBottomTab />
    </div>
  </div>;
}

export default MobileMyPage;
