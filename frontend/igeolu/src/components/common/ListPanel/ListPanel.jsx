
import React from 'react';
import { Building2, MapPin, Home } from 'lucide-react';
import './ListPanel.css';

const ListPanel = ({ type, onItemClick, items = [] }) => {
  const formatPrice = (deposit, monthlyRent) => {
    return `${deposit ? deposit.toLocaleString() : 0}/${monthlyRent ? monthlyRent.toLocaleString() : 0}`;
  };

  return (
    <div className='list-panel'>
      <div className='list-panel-header'>
        {type === 'room' ? (
          <div className="header-content">
            <Home size={20} />
            <span className="header-title">원룸 목록</span>
            <span className='result-count'>총 {items.length}건</span>
          </div>
        ) : (
          <div className="header-content">
            <Building2 size={20} />
            <span className="header-title">공인중개사 목록</span>
            <span className='result-count'>총 {items.length}건</span>
          </div>
        )}
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
                    <div className="property-image">
                      <img 
                        src={item.imageUrl || '/room-placeholder.jpg'} 
                        alt={item.title} 
                        className="room-image"
                      />
                      {item.roomType && (
                        <span className="room-type-badge">{item.roomType}</span>
                      )}
                    </div>
                    <div className="property-info">
                      <h4>{item.title}</h4>
                      <div className="price-info">
                        <span className="price-value">{formatPrice(item.deposit, item.monthlyRent)}</span>
                      </div>
                      <div className="address-info">
                        <p className="address">{item.address || '주소 정보 없음'}</p>
                      </div>
                    </div>
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
                      <div className="agent-address-info">
                        <MapPin size={16} />
                        <p className='agent-address'>{item.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className='no-results'>
              <Building2 size={48} />
              <p>검색 결과가 없습니다.</p>
              <span>다른 검색 조건을 시도해보세요.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPanel;