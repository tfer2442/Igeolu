import './RealEstateEdit.css'
import { IoIosArrowForward } from 'react-icons/io'; 
import { useNavigate } from 'react-router-dom';

function RealEstateEdit() {
    const navigate = useNavigate();
    return (
        <div className="real-estate-edit" 
        onClick={() => navigate('/mobile-estate-list')} 
            style={{ cursor: 'pointer' }}
        >
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