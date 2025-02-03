import './RealEstateRegistration.css'
import { IoIosArrowForward } from 'react-icons/io'; 
function RealEstateRegistration() {
    return (
        <div className="real-estate-registration">
            <div className="real-estate-registration__p">
                <p id="title">매물등록</p>
                <p>내 부동산 매물<span id='p-color'>추가 등록</span></p>
            </div>
            <div className="real-estate-registration__arrow">
                <IoIosArrowForward />
            </div>

        </div>
    );
}

export default RealEstateRegistration;