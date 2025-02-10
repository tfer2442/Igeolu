
// import React from 'react';
// import './OptionDropdownPanel.css';

// const OptionDropdownPanel = ({
//   isOpen,
//   selectedOptions = [],
//   onOptionToggle,
//   onApply,
//   onReset,
//   options
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="location-dropdown-panel">
//       <div className="option-panel">
//         <div className="option-content">
//           <div className="option-header">옵션 선택</div>
//           <div className="option-grid">
//             {Array.isArray(options) && options.map((option) => (
//               <div
//                 key={option.optionId}
//                 className={`option-item ${
//                   selectedOptions.includes(option.optionId) ? 'selected' : ''
//                 }`}
//                 onClick={() => onOptionToggle(option.optionId)}
//               >
//                 {option.optionName}
//               </div>
//             ))}
//           </div>
//           <div className="option-actions">
//             <button className="option-action-button reset" onClick={onReset}>
//               초기화
//             </button>
//             <button className="option-action-button apply" onClick={onApply}>
//               적용하기
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OptionDropdownPanel;

import React from 'react';
import './OptionDropdownPanel.css';

const OptionDropdownPanel = ({
  isOpen,
  options = [],  // 옵션 데이터 배열
  selectedOptions = [],
  onOptionToggle,
  onApply,
  onReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="option-panel">
      <div className="option-content">
        <div className="option-header">옵션 선택</div>
        <div className="option-grid">
          {Array.isArray(options) && options.map((option) => (
            <div
              key={option.optionId}
              className={`option-item ${
                selectedOptions.includes(option.optionId) ? 'selected' : ''
              }`}
              onClick={() => onOptionToggle(option.optionId)}
            >
              {option.optionName}
            </div>
          ))}
        </div>
        <div className="option-actions">
          <button className="option-action-button reset" onClick={onReset}>
            초기화
          </button>
          <button className="option-action-button apply" onClick={onApply}>
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionDropdownPanel;