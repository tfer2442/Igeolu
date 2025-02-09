import React from 'react';
import './LocationDropdownPanel.css';

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

export default LocationDropdownPanel;