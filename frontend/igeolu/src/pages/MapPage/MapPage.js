
import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import axios from 'axios';
import DesktopMapPageNav from '../../components/common/DesktopNav/DesktopMapPageNav';
import MenuButtons from '../../components/common/MenuButtons/MenuBottons';
import Filter from '../../components/common/Filter/Filter';
import ListPanel from '../../components/common/ListPanel/ListPanel';
import DetailPanel from '../../components/common/DetailPanel/DetailPanel';

import './MapPage.css';

function MapPage() {
    const handleLoginSigninClick = () => {
        console.log('로그인 |회원가입');
    };

    // 위치 상태 관리
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');

    // 사용가능한 지역 데이터
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);

    // 시도 선택
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('https://i12d205.p.ssafy.io/api/sidos');
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, []);

    // 구군 선택
    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedCity) {
                try {
                    const encodedSidoName = encodeURIComponent(selectedCity);
                    const response = await axios.get(`https://i12d205.p.ssafy.io/api/guguns?sidoName=${encodedSidoName}`);
                    console.log('Districts response:', response.data);
                    setDistricts(response.data);
                } catch (error) {
                    console.error('Error fetching districts:', error);
                    console.error('Error details:', error.response);
                }
            } else {
                setDistricts([]);
            }
        };
        fetchDistricts();
    }, [selectedCity]);

    // 동 선택
    useEffect(() => {
        const fetchNeighborhoods = async () => {
            if (selectedCity && selectedDistrict) {
                try {
                    const encodedSidoName = encodeURIComponent(selectedCity);
                    const encodedGugunName = encodeURIComponent(selectedDistrict);
                    const response = await axios.get(`https://i12d205.p.ssafy.io/api/dongs?sidoName=${encodedSidoName}&gugunName=${encodedGugunName}`);
                    console.log('Neighborhoods response:', response.data);
                    setNeighborhoods(response.data);
                } catch (error) {
                    console.error('Error fetching neighborhoods:', error);
                    console.error('Error details:', error.response);
                }
            } else {
                setNeighborhoods([]);
            }
        };
        fetchNeighborhoods();
    }, [selectedCity, selectedDistrict]);

    // 마커 테스트 데이터
    const [markers] = useState([
        {
            position: {
                lat: 37.566826,
                lng: 126.978656,
            },
        },
        {
            position: {
                lat: 37.563474,
                lng: 126.983828,
            },
        },
        {
            position: {
                lat: 37.570975,
                lng: 126.977419,
            },
        },
    ]);

    const [activeMenu, setActiveMenu] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleMenuClick = (menuType) => {
        setActiveMenu(activeMenu === menuType ? null : menuType);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const handleDetailClose = () => {
        setSelectedItem(null);
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        setSelectedDistrict('');
        setSelectedNeighborhood('');
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
        setSelectedNeighborhood('');
    };

    const handleNeighborhoodChange = (e) => {
        setSelectedNeighborhood(e.target.value);
    };

    const handleReset = () => {
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedNeighborhood('');
    };

    return (
        <div className='desktop-map-page'>
            <DesktopMapPageNav onLoginSigninClick={handleLoginSigninClick} />
            <div className='desktop-map-page-content'>
                <div className='left-menu-content'>
                    <MenuButtons 
                        onMenuClick={handleMenuClick}
                        activeMenu={activeMenu}
                    />
                </div>
                
                <div className='right-content'>
                    <Filter 
                        selectedCity={selectedCity}
                        selectedDistrict={selectedDistrict}
                        selectedNeighborhood={selectedNeighborhood}
                        cities={cities}
                        districts={districts}
                        neighborhoods={neighborhoods}
                        onCityChange={handleCityChange}
                        onDistrictChange={handleDistrictChange}
                        onNeighborhoodChange={handleNeighborhoodChange}
                        onReset={handleReset}
                    />
                    
                    <div className='right-content-inner'>
                        <ListPanel 
                            isVisible={!!activeMenu} 
                            type={activeMenu}
                            onItemClick={handleItemClick}
                        />
                        <DetailPanel 
                            isVisible={!!selectedItem}
                            type={activeMenu}
                            data={selectedItem}
                            onClose={handleDetailClose}
                        />
                        <div className='map-container'>
                            <div className='map-content'>
                                <Map
                                    center={{
                                        lat: 37.566826,
                                        lng: 126.978656
                                    }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '12px',
                                        border: '1px solid #e1e1e1'
                                    }}
                                    level={3}
                                >
                                    {markers.map((marker, index) => (
                                        <MapMarker
                                            key={index}
                                            position={marker.position}
                                        />
                                    ))}
                                </Map>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapPage;