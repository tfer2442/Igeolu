// src/components/Map/KakaoMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import './KakaoMap.css';

const KakaoMap = () => {
  const mapRef = useRef(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.log('Waiting for Kakao Maps SDK...');
        return;
      }

      window.kakao.maps.load(() => {
        try {
          const container = mapRef.current;
          const options = {
            center: new window.kakao.maps.LatLng(37.5666805, 126.9784147),
            level: 5,
          };

          console.log('Creating map instance...');
          const map = new window.kakao.maps.Map(container, options);

          // 지도 컨트롤 추가
          const zoomControl = new window.kakao.maps.ZoomControl();
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

          const mapTypeControl = new window.kakao.maps.MapTypeControl();
          map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
          
          setIsKakaoLoaded(true);
          console.log('Map initialized successfully');
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      });
    };

    const checkKakaoAndInit = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
        clearInterval(checkKakaoAndInit);
      }
    }, 100);

    return () => {
      clearInterval(checkKakaoAndInit);
    };
  }, []);

  if (!isKakaoLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div 
      id="map" 
      ref={mapRef} 
      className="kakao-map"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default KakaoMap;