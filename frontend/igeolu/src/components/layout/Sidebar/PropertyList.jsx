// src/components/layout/Sidebar/PropertyList.jsx
import React from 'react';
import './PropertyList.css';

const PropertyList = () => {
  return (
    <div className="property-list">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="property-item">
          <div className="property-content">
            <img src="/api/placeholder/100/80" alt="매물 사진" className="property-image" />
            <div className="property-info">
              <h3 className="property-price">월세 1000/53</h3>
              <p className="property-type">원룸</p>
              <p className="property-details">신축, 풀옵션, 전세대출가능</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;