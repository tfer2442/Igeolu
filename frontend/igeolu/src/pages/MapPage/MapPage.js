
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
    const handleLoginSigninClick = () => {
        console.log('로그인 |회원가입');
    };

    // URL 파라미터에서 type 가져오기
    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get('type');


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

            if (params.toString() === '') {
                setSearchResults([]);
                return;
            }

            console.log('Search Parameters:', Object.fromEntries(params));

            const response = await axios.get('https://i12d205.p.ssafy.io/api/properties/search', {
                params: params,
                paramsSerializer: {
                    indexes: null
                }
            });

            const validResults = response.data.filter(item =>
                item && typeof item.latitude === 'number' && typeof item.longitude === 'number'
            );

            console.log('Valid Results:', validResults.map(item => ({
                id: item.propertyId,
                title: item.title,
                location: {
                    lat: item.latitude,
                    lng: item.longitude
                }
            })));
            
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

    useEffect(() => {
        if (activeMenu === 'room') {
            fetchSearchResults();
        }
        // 필터값이 변경될 때마다 DetailPanel 닫기
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
            setSearchResults([]);
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
        setSelectedOptions(options);
    };

    return (
        <div className='desktop-map-page'>
            <DesktopMapPageNav onLoginSigninClick={handleLoginSigninClick}>
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