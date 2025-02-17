// src/components/PropertySlider/PropertySlider.js
import React from 'react';
import './PropertySlider.css';

const PropertySlider = ({ properties, onPropertyClick }) => {
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0';
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '0';
    return numPrice.toLocaleString();
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="mypage-property-slider-container">
        <div className="mypage-property-empty">
          등록된 매물이 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-property-slider-container">
      <div className="mypage-property-slider">
        <div className="mypage-property-slider-track">
          {properties.map((property) => (
            <div
              key={property.propertyId}
              className="mypage-property-slide"
              onClick={() => onPropertyClick(property)}
            >
              <div className="mypage-property-slide-content">
                <div className="mypage-property-image">
                  <img src={property.images[0]} alt={property.description} />
                </div>
                <div className="mypage-property-info">
                  <div className="mypage-property-description">
                    {property.description}
                  </div>
                  <div className="mypage-property-price">
                    {formatPrice(property.deposit)}만원 / {formatPrice(property.monthlyRent)}만원
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertySlider;