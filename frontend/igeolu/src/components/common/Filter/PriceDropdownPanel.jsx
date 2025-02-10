
// import React from 'react';
// import './PriceDropdownPanel.css';

// const PriceDropdownPanel = ({
//     isOpen,
//     deposit,
//     monthlyRent,
//     onDepositChange,
//     onMonthlyRentChange,
//     onApply,
//     onReset
// }) => {
//     if (!isOpen) return null;

//     const formatValue = (value) => {
//         if (!value) return '무제한';
//         return `${value.toLocaleString()}만원`;
//     };

//     const handleDepositChange = (e) => {
//         const value = e.target.value;
//         onDepositChange(value === '0' ? null : Number(value));
//     };

//     const handleMonthlyRentChange = (e) => {
//         const value = e.target.value;
//         onMonthlyRentChange(value === '0' ? null : Number(value));
//     };

//     return (
//         <div className="location-dropdown-panel">
//             <div className="location-panel-content price-panel">
//                 <div className="price-range-section">
//                     <div className="price-range-container">
//                         <div className="price-range-header">
//                             <span>보증금</span>
//                             <span className="price-value">{formatValue(deposit)}</span>
//                         </div>
//                         <input
//                             type="range"
//                             min="0"
//                             max="20000"
//                             step="100"
//                             value={deposit || 0}
//                             onChange={handleDepositChange}
//                             className="price-range-slider"
//                         />
//                         <div className="price-range-labels">
//                             <span>0</span>
//                             <span>1억</span>
//                             <span>2억</span>
//                         </div>
//                     </div>

//                     <div className="price-range-container">
//                         <div className="price-range-header">
//                             <span>월세</span>
//                             <span className="price-value">{formatValue(monthlyRent)}</span>
//                         </div>
//                         <input
//                             type="range"
//                             min="0"
//                             max="300"
//                             step="5"
//                             value={monthlyRent || 0}
//                             onChange={handleMonthlyRentChange}
//                             className="price-range-slider"
//                         />
//                         <div className="price-range-labels">
//                             <span>0</span>
//                             <span>150만원</span>
//                             <span>300만원</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="price-actions">
//                     <button className="price-action-button reset" onClick={onReset}>
//                         초기화
//                     </button>
//                     <button className="price-action-button apply" onClick={onApply}>
//                         적용하기
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PriceDropdownPanel;

import React from 'react';
import './PriceDropdownPanel.css';

const PriceDropdownPanel = ({
    isOpen,
    deposit: maxDeposit,
    monthlyRent: maxMonthlyRent,
    onDepositChange: onMaxDepositChange,
    onMonthlyRentChange: onMaxMonthlyRentChange,
    onApply,
    onReset
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
                            max="20000"
                            step="100"
                            value={maxDeposit || 0}
                            onChange={handleMaxDepositChange}
                            className="price-range-slider"
                        />
                        <div className="price-range-labels">
                            <span>0</span>
                            <span>1억</span>
                            <span>2억</span>
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
                            <span>0</span>
                            <span>150만원</span>
                            <span>300만원</span>
                        </div>
                    </div>
                </div>

                <div className="price-actions">
                    <button className="price-action-button reset" onClick={onReset}>
                        초기화
                    </button>
                    <button className="price-action-button apply" onClick={onApply}>
                        적용하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriceDropdownPanel;