import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import ChatApi from '../../services/ChatApi';

const API_BASE_URL = 'https://i12d205.p.ssafy.io';
const DEFAULT_CENTER = {
  lat: 37.566826,
  lng: 126.978656,
};

function MapPage({
  onLoginSigninClick,
  setIsOpen,
  setSelectedRoom,
  setChatRooms, // 추가
  currentUserId,
  userRole,
}) {
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    if (typeParam) {
      setActiveMenu(typeParam);
      if (typeParam === 'agent') {
        fetchRealtors();
      } else {
        fetchSearchResults();
      }
    }
  }, [typeParam]);

  const updateMapCenter = (newCenter) => {
    if (
      newCenter &&
      typeof newCenter.lat === 'number' &&
      typeof newCenter.lng === 'number' &&
      !isNaN(newCenter.lat) &&
      !isNaN(newCenter.lng)
    ) {
      setMapCenter(newCenter);
    }
  };

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
          const response = await axios.get(
            `${API_BASE_URL}/api/guguns?sidoName=${encodeURIComponent(selectedCity)}`
          );
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
          const response = await axios.get(
            `${API_BASE_URL}/api/dongs?sidoName=${encodeURIComponent(selectedCity)}&gugunName=${encodeURIComponent(selectedDistrict)}`
          );
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
      await new Promise((resolve) => setTimeout(resolve, 100));
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
            lng: parseFloat(result[0].x),
          });
        } else {
          reject(new Error('Geocoding failed: ' + status));
        }
      });
    });
  };

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

      const response = await axios.get(
        `${API_BASE_URL}/api/properties/search`,
        {
          params: params,
          paramsSerializer: {
            indexes: null,
          },
        }
      );

      const validResults = response.data.filter(
        (item) =>
          item &&
          typeof item.latitude === 'number' &&
          typeof item.longitude === 'number'
      );

      setSearchResults(validResults);
      setPropertyMarkers([]);

      // 검색 결과가 있을 경우 첫 번째 결과의 위치로 이동
      if (validResults.length > 0) {
        updateMapCenter({
          lat: parseFloat(validResults[0].latitude),
          lng: parseFloat(validResults[0].longitude),
        });
        setMapLevel(3);
      }
      // 검색 결과가 없지만 지역이 선택된 경우, 선택된 지역의 좌표로 이동
      else if (selectedCity && selectedDistrict) {
        try {
          const address =
            `${selectedCity} ${selectedDistrict} ${selectedNeighborhood || ''}`.trim();
          const coordinates = await searchCoordinates(address);
          if (coordinates) {
            updateMapCenter(coordinates);
            setMapLevel(5);
          }
        } catch (error) {
          console.error(
            'Error getting coordinates for selected location:',
            error
          );
        }
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setPropertyMarkers([]);
    }
  };

  const fetchRealtors = async () => {
    try {
      // 지역 필터가 없는 경우 전체 공인중개사 목록 조회
      if (!selectedCity || !selectedDistrict || !selectedNeighborhood) {
        const response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
        const realtors = response.data.map((realtor) => ({
          ...realtor,
          type: 'agent',
        }));

        setSearchResults(realtors);
        setPropertyMarkers(realtors);
        return;
      }

      // 동까지 모두 선택된 경우
      if (selectedCity && selectedDistrict && selectedNeighborhood) {
        try {
          const address = `${selectedCity} ${selectedDistrict} ${selectedNeighborhood}`;
          const coordinates = await searchCoordinates(address);

          if (coordinates) {
            updateMapCenter(coordinates);
            setMapLevel(3);
          }

          const selectedDong = neighborhoods.find(
            (n) =>
              n.dongName === selectedNeighborhood ||
              n.name === selectedNeighborhood
          );
          const dongCode =
            selectedDong?.dongCode ||
            selectedDong?.dongcode ||
            selectedDong?.code ||
            selectedDong?.id;

          if (dongCode) {
            const response = await axios.get(
              `${API_BASE_URL}/api/users/${dongCode}/realtors`
            );
            const realtors = response.data.map((realtor) => ({
              ...realtor,
              type: 'agent',
            }));
            setSearchResults(realtors);
            setPropertyMarkers(realtors);
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


  useEffect(() => {
    // 현재 activeMenu 값 캡처
    const currentMenu = activeMenu;
    
    if (currentMenu === 'room') {
      const fetchAndUpdateResults = async () => {
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
  
          const response = await axios.get(
            `${API_BASE_URL}/api/properties/search`,
            {
              params: params,
              paramsSerializer: {
                indexes: null,
              },
            }
          );
  
          const validResults = response.data.filter(
            (item) =>
              item &&
              typeof item.latitude === 'number' &&
              typeof item.longitude === 'number' &&
              !isNaN(item.latitude) &&
              !isNaN(item.longitude)
          );
  
          // 현재 activeMenu가 여전히 일치하는지 확인
          if (activeMenu === currentMenu) {           
            // 데이터에 type 속성 명시적으로 추가
            const roomsWithType = validResults.map(room => ({
              ...room,
              type: 'room'
            }));
            
            setSearchResults(roomsWithType);
  
            // 현재 선택된 매물이 검색 결과에 없는 경우에만 DetailPanel 닫기
            if (selectedItem && selectedItem.type === 'room') {
              const itemExists = validResults.some(
                (item) => item.propertyId === selectedItem.propertyId
              );
              if (!itemExists) {
                setSelectedItem(null);
                setDetailPanelView('main');
              }
            }
  
            // 검색 결과가 있는 경우
            if (validResults.length > 0) {
              updateMapCenter({
                lat: parseFloat(validResults[0].latitude),
                lng: parseFloat(validResults[0].longitude),
              });
              setMapLevel(3);
            }
            // 검색 결과가 없지만 지역이 선택된 경우
            else if (selectedCity && selectedDistrict) {
              try {
                const address =
                  `${selectedCity} ${selectedDistrict} ${selectedNeighborhood || ''}`.trim();
                const coordinates = await searchCoordinates(address);
                if (coordinates) {
                  updateMapCenter(coordinates);
                  setMapLevel(5);
                }
              } catch (error) {
                console.error(
                  'Error getting coordinates for selected location:',
                  error
                );
              }
            }
            // 검색 결과도 없고 지역도 선택되지 않은 경우
            else {
              updateMapCenter(DEFAULT_CENTER);
              setMapLevel(3);
            }
          } else {
            // console.log(`메뉴가 변경됨 - ${currentMenu} → ${activeMenu}. Room 데이터 로드 취소`);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
          updateMapCenter(DEFAULT_CENTER);
          setMapLevel(3);
        }
      };
  
      fetchAndUpdateResults();
    } else if (currentMenu === 'agent') {
      // console.log('Agent 메뉴 데이터 로딩 시작');
      // 공인중개사 메뉴일 때의 로직
      const fetchFilteredRealtors = async () => {
        try {
          let response;
          if (selectedCity && selectedDistrict && selectedNeighborhood) {
            // 동까지 선택된 경우의 로직
            try {
              const address = `${selectedCity} ${selectedDistrict} ${selectedNeighborhood}`;
              const coordinates = await searchCoordinates(address);
  
              if (coordinates) {
                updateMapCenter(coordinates);
                setMapLevel(3);
              }
  
              const selectedDong = neighborhoods.find(
                (n) =>
                  n.dongName === selectedNeighborhood ||
                  n.name === selectedNeighborhood
              );
              const dongCode =
                selectedDong?.dongCode ||
                selectedDong?.dongcode ||
                selectedDong?.code ||
                selectedDong?.id;
  
              if (dongCode) {
                response = await axios.get(
                  `${API_BASE_URL}/api/users/${dongCode}/realtors`
                );
              }
            } catch (error) {
              console.error('Error fetching dong realtors:', error);
            }
          }
  
          if (!response) {
            response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
          }
  
          const validRealtors = response.data
            .filter(
              (realtor) =>
                realtor &&
                typeof realtor.latitude === 'number' &&
                typeof realtor.longitude === 'number' &&
                !isNaN(realtor.latitude) &&
                !isNaN(realtor.longitude)
            );
  
          // 현재 activeMenu가 여전히 일치하는지 확인
          if (activeMenu === currentMenu) {
            // 명시적으로 타입 추가
            const realtorsWithType = validRealtors.map(realtor => ({
              ...realtor,
              type: 'agent'
            }));
            
            setSearchResults(realtorsWithType);
            setPropertyMarkers(realtorsWithType);
  
            if (realtorsWithType.length > 0) {
              const firstRealtor = realtorsWithType[0];
              updateMapCenter({
                lat: parseFloat(firstRealtor.latitude),
                lng: parseFloat(firstRealtor.longitude),
              });
  
              // 지역 필터가 적용된 경우는 더 자세히 보여주기 위해 레벨 3으로,
              // 그렇지 않은 경우는 전체를 보여주기 위해 레벨 7로 설정
              setMapLevel(selectedCity ? 3 : 7);
            }
  
            // 현재 선택된 공인중개사가 검색 결과에 없는 경우에만 DetailPanel 닫기
            if (selectedItem && selectedItem.type === 'agent') {
              const itemExists = realtorsWithType.some(
                (realtor) => realtor.userId === selectedItem.userId
              );
              if (!itemExists) {
                setSelectedItem(null);
                setDetailPanelView('main');
              }
            }
  
            if (!selectedCity && realtorsWithType.length > 0) {
              updateMapCenter({
                lat: parseFloat(realtorsWithType[0].latitude),
                lng: parseFloat(realtorsWithType[0].longitude),
              });
              setMapLevel(3);
            }
          } else {
            // console.log(`메뉴가 변경됨 - ${currentMenu} → ${activeMenu}. Agent 데이터 로드 취소`);
          }
        } catch (error) {
          console.error('Error fetching realtors:', error);
          setSearchResults([]);
          setPropertyMarkers([]); // 에러 시 마커도 초기화
        }
      };
  
      fetchFilteredRealtors();
    }
  }, [
    selectedCity,
    selectedDistrict,
    selectedNeighborhood,
    activeMenu,
    deposit,
    monthlyRent,
    selectedOptions,
  ]);

  const handleMenuClick = async (menuType) => {
    
    // 즉시 상태 초기화 - 데이터 일관성 문제 방지
    setSelectedItem(null);
    setDetailPanelView('main');
    
    // 비동기 작업 전에 메뉴 상태 변경
    setActiveMenu(menuType);
    
    // 이제 데이터 컬렉션 초기화
    setSearchResults([]);
    setPropertyMarkers([]);
    setInitialProperties([]);
  
    // 지연 실행으로 상태 업데이트 완료 보장
    setTimeout(async () => {
      // 메뉴가 여전히 현재 메뉴인지 확인
      if (activeMenu !== menuType) {
        // console.log('메뉴가 이미 변경되어 데이터 로딩 취소');
        return;
      }
      
      if (menuType === 'agent') {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
          const validRealtors = response.data.filter(
            (realtor) =>
              realtor &&
              typeof realtor.latitude === 'number' &&
              typeof realtor.longitude === 'number' &&
              !isNaN(realtor.latitude) &&
              !isNaN(realtor.longitude)
          );
  
          // 현재 메뉴 다시 확인
          if (activeMenu === menuType) {
            const realtorsWithType = validRealtors.map(realtor => ({
              ...realtor,
              type: 'agent'
            }));
            setSearchResults(realtorsWithType);
            setPropertyMarkers(realtorsWithType);
            
            // 지도 중심 설정
            if (realtorsWithType.length > 0) {
              updateMapCenter({
                lat: parseFloat(realtorsWithType[0].latitude),
                lng: parseFloat(realtorsWithType[0].longitude),
              });
              setMapLevel(3);
            }
          }
        } catch (error) {
          console.error('공인중개사 데이터 로딩 실패:', error);
        }
      } else {
        // room 메뉴 데이터 로딩
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
  
          const response = await axios.get(
            `${API_BASE_URL}/api/properties/search`,
            {
              params: params,
              paramsSerializer: {
                indexes: null,
              },
            }
          );
  
          // 현재 메뉴 다시 확인
          if (activeMenu === menuType) {
            const validResults = response.data.filter(
              (item) =>
                item &&
                typeof item.latitude === 'number' &&
                typeof item.longitude === 'number' &&
                !isNaN(item.latitude) &&
                !isNaN(item.longitude)
            );
  
            const roomsWithType = validResults.map(room => ({
              ...room,
              type: 'room'
            }));
            setSearchResults(roomsWithType);
            
            // 지도 중심 설정
            if (roomsWithType.length > 0) {
              updateMapCenter({
                lat: parseFloat(roomsWithType[0].latitude),
                lng: parseFloat(roomsWithType[0].longitude),
              });
              setMapLevel(3);
            }
          }
        } catch (error) {
          console.error('원룸 데이터 로딩 실패:', error);
        }
      }
    }, 0);
  };

  const handleChatRoomCreated = async (newRoom) => {
    try {
      // 채팅방 목록 새로 가져오기
      const updatedRooms = await ChatApi.getChatRooms(currentUserId, userRole);

      // 전체 채팅방 목록 업데이트
      setChatRooms(updatedRooms);

      // 채팅 슬라이드 열고 새로운 방 선택
      setIsOpen(true);
      setSelectedRoom(newRoom);
    } catch (error) {
      console.error('Error updating chat rooms:', error);
    }
  };

  const handleReset = async () => {
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedNeighborhood('');
    setDeposit(null);
    setMonthlyRent(null);
    setSelectedOptions([]);
    setInitialProperties([]);

    if (activeMenu === 'agent') {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
        const validRealtors = response.data.filter(
          (realtor) =>
            realtor &&
            typeof realtor.latitude === 'number' &&
            typeof realtor.longitude === 'number' &&
            !isNaN(realtor.latitude) &&
            !isNaN(realtor.longitude)
        );

        const realtorsWithType = validRealtors.map((realtor) => ({
          ...realtor,
          type: 'agent',
        }));

        setSearchResults(realtorsWithType);
        setPropertyMarkers(realtorsWithType);

        if (validRealtors.length > 0) {
          updateMapCenter({
            lat: parseFloat(validRealtors[0].latitude),
            lng: parseFloat(validRealtors[0].longitude),
          });
          setMapLevel(3);
        }
      } catch (error) {
        console.error('Error fetching realtors:', error);
        setSearchResults([]);
        setPropertyMarkers([]);
      }
    } else {
      setPropertyMarkers([]);
      updateMapCenter(DEFAULT_CENTER);
      setMapLevel(3);
    }
  };

  const handleLocationSearch = async ({ sidoName, gugunName, dongName }) => {
    // 지도 이동
    if (sidoName && gugunName) {
      try {
        const fullAddress = `${sidoName} ${gugunName} ${dongName || ''}`.trim();
        const coordinates = await searchCoordinates(fullAddress);
        if (coordinates) {
          updateMapCenter(coordinates);
          setMapLevel(3);
        }
      } catch (error) {
        console.error('Error getting coordinates:', error);
      }
    }

    // 상태 업데이트
    setSelectedCity(sidoName);
    setSelectedDistrict(gugunName);
    setSelectedNeighborhood(dongName);

    try {
      if (activeMenu === 'room') {
        const params = new URLSearchParams();

        if (sidoName) params.append('sidoName', sidoName);
        if (gugunName) params.append('gugunName', gugunName);
        if (dongName) params.append('dongName', dongName);
        if (deposit) params.append('maxDeposit', deposit);
        if (monthlyRent) params.append('maxMonthlyRent', monthlyRent);
        if (selectedOptions?.length > 0) {
          params.append('optionIds', selectedOptions.join(','));
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/properties/search`,
          {
            params: params,
            paramsSerializer: {
              indexes: null,
            },
          }
        );

        const validResults = response.data.filter(
          (item) =>
            item &&
            typeof item.latitude === 'number' &&
            typeof item.longitude === 'number' &&
            !isNaN(item.latitude) &&
            !isNaN(item.longitude)
        );

        setSearchResults(validResults);
        setSelectedItem(null);
        setPropertyMarkers([]);

        if (validResults.length > 0) {
          updateMapCenter({
            lat: parseFloat(validResults[0].latitude),
            lng: parseFloat(validResults[0].longitude),
          });
          setMapLevel(5);
        }
      } else {
        // 공인중개사 메뉴일 때의 로직
        let response = null;

        if (dongName) {
          try {
            const requestUrl = `${API_BASE_URL}/api/dongs?sidoName=${sidoName}&gugunName=${gugunName}`;
            const dongResponse = await axios.get(requestUrl);

            if (dongResponse.data && dongResponse.data.length > 0) {
              const normalizedDongName = dongName
                .replace(/\s+/g, '')
                .toLowerCase();
              const selectedDong = dongResponse.data.find((dong) => {
                const dongNameToCompare = (dong.dongName || dong.name || '')
                  .replace(/\s+/g, '')
                  .toLowerCase();
                return dongNameToCompare === normalizedDongName;
              });

              if (selectedDong) {
                const dongCode = selectedDong.dongCode || selectedDong.dongcode;
                if (dongCode) {
                  response = await axios.get(
                    `${API_BASE_URL}/api/users/${dongCode}/realtors`
                  );
                }
              }
            }
          } catch (error) {
            console.error('Error fetching dong info:', error);
          }
        }

        if (!response) {
          response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
        }

        const realtors = response.data.map((realtor) => ({
          ...realtor,
          type: 'agent',
        }));

        setSearchResults(realtors);
        setSelectedItem(null);
        setPropertyMarkers(realtors);
      }
    } catch (error) {
      console.error('Error updating search results:', error);
      setSearchResults([]);
      setPropertyMarkers([]);
    }
  };

  const handleItemClick = (item, isPropertyMarker = false, view, setView) => {
    if (isPropertyMarker || item.type === 'room' || activeMenu === 'room') {
      const roomItem = {
        ...item,
        type: 'room',
      };
      setSelectedItem(roomItem);
      // 매물 마커 설정
      if (roomItem.latitude && roomItem.longitude) {
        setPropertyMarkers([roomItem]);
        updateMapCenter({
          lat: parseFloat(roomItem.latitude),
          lng: parseFloat(roomItem.longitude),
        });
        setMapLevel(3);
      }
    } else {
      if (view === 'propertyDetail') {
        setView('main');
      }

      const agentItem = {
        ...item,
        type: 'agent',
      };
      setSelectedItem(agentItem);
      // 공인중개사 마커 설정
      if (agentItem.latitude && agentItem.longitude) {
        setPropertyMarkers([agentItem]);
        updateMapCenter({
          lat: parseFloat(agentItem.latitude),
          lng: parseFloat(agentItem.longitude),
        });
        setMapLevel(3);
      }
    }
  };

  const handleDetailClose = async (type) => {
    setSelectedItem(null);

    if (type === 'agent') {
      // 공인중개사 메뉴인 경우
      try {
        // ListPanel에 표시된 공인중개사들을 마커로 표시
        const realtorsToShow = searchResults.map((realtor) => ({
          ...realtor,
          type: 'agent',
        }));

        setPropertyMarkers(realtorsToShow);

        // 모든 마커가 잘 보이도록 지도 중심과 레벨 조정
        if (realtorsToShow.length > 0) {
          updateMapCenter({
            lat: parseFloat(realtorsToShow[0].latitude),
            lng: parseFloat(realtorsToShow[0].longitude),
          });
          setMapLevel(3);
        }
      } catch (error) {
        console.error('Error showing realtor markers:', error);
        setPropertyMarkers([]);
      }
    } else {
      // 원룸 메뉴인 경우 전체 검색 결과 마커 표시
      if (searchResults.length > 0) {
        setPropertyMarkers(searchResults);
        updateMapCenter({
          lat: parseFloat(searchResults[0].latitude),
          lng: parseFloat(searchResults[0].longitude),
        });
        setMapLevel(3);
      } else {
        setPropertyMarkers([]);
        updateMapCenter(DEFAULT_CENTER);
        setMapLevel(3);
      }
    }

    setInitialProperties([]);
  };

  const handleViewProperties = async (
    realtorId,
    selectedPropertyId = null,
    propertiesData = null,
    isBack = false
  ) => {
    try {
      // 데이터 가져오기
      const properties =
        propertiesData ||
        (await axios.get(`${API_BASE_URL}/api/properties/realtor/${realtorId}`))
          .data;

      const validResults = properties.filter(
        (item) =>
          item &&
          typeof item.latitude === 'number' &&
          typeof item.longitude === 'number' &&
          !isNaN(item.latitude) &&
          !isNaN(item.longitude)
      );

      if (selectedPropertyId) {
        // 특정 매물이 선택된 경우
        const selectedProperty = validResults.find(
          (item) => item.propertyId === selectedPropertyId
        );
        if (selectedProperty) {
          setPropertyMarkers([selectedProperty]);
          setInitialProperties([selectedProperty]);
          const center = {
            lat: parseFloat(selectedProperty.latitude),
            lng: parseFloat(selectedProperty.longitude),
          };
          updateMapCenter(center);
          setMapCenter(center);
          setMapLevel(3);
        }
      } else {
        // 전체 매물 목록을 보여주는 경우
        setInitialProperties(validResults);
        setPropertyMarkers(validResults);

        if (validResults.length > 0) {
          // 뒤로가기인 경우 더 넓은 시야로 보여주기
          if (isBack) {
            // 모든 마커가 보이도록 중심점과 확대 레벨 조정
            const center = {
              lat: parseFloat(validResults[0].latitude),
              lng: parseFloat(validResults[0].longitude),
            };
            updateMapCenter(center);
            setMapCenter(center);
            setMapLevel(3);
          } else {
            const center = {
              lat: parseFloat(validResults[0].latitude),
              lng: parseFloat(validResults[0].longitude),
            };
            updateMapCenter(center);
            setMapCenter(center);
            setMapLevel(3);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching realtor properties:', error);
      setPropertyMarkers([]);
      setInitialProperties([]);
    }
  };

  const handleSwitchToAgent = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/realtors`);
      const targetAgent = response.data.find(
        (realtor) => realtor.userId === userId
      );

      if (!targetAgent) return;

      const realtorsWithType = response.data.map((realtor) => ({
        ...realtor,
        type: 'agent',
      }));

      const targetAgentWithType = {
        ...targetAgent,
        type: 'agent',
      };

      setActiveMenu('agent');
      setSelectedItem(null);
      setSearchResults(realtorsWithType);

      setTimeout(() => {
        setSelectedItem(targetAgentWithType);
        setPropertyMarkers([targetAgentWithType]);

        if (targetAgent.latitude && targetAgent.longitude) {
          updateMapCenter({
            lat: parseFloat(targetAgent.latitude),
            lng: parseFloat(targetAgent.longitude),
          });
          setMapLevel(3);
        }
      }, 100);
    } catch (error) {
      console.error('Error switching to agent view:', error);
    }
  };

  const handleWorldCupWinner = async (winner) => {
    setActiveMenu('room');
    setSelectedItem({ ...winner, type: 'room' });

    if (winner.latitude && winner.longitude) {
      setPropertyMarkers([winner]);
      updateMapCenter({
        lat: parseFloat(winner.latitude),
        lng: parseFloat(winner.longitude),
      });
      setMapLevel(3);
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

  const handlePriceChange = (newDeposit, newMonthlyRent) => {
    setDeposit(newDeposit);
    setMonthlyRent(newMonthlyRent);
  };

  const handleOptionsChange = (options) => {
    setSelectedOptions(options);
  };

  return (
    <div className='desktop-map-page'>
      <DesktopMapPageNav onLoginSigninClick={onLoginSigninClick}>
        <LocationSearch onSearch={handleLocationSearch} />
      </DesktopMapPageNav>
      <div className='desktop-map-page-content'>
        <div className='left-menu-content'>
          <MenuButtons onMenuClick={handleMenuClick} activeMenu={activeMenu} />
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
            {activeMenu !== 'agent' && (
              <div className='filter-worldcup-container'>
                <WorldCup
                  properties={searchResults}
                  isOpen={isWorldCupOpen}
                  onClose={() => setIsWorldCupOpen(false)}
                  onSelectWinner={handleWorldCupWinner}
                />
              </div>
            )}
          </div>
          <div className='right-content-inner'>
            <ListPanel
              type={activeMenu}
              onItemClick={(item) =>
                handleItemClick(
                  item,
                  false,
                  detailPanelView,
                  setDetailPanelView
                )
              }
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
              onSwitchToAgent={handleSwitchToAgent}
              onChatRoomCreated={handleChatRoomCreated} // 이미 전달되어 있음
            />
            <div className='map-container'>
              <div className='map-content'>
                {mapCenter &&
                  typeof mapCenter.lat === 'number' &&
                  typeof mapCenter.lng === 'number' && (
                    <Map
                      center={mapCenter}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '12px',
                        border: '1px solid #e1e1e1',
                      }}
                      level={mapLevel}
                    >
                      {/* 원룸 메뉴일 때만 searchResults 마커 표시 */}
                      {activeMenu === 'room' &&
                        !selectedItem &&
                        propertyMarkers.length === 0 &&
                        searchResults.map((item, index) => {
                          if (!item?.latitude || !item?.longitude) return null;

                          const position = {
                            lat: parseFloat(item.latitude),
                            lng: parseFloat(item.longitude),
                          };

                          if (isNaN(position.lat) || isNaN(position.lng))
                            return null;

                          return (
                            <MapMarker
                              key={`marker-${item.propertyId || index}`}
                              position={position}
                              onClick={() => handleItemClick(item)}
                              title={item.title || '매물정보'}
                            />
                          );
                        })}

                      {/* 공인중개사 메뉴이거나 propertyMarkers가 있을 때 propertyMarkers 마커 표시 */}
                      {propertyMarkers.map((item, index) => {
                        if (!item?.latitude || !item?.longitude) return null;

                        const position = {
                          lat: parseFloat(item.latitude),
                          lng: parseFloat(item.longitude),
                        };

                        if (isNaN(position.lat) || isNaN(position.lng))
                          return null;

                        return (
                          <MapMarker
                            key={`property-${item.propertyId || index}`}
                            position={position}
                            onClick={() => handleItemClick(item, true)}
                            title={item.username || item.title || '매물정보'}
                            image={
                              activeMenu === 'agent'
                                ? {
                                    src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                                    size: {
                                      width: 24,
                                      height: 35,
                                    },
                                  }
                                : undefined
                            }
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
