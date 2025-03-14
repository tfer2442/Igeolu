
import React from 'react';
import './PriceDropdownPanel.css';

const PriceDropdownPanel = ({
   isOpen,
   deposit: maxDeposit,
   monthlyRent: maxMonthlyRent,
   onDepositChange: onMaxDepositChange,
   onMonthlyRentChange: onMaxMonthlyRentChange,
   onApply,
   onReset,
   setIsPriceDropdownOpen,
   selectedOptions // 선택된 옵션 정보 props 추가
}) => {
   if (!isOpen) return null;

   const formatValue = (value) => {
       if (!value) return '무제한';
       return `${value.toLocaleString()}만원`;
   };

   const handleMaxDepositChange = (e) => {
       const value = e.target.value;
       onMaxDepositChange(value === '0' ? null : Number(value));
   };

   const handleMaxMonthlyRentChange = (e) => {
       const value = e.target.value;
       onMaxMonthlyRentChange(value === '0' ? null : Number(value));
   };

   const handleApply = () => {
       // 모든 필터 조건을 함께 적용
       const params = new URLSearchParams();
       if (maxDeposit) params.append('maxDeposit', maxDeposit);
       if (maxMonthlyRent) params.append('maxMonthlyRent', maxMonthlyRent);
       if (selectedOptions?.length > 0) {
           params.append('optionIds', selectedOptions.join(','));
       }
       onApply(maxDeposit, maxMonthlyRent, params);
       setIsPriceDropdownOpen(false);
   };

   const handleReset = () => {
       onReset();
       setIsPriceDropdownOpen(false);
   };

   return (
       <div className="location-dropdown-panel">
           <div className="location-panel-content price-panel">
               <div className="price-range-section">
                   <div className="price-range-container">
                       <div className="price-range-header">
                           <span>최대 보증금</span>
                           <span className="price-value">{formatValue(maxDeposit)}</span>
                       </div>
                       <input
                           type="range"
                           min="0"
                           max="1000"
                           step="10"
                           value={maxDeposit || 0}
                           onChange={handleMaxDepositChange}
                           className="price-range-slider"
                       />
                       <div className="price-range-labels">
                           <span>0만원</span>
                           <span>500만원</span>
                           <span>1000만원</span>
                       </div>
                   </div>

                   <div className="price-range-container">
                       <div className="price-range-header">
                           <span>최대 월세</span>
                           <span className="price-value">{formatValue(maxMonthlyRent)}</span>
                       </div>
                       <input
                           type="range"
                           min="0"
                           max="300"
                           step="5"
                           value={maxMonthlyRent || 0}
                           onChange={handleMaxMonthlyRentChange}
                           className="price-range-slider"
                       />
                       <div className="price-range-labels">
                           <span>0만원</span>
                           <span>150만원</span>
                           <span>300만원</span>
                       </div>
                   </div>
               </div>

               <div className="price-actions">
                   <button className="price-action-button reset" onClick={handleReset}>
                       초기화
                   </button>
                   <button className="price-action-button apply" onClick={handleApply}>
                       적용하기
                   </button>
               </div>
           </div>
       </div>
   );
};

export default PriceDropdownPanel;