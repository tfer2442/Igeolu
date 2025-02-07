
import React, { useState } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import DesktopMapPageNav from '../../components/common/DesktopNav/DesktopMapPageNav';
import MenuButtons from '../../components/common/MenuButtons/MenuBottons';
import LocationFilter from '../../components/common/LocationFilter/LocationFilter';
import ListPanel from '../../components/common/ListPanel/ListPanel';
import DetailPanel from '../../components/common/DetailPanel/DetailPanel';

import './MapPage.css';
import axios from 'axios';

function MapPage() {
    const handleLoginSigninClick = () => {
        console.log('로그인 |회원가입');
    };

    // 필터 테스트용 더미데이터
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');

    const [cities] = useState([
        '서울특별시',
        '경기도', 
        '인천광역시',
        '부산광역시',
        '대구광역시'
    ]);

    const districts = {
        '서울특별시': ['강남구', '서초구', '송파구', '영등포구', '마포구'],
        '경기도': ['수원시', '성남시', '용인시', '부천시', '안산시'],
        '인천광역시': ['중구', '동구', '미추홀구', '연수구', '남동구']
    };

    const neighborhoods = {
        '강남구': ['삼성동', '역삼동', '청담동', '신사동', '논현동'],
        '서초구': ['서초동', '반포동', '방배동', '양재동', '잠원동'],
        '송파구': ['잠실동', '석촌동', '송파동', '방이동', '가락동']
    };

    // 마커 테스트용 좌표 더미데이터
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
                    <LocationFilter 
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