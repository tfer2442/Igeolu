
import React from 'react';
import './ListPanel.css';

const ListPanel = ({ isVisible, type, onItemClick }) => {
  if (!isVisible) return null;

  // 임시 데이터
  const items = type === 'room' ? [
    { id: 1, title: '강남역 원룸', price: '5000/50', address: '서울시 강남구' },
    { id: 2, title: '역삼동 원룸', price: '4000/40', address: '서울시 강남구' },
  ] : [
    { 
      id: 1,
      name: "John Doe",
      realtorId:"1234-1234-1234",
      tel: "010-1234-5678",
      content: "하이 마이 네임 이즈 존 도우, 열심히 하겠습니다.",
      address: "Daegu Road 123",
      image: "https://i.pravatar.cc/300?img=1"
    },
    { 
      id: 2,
      name: "Jane Smith",
      realtorId:"5678-5678-5678",
      tel: "010-8765-4321",
      content: "안녕하세요, 정직과 신뢰로 모시겠습니다.",
      address: "Seoul Street 456",
      image: "https://i.pravatar.cc/300?img=2"
    }
  ];

  return (
    <div className='list-panel'>
      <div className='list-panel-header'>
        {type === 'room' ? '원룸 목록' : '공인중개사 목록'}
      </div>
      <div className='list-panel-content'>
        <div className='list-items'>
          {items.map((item) => (
            <div 
              key={item.id} 
              className='list-item'
              onClick={() => onItemClick(item)}
            >
              {type === 'room' ? (
                <>
                  <h4>{item.title}</h4>
                  <p>{item.price}</p>
                  <p>{item.address}</p>
                </>
              ) : (
                <div className='agent-item'>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className='agent-image'
                  />
                  <div className='agent-info'>
                    <span className='agent-name'>{item.name}</span>
                    <p className='agent-content'>{item.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListPanel;