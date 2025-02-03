import './RealEstateEdit.css'
import { IoIosArrowForward } from 'react-icons/io'; 

function RealEstateEdit() {
    return (
        <div className="real-estate-edit">
            <div className="real-estate-edit__p">
                <p id="title">매물 수정</p>
                <p>내 부동산 매물<span id='p-color'>정보 수정</span></p>
            </div>
            <div className="real-estate-edit__arrow">
                <IoIosArrowForward />
            </div>
        </div>
    );
}

export default RealEstateEdit;