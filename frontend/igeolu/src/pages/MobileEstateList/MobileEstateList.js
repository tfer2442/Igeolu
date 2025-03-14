import "./MobileEstateList.css";
import MobileBottomTab from "../../components/MobileBottomTab/MobileBottomTab";
import { IoIosArrowForward } from "react-icons/io";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MobileEstateList() {
    const [properties, setProperties] = useState([]);
    const navigate = useNavigate();

    // localStorage에서 사용자 정보 가져오기
    const getUserId = () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
            navigate('/mobile-login');
            return null;
        }
        try {
            const user = JSON.parse(userStr);
            return user.userId;
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/mobile-login');
            return null;
        }
    };

    const userId = getUserId();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(`/api/properties?userId=${userId}`);
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const handleEditClick = async (propertyId) => {
        try {
            const response = await fetch(`/api/properties/${propertyId}`);
            const propertyData = await response.json();
            console.log('매물 상세 정보:', propertyData); // 디버깅용 로그
            navigate('/mobile-edit', { state: { propertyData } });
        } catch (error) {
            console.error('Error fetching property details:', error);
        }
    };

    return (
        <div className="mobile-estate-list-container"   >
            <div className="mobile-estate-list-page">
                <div className="mobile-estate-list-page__top">
                    <p>나의 부동산 매물</p>
                </div>
                <div className="mobile-estate-list-page__content-list">
                    {Array.isArray(properties) && properties.map((property, index) => (
                        <div className="mobile-estate-list-page__content" key={index}>
                            <img 
                                src={property.images && property.images.length > 0 
                                    ? property.images[0] 
                                    : "/default-property-image.png"} 
                                alt="매물 이미지" 
                            />
                            <div className="mobile-estate-list-page__content-info">
                                <div className="mobile-estate-list-page__content-info-text">
                                    <p id="deposit-and-monthly-rent">
                                        {(property.deposit ?? 0).toLocaleString()} / {(property.monthlyRent ?? 0).toLocaleString()}
                                    </p>
                                    <p id="address">{property.address || '주소 정보 없음'}</p>
                                </div>
                                <div 
                                    className="mobile-estate-list-page__content-info-icon"
                                    onClick={() => handleEditClick(property.propertyId)}
                                >
                                    <IoIosArrowForward size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <MobileBottomTab />
            </div>
        </div>
    );
}

export default MobileEstateList;