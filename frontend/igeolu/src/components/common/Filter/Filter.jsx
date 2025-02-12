
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MapPin, ChevronDown, Wallet, Settings } from 'lucide-react';
import LocationDropdownPanel from './LocationDropdownPanel';
import PriceDropdownPanel from './PriceDropdownPanel';
import OptionDropdownPanel from './OptionDropdownPanel';
import './Filter.css';

const Filter = ({
  selectedCity,
  selectedDistrict,
  selectedNeighborhood,
  cities,
  districts,
  neighborhoods,
  onCityChange,
  onDistrictChange,
  onNeighborhoodChange,
  onReset,
  onPriceChange,
  onOptionsChange,
  deposit,
  monthlyRent,
  selectedOptions,
  activeMenu // 추가: 현재 활성화된 메뉴
}) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  
  const [tempDeposit, setTempDeposit] = useState(deposit);
  const [tempMonthlyRent, setTempMonthlyRent] = useState(monthlyRent);
  const [tempOptions, setTempOptions] = useState(selectedOptions);
  
  const [options, setOptions] = useState([]);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('https://i12d205.p.ssafy.io/api/options');
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    setTempDeposit(deposit);
    setTempMonthlyRent(monthlyRent);
  }, [deposit, monthlyRent]);

  useEffect(() => {
    setTempOptions(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
        setIsPriceDropdownOpen(false);
        setIsOptionDropdownOpen(false);
        setTempDeposit(deposit);
        setTempMonthlyRent(monthlyRent);
        setTempOptions(selectedOptions);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [deposit, monthlyRent, selectedOptions]);

  const getDisplayLocation = () => {
    if (selectedNeighborhood) return selectedNeighborhood;
    if (selectedDistrict) return selectedDistrict;
    if (selectedCity) return selectedCity;
    return '지역을 선택하세요';
  };

  const getDisplayPrice = () => {
    if (!deposit && !monthlyRent) return '보증금/월세';
    
    const depositText = deposit ? `${deposit.toLocaleString()}만원` : '무제한';
    const monthlyRentText = monthlyRent ? `${monthlyRent}만원` : '무제한';
    
    return `보증금 ${depositText} / 월세 ${monthlyRentText}`;
  };

  const getDisplayOptions = () => {
    if (!selectedOptions || selectedOptions.length === 0) return '옵션 선택';
    return `${selectedOptions.length}개 선택됨`;
  };

  const handlePriceReset = () => {
    setTempDeposit(null);
    setTempMonthlyRent(null);
    onPriceChange(null, null);
    setIsPriceDropdownOpen(false);
  };

  const handlePriceApply = () => {
    onPriceChange(tempDeposit, tempMonthlyRent);
    setIsPriceDropdownOpen(false);
  };

  const handleOptionToggle = (optionId) => {
    setTempOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleOptionReset = () => {
    setTempOptions([]);
    onOptionsChange([]);
    setIsOptionDropdownOpen(false);
  };

  const handleOptionApply = () => {
    onOptionsChange(tempOptions);
    setIsOptionDropdownOpen(false);
  };

  const handleAllReset = () => {
    onReset();
    setTempDeposit(null);
    setTempMonthlyRent(null);
    setTempOptions([]);
  };

  return (
    <div className="filter-content" ref={dropdownRef}>
      <div className="filter-wrapper">
        <div className="filter-buttons">
          <button 
            className={`location-filter-button ${isLocationDropdownOpen ? 'active' : ''}`}
            onClick={() => {
              setIsLocationDropdownOpen(!isLocationDropdownOpen);
              setIsPriceDropdownOpen(false);
              setIsOptionDropdownOpen(false);
            }}
          >
            <MapPin size={18} />
            <span className="location-text">{getDisplayLocation()}</span>
            <ChevronDown 
              size={18} 
              className={`chevron-icon ${isLocationDropdownOpen ? 'rotate' : ''}`}
            />
          </button>

          <button 
            className={`price-filter-button ${isPriceDropdownOpen ? 'active' : ''}`}
            onClick={() => {
              setIsPriceDropdownOpen(!isPriceDropdownOpen);
              setIsLocationDropdownOpen(false);
              setIsOptionDropdownOpen(false);
            }}
          >
            <Wallet size={18} />
            <span className="price-text">{getDisplayPrice()}</span>
            <ChevronDown 
              size={18} 
              className={`chevron-icon ${isPriceDropdownOpen ? 'rotate' : ''}`}
            />
          </button>

          <button 
            className={`option-filter-button ${isOptionDropdownOpen ? 'active' : ''}`}
            onClick={() => {
              setIsOptionDropdownOpen(!isOptionDropdownOpen);
              setIsLocationDropdownOpen(false);
              setIsPriceDropdownOpen(false);
            }}
          >
            <Settings size={18} />
            <span className="option-text">{getDisplayOptions()}</span>
            <ChevronDown 
              size={18} 
              className={`chevron-icon ${isOptionDropdownOpen ? 'rotate' : ''}`}
            />
          </button>
        </div>

        <LocationDropdownPanel
          isOpen={isLocationDropdownOpen}
          selectedCity={selectedCity}
          selectedDistrict={selectedDistrict}
          selectedNeighborhood={selectedNeighborhood}
          cities={cities}
          districts={districts}
          neighborhoods={neighborhoods}
          onCityChange={onCityChange}
          onDistrictChange={onDistrictChange}
          onNeighborhoodChange={onNeighborhoodChange}
          onReset={handleAllReset}
          onClose={() => setIsLocationDropdownOpen(false)}
          setIsLocationDropdownOpen={setIsLocationDropdownOpen}
        />

        <PriceDropdownPanel
          isOpen={isPriceDropdownOpen}
          deposit={tempDeposit}
          monthlyRent={tempMonthlyRent}
          onDepositChange={setTempDeposit}
          onMonthlyRentChange={setTempMonthlyRent}
          onApply={handlePriceApply}
          onReset={handlePriceReset}
          setIsPriceDropdownOpen={setIsPriceDropdownOpen}
        />

        <OptionDropdownPanel
          isOpen={isOptionDropdownOpen}
          options={options}
          selectedOptions={tempOptions}
          onOptionToggle={handleOptionToggle}
          onApply={handleOptionApply}
          onReset={handleOptionReset}
          setIsOptionDropdownOpen={setIsOptionDropdownOpen}
        />
      </div>
    </div>
  );
};

export default Filter;