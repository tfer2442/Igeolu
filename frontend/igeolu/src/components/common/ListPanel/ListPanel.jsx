// src/components/common/ListPanel/ListPanel.jsx
import React from 'react';
import './ListPanel.css';

const ListPanel = ({ isVisible, type, onItemClick }) => {
    if (!isVisible) return null;

    // 임시 데이터
    const items = type === 'room' ? [
        { id: 1, title: '강남역 원룸', price: '5000/50', address: '서울시 강남구' },
        { id: 2, title: '역삼동 원룸', price: '4000/40', address: '서울시 강남구' },
    ] : [
        { id: 1, name: '김공인', agency: '강남부동산', contact: '010-1234-5678' },
        { id: 2, name: '이공인', agency: '역삼부동산', contact: '010-2345-6789' },
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
                    <>
                    <h4>{item.name}</h4>
                    <p>{item.agency}</p>
                    <p>{item.contact}</p>
                    </>
                )}
                </div>
            ))}
            </div>
        </div>
        </div>
    );
};

export default ListPanel;