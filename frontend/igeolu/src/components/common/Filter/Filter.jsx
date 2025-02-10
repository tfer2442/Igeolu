
// import React, { useState, useRef, useEffect } from 'react';
// import { MapPin, ChevronDown, Wallet, Settings } from 'lucide-react';
// import LocationDropdownPanel from './LocationDropdownPanel';
// import PriceDropdownPanel from './PriceDropdownPanel';
// import OptionDropdownPanel from './OptionDropdownPanel';
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
//   onReset,
//   onPriceChange,
//   onOptionsChange,
//   deposit,
//   monthlyRent,
//   selectedOptions
// }) => {
//   const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
//   const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
//   const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  
//   // 임시 상태 추가
//   const [tempDeposit, setTempDeposit] = useState(deposit);
//   const [tempMonthlyRent, setTempMonthlyRent] = useState(monthlyRent);
//   const [tempOptions, setTempOptions] = useState(selectedOptions);
  
//   const dropdownRef = useRef(null);

//   // props가 변경될 때 임시 상태 업데이트
//   useEffect(() => {
//     setTempDeposit(deposit);
//     setTempMonthlyRent(monthlyRent);
//   }, [deposit, monthlyRent]);

//   useEffect(() => {
//     setTempOptions(selectedOptions);
//   }, [selectedOptions]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsLocationDropdownOpen(false);
//         setIsPriceDropdownOpen(false);
//         setIsOptionDropdownOpen(false);
//         // 패널이 닫힐 때 임시 상태를 원래대로 복구
//         setTempDeposit(deposit);
//         setTempMonthlyRent(monthlyRent);
//         setTempOptions(selectedOptions);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [deposit, monthlyRent, selectedOptions]);

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

//   const getDisplayOptions = () => {
//     if (!selectedOptions || selectedOptions.length === 0) return '옵션 선택';
//     return `${selectedOptions.length}개 선택됨`;
//   };

//   // 가격 필터 핸들러
//   const handlePriceReset = () => {
//     setTempDeposit(null);
//     setTempMonthlyRent(null);
//   };

//   const handlePriceApply = () => {
//     onPriceChange(tempDeposit, tempMonthlyRent);
//     setIsPriceDropdownOpen(false);
//   };

//   // 옵션 필터 핸들러
//   const handleOptionToggle = (optionId) => {
//     setTempOptions(prev => 
//       prev.includes(optionId)
//         ? prev.filter(id => id !== optionId)
//         : [...prev, optionId]
//     );
//   };

//   const handleOptionReset = () => {
//     setTempOptions([]);
//   };

//   const handleOptionApply = () => {
//     onOptionsChange(tempOptions);
//     setIsOptionDropdownOpen(false);
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
//               setIsOptionDropdownOpen(false);
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
//               setIsOptionDropdownOpen(false);
//             }}
//           >
//             <Wallet size={18} />
//             <span className="price-text">{getDisplayPrice()}</span>
//             <ChevronDown 
//               size={18} 
//               className={`chevron-icon ${isPriceDropdownOpen ? 'rotate' : ''}`}
//             />
//           </button>

//           <button 
//             className={`option-filter-button ${isOptionDropdownOpen ? 'active' : ''}`}
//             onClick={() => {
//               setIsOptionDropdownOpen(!isOptionDropdownOpen);
//               setIsLocationDropdownOpen(false);
//               setIsPriceDropdownOpen(false);
//             }}
//           >
//             <Settings size={18} />
//             <span className="option-text">{getDisplayOptions()}</span>
//             <ChevronDown 
//               size={18} 
//               className={`chevron-icon ${isOptionDropdownOpen ? 'rotate' : ''}`}
//             />
//           </button>
//         </div>

//         <LocationDropdownPanel
//           isOpen={isLocationDropdownOpen}
//           selectedCity={selectedCity}
//           selectedDistrict={selectedDistrict}
//           selectedNeighborhood={selectedNeighborhood}
//           cities={cities}
//           districts={districts}
//           neighborhoods={neighborhoods}
//           onCityChange={onCityChange}
//           onDistrictChange={onDistrictChange}
//           onNeighborhoodChange={onNeighborhoodChange}
//           onReset={onReset}
//           onClose={() => setIsLocationDropdownOpen(false)}
//         />

//         <PriceDropdownPanel
//           isOpen={isPriceDropdownOpen}
//           deposit={tempDeposit}
//           monthlyRent={tempMonthlyRent}
//           onDepositChange={setTempDeposit}
//           onMonthlyRentChange={setTempMonthlyRent}
//           onApply={handlePriceApply}
//           onReset={handlePriceReset}
//         />

//         <OptionDropdownPanel
//           isOpen={isOptionDropdownOpen}
//           selectedOptions={tempOptions}
//           onOptionToggle={handleOptionToggle}
//           onApply={handleOptionApply}
//           onReset={handleOptionReset}
//         />
//       </div>
//     </div>
//   );
// };

// export default Filter;

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
  selectedOptions
}) => {
  // 드롭다운 패널 상태
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  
  // 임시 상태 관리
  const [tempDeposit, setTempDeposit] = useState(deposit);
  const [tempMonthlyRent, setTempMonthlyRent] = useState(monthlyRent);
  const [tempOptions, setTempOptions] = useState(selectedOptions);
  
  // 옵션 데이터 상태
  const [options, setOptions] = useState([]);
  
  const dropdownRef = useRef(null);

  // 옵션 데이터 로드
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

  // props가 변경될 때 임시 상태 업데이트
  useEffect(() => {
    setTempDeposit(deposit);
    setTempMonthlyRent(monthlyRent);
  }, [deposit, monthlyRent]);

  useEffect(() => {
    setTempOptions(selectedOptions);
  }, [selectedOptions]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
        setIsPriceDropdownOpen(false);
        setIsOptionDropdownOpen(false);
        // 패널이 닫힐 때 임시 상태를 원래대로 복구
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

  // 가격 필터 핸들러
  const handlePriceReset = () => {
    setTempDeposit(null);
    setTempMonthlyRent(null);
  };

  const handlePriceApply = () => {
    onPriceChange(tempDeposit, tempMonthlyRent);
    setIsPriceDropdownOpen(false);
  };

  // 옵션 필터 핸들러
  const handleOptionToggle = (optionId) => {
    setTempOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleOptionReset = () => {
    setTempOptions([]);
  };

  const handleOptionApply = () => {
    onOptionsChange(tempOptions);
    setIsOptionDropdownOpen(false);
  };

  // 전체 초기화 핸들러
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
        />

        <PriceDropdownPanel
          isOpen={isPriceDropdownOpen}
          deposit={tempDeposit}
          monthlyRent={tempMonthlyRent}
          onDepositChange={setTempDeposit}
          onMonthlyRentChange={setTempMonthlyRent}
          onApply={handlePriceApply}
          onReset={handlePriceReset}
        />

        <OptionDropdownPanel
          isOpen={isOptionDropdownOpen}
          options={options}  // 여기에 options 데이터 전달
          selectedOptions={tempOptions}
          onOptionToggle={handleOptionToggle}
          onApply={handleOptionApply}
          onReset={handleOptionReset}
        />
      </div>
    </div>
  );
};

export default Filter;