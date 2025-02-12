
// import React, { useState, useEffect } from 'react';
// import { Map, MapMarker } from "react-kakao-maps-sdk";
// import axios from 'axios';
// import DesktopMapPageNav from '../../components/DesktopNav/DesktopMapPageNav';
// import LocationSearch from '../../components/common/LocationSearch/LocationSearch';
// import MenuButtons from '../../components/common/MenuButtons/MenuBottons';
// import Filter from '../../components/common/Filter/Filter';
// import ListPanel from '../../components/common/ListPanel/ListPanel';
// import DetailPanel from '../../components/common/DetailPanel/DetailPanel';
// import './MapPage.css';

// function MapPage() {
//     // URL 파라미터에서 type 가져오기
//     const searchParams = new URLSearchParams(window.location.search);
//     const typeParam = searchParams.get('type');

//     // 상태 관리
//     const [selectedCity, setSelectedCity] = useState('');
//     const [selectedDistrict, setSelectedDistrict] = useState('');
//     const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
//     const [activeMenu, setActiveMenu] = useState(typeParam || 'room');
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [searchResults, setSearchResults] = useState([]);
//     const [mapCenter, setMapCenter] = useState({
//         lat: 37.566826,
//         lng: 126.978656
//     });
//     const [deposit, setDeposit] = useState(null);
//     const [monthlyRent, setMonthlyRent] = useState(null);
//     const [selectedOptions, setSelectedOptions] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [neighborhoods, setNeighborhoods] = useState([]);

//     // 시/도 데이터 가져오기
//     useEffect(() => {
//         const fetchCities = async () => {
//             try {
//                 const response = await axios.get('https://i12d205.p.ssafy.io/api/sidos');
//                 console.log('Fetched cities:', response.data);
//                 setCities(response.data);
//             } catch (error) {
//                 console.error('Error fetching cities:', error);
//             }
//         };
//         fetchCities();
//     }, []);

//     // 구/군 데이터 가져오기
//     useEffect(() => {
//         const fetchDistricts = async () => {
//             if (selectedCity) {
//                 try {
//                     const response = await axios.get(`https://i12d205.p.ssafy.io/api/guguns?sidoName=${encodeURIComponent(selectedCity)}`);
//                     console.log('Fetched districts:', response.data);
//                     setDistricts(response.data);
//                 } catch (error) {
//                     console.error('Error fetching districts:', error);
//                 }
//             } else {
//                 setDistricts([]);
//             }
//         };
//         fetchDistricts();
//     }, [selectedCity]);

//     // 동 데이터 가져오기
//     useEffect(() => {
//         const fetchNeighborhoods = async () => {
//             if (selectedCity && selectedDistrict) {
//                 try {
//                     const response = await axios.get(`https://i12d205.p.ssafy.io/api/dongs?sidoName=${encodeURIComponent(selectedCity)}&gugunName=${encodeURIComponent(selectedDistrict)}`);
//                     console.log('Fetched neighborhoods:', response.data);
//                     setNeighborhoods(response.data);
//                 } catch (error) {
//                     console.error('Error fetching neighborhoods:', error);
//                 }
//             } else {
//                 setNeighborhoods([]);
//             }
//         };
//         fetchNeighborhoods();
//     }, [selectedCity, selectedDistrict]);

//     // 매물 검색 결과 가져오기
//     const fetchSearchResults = async () => {
//         try {
//             const params = new URLSearchParams();

//             if (selectedCity) params.append('sidoName', selectedCity);
//             if (selectedDistrict) params.append('gugunName', selectedDistrict);
//             if (selectedNeighborhood) params.append('dongName', selectedNeighborhood);
//             if (deposit) params.append('maxDeposit', deposit);
//             if (monthlyRent) params.append('maxMonthlyRent', monthlyRent);
//             if (selectedOptions?.length > 0) {
//                 params.append('optionIds', selectedOptions.join(','));
//             }

//             console.log('Property search params:', Object.fromEntries(params));

//             // 필터 조건이 없을 때도 전체 매물 조회
//             if (params.toString() === '') {
//                 try {
//                     const response = await axios.get('https://i12d205.p.ssafy.io/api/properties/search');
//                     const validResults = response.data.filter(item =>
//                         item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
//                     );
//                     console.log('All properties response:', validResults);
//                     setSearchResults(validResults);
                    
//                     if (validResults.length > 0) {
//                         const newCenter = {
//                             lat: parseFloat(validResults[0].latitude),
//                             lng: parseFloat(validResults[0].longitude)
//                         };
//                         setMapCenter(newCenter);
//                     }
//                     return;
//                 } catch (error) {
//                     console.error('Error fetching all properties:', error);
//                     setSearchResults([]);
//                     return;
//                 }
//             }

//             const response = await axios.get('https://i12d205.p.ssafy.io/api/properties/search', {
//                 params: params,
//                 paramsSerializer: {
//                     indexes: null
//                 }
//             });

//             const validResults = response.data.filter(item =>
//                 item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
//             );
            
//             console.log('Filtered properties response:', validResults);
//             setSearchResults(validResults);

//             if (validResults.length > 0) {
//                 const newCenter = {
//                     lat: parseFloat(validResults[0].latitude),
//                     lng: parseFloat(validResults[0].longitude)
//                 };
//                 setMapCenter(newCenter);
//             }
//         } catch (error) {
//             console.error('Error fetching search results:', error);
//             setSearchResults([]);
//         }
//     };

//     // 공인중개사 목록 가져오기
//     const fetchRealtors = async () => {
//         try {
//             // 현재 필터 설정값 로깅
//             console.log('Current Filter Settings:', {
//                 selectedCity,
//                 selectedDistrict,
//                 selectedNeighborhood,
//                 filterStatus: !selectedCity || !selectedDistrict || !selectedNeighborhood ? '전체 조회' : '필터링된 조회'
//             });

//             // 필터 설정값이 없는 경우 (전체 조회)
//             if (!selectedCity || !selectedDistrict || !selectedNeighborhood) {
//                 console.log('Fetching all realtors from:', 'https://i12d205.p.ssafy.io/api/users/realtors');
//                 const response = await axios.get('https://i12d205.p.ssafy.io/api/users/realtors');
//                 console.log('All realtors response:', response.data);
//                 setSearchResults(response.data);
                
//                 if (response.data.length > 0) {
//                     const firstItem = response.data[0];
//                     if (firstItem.latitude && firstItem.longitude) {
//                         setMapCenter({
//                             lat: parseFloat(firstItem.latitude),
//                             lng: parseFloat(firstItem.longitude)
//                         });
//                     }
//                 }
//                 return;
//             }

//             // 동까지 모두 선택된 경우 (필터링된 조회)
//             try {
//                 // neighborhoods 데이터 구조 확인을 위한 로깅
//                 console.log('Current neighborhoods data:', neighborhoods);
                
//                 // 선택된 동의 정보에서 dongCode 가져오기
//                 // API 응답 구조에 맞게 수정
//                 const selectedDong = neighborhoods.find(n => 
//                     n.dongName === selectedNeighborhood || n.name === selectedNeighborhood
//                 );

//                 console.log('Selected dong data:', selectedDong);

//                 // dongCode가 다른 속성명으로 존재할 수 있으므로 체크
//                 const dongCode = selectedDong?.dongCode || selectedDong?.dongcode || selectedDong?.code || selectedDong?.id;

//                 if (!dongCode) {
//                     console.error('DongCode not found for:', selectedNeighborhood);
//                     console.error('Selected dong data:', selectedDong);
//                     setSearchResults([]);
//                     return;
//                 }

//                 const apiUrl = `https://i12d205.p.ssafy.io/api/users/${dongCode}/realtors`;
//                 console.log('Fetching filtered realtors from:', apiUrl);
                
//                 const response = await axios.get(apiUrl);
//                 console.log('Filtered realtors response:', response.data);
                
//                 const resultsWithLocation = response.data.map(realtor => ({
//                     ...realtor,
//                     dongCode: dongCode,
//                     dongName: selectedNeighborhood
//                 }));
                
