
// // ListPanel.jsx
// import React from 'react';
// import { Building2, MapPin, Home } from 'lucide-react';
// import './ListPanel.css';

// const ListPanel = ({ type, onItemClick, items = [] }) => {
//   const formatPrice = (deposit, monthlyRent) => {
//     return `${deposit ? deposit.toLocaleString() : 0}/${monthlyRent ? monthlyRent.toLocaleString() : 0}`;
//   };

//   const formatFloorInfo = (currentFloor, totalFloors) => {
//     if (currentFloor && totalFloors) {
//         return `${currentFloor}층 / 전체 ${totalFloors}층`;
//     } else if (currentFloor) {
//         return `${currentFloor}층`;
//     }
//     return '-';
//   };

//   return (
//     <div className='list-panel'>
//       <div className='list-panel-header'>
//         {type === 'room' ? (
//           <div className="header-content">
//             <Home size={20} />
//             <span className="header-title">원룸 목록</span>
//             <span className='result-count'>총 {items.length}건</span>
//           </div>
//         ) : (
//           <div className="header-content">
//             <Building2 size={20} />
//             <span className="header-title">공인중개사 목록</span>
//             <span className='result-count'>총 {items.length}건</span>
//           </div>
//         )}
//       </div>
//       <div className='list-panel-content'>
//         <div className='list-items'>
//           {items.length > 0 ? (
//             items.map((item) => (
//               <div 
//                 key={type === 'room' ? item.propertyId : item.userId}
//                 className='list-item'
//                 onClick={() => onItemClick(item)}
//               >
//                 {type === 'room' ? (
//                   <div className="property-list-item">
//                     <div className="property-image">
//                       {item.images && item.images.length > 0 ? (
//                         <img 
//                           src={item.images[0]} 
//                           alt="매물 이미지"
//                           className="room-image"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = '/room-placeholder.jpg';
//                           }}
//                         />
//                       ) : (
//                         <div className="no-image">이미지 없음</div>
//                       )}
//                     </div>
//                     <div className='property-list-item-content'>
//                       <div className='property-list-price'>
//                         <span className='deposit'>{item.deposit?.toLocaleString()}만원</span>
//                         <span className='monthly-rent'>{item.monthlyRent?.toLocaleString()}만원</span>
//                       </div>
//                       <div className='property-list-info'>
//                         <span className='address'>{item.address}</span>
//                         <div className='property-specs'>
//                           <span>{item.area}㎡</span>
//                           <span className='spec-divider'>|</span>
//                           <span>{formatFloorInfo(item.currentFloor, item.totalFloors)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className='agent-item'>
//                     <img 
//                       src={item.profileImage || '/default-agent.png'} 
//                       alt={item.username} 
//                       className='agent-image'
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = '/default-agent.png';
//                       }}
//                     />
//                     <div className='agent-info'>
//                       <span className='agent-name'>{item.username}</span>
//                       <p className='agent-title'>{item.title}</p>
//                       <p className='agent-content'>{item.content}</p>
//                       <div className="agent-address-info">
//                         <MapPin size={16} />
//                         <p className='agent-address'>{item.address}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className='no-results'>
//               {type === 'room' ? <Home size={48} /> : <Building2 size={48} />}
//               <p>검색 결과가 없습니다.</p>
//               <span>다른 검색 조건을 시도해보세요.</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ListPanel;


import React from 'react';
import { Building2, MapPin, Home } from 'lucide-react';
import './ListPanel.css';

const ListPanel = ({ type, onItemClick, items = [] }) => {
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
          <span className='result-count'>총 {items.length}건</span>
        </div>
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
                <div className="item-image-container">
                  <img 
                    src={type === 'room' ? 
                      (item.images?.[0] || '/room-placeholder.jpg') : 
                      (item.profileImage || '/default-agent.png')
                    }
                    alt={type === 'room' ? "매물 이미지" : "공인중개사 프로필"}
                    className="item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = type === 'room' ? 
                        '/room-placeholder.jpg' : 
                        '/default-agent.png';
                    }}
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
                      <div className='item-details'>
                        <div className='item-address'>
                          <MapPin size={16} />
                          <span>{item.address}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
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