import React from 'react';
import { X } from 'lucide-react';
import './DetailPanel.css';

const DetailPanel = ({ isVisible, onClose, type, data }) => {
    if (!isVisible) return null;

    return (
        <div className='detail-panel'>
        <div className='detail-panel-header'>
            <h3>{type === 'room' ? '매물 상세정보' : '공인중개사 정보'}</h3>
            <button className='detail-close-button' onClick={onClose}>
                <X size={20} />
            </button>
        </div>
        <div className='detail-panel-content'>
            {type === 'room' ? (
            // 원룸 상세정보
            <div className='detail-panel-section'>
                <div className='image-placeholder'>이미지 영역</div>
                <div className='info-group'>
                <h4>매물 정보</h4>
                <p>가격: {data?.price}</p>
                <p>주소: {data?.address}</p>
                </div>
            </div>
            ) : (
            // 공인중개사 상세정보
            <div className='detail-panel-section'>
                <div className='agent-profile'>
                <div className='agent-image-container'>
                    <img 
                    src={data?.image}
                    alt={data?.name}
                    className='agent-detail-image'
                    />
                </div>
                </div>

                <div className='agent-additional-info'>
                <div className='info-row'>
                    <h5>이름</h5>
                    <p>{data?.name}</p>
                </div>

                <div className='info-row'>
                    <h5>주소</h5>
                    <p>{data?.address}</p>
                </div>

                <div className='info-row'>
                    <h5>등록번호</h5>
                    <p>{data?.realtorId}</p>
                </div>

                <div className='info-row'>
                    <h5>연락처</h5>
                    <p>{data?.tel}</p>
                </div>

                <div className='info-row'>
                    <h5>소개</h5>
                    <p>{data?.content}</p>
                </div>

                <div className='info-row'>
                    <h5>라이브 방송 횟수</h5>
                    <p>{data?.liveCount || 0}회</p>
                </div>

                <div className='property-summary'>
                    <h5>보유 매물 정보</h5>
                    <div className='property-stats'>
                    <div className='property-stat-item'>
                        <span className='property-type'>원룸</span>
                        <span className='property-count'>{data?.propertyTypes?.oneRoom || 0}건</span>
                    </div>
                    <div className='property-stat-item'>
                        <span className='property-type'>투룸</span>
                        <span className='property-count'>{data?.propertyTypes?.twoRoom || 0}건</span>
                    </div>
                    <div className='property-stat-item'>
                        <span className='property-type'>쓰리룸+</span>
                        <span className='property-count'>{data?.propertyTypes?.threeRoom || 0}건</span>
                    </div>
                    </div>
                </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                </div>
            </div>
            )}
        </div>
        </div>
    );
};

export default DetailPanel;