
import React from 'react';
import './ListPanel.css';

const ListPanel = ({ type, onItemClick, items = [] }) => {
  const formatPrice = (deposit, monthlyRent) => {
    const depositStr = deposit ? `${deposit.toLocaleString()}만원` : '0만원';
    const monthlyRentStr = monthlyRent ? `${monthlyRent.toLocaleString()}만원` : '0만원';
    return `${depositStr}/${monthlyRentStr}`;
  };

  return (
    <div className='list-panel'>
      <div className='list-panel-header'>
        {type === 'room' ? '원룸 목록' : '공인중개사 목록'}
        <span className='result-count'> (총 {items.length}건)</span>
      </div>
      <div className='list-panel-content'>
        <div className='list-items'>
          {items.length > 0 ? (
            items.map((item) => (
              <div 
                key={type === 'room' ? item.propertyId : item.userId}
                className='list-item'
                onClick={() => onItemClick(item)}
              >
                {type === 'room' ? (
                  <div className="property-item">
                    <h4>{item.title}</h4>
                    <p className="price">{formatPrice(item.deposit, item.monthlyRent)}</p>
                    <p className="address">{item.address || '주소 정보 없음'}</p>
                    {item.options && item.options.length > 0 && (
                      <div className="options">
                        {item.options.map((option, index) => (
                          <span key={index} className="option-tag">
                            {option.optionName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='agent-item'>
                    <img 
                      src={item.profileImage || '/default-agent.png'} 
                      alt={item.username} 
                      className='agent-image'
                    />
                    <div className='agent-info'>
                      <span className='agent-name'>{item.username}</span>
                      <p className='agent-title'>{item.title}</p>
                      <p className='agent-content'>{item.content}</p>
                      <p className='agent-address'>{item.address}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className='no-results'>
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPanel;