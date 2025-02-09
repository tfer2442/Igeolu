
import React from 'react';
import './PriceDropdownPanel.css';

const PriceDropdownPanel = ({
  isOpen,
  deposit,
  monthlyRent,
  onDepositChange,
  onMonthlyRentChange,
  onApply,
  onReset
}) => {
  if (!isOpen) return null;

  const formatValue = (value, type) => {
    if (!value) return type === 'deposit' ? '무제한' : '무제한';
    return `${value.toLocaleString()}만원`;
  };

  return (
    <div className="location-dropdown-panel">
      <div className="location-panel-content price-panel">
        <div className="price-range-section">
          <div className="price-range-container">
            <div className="price-range-header">
              <span>최대 보증금</span>
              <span className="price-value">{formatValue(deposit, 'deposit')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="100"
              value={deposit || 0}
              onChange={(e) => onDepositChange(Number(e.target.value) || null)}
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
              <span className="price-value">{formatValue(monthlyRent, 'monthly')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="5"
              value={monthlyRent || 0}
              onChange={(e) => onMonthlyRentChange(Number(e.target.value) || null)}
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