//                 console.log('Results with location:', resultsWithLocation);
//                 setSearchResults(resultsWithLocation);

//                 if (resultsWithLocation.length > 0) {
//                     const firstItem = resultsWithLocation[0];
//                     if (firstItem.latitude && firstItem.longitude) {
//                         setMapCenter({
//                             lat: parseFloat(firstItem.latitude),
//                             lng: parseFloat(firstItem.longitude)
//                         });
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching realtors by dongcode:', error);
//                 setSearchResults([]);
//             }
//         } catch (error) {
//             console.error('Error fetching realtors:', error);
//             setSearchResults([]);
//         }
//     };

//     // 필터값 변경시 검색 결과 업데이트
//     useEffect(() => {
//         if (activeMenu === 'room') {
//             fetchSearchResults();
//         } else if (activeMenu === 'agent') {
//             fetchRealtors();
//         }
//         setSelectedItem(null);
//     }, [selectedCity, selectedDistrict, selectedNeighborhood, deposit, monthlyRent, selectedOptions, activeMenu]);

//     // 이벤트 핸들러
//     const handleLocationSearch = ({ sidoName, gugunName, dongName }) => {
//         setSelectedCity(sidoName);
//         setSelectedDistrict(gugunName);
//         setSelectedNeighborhood(dongName);
//     };

//     const handleMenuClick = (menuType) => {
//         setActiveMenu(menuType);
//         setSelectedItem(null);
//         if (menuType === 'agent') {
//             fetchRealtors();
//         } else {
//             fetchSearchResults();
//         }
//     };

//     const handleItemClick = (item) => {
//         setSelectedItem(item);
//         if (item && item.latitude && item.longitude) {
//             setMapCenter({
//                 lat: parseFloat(item.latitude),
//                 lng: parseFloat(item.longitude)
//             });
//         }
//     };

//     const handleDetailClose = () => {
//         setSelectedItem(null);
//     };

//     const handleCityChange = (e) => {
//         setSelectedCity(e.target.value);
//         setSelectedDistrict('');
//         setSelectedNeighborhood('');
//     };

//     const handleDistrictChange = (e) => {
//         setSelectedDistrict(e.target.value);
//         setSelectedNeighborhood('');
//     };

//     const handleNeighborhoodChange = (e) => {
//         setSelectedNeighborhood(e.target.value);
//     };

//     const handleReset = () => {
//         setSelectedCity('');
//         setSelectedDistrict('');
//         setSelectedNeighborhood('');
//         setDeposit(null);
//         setMonthlyRent(null);
//         setSelectedOptions([]);
//     };

//     const handlePriceChange = (newDeposit, newMonthlyRent) => {
//         setDeposit(newDeposit);
//         setMonthlyRent(newMonthlyRent);
//     };

//     const handleOptionsChange = (options) => {
//         setSelectedOptions(options);
//     };

//     return (
//         <div className='desktop-map-page'>
//             <DesktopMapPageNav onLoginSigninClick={() => console.log('로그인 |회원가입')}>
//                 <LocationSearch onSearch={handleLocationSearch} />
//             </DesktopMapPageNav>
//             <div className='desktop-map-page-content'>
//                 <div className='left-menu-content'>
//                     <MenuButtons 
//                         onMenuClick={handleMenuClick}
//                         activeMenu={activeMenu}
//                     />
//                 </div>
                
//                 <div className='right-content'>
//                     <Filter 
//                         selectedCity={selectedCity}
//                         selectedDistrict={selectedDistrict}
//                         selectedNeighborhood={selectedNeighborhood}
//                         cities={cities}
//                         districts={districts}
//                         neighborhoods={neighborhoods}
//                         onCityChange={handleCityChange}
//                         onDistrictChange={handleDistrictChange}
//                         onNeighborhoodChange={handleNeighborhoodChange}
//                         onReset={handleReset}
//                         onPriceChange={handlePriceChange}
//                         onOptionsChange={handleOptionsChange}
//                         deposit={deposit}
//                         monthlyRent={monthlyRent}
//                         selectedOptions={selectedOptions}
//                     />
                    
