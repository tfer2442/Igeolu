
import React, { useState, useRef, useEffect } from 'react';
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
  selectedOptions
}) => {

  // 필터 드롭다운 상태
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
        setIsPriceDropdownOpen(false);
        setIsOptionDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 화면 표시용 문자열 생성 함수들
  const getDisplayLocation = () => {
    if (selectedNeighborhood) return selectedNeighborhood;
    if (selectedDistrict) return selectedDistrict;
    if (selectedCity) return selectedCity;
    return '지역을 선택하세요';
  };

  // 가격필터 버튼에 보증금/월세 나타냄
  const getDisplayPrice = () => {
    if (!deposit && !monthlyRent) return '보증금/월세';
    
    const depositText = deposit ? `${deposit.toLocaleString()}만원` : '무제한';
    const monthlyRentText = monthlyRent ? `${monthlyRent}만원` : '무제한';
    
    return `보증금 ${depositText} / 월세 ${monthlyRentText}`;
  };

  // 옵션필터 버튼에 몇개 선택 됬는지 나타냄
  const getDisplayOptions = () => {
    if (!selectedOptions || selectedOptions.length === 0) return '옵션 선택';
    return `${selectedOptions.length}개 선택됨`;
  };

  // 가격 필터 핸들러
  const handlePriceReset = () => {
    onPriceChange(null, null);
  };

  const handlePriceApply = () => {
    setIsPriceDropdownOpen(false);
  };

  // 옵션 필터 핸들러
  const handleOptionToggle = (optionId) => {
    const newOptions = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    onOptionsChange(newOptions);
  };

  const handleOptionReset = () => {
    onOptionsChange([]);
  };

  const handleOptionApply = () => {
    setIsOptionDropdownOpen(false);
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
          onReset={onReset}
          onClose={() => setIsLocationDropdownOpen(false)}
        />

        <PriceDropdownPanel
          isOpen={isPriceDropdownOpen}
          deposit={deposit}
          monthlyRent={monthlyRent}
          onDepositChange={(newDeposit) => onPriceChange(newDeposit, monthlyRent)}
          onMonthlyRentChange={(newMonthlyRent) => onPriceChange(deposit, newMonthlyRent)}
          onApply={handlePriceApply}
          onReset={handlePriceReset}
        />

        <OptionDropdownPanel
          isOpen={isOptionDropdownOpen}
          selectedOptions={selectedOptions}
          onOptionToggle={handleOptionToggle}
          onApply={handleOptionApply}
          onReset={handleOptionReset}
        />
      </div>
    </div>
  );
};

export default Filter;