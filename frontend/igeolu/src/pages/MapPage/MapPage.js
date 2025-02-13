
import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import axios from 'axios';
import DesktopMapPageNav from '../../components/DesktopNav/DesktopMapPageNav';
import LocationSearch from '../../components/common/LocationSearch/LocationSearch';
import MenuButtons from '../../components/common/MenuButtons/MenuBottons';
import Filter from '../../components/common/Filter/Filter';
import ListPanel from '../../components/common/ListPanel/ListPanel';
import DetailPanel from '../../components/common/DetailPanel/DetailPanel';
import WorldCup from '../../components/WorldCup/WorldCup';
import './MapPage.css';

const API_BASE_URL = 'https://i12d205.p.ssafy.io';
const DEFAULT_CENTER = {
    lat: 37.566826,
    lng: 126.978656
};

function MapPage() {
    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get('type');

    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [activeMenu, setActiveMenu] = useState(typeParam || 'room');
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [propertyMarkers, setPropertyMarkers] = useState([]);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [mapLevel, setMapLevel] = useState(3);
    const [deposit, setDeposit] = useState(null);
    const [monthlyRent, setMonthlyRent] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [isWorldCupOpen, setIsWorldCupOpen] = useState(false);
    const [initialProperties, setInitialProperties] = useState([]);
    const [isKakaoMapsLoaded, setIsKakaoMapsLoaded] = useState(false);

    // Kakao Maps API 로드 상태 확인
    useEffect(() => {
        const loadKakaoMaps = () => {
            if (window.kakao && window.kakao.maps) {
                // Geocoder 서비스 로드
                if (!window.kakao.maps.services) {
                    window.kakao.maps.load(() => {
                        setIsKakaoMapsLoaded(true);
                    });
                } else {
                    setIsKakaoMapsLoaded(true);
                }
            } else {
                // API가 아직 로드되지 않은 경우 대기
                setTimeout(loadKakaoMaps, 100);
            }
        };

        loadKakaoMaps();
        
        return () => {
            setIsKakaoMapsLoaded(false);
        };
    }, []);

    const updateMapCenter = (newCenter) => {
        if (newCenter && 
            typeof newCenter.lat === 'number' && 
            typeof newCenter.lng === 'number' && 
            !isNaN(newCenter.lat) && 
            !isNaN(newCenter.lng)) {
            setMapCenter(newCenter);
        } else {
            setMapCenter(DEFAULT_CENTER);
        }
    };

    // 시/도 데이터 가져오기
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/sidos`);
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, []);

    // 구/군 데이터 가져오기
    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedCity) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/guguns?sidoName=${encodeURIComponent(selectedCity)}`);
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

    // 동 데이터 가져오기
    useEffect(() => {
        const fetchNeighborhoods = async () => {
            if (selectedCity && selectedDistrict) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/dongs?sidoName=${encodeURIComponent(selectedCity)}&gugunName=${encodeURIComponent(selectedDistrict)}`);
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

    // 좌표 검색 함수
    const searchCoordinates = async (address) => {
        // API 로드 대기
        let retryCount = 0;
        while (!isKakaoMapsLoaded && retryCount < 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retryCount++;
        }

        if (!isKakaoMapsLoaded) {
            throw new Error('Kakao Maps API failed to load');
        }

        return new Promise((resolve, reject) => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve({
                        lat: parseFloat(result[0].y),
                        lng: parseFloat(result[0].x)
                    });
                } else {
                    reject(new Error('Geocoding failed: ' + status));
                }
            });
        });
    };

    // 매물 검색 결과 가져오기
    const fetchSearchResults = async () => {
        try {
            const params = new URLSearchParams();

            if (selectedCity) params.append('sidoName', selectedCity);
            if (selectedDistrict) params.append('gugunName', selectedDistrict);
            if (selectedNeighborhood) params.append('dongName', selectedNeighborhood);
            if (deposit) params.append('maxDeposit', deposit);
            if (monthlyRent) params.append('maxMonthlyRent', monthlyRent);
            if (selectedOptions?.length > 0) {
                params.append('optionIds', selectedOptions.join(','));
            }

            const response = await axios.get(`${API_BASE_URL}/api/properties/search`, {
                params: params,
                paramsSerializer: {
                    indexes: null
                }
            });

            const validResults = response.data.filter(item =>
                item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
            );
            
            setSearchResults(validResults);
            setPropertyMarkers([]);

            if (validResults.length > 0) {
                updateMapCenter({
                    lat: parseFloat(validResults[0].latitude),
                    lng: parseFloat(validResults[0].longitude)
                });
                setMapLevel(5);
            } else if (selectedNeighborhood && isKakaoMapsLoaded) {
                try {
                    const fullAddress = `${selectedCity} ${selectedDistrict} ${selectedNeighborhood}`;
                    const coordinates = await searchCoordinates(fullAddress);
                    updateMapCenter(coordinates);
                    setMapLevel(5);
                } catch (error) {
                    console.error('Error getting coordinates:', error);
                    updateMapCenter(DEFAULT_CENTER);
                }
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]);
            setPropertyMarkers([]);
        }
    };

    // 공인중개사 목록 가져오기
    const fetchRealtors = async () => {
        try {
            if (!selectedCity || !selectedDistrict || !selectedNeighborhood) {
                const response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
                setSearchResults(response.data);
                setPropertyMarkers([]);
                
                if (response.data.length > 0) {
                    const firstItem = response.data[0];
                    if (firstItem.latitude && firstItem.longitude) {
                        updateMapCenter({
                            lat: parseFloat(firstItem.latitude),
                            lng: parseFloat(firstItem.longitude)
                        });
                        setMapLevel(5);
                    }
                }
                return;
            }

            try {
                const selectedDong = neighborhoods.find(n => 
                    n.dongName === selectedNeighborhood || n.name === selectedNeighborhood
                );

                const dongCode = selectedDong?.dongCode || selectedDong?.dongcode || selectedDong?.code || selectedDong?.id;

                if (!dongCode) {
                    setSearchResults([]);
                    setPropertyMarkers([]);
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/api/users/${dongCode}/realtors`);
                
                const resultsWithLocation = response.data.map(realtor => ({
                    ...realtor,
                    dongCode: dongCode,
                    dongName: selectedNeighborhood
                }));
                
                setSearchResults(resultsWithLocation);
                setPropertyMarkers([]);

                if (resultsWithLocation.length > 0) {
                    const firstItem = resultsWithLocation[0];
                    if (firstItem.latitude && firstItem.longitude) {
                        updateMapCenter({
                            lat: parseFloat(firstItem.latitude),
                            lng: parseFloat(firstItem.longitude)
                        });
                        setMapLevel(5);
                    }
                } else {
                    try {
                        const fullAddress = `${selectedCity} ${selectedDistrict} ${selectedNeighborhood}`;
                        const coordinates = await searchCoordinates(fullAddress);
                        updateMapCenter(coordinates);
                        setMapLevel(5);
                    } catch (error) {
                        console.error('Error getting coordinates:', error);
                        updateMapCenter(DEFAULT_CENTER);
                    }
                }
            } catch (error) {
                console.error('Error fetching realtors by dongcode:', error);
                setSearchResults([]);
                setPropertyMarkers([]);
            }
        } catch (error) {
            console.error('Error fetching realtors:', error);
            setSearchResults([]);
            setPropertyMarkers([]);
        }
    };

    // 필터값 변경시 검색 결과 업데이트
    useEffect(() => {
        if (activeMenu === 'room') {
            fetchSearchResults();
        } else if (activeMenu === 'agent') {
            fetchRealtors();
        }
        setSelectedItem(null);
        setPropertyMarkers([]);
        setInitialProperties([]);
    }, [
        selectedCity, 
        selectedDistrict, 
        selectedNeighborhood, 
        activeMenu,
        deposit,
        monthlyRent,
        selectedOptions
    ]);

    // 공인중개사 매물 필터링
    useEffect(() => {
        if (initialProperties.length > 0) {
            const filteredResults = initialProperties.filter(item => {
                const passesDepositFilter = !deposit || item.deposit <= deposit;
                const passesMonthlyRentFilter = !monthlyRent || item.monthlyRent <= monthlyRent;
                const passesOptionsFilter = selectedOptions.length === 0 || 
                    selectedOptions.every(optionId => 
                        item.options?.some(opt => opt.optionId === optionId)
                    );

                return passesDepositFilter && passesMonthlyRentFilter && passesOptionsFilter;
            });
            
            setPropertyMarkers(filteredResults);

            if (filteredResults.length > 0) {
                updateMapCenter({
                    lat: parseFloat(filteredResults[0].latitude),
                    lng: parseFloat(filteredResults[0].longitude)
                });
            }
        }
    }, [deposit, monthlyRent, selectedOptions, initialProperties]);

    const handleLocationSearch = ({ sidoName, gugunName, dongName }) => {
        setSelectedCity(sidoName);
        setSelectedDistrict(gugunName);
        setSelectedNeighborhood(dongName);
    };

    const handleMenuClick = (menuType) => {
        setActiveMenu(menuType);
        setSelectedItem(null);
        setPropertyMarkers([]);
        setInitialProperties([]);
        if (menuType === 'agent') {
            fetchRealtors();
        } else {
            fetchSearchResults();
        }
    };

    const handleItemClick = (item, isPropertyMarker = false) => {
        if (isPropertyMarker) {
            setSelectedItem({
                ...item,
                type: 'room'
            });
        } else {
            setSelectedItem(item);
        }

        if (item && item.latitude && item.longitude) {
            updateMapCenter({
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude)
            });
            setMapLevel(3);
        }
    };

    const handleDetailClose = () => {
        setSelectedItem(null);
        setPropertyMarkers([]);
        setInitialProperties([]);
        if (activeMenu === 'agent') {
            fetchRealtors();
        }
    };

    const handleViewProperties = async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/properties`, {
                params: { userId: userId }
            });
            
            const validResults = response.data.filter(item =>
                item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
            );

            setInitialProperties(validResults);
            
            const filteredResults = validResults.filter(item => {
                const passesDepositFilter = !deposit || item.deposit <= deposit;
                const passesMonthlyRentFilter = !monthlyRent || item.monthlyRent <= monthlyRent;
                const passesOptionsFilter = selectedOptions.length === 0 || 
                    selectedOptions.every(optionId => 
                        item.options?.some(opt => opt.optionId === optionId)
                    );

                return passesDepositFilter && passesMonthlyRentFilter && passesOptionsFilter;
            });
            
            setPropertyMarkers(filteredResults);

            if (filteredResults.length > 0) {
                updateMapCenter({
                    lat: parseFloat(filteredResults[0].latitude),
                    lng: parseFloat(filteredResults[0].longitude)
                });
                setMapLevel(5);
            }
        } catch (error) {
            console.error('Error fetching realtor properties:', error);
            setPropertyMarkers([]);
            setInitialProperties([]);
        }
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
        setPropertyMarkers([]);
        setInitialProperties([]);
        updateMapCenter(DEFAULT_CENTER);
        setMapLevel(3);
    };

    const handlePriceChange = (newDeposit, newMonthlyRent) => {
        setDeposit(newDeposit);
        setMonthlyRent(newMonthlyRent);
    };

    const handleOptionsChange = (options) => {
        setSelectedOptions(options);
    };

    const handleStartWorldCup = () => {
        if (searchResults.length >= 2) {
            setIsWorldCupOpen(true);
        } else {
            alert('월드컵을 시작하기 위해서는 최소 2개 이상의 매물이 필요합니다.');
        }
    };

    return (
        <div className='desktop-map-page'>
            <DesktopMapPageNav onLoginSigninClick={() => console.log('로그인 |회원가입')}>
                <LocationSearch onSearch={handleLocationSearch} />
            </DesktopMapPageNav>
            <div className='desktop-map-page-content'>
                <div className='left-menu-content'>
                    <MenuButtons 
                        onMenuClick={handleMenuClick}
                        activeMenu={activeMenu}
                    />
                </div>
                
                <div className='right-content'>
                    <div className='filter-container'>
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
                            activeMenu={activeMenu}
                        />
                        <div className="filter-worldcup-container">
                            <WorldCup 
                                properties={searchResults}
                                isOpen={isWorldCupOpen}
                                onClose={() => setIsWorldCupOpen(false)}
                            />
                        </div>
                    </div>
                    <div className='right-content-inner'>
                        <ListPanel 
                            type={activeMenu}
                            onItemClick={handleItemClick}
                            items={searchResults}
                        />
                        <DetailPanel 
                            isVisible={!!selectedItem}
                            type={activeMenu}
                            data={selectedItem}
                            onClose={handleDetailClose}
                            onViewProperties={handleViewProperties}
                        />
                        <div className='map-container'>
                            <div className='map-content'>
                                {mapCenter && typeof mapCenter.lat === 'number' && typeof mapCenter.lng === 'number' && (
                                    <Map
                                        center={mapCenter}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '12px',
                                            border: '1px solid #e1e1e1'
                                        }}
                                        level={mapLevel}
                                    >
                                        {/* 기존 마커들 */}
                                        {searchResults.map((item, index) => {
                                            if (!item?.latitude || !item?.longitude) return null;
                                            
                                            const position = {
                                                lat: parseFloat(item.latitude),
                                                lng: parseFloat(item.longitude)
                                            };
                                            
                                            if (isNaN(position.lat) || isNaN(position.lng)) return null;
                                            
                                            const itemId = activeMenu === 'room' ? item.propertyId : item.userId;
                                            const itemTitle = activeMenu === 'room' ? (item.title || '매물정보') : (item.username || '공인중개사');
                                            
                                            return (
                                                <MapMarker
                                                    key={`marker-${itemId || index}`}
                                                    position={position}
                                                    onClick={() => handleItemClick(item)}
                                                    title={itemTitle}
                                                />
                                            );
                                        })}

                                        {/* 공인중개사 매물 마커들 */}
                                        {propertyMarkers.map((item, index) => {
                                            if (!item?.latitude || !item?.longitude) return null;
                                            
                                            const position = {
                                                lat: parseFloat(item.latitude),
                                                lng: parseFloat(item.longitude)
                                            };
                                            
                                            if (isNaN(position.lat) || isNaN(position.lng)) return null;

                                            return (
                                                <MapMarker
                                                    key={`property-${item.propertyId || index}`}
                                                    position={position}
                                                    onClick={() => handleItemClick(item, true)}
                                                    title={item.title || '매물정보'}
                                                    image={{
                                                        src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                                                        size: {
                                                            width: 24,
                                                            height: 35
                                                        },
                                                    }}
                                                />
                                            );
                                        })}
                                    </Map>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapPage;