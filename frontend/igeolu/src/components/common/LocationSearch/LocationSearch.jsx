import React from 'react';
import { Search } from 'lucide-react';
import './LocationSearch.css';

const LocationSearch = () => {
  return (
    <div className="location-search">
      <input
        type="text"
        placeholder="지역을 입력하세요"
        className="location-search__input"
      />
      <Search size={20} className="location-search__icon" />
    </div>
  );
};

export default LocationSearch;