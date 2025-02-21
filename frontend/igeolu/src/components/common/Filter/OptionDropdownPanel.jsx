
import React from 'react';
import './OptionDropdownPanel.css';

const OptionDropdownPanel = ({
 isOpen,
 options = [],
 selectedOptions = [],
 onOptionToggle,
 onApply,
 onReset,
 setIsOptionDropdownOpen
}) => {
 if (!isOpen) return null;

 return (
   <div className="map-option-panel">
     <div className="map-option-content">
       <div className="map-option-header">옵션 선택</div>
       <div className="map-option-grid">
         {Array.isArray(options) && options.map((option) => (
           <div
             key={option.optionId}
             className={`map-option-item ${
               selectedOptions.includes(option.optionId) ? 'selected' : ''
             }`}
             onClick={() => onOptionToggle(option.optionId)}
           >
             {option.optionName}
           </div>
         ))}
       </div>
       <div className="map-option-actions">
         <button className="map-option-action-button reset" onClick={() => {
           onReset();
           setIsOptionDropdownOpen(false);
         }}>
           초기화
         </button>
         <button className="map-option-action-button apply" onClick={onApply}>
           적용하기
         </button>
       </div>
     </div>
   </div>
 );
};

export default OptionDropdownPanel;