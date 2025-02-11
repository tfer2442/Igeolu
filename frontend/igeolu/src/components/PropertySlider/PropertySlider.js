// src/components/PropertySlider/PropertySlider.js
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './PropertySlider.css';

const PropertySlider = ({ properties, onPropertyClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;  // 한 번에 4개의 매물을 보여줍니다
  const maxIndex = Math.max(0, Math.ceil(properties.length / itemsPerView) - 1);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="property-slider-container">
      <button 
        className="slider-button prev"
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={24} />
      </button>

      <div className="property-slider">
        <div 
          className="property-slider-track"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView * itemsPerView)}%)`,
          }}
        >
          {properties.map((property) => (
            <div
              key={property.propertyId}
              className="property-slide"
              onClick={() => onPropertyClick(property)}
            >
              <div className="property-slide-content">
                <div className="property-image">
                  <img src={property.images[0]} alt={property.description} />
                </div>
                <div className="property-info">
                  <div className="property-actions">
                  <p className="property-name">{property.description}</p>
                  </div>
                </div>
                <div className="property-highlight-bar"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="slider-button next"
        onClick={handleNext}
        disabled={currentIndex === maxIndex}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default PropertySlider;