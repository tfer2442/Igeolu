
import React from 'react';
import { Building2, MapPin, Home } from 'lucide-react';
import './ListPanel.css';

const ListPanel = ({ type, onItemClick, items = [] }) => {
  
  // 아이템 타입과 컴포넌트 타입 확인
  const filteredItems = items.filter(item => {
    // 아이템 자체의 타입이 있으면 그것을 우선적으로 확인
    if (item.type && item.type !== type) {
      // console.warn(`데이터 타입(${item.type})과 컴포넌트 타입(${type})이 일치하지 않음:`, item);
      return false;
    }
    
    // 타입별 필수 속성 확인
    if (type === 'room' && !item.propertyId) {
      console.warn('유효하지 않은 방 데이터가 발견됨:', item);
      return false;
    }
    if (type === 'agent' && !item.userId) {
      console.warn('유효하지 않은 공인중개사 데이터가 발견됨:', item);
      return false;
    }
    return true;
  });

  const formatFloorInfo = (currentFloor, totalFloors) => {
    if (currentFloor && totalFloors) {
      return `${currentFloor}층 / 전체 ${totalFloors}층`;
    } else if (currentFloor) {
      return `${currentFloor}층`;
    }
    return '-';
  };

  return (
    <div className='list-panel'>
      <div className='list-panel-header'>
        <div className="header-content">
          {type === 'room' ? <Home size={20} /> : <Building2 size={20} />}
          <span className="header-title">
            {type === 'room' ? '원룸 목록' : '공인중개사 목록'}
          </span>
          <span className='result-count'>총 {filteredItems.length}건</span>
        </div>
      </div>
      
      <div className='list-panel-content'>
        <div className='list-items'>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              // 고유한 키 생성 로직 개선
              const itemKey = type === 'room' 
                ? `room-${item.propertyId}-${index}`
                : `agent-${item.userId}-${index}`;
                
              return (
                <div
                  key={itemKey}
                  className='list-item'
                  onClick={() => onItemClick(item)}
                >
                  <div className={`item-image-container ${type === 'agent' ? 'agent' : ''}`}>
                    <img 
                      src={type === 'room' ? 
                        (item.images?.[0] || '/room-placeholder.jpg') : 
                        (item.profileImage || '/default-agent.png')
                      }
                      alt={type === 'room' ? "매물 이미지" : "공인중개사 프로필"}
                      className="item-image"
                    />
                  </div>
                  
                  <div className='item-content'>
                    {type === 'room' ? (
                      <>
                        <div className='item-price'>
                          <span className='price-value'>{item.deposit?.toLocaleString()}만원</span>
                          <span className='price-value'>{item.monthlyRent?.toLocaleString()}만원</span>
                        </div>
                        <div className='item-details'>
                          <div className='item-specs'>
                            <span>{item.area}㎡</span>
                            <span>|</span>
                            <span>{formatFloorInfo(item.currentFloor, item.totalFloors)}</span>
                          </div>
                          <div className='item-address'>
                            <MapPin size={16} />
                            <span>{item.address}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='item-title'>{item.username}</div>
                        <div className='item-subtitle'>{item.title}</div>
                        <div className='item-address'>
                          <MapPin size={16} />
                          <span>{item.address}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className='no-results'>
              {type === 'room' ? <Home size={48} /> : <Building2 size={48} />}
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