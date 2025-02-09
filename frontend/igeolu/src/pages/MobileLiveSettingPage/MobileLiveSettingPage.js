import React, { useState, useEffect } from 'react';
import "./MobileLiveSettingPage.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MobileBottomTab from "../../components/MobileBottomTab/MobileBottomTab";

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg',
        'userId': '32'
    }
});

const MobileLiveSettingPage = () => {
    const [properties, setProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`/api/properties?userId=32`);
                setProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const handlePropertySelect = (property) => {
        // 이미 선택된 매물이면 선택 취소
        if (selectedProperties.some(p => p.propertyId === property.propertyId)) {
            setSelectedProperties(selectedProperties.filter(p => p.propertyId !== property.propertyId));
        } else {
            // 새로운 매물 선택
            setSelectedProperties([...selectedProperties, property]);
        }
    };

    const removeFromSelected = (propertyId) => {
        setSelectedProperties(selectedProperties.filter(p => p.propertyId !== propertyId));
    };

    const handleStartLive = async () => {
        if (selectedProperties.length === 0) {
            alert('라이브에 보여줄 매물을 하나 이상 선택해주세요.');
            return;
        }

        try {
            console.log('Sending request to:', `${API_BASE_URL}/lives`);
            
            const response = await api.post('/lives', {
                propertyIds: selectedProperties.map(prop => prop.propertyId),
                role: 'host'  // role 유지
            });
            
            console.log('Full response:', response);
            
            const { sessionId, token } = response.data;
            console.log('Session created successfully:', { sessionId, token });
            
            navigate('/mobile-live', { 
                state: { 
                    sessionId, 
                    token,
                    role: 'host',
                    selectedProperties: selectedProperties.map(prop => prop.propertyId)     
                } 
            });
        } catch (error) {
            console.error('Error creating session:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            
            alert('라이브 세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    return (
        <div className="mobile-live-setting-page-container">
            <div className="mobile-live-setting-page">
                <div className="mobile-live-setting-page-header">
                    <p>라이브 설정</p>
                </div>
                <div className="mobile-live-setting-page-content">
                    <div className="mobile-live-setting-page-content-my-estate">
                        <p id="my-estate-title">나의 부동산 매물</p>
                        <div className="mobile-live-setting-page-content-my-estate-list">
                            {properties.map((property, index) => (
                                <div 
                                    className={`mobile-live-setting-page-content-my-estate-list-item ${
                                        selectedProperties.some(p => p.propertyId === property.propertyId) ? 'selected' : ''
                                    }`}
                                    key={property.propertyId}
                                    onClick={() => handlePropertySelect(property)}
                                >
                                    <img 
                                        src={property.images && property.images.length > 0 
                                            ? property.images[0] 
                                            : "/default-property-image.png"} 
                                        alt="estate" 
                                    />
                                    <div className="mobile-live-setting-page-content-my-estate-list-item-info">
                                        <p id="estate-type">
                                            {(property.deposit ?? 0).toLocaleString()}원 / {(property.monthlyRent ?? 0).toLocaleString()}원
                                        </p>
                                        <p id="estate-description">{property.description || '소개 없음'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mobile-live-setting-page-content-select-estate">
                        <p id="select-estate-title">라이브 순서</p>
                        <div className="mobile-live-setting-page-content-select-estate-list">
                            {selectedProperties.map((property, index) => (
                                <div 
                                    key={property.propertyId}
                                    className="mobile-live-setting-page-content-select-estate-list-item"
                                    onClick={() => removeFromSelected(property.propertyId)}
                                >
                                    <span className="order-number">{index + 1}</span>
                                    <div className="selected-property-info">
                                        <p>{property.description || '소개 없음'}</p>
                                        <p>{(property.deposit ?? 0).toLocaleString()}원 / {(property.monthlyRent ?? 0).toLocaleString()}원</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mobile-live-setting-page-content-button">
                        <p>시작후 폰을 가로로 돌려주세요.</p>
                        <input 
                            type="button" 
                            value="라이브 시작" 
                            onClick={handleStartLive}
                        />
                    </div>
                    <MobileBottomTab />
                </div>
            </div>
        </div>
    );
};

export default MobileLiveSettingPage;