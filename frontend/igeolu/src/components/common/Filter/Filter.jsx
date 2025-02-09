
// import React, { useState, useRef, useEffect } from 'react';
// import { MapPin, ChevronDown, Wallet } from 'lucide-react';
// import LocationDropdownPanel from './LocationDropdownPanel';
// import PriceDropdownPanel from './PriceDropdownPanel';
// import './Filter.css';

// const Filter = ({
//   selectedCity,
//   selectedDistrict,
//   selectedNeighborhood,
//   cities,
//   districts,
//   neighborhoods,
//   onCityChange,
//   onDistrictChange,
//   onNeighborhoodChange,
//   onReset: onLocationReset
// }) => {
//   const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
//   const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
//   const [deposit, setDeposit] = useState(null);
//   const [monthlyRent, setMonthlyRent] = useState(null);
//   const dropdownRef = useRef(null);

//   const getDisplayLocation = () => {
//     if (selectedNeighborhood) return selectedNeighborhood;
//     if (selectedDistrict) return selectedDistrict;
//     if (selectedCity) return selectedCity;
//     return '지역을 선택하세요';
//   };

//   const getDisplayPrice = () => {
//     if (!deposit && !monthlyRent) return '보증금/월세';
    
//     const depositText = deposit ? `${deposit.toLocaleString()}만원` : '무제한';
//     const monthlyRentText = monthlyRent ? `${monthlyRent}만원` : '무제한';
    
//     return `보증금 ${depositText} / 월세 ${monthlyRentText}`;
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsLocationDropdownOpen(false);
//         setIsPriceDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handlePriceReset = () => {
//     setDeposit(null);
//     setMonthlyRent(null);
//   };

//   const handlePriceApply = () => {
//     setIsPriceDropdownOpen(false);
//     // 여기에 필터링 로직 추가
//   };

//   return (
//     <div className="filter-content" ref={dropdownRef}>
//       <div className="filter-wrapper">
//         <div className="filter-buttons">
//           <button 
//             className={`location-filter-button ${isLocationDropdownOpen ? 'active' : ''}`}
//             onClick={() => {
//               setIsLocationDropdownOpen(!isLocationDropdownOpen);
//               setIsPriceDropdownOpen(false);
//             }}
//           >
//             <MapPin size={18} />
//             <span className="location-text">{getDisplayLocation()}</span>
//             <ChevronDown 
//               size={18} 
//               className={`chevron-icon ${isLocationDropdownOpen ? 'rotate' : ''}`}
//             />
//           </button>

//           <button 
//             className={`price-filter-button ${isPriceDropdownOpen ? 'active' : ''}`}
//             onClick={() => {
//               setIsPriceDropdownOpen(!isPriceDropdownOpen);
//               setIsLocationDropdownOpen(false);
//             }}
//           >
//             <Wallet size={18} />
//             <span className="price-text">{getDisplayPrice()}</span>
//             <ChevronDown 
//               size={18} 
//               className={`chevron-icon ${isPriceDropdownOpen ? 'rotate' : ''}`}
//             />
//           </button>
//         </div>

//         <LocationDropdownPanel
//           isOpen={isLocationDropdownOpen}
//           onClose={() => setIsLocationDropdownOpen(false)}
//           selectedCity={selectedCity}
//           selectedDistrict={selectedDistrict}
//           selectedNeighborhood={selectedNeighborhood}
//           cities={cities}
//           districts={districts}
//           neighborhoods={neighborhoods}
//           onCityChange={onCityChange}
//           onDistrictChange={onDistrictChange}
//           onNeighborhoodChange={onNeighborhoodChange}
//           onReset={onLocationReset}
//         />

//         <PriceDropdownPanel
//           isOpen={isPriceDropdownOpen}
//           deposit={deposit}
//           monthlyRent={monthlyRent}
//           onDepositChange={setDeposit}
//           onMonthlyRentChange={setMonthlyRent}
//           onApply={handlePriceApply}
//           onReset={handlePriceReset}
//         />

        
//       </div>
//     </div>
//   );
// };

// export default Filter;

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Wallet, Settings } from 'lucide-react';
import axios from 'axios';
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
  onReset: onLocationReset
}) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  const [deposit, setDeposit] = useState(null);
  const [monthlyRent, setMonthlyRent] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
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
    if (selectedOptions.length === 0) return '옵션 선택';
    return `${selectedOptions.length}개 선택됨`;
  };

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

  const handlePriceReset = () => {
    setDeposit(null);
    setMonthlyRent(null);
  };

  const handlePriceApply = () => {
    setIsPriceDropdownOpen(false);
    // 여기에 필터링 로직 추가
  };

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
    // 콘솔에 현재 선택된 옵션들 출력 (디버깅용)
    console.log('Selected options:', selectedOptions);
  };

  const handleOptionReset = () => {
    setSelectedOptions([]);
  };

  const handleOptionApply = () => {
    setIsOptionDropdownOpen(false);
    // 여기에 필터링 로직 추가
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
          onClose={() => setIsLocationDropdownOpen(false)}
          selectedCity={selectedCity}
          selectedDistrict={selectedDistrict}
          selectedNeighborhood={selectedNeighborhood}
          cities={cities}
          districts={districts}
          neighborhoods={neighborhoods}
          onCityChange={onCityChange}
          onDistrictChange={onDistrictChange}
          onNeighborhoodChange={onNeighborhoodChange}
          onReset={onLocationReset}
        />

        <PriceDropdownPanel
          isOpen={isPriceDropdownOpen}
          deposit={deposit}
          monthlyRent={monthlyRent}
          onDepositChange={setDeposit}
          onMonthlyRentChange={setMonthlyRent}
          onApply={handlePriceApply}
          onReset={handlePriceReset}
        />

        <OptionDropdownPanel
          isOpen={isOptionDropdownOpen}
          options={options}
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