//                     <div className='right-content-inner'>
//                         <ListPanel 
//                             type={activeMenu}
//                             onItemClick={handleItemClick}
//                             items={searchResults}
//                         />
//                         <DetailPanel 
//                             isVisible={!!selectedItem}
//                             type={activeMenu}
//                             data={selectedItem}
//                             onClose={handleDetailClose}
//                         />
//                         <div className='map-container'>
//                             <div className='map-content'>
//                                 <Map
//                                     center={mapCenter}
//                                     style={{
//                                         width: '100%',
//                                         height: '100%',
//                                         borderRadius: '12px',
//                                         border: '1px solid #e1e1e1'
//                                     }}
//                                     level={3}
//                                 >
//                                     {searchResults.map((item, index) => {
//                                         if (!item || !item.latitude || !item.longitude) return null;
                                        
//                                         const position = {
//                                             lat: parseFloat(item.latitude),
//                                             lng: parseFloat(item.longitude)
//                                         };
                                        
//                                         const itemId = activeMenu === 'room' ? item.propertyId : item.userId;
//                                         const itemTitle = activeMenu === 'room' ? (item.title || '매물정보') : (item.username || '공인중개사');
//                                         return (
//                                             <MapMarker
//                                                 key={`marker-${itemId || index}`}
//                                                 position={position}
//                                                 onClick={() => handleItemClick(item)}
//                                                 title={itemTitle}
//                                             />
//                                         );
//                                     })}
//                                 </Map>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default MapPage;


// MapPage.js
import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import axios from 'axios';
import DesktopMapPageNav from '../../components/DesktopNav/DesktopMapPageNav';
import LocationSearch from '../../components/common/LocationSearch/LocationSearch';
import MenuButtons from '../../components/common/MenuButtons/MenuBottons';
import Filter from '../../components/common/Filter/Filter';
import ListPanel from '../../components/common/ListPanel/ListPanel';
import DetailPanel from '../../components/common/DetailPanel/DetailPanel';
import './MapPage.css';

function MapPage() {
    // URL 파라미터에서 type 가져오기
    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get('type');

    // 상태 관리
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [activeMenu, setActiveMenu] = useState(typeParam || 'room');
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [mapCenter, setMapCenter] = useState({
        lat: 37.566826,
        lng: 126.978656
    });
    const [deposit, setDeposit] = useState(null);
    const [monthlyRent, setMonthlyRent] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);

    // 시/도 데이터 가져오기
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('https://i12d205.p.ssafy.io/api/sidos');
                console.log('Fetched cities:', response.data);
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
                    const response = await axios.get(`https://i12d205.p.ssafy.io/api/guguns?sidoName=${encodeURIComponent(selectedCity)}`);
                    console.log('Fetched districts:', response.data);
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
                    const response = await axios.get(`https://i12d205.p.ssafy.io/api/dongs?sidoName=${encodeURIComponent(selectedCity)}&gugunName=${encodeURIComponent(selectedDistrict)}`);
                    console.log('Fetched neighborhoods:', response.data);
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

            console.log('Property search params:', Object.fromEntries(params));

            // 필터 조건이 없을 때도 전체 매물 조회
            if (params.toString() === '') {
                try {
                    const response = await axios.get('https://i12d205.p.ssafy.io/api/properties/search');
                    const validResults = response.data.filter(item =>
                        item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
                    );
                    console.log('All properties response:', validResults);
                    setSearchResults(validResults);
                    
                    if (validResults.length > 0) {
                        const newCenter = {
                            lat: parseFloat(validResults[0].latitude),
                            lng: parseFloat(validResults[0].longitude)
                        };
                        setMapCenter(newCenter);
                    }
                    return;
                } catch (error) {
                    console.error('Error fetching all properties:', error);
                    setSearchResults([]);
                    return;
                }
            }

            const response = await axios.get('https://i12d205.p.ssafy.io/api/properties/search', {
                params: params,
                paramsSerializer: {
                    indexes: null
                }
            });

            const validResults = response.data.filter(item =>
                item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
            );
            
            console.log('Filtered properties response:', validResults);
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

    // 공인중개사 목록 가져오기
    const fetchRealtors = async () => {
        try {
            console.log('Current Filter Settings:', {
                selectedCity,
                selectedDistrict,
                selectedNeighborhood,
                filterStatus: !selectedCity || !selectedDistrict || !selectedNeighborhood ? '전체 조회' : '필터링된 조회'
            });

            if (!selectedCity || !selectedDistrict || !selectedNeighborhood) {
                console.log('Fetching all realtors from:', 'https://i12d205.p.ssafy.io/api/users/realtors');
                const response = await axios.get('https://i12d205.p.ssafy.io/api/users/realtors');
                console.log('All realtors response:', response.data);
                setSearchResults(response.data);
                
                if (response.data.length > 0) {
                    const firstItem = response.data[0];
                    if (firstItem.latitude && firstItem.longitude) {
                        setMapCenter({
                            lat: parseFloat(firstItem.latitude),
                            lng: parseFloat(firstItem.longitude)
                        });
                    }
                }
                return;
            }

            try {
                console.log('Current neighborhoods data:', neighborhoods);
                
                const selectedDong = neighborhoods.find(n => 
                    n.dongName === selectedNeighborhood || n.name === selectedNeighborhood
                );

                console.log('Selected dong data:', selectedDong);

                const dongCode = selectedDong?.dongCode || selectedDong?.dongcode || selectedDong?.code || selectedDong?.id;

                if (!dongCode) {
                    console.error('DongCode not found for:', selectedNeighborhood);
                    console.error('Selected dong data:', selectedDong);
                    setSearchResults([]);
                    return;
                }

                const apiUrl = `https://i12d205.p.ssafy.io/api/users/${dongCode}/realtors`;
                console.log('Fetching filtered realtors from:', apiUrl);
                
                const response = await axios.get(apiUrl);
                console.log('Filtered realtors response:', response.data);
                
                const resultsWithLocation = response.data.map(realtor => ({
                    ...realtor,
                    dongCode: dongCode,
                    dongName: selectedNeighborhood
                }));
                
                console.log('Results with location:', resultsWithLocation);
                setSearchResults(resultsWithLocation);

                if (resultsWithLocation.length > 0) {
                    const firstItem = resultsWithLocation[0];
                    if (firstItem.latitude && firstItem.longitude) {
                        setMapCenter({
                            lat: parseFloat(firstItem.latitude),
                            lng: parseFloat(firstItem.longitude)
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching realtors by dongcode:', error);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching realtors:', error);
            setSearchResults([]);
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
    }, [selectedCity, selectedDistrict, selectedNeighborhood, deposit, monthlyRent, selectedOptions, activeMenu]);

    const handleLocationSearch = ({ sidoName, gugunName, dongName }) => {
        setSelectedCity(sidoName);
        setSelectedDistrict(gugunName);
        setSelectedNeighborhood(dongName);
    };

    const handleMenuClick = (menuType) => {
        setActiveMenu(menuType);
        setSelectedItem(null);
        if (menuType === 'agent') {
            fetchRealtors();
        } else {
            fetchSearchResults();
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
        // 매물 마커도 초기화
        if (activeMenu === 'agent') {
            fetchRealtors();
        }
    };

    const handleViewProperties = async (userId) => {
        try {
            const response = await axios.get(`https://i12d205.p.ssafy.io/api/properties`, {
                params: {
                    userId: userId
                }
            });
            
            // 유효한 좌표가 있는 매물만 필터링
            const validResults = response.data.filter(item =>
                item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
            );
            
            setSearchResults(validResults);

            if (validResults.length > 0) {
                const newCenter = {
                    lat: parseFloat(validResults[0].latitude),
                    lng: parseFloat(validResults[0].longitude)
                };
                setMapCenter(newCenter);
            }
        } catch (error) {
            console.error('Error fetching realtor properties:', error);
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
    };

    const handlePriceChange = (newDeposit, newMonthlyRent) => {
        setDeposit(newDeposit);
        setMonthlyRent(newMonthlyRent);
    };

    const handleOptionsChange = (options) => {
        setSelectedOptions(options);
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