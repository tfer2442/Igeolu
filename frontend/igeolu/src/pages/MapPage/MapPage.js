
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

    // 메뉴 및 아이템 상태 관리
    const [activeMenu, setActiveMenu] = useState('room');
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    // 지도 중심 좌표 상태
    const [mapCenter, setMapCenter] = useState({
        lat: 37.566826,
        lng: 126.978656
    });

    // 필터 상태 관리
    const [deposit, setDeposit] = useState(null);
    const [monthlyRent, setMonthlyRent] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // 지역 데이터 상태
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);

    // 시도 데이터 로드
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

    // 구군 데이터 로드
    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedCity) {
                try {
                    const response = await axios.get(`https://i12d205.p.ssafy.io/api/guguns?sidoName=${encodeURIComponent(selectedCity)}`);
                    setDistricts(response.data);
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            } else {
                setDistricts([]);
            }
        };
        fetchDistricts();
    }, [selectedCity]);

    // 동 데이터 로드
    useEffect(() => {
        const fetchNeighborhoods = async () => {
            if (selectedCity && selectedDistrict) {
                try {
                    const response = await axios.get(`https://i12d205.p.ssafy.io/api/dongs?sidoName=${encodeURIComponent(selectedCity)}&gugunName=${encodeURIComponent(selectedDistrict)}`);
                    setNeighborhoods(response.data);
                } catch (error) {
                    console.error('Error fetching neighborhoods:', error);
                }
            } else {
                setNeighborhoods([]);
            }
        };
        fetchNeighborhoods();
    }, [selectedCity, selectedDistrict]);

    // 통합 검색 함수
    const fetchSearchResults = async () => {
        try {
            const params = new URLSearchParams();

            // 지역 필터가 설정된 경우에만 추가
            if (selectedCity) params.append('sidoName', selectedCity);
            if (selectedDistrict) params.append('gugunName', selectedDistrict);
            if (selectedNeighborhood) params.append('dongName', selectedNeighborhood);

            // 가격 필터
            if (deposit) params.append('maxDeposit', deposit);
            if (monthlyRent) params.append('maxMonthlyRent', monthlyRent);

            // 옵션 필터
            if (selectedOptions?.length > 0) {
                params.append('optionIds', selectedOptions.join(','));
            }

            // 아무 필터도 설정되지 않은 경우 검색하지 않음
            if (params.toString() === '') {
                setSearchResults([]);
                return;
            }

            console.log('Search parameters:', Object.fromEntries(params));

            const response = await axios.get('https://i12d205.p.ssafy.io/api/properties/search', {
                params: params,
                paramsSerializer: {
                    indexes: null
                }
            });

            const validResults = response.data.filter(item =>
                item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
            );

            console.log('Search results:', validResults);
            
            setSearchResults(validResults);

            if (validResults.length > 0) {
                const newCenter = {
                    lat: parseFloat(validResults[0].latitude),
                    lng: parseFloat(validResults[0].longitude)
                };
                setMapCenter(newCenter);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]);
        }
    };

    // 필터 조건이 변경될 때마다 검색 실행
    useEffect(() => {
        if (activeMenu === 'room') {
            fetchSearchResults();
        }
    }, [selectedCity, selectedDistrict, selectedNeighborhood, deposit, monthlyRent, selectedOptions, activeMenu]);

    // 이벤트 핸들러
    const handleMenuClick = (menuType) => {
        setActiveMenu(menuType);
        setSelectedItem(null);
        if (menuType === 'agent') {
            setSearchResults([]); // 공인중개사 메뉴 선택 시 검색 결과 초기화
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        if (item && item.latitude && item.longitude) {
            setMapCenter({
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude)
            });
        }
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
        setDeposit(null);
        setMonthlyRent(null);
        setSelectedOptions([]);
    };

    const handlePriceChange = (newDeposit, newMonthlyRent) => {
        setDeposit(newDeposit);
        setMonthlyRent(newMonthlyRent);
    };

    const handleOptionsChange = (options) => {
        console.log('Options changed:', options);
        setSelectedOptions(options);
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
                        onPriceChange={handlePriceChange}
                        onOptionsChange={handleOptionsChange}
                        deposit={deposit}
                        monthlyRent={monthlyRent}
                        selectedOptions={selectedOptions}
                    />
                    
                    <div className='right-content-inner'>
                        <ListPanel 
                            isVisible={!!activeMenu} 
                            type={activeMenu}
                            onItemClick={handleItemClick}
                            items={searchResults}
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
                                    center={mapCenter}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '12px',
                                        border: '1px solid #e1e1e1'
                                    }}
                                    level={3}
                                >
                                    {searchResults.map((item, index) => {
                                        if (!item || !item.latitude || !item.longitude) return null;
                                        
                                        const position = {
                                            lat: parseFloat(item.latitude),
                                            lng: parseFloat(item.longitude)
                                        };
                                        
                                        return (
                                            <MapMarker
                                                key={`marker-${item.propertyId || index}`}
                                                position={position}
                                                onClick={() => handleItemClick(item)}
                                                title={item.title || '매물정보'}
                                            />
                                        );
                                    })}
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