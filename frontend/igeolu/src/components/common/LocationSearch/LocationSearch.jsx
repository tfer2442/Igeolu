
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import './LocationSearch.css';

const LocationSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`https://i12d205.p.ssafy.io/api/properties/sigungu/search?keyword=${encodeURIComponent(searchTerm)}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm('');
    setIsOpen(false);

    const [sidoName, gugunName, dongName] = suggestion.sigungu.split(' ');
    onSearch({ sidoName, gugunName, dongName: dongName || '' });
  };

  return (
    <div className="location-search-wrapper" ref={wrapperRef}>
      <div className="location-search">
        <Search size={20} className="location-search__icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="지역을 입력하세요"
          className="location-search__input"
        />
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div className="location-search__suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="location-search__suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.sigungu}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
