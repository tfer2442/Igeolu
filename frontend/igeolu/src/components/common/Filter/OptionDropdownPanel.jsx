import React from 'react';
import './OptionDropdownPanel.css';

const OptionDropdownPanel = ({
  isOpen,
  options = [], // 기본값 추가
  selectedOptions = [], // 기본값 추가
  onOptionToggle,
  onApply,
  onReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="location-dropdown-panel">
      <div className="option-panel">
        <div className="option-content">
          <div className="option-header">옵션 선택</div>
          <div className="option-grid">
            {Array.isArray(options) && options.map((option) => (
              <div
                key={`option-${option.optionId}`} // 수정된 부분: 고유한 key 값 부여
                className={`option-item ${
                  selectedOptions.includes(option.optionId) ? 'selected' : ''
                }`}
                onClick={() => onOptionToggle(option.optionId)}
              >
                {option.optionName} {/* API 응답 형식에 맞게 수정 */}
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
    </div>
  );
};

export default OptionDropdownPanel;