import React, { useState, useEffect, useRef } from 'react';
import './MobileLiveSettingPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import ChatWebSocket from '../../services/webSocket/chatWebSocket';
import { useUser } from '../../contexts/UserContext';

const API_BASE_URL = '/api';

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'accept': '*/*',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAzMDEzLCJleHAiOjE3NDAxMTI2MTN9.s6tgPhKV61WYbIbjPHPg6crY0gFvc0T-RhQJ-bGVGWg',
//         'userId': '33'
//     }
// });

// axios 기본 설정
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    accept: '*/*',
    'Content-Type': 'application/json',
  },
});

const MobileLiveSettingPage = () => {
  const { user, isLoading } = useUser();
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, userId } = location.state || {};
  const chatSocketRef = useRef(null);

  // 웹소켓 연결 설정
  useEffect(() => {
    if (roomId) {
      chatSocketRef.current = new ChatWebSocket(roomId);
      chatSocketRef.current.connect();
    }

    return () => {
      if (chatSocketRef.current) {
        chatSocketRef.current.disconnect();
      }
    };
  }, [roomId]);

  // useEffect(() => {
  //     const fetchProperties = async () => {
  //         try {
  //             const response = await axios.get(`/api/properties?userId=32`);
  //             setProperties(response.data);
  //         } catch (error) {
  //             console.error('Error fetching properties:', error);
  //         }
  //     };

  //     fetchProperties();
  // }, []);

  //   useEffect(() => {
  //     const fetchProperties = async () => {
  //       try {
  //         // userId는 서버에서 세션/쿠키를 통해 확인
  //         const response = await api.get('/properties');
  //         setProperties(response.data);
  //       } catch (error) {
  //         console.error('Error fetching properties:', error);
  //       }
  //     };

  //     fetchProperties();
  //   }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // isLoading 체크를 통해 user가 초기화되었는지 확인
        if (isLoading) return;

        const response = await api.get(`/properties?userId=${user?.userId}`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    if (user?.userId) {
      fetchProperties();
    }
  }, [user?.userId, isLoading]);

  const handlePropertySelect = (property) => {
    // 이미 선택된 매물이면 선택 취소
    if (selectedProperties.some((p) => p.propertyId === property.propertyId)) {
      setSelectedProperties(
        selectedProperties.filter((p) => p.propertyId !== property.propertyId)
      );
    } else {
      // 새로운 매물 선택
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const removeFromSelected = (propertyId) => {
    setSelectedProperties(
      selectedProperties.filter((p) => p.propertyId !== propertyId)
    );
  };

  const handleStartLive = async () => {
    if (selectedProperties.length === 0) {
      alert('라이브에 보여줄 매물을 하나 이상 선택해주세요.');
      return;
    }

    try {
      const response = await api.post('/lives', {
        propertyIds: selectedProperties.map((prop) => prop.propertyId),
        role: 'host',
      });

      const { sessionId, token } = response.data;
      console.log('Session created successfully:', { sessionId, token });

      // 웹소켓을 통한 시스템 메시지 전송
      if (roomId && chatSocketRef.current) {
        const messageData = {
          roomId: roomId,
          userId: userId,
          content: `라이브 방송이 시작되었습니다!\n세션 ID: ${sessionId}\n방송 참여하기: /desktop-live-join?sessionId=${sessionId}`,
          senderType: 'SYSTEM',
        };

        const sent = await chatSocketRef.current.sendMessage(messageData);
        if (!sent) {
          console.error('시스템 메시지 전송 실패');
        }
      }

      // MobileLivePage로 이동
      navigate('/mobile-live', {
        state: {
          sessionId,
          token,
          role: 'host',
          selectedProperties: selectedProperties.map((prop) => prop.propertyId),
          // connection.data에 전달할 정보도 포함
          clientData: JSON.stringify({ role: 'host' }), // OpenVidu connection.data용
        },
      });
    } catch (error) {
      console.error('Error creating session:', error);
      alert('라이브 세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // Loading state 처리
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 로그인하지 않은 경우 처리
  if (!user) {
    navigate('mobile-login');
    return null;
  }

  return (
    <div className='mobile-live-setting-page-container'>
      <div className='mobile-live-setting-page'>
        <div className='mobile-live-setting-page-header'>
          <p>라이브 설정</p>
        </div>
        <div className='mobile-live-setting-page-content'>
          <div className='mobile-live-setting-page-content-my-estate'>
            <p id='my-estate-title'>나의 부동산 매물</p>
            <div className='mobile-live-setting-page-content-my-estate-list'>
              {properties.map((property) => (
                <div
                  className={`mobile-live-setting-page-content-my-estate-list-item ${
                    selectedProperties.some(
                      (p) => p.propertyId === property.propertyId
                    )
                      ? 'selected'
                      : ''
                  }`}
                  key={property.propertyId}
                  onClick={() => handlePropertySelect(property)}
                >
                  <img
                    src={
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : '/default-property-image.png'
                    }
                    alt='estate'
                  />
                  <div className='mobile-live-setting-page-content-my-estate-list-item-info'>
                    <p id='estate-type'>
                      {(property.deposit ?? 0).toLocaleString()}원 /{' '}
                      {(property.monthlyRent ?? 0).toLocaleString()}원
                    </p>
                    <p id='estate-description'>
                      {property.description || '소개 없음'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='mobile-live-setting-page-content-select-estate'>
            <p id='select-estate-title'>라이브 순서</p>
            <div className='mobile-live-setting-page-content-select-estate-list'>
              {selectedProperties.map((property, index) => (
                <div
                  key={property.propertyId}
                  className='mobile-live-setting-page-content-select-estate-list-item'
                  onClick={() => removeFromSelected(property.propertyId)}
                >
                  <span className='order-number'>{index + 1}</span>
                  <div className='selected-property-info'>
                    <p>{property.description || '소개 없음'}</p>
                    <p>
                      {(property.deposit ?? 0).toLocaleString()}원 /{' '}
                      {(property.monthlyRent ?? 0).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='mobile-live-setting-page-content-button'>
            <p>시작후 폰을 가로로 돌려주세요.</p>
            <input
              type='button'
              value='라이브 시작'
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
