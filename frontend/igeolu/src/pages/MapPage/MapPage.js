
import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
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
    const [detailPanelView, setDetailPanelView] = useState('main');

    // Kakao Maps 로딩
    useEffect(() => {
        const loadKakaoMaps = () => {
            if (window.kakao && window.kakao.maps) {
                if (!window.kakao.maps.services) {
                    window.kakao.maps.load(() => {
                        setIsKakaoMapsLoaded(true);
                    });
                } else {
                    setIsKakaoMapsLoaded(true);
                }
            } else {
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

    // 시/도 목록 가져오기
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

    // 구/군 목록 가져오기
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

    // 동 목록 가져오기
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

    // 주소로 좌표 검색
    const searchCoordinates = async (address) => {
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

    // 매물 검색
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
    // const fetchRealtors = async () => {
    //     try {
    //         // 지역 필터가 모두 설정되지 않은 경우 전체 공인중개사 목록 조회
    //         if (!selectedCity || !selectedDistrict || !selectedNeighborhood) {
    //             const response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
    //             const realtors = response.data.map(realtor => ({
    //                 ...realtor,
    //                 type: 'agent'
    //             }));
                
    //             setSearchResults(realtors);
    //             setPropertyMarkers([]);
                
    //             if (realtors.length > 0) {
    //                 const firstItem = realtors[0];
    //                 if (firstItem.latitude && firstItem.longitude) {
    //                     updateMapCenter({
    //                         lat: parseFloat(firstItem.latitude),
    //                         lng: parseFloat(firstItem.longitude)
    //                     });
    //                     setMapLevel(5);
    //                 }
    //             }
    //             return;
    //         }

    //         // 지역 필터가 설정된 경우 해당 지역의 공인중개사 목록 조회
    //         const selectedDong = neighborhoods.find(n => 
    //             n.dongName === selectedNeighborhood || n.name === selectedNeighborhood
    //         );

    //         const dongCode = selectedDong?.dongCode || selectedDong?.dongcode || selectedDong?.code || selectedDong?.id;

    //         if (!dongCode) {
    //             setSearchResults([]);
    //             setPropertyMarkers([]);
    //             return;
    //         }

    //         const response = await axios.get(`${API_BASE_URL}/api/users/${dongCode}/realtors`);
            
    //         const realtors = response.data.map(realtor => ({
    //             ...realtor,
    //             type: 'agent',
    //             dongCode: dongCode,
    //             dongName: selectedNeighborhood
    //         }));
            
    //         setSearchResults(realtors);
    //         setPropertyMarkers([]);

    //         if (realtors.length > 0) {
    //             const firstItem = realtors[0];
    //             if (firstItem.latitude && firstItem.longitude) {
    //                 updateMapCenter({
    //                     lat: parseFloat(firstItem.latitude),
    //                     lng: parseFloat(firstItem.longitude)
    //                 });
    //                 setMapLevel(5);
    //             } else {
    //                 const fullAddress = `${selectedCity} ${selectedDistrict} ${selectedNeighborhood}`;
    //                 try {
    //                     const coordinates = await searchCoordinates(fullAddress);
    //                     updateMapCenter(coordinates);
    //                     setMapLevel(5);
    //                 } catch (error) {
    //                     console.error('Error getting coordinates:', error);
    //                     updateMapCenter(DEFAULT_CENTER);
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error fetching realtors:', error);
    //         setSearchResults([]);
    //         setPropertyMarkers([]);
    //     }
    // };

    const fetchRealtors = async () => {
        try {
            // 지역 필터가 없는 경우 전체 공인중개사 목록 조회
            if (!selectedCity || !selectedDistrict || !selectedNeighborhood) {
                const response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
                const realtors = response.data.map(realtor => ({
                    ...realtor,
                    type: 'agent'
                }));
                
                setSearchResults(realtors);
                // 전체 조회시에는 마커 표시하지 않음
                setPropertyMarkers([]); 
                return;
            }
    
            // 동까지 모두 선택된 경우
            if (selectedCity && selectedDistrict && selectedNeighborhood) {
                try {
                    // 설정된 지역 주소로 좌표 검색
                    const address = `${selectedCity} ${selectedDistrict} ${selectedNeighborhood}`;
                    const coordinates = await searchCoordinates(address);
                    
                    if (coordinates) {
                        updateMapCenter(coordinates);
                        setMapLevel(3);
                    }
    
                    // 선택된 동의 공인중개사 목록 조회
                    const selectedDong = neighborhoods.find(n => 
                        n.dongName === selectedNeighborhood || n.name === selectedNeighborhood
                    );
                    const dongCode = selectedDong?.dongCode || selectedDong?.dongcode || selectedDong?.code || selectedDong?.id;
                    
                    if (dongCode) {
                        const response = await axios.get(`${API_BASE_URL}/api/users/${dongCode}/realtors`);
                        const realtors = response.data.map(realtor => ({
                            ...realtor,
                            type: 'agent'
                        }));
                        setSearchResults(realtors);
                        // selectedItem이 있는 경우에는 해당 마커만 표시
                        if (selectedItem) {
                            setPropertyMarkers([selectedItem]);
                        } else {
                            setPropertyMarkers([]);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching coordinates or realtors:', error);
                    setSearchResults([]);
                    setPropertyMarkers([]);
                }
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

    // 초기 매물 필터링
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
        setSearchResults([]); // 이전 검색 결과 초기화
        if (menuType === 'agent') {
            fetchRealtors();
        } else {
            fetchSearchResults();
        }
    };

    const handleItemClick = (item, isPropertyMarker = false) => {
        if (selectedItem && detailPanelView === 'propertyDetail') {
            return;
        }
    
        const isRoom = item.type === 'room' || activeMenu === 'room';
    
        if (isPropertyMarker || isRoom) {
            const roomItem = {
                ...item,
                type: 'room'
            };
            setSelectedItem(roomItem);
            setPropertyMarkers([roomItem]);  // 선택된 매물만 마커로 표시
            setInitialProperties([]);
        } else {
            // 공인중개사를 선택한 경우
            setSelectedItem(item);
            // 공인중개사의 위치를 마커로 표시
            if (item.latitude && item.longitude) {
                setPropertyMarkers([{
                    ...item,
                    type: 'agent'
                }]);
            }
            setInitialProperties([]);
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
            fetchRealtors();  // 공인중개사 메뉴는 그대로 유지
        } else if (activeMenu === 'room') {
            // 원룸 메뉴인 경우에만 검색 결과를 다시 표시
            fetchSearchResults();
        }
    };

    const handleViewProperties = async (userId, selectedPropertyId = null) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/properties`, {
                params: { userId: userId }
            });
            
            const validResults = response.data.filter(item =>
                item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
            );

            if (selectedPropertyId) {
                // 특정 매물이 선택된 경우 해당 매물만 표시
                const selectedProperty = validResults.find(item => item.propertyId === selectedPropertyId);
                if (selectedProperty) {
                    setPropertyMarkers([selectedProperty]);
                    setInitialProperties([selectedProperty]);
                    updateMapCenter({
                        lat: parseFloat(selectedProperty.latitude),
                        lng: parseFloat(selectedProperty.longitude)
                    });
                    setMapLevel(3);
                }
            } else {
                // 매물 목록을 볼 때는 모든 매물 표시
                setInitialProperties(validResults);
                setPropertyMarkers(validResults);
                if (validResults.length > 0) {
                    // 첫 번째 매물을 기준으로 지도 중심 이동
                    updateMapCenter({
                        lat: parseFloat(validResults[0].latitude),
                        lng: parseFloat(validResults[0].longitude)
                    });
                    setMapLevel(5); // 목록 전체를 볼 수 있도록 줌 레벨 조정
                }
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

    // const handleSwitchToAgent = async (userId) => {
    //     try {
    //         // 공인중개사 메뉴로 전환
    //         setActiveMenu('agent');
            
    //         // 모든 공인중개사 목록 가져오기
    //         const response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
    //         const targetAgent = response.data.find(realtor => realtor.userId === userId);
            
    //         if (targetAgent) {
    //             const agentWithType = {
    //                 ...targetAgent,
    //                 type: 'agent'
    //             };
                
    //             // 검색 결과를 해당 공인중개사만 포함하도록 설정
    //             setSearchResults([agentWithType]);
    //             setSelectedItem(agentWithType);
                
    //             if (targetAgent.latitude && targetAgent.longitude) {
    //                 updateMapCenter({
    //                     lat: parseFloat(targetAgent.latitude),
    //                     lng: parseFloat(targetAgent.longitude)
    //                 });
    //                 setMapLevel(3);
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error switching to agent view:', error);
    //     }
    // };

    const handleSwitchToAgent = async (userId) => {
        try {
            // 1. 공인중개사 정보를 가져옴
            const response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
            const targetAgent = response.data.find(realtor => realtor.userId === userId);
            
            if (!targetAgent) return;
    
            // 2. 모든 공인중개사에 type 필드 추가
            const realtorsWithType = response.data.map(realtor => ({
                ...realtor,
                type: 'agent'
            }));
    
            const targetAgentWithType = {
                ...targetAgent,
                type: 'agent'
            };
    
            // 3. 상태 업데이트
            setActiveMenu('agent');
            setSelectedItem(null);
            
            // 4. 전체 공인중개사 목록 설정
            setSearchResults(realtorsWithType);
    
            // 5. 선택된 공인중개사 정보 설정 및 마커 생성
            setTimeout(() => {
                setSelectedItem(targetAgentWithType);
                // 마커 생성을 위해 propertyMarkers 설정
                setPropertyMarkers([targetAgentWithType]);
                
                // 6. 지도 위치 업데이트
                if (targetAgent.latitude && targetAgent.longitude) {
                    updateMapCenter({
                        lat: parseFloat(targetAgent.latitude),
                        lng: parseFloat(targetAgent.longitude)
                    });
                    setMapLevel(3);
                }
            }, 100);
    
        } catch (error) {
            console.error('Error switching to agent view:', error);
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
                            view={detailPanelView}
                            setView={setDetailPanelView}
                            onSwitchToAgent={handleSwitchToAgent}  // 이 줄 추가
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
                                    {/* 선택된 매물이 없을 때만 검색 결과 마커들을 표시 */}
                                    {!selectedItem && searchResults.map((item, index) => {
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
                                
                                    {/* 선택된 매물의 마커 */}
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