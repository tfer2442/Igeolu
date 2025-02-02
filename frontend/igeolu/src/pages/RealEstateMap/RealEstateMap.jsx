// src/pages/RealEstateMap/RealEstateMap.jsx
import React from 'react';
import Navbar from '../../components/layout/Navbar/Navbar';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import KakaoMap from '../../components/common/Map/KakaoMap';
import './RealEstateMap.css';

const RealEstateMap = () => {
  return (
    <div className="map-container">
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <div className="map-area">
          <KakaoMap />
        </div>
      </div>
    </div>
  );
};

export default RealEstateMap;