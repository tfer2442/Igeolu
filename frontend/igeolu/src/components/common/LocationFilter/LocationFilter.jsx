// LocationFilter.jsx
import React from 'react';
import { RefreshCw } from 'lucide-react';
import './LocationFilter.css';

const LocationFilter = ({
  selectedCity,
  selectedDistrict,
  selectedNeighborhood,
  cities,
  districts,
  neighborhoods,
  onCityChange,
  onDistrictChange,
  onNeighborhoodChange,
  onReset
}) => {
  return (
    <div className='filter-content'>
      <div className='filter-wrapper'>
        <div className='filter'>
          <select 
            className='location-city'
            value={selectedCity}
            onChange={onCityChange}
          >
            <option value="">시/도</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>

          <select 
            className='location-district'
            value={selectedDistrict}
            onChange={onDistrictChange}
            disabled={!selectedCity}
          >
            <option value="">구/군</option>
            {selectedCity && districts[selectedCity]?.map((district, index) => (
              <option key={index} value={district}>{district}</option>
            ))}
          </select>

          <select 
            className='location-neighborhood'
            value={selectedNeighborhood}
            onChange={onNeighborhoodChange}
            disabled={!selectedDistrict}
          >
            <option value="">동</option>
            {selectedDistrict && neighborhoods[selectedDistrict]?.map((neighborhood, index) => (
              <option key={index} value={neighborhood}>{neighborhood}</option>
            ))}
          </select>
        </div>
        <button onClick={onReset} className='reset-button'>
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  );
};

export default LocationFilter;