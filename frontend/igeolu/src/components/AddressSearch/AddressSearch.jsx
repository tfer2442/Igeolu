import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddressSearch.css';

const AddressSearch = () => {
  const [sidos, setSidos] = useState([]);
  const [guguns, setGuguns] = useState([]);
  const [dongs, setDongs] = useState([]);
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedGugun, setSelectedGugun] = useState('');
  const [selectedDong, setSelectedDong] = useState('');
  const [properties, setProperties] = useState([]);

  // 시도 목록 조회
  useEffect(() => {
    axios.get('/api/sidos')
      .then(response => setSidos(response.data))
      .catch(error => console.error('시도 목록 조회 실패:', error));
  }, []);

  // 군구 목록 조회
  useEffect(() => {
    if (selectedSido) {
      axios.get('/api/guguns', {
        params: { sidoName: selectedSido }
      })
        .then(response => setGuguns(response.data))
        .catch(error => console.error('군구 목록 조회 실패:', error));
      setSelectedGugun('');
      setDongs([]);
    }
  }, [selectedSido]);

  // 동 목록 조회
  useEffect(() => {
    if (selectedSido && selectedGugun) {
      axios.get('/api/dongs', {
        params: {
          sidoName: selectedSido,
          gugunName: selectedGugun
        }
      })
        .then(response => setDongs(response.data))
        .catch(error => console.error('동 목록 조회 실패:', error));
      setSelectedDong('');
    }
  }, [selectedSido, selectedGugun]);

  // 매물 조회 함수
  const searchProperties = () => {
    if (!selectedDong) {
      alert('동을 선택해주세요');
      return;
    }

    axios.get('/api/properties', {
      params: { dongcode: selectedDong }
    })
      .then(response => {
        console.log('조회된 매물:', response.data);
        setProperties(response.data);
      })
      .catch(error => console.error('매물 조회 실패:', error));
  };

  return (
    <div className="address-search-container">
      <select 
        value={selectedSido} 
        onChange={(e) => setSelectedSido(e.target.value)}
      >
        <option value="">시/도 선택</option>
        {sidos.map((sido, index) => (
          <option key={index} value={sido}>{sido}</option>
        ))}
      </select>

      <select 
        value={selectedGugun} 
        onChange={(e) => setSelectedGugun(e.target.value)}
        disabled={!selectedSido}
      >
        <option value="">군/구 선택</option>
        {guguns.map((gugun, index) => (
          <option key={index} value={gugun}>{gugun}</option>
        ))}
      </select>

      <select 
        value={selectedDong} 
        onChange={(e) => {
          const selectedValue = e.target.value;
          setSelectedDong(selectedValue);
          console.log('선택된 동코드:', selectedValue);
        }}
        disabled={!selectedGugun}
      >
        <option value="">동 선택</option>
        {dongs.map((dong, index) => (
          <option key={index} value={dong.dongcode}>{dong.dongName}</option>
        ))}
      </select>

      <button 
        onClick={searchProperties}
        disabled={!selectedDong}
        className="search-button"
      >
        매물 조회
      </button>

      {/* 조회된 매물 수 표시 */}
      {properties.length > 0 && (
        <div className="properties-count">
          조회된 매물 수: {properties.length}개
        </div>
      )}
    </div>
  );
};

export default AddressSearch;