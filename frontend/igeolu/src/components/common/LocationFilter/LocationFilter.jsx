
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import './LocationFilter.css';

const LocationDropdownPanel = ({
  isOpen,
  onClose,
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
  if (!isOpen) return null;

  return (
    <div className="location-dropdown-panel">
      <div className="location-panel-content">
        <div className="location-columns">
          <div className="location-column">
            <div className="location-column-header">시/도</div>
            <div className="location-options">
              {cities?.map((city, index) => (
                <button
                  key={index}
                  className={`location-option ${selectedCity === (city.sidoName || city) ? 'selected' : ''}`}
                  onClick={() => onCityChange({ target: { value: city.sidoName || city } })}
                >
                  {city.sidoName || city}
                </button>
              ))}
            </div>
          </div>

          <div className="location-column">
            <div className="location-column-header">구/군</div>
            <div className="location-options">
              {districts?.map((district, index) => (
                <button
                  key={index}
                  className={`location-option ${selectedDistrict === (district.gugunName || district) ? 'selected' : ''}`}
                  onClick={() => onDistrictChange({ target: { value: district.gugunName || district } })}
                  disabled={!selectedCity}
                >
                  {district.gugunName || district}
                </button>
              ))}
            </div>
          </div>

          <div className="location-column">
            <div className="location-column-header">동</div>
            <div className="location-options">
              {neighborhoods?.map((neighborhood, index) => (
                <button
                  key={index}
                  className={`location-option ${selectedNeighborhood === (neighborhood.dongName || neighborhood) ? 'selected' : ''}`}
                  onClick={() => onNeighborhoodChange({ target: { value: neighborhood.dongName || neighborhood } })}
                  disabled={!selectedDistrict}
                >
                  {neighborhood.dongName || neighborhood}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getDisplayLocation = () => {
    if (selectedNeighborhood) return selectedNeighborhood;
    if (selectedDistrict) return selectedDistrict;
    if (selectedCity) return selectedCity;
    return '지역을 선택하세요';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="filter-content" ref={dropdownRef}>
      <div className="filter-wrapper">
        <button 
          className={`location-filter-button ${isDropdownOpen ? 'active' : ''}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <MapPin size={18} />
          <span className="location-text">{getDisplayLocation()}</span>
          <ChevronDown 
            size={18} 
            className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`}
          />
        </button>

        <LocationDropdownPanel
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          selectedCity={selectedCity}
          selectedDistrict={selectedDistrict}
          selectedNeighborhood={selectedNeighborhood}
          cities={cities}
          districts={districts}
          neighborhoods={neighborhoods}
          onCityChange={onCityChange}
          onDistrictChange={onDistrictChange}
          onNeighborhoodChange={onNeighborhoodChange}
          onReset={onReset}
        />
      </div>
    </div>
  );
};

export default LocationFilter;