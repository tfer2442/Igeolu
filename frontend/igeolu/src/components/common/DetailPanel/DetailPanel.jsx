
import React from 'react';
import { X } from 'lucide-react';
import './DetailPanel.css';

const DetailPanel = ({ isVisible, onClose, type, data }) => {
  if (!isVisible) return null;

  return (
    <div className='detail-panel'>
      <div className='detail-panel-header'>
        <h3>{type === 'room' ? '매물 상세정보' : '공인중개사 상세정보'}</h3>
        <button className='close-button' onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className='detail-panel-content'>
        {/* 상세 정보 내용이 들어갈 자리 */}
        <div className='detail-panel-section'>
          {type === 'room' ? (
            <>
              <div className='image-placeholder'>이미지 영역</div>
              <div className='info-group'>
                <h4>매물 정보</h4>
                <p>가격: {data?.price}</p>
                <p>주소: {data?.address}</p>
              </div>
            </>
          ) : (
            <>
              <div className='info-group'>
                <h4>공인중개사 정보</h4>
                <p>이름: {data?.name}</p>
                <p>연락처: {data?.contact}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;