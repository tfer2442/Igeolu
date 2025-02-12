
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import './DetailPanel.css';

const DetailPanel = ({ isVisible, onClose, type, data, onViewProperties }) => {
    const [optionsData, setOptionsData] = useState([]);
    
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // data.options가 ID 배열인 경우에만 API 호출
                if (Array.isArray(data?.options) && data.options.length > 0 && typeof data.options[0] === 'number') {
                    const response = await axios.get('https://i12d205.p.ssafy.io/api/options');
                    const allOptions = response.data;
                    
                    const matchedOptions = data.options
                        .map(optionId => allOptions.find(option => option.optionId === optionId))
                        .filter(option => option);
                    
                    setOptionsData(matchedOptions);
                } else if (Array.isArray(data?.options)) {
                    // 이미 옵션 정보가 포함된 경우 바로 사용
                    setOptionsData(data.options);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, [data?.options]);

    if (!isVisible) return null;

    // 매물 데이터인 경우의 type 체크
    const isPropMarker = data?.type === 'room';
    const displayType = isPropMarker ? 'room' : type;

    return (
        <div className='detail-panel'>
            <div className='detail-panel-header'>
                <h3>{displayType === 'room' || isPropMarker ? '매물 상세정보' : '공인중개사 정보'}</h3>
                <button className='detail-close-button' onClick={onClose}>
                    <X size={20} />
                </button>
            </div>
            <div className='detail-panel-content'>
                {(displayType === 'room' || isPropMarker) ? (
                    // 원룸 상세정보
                    <div className='detail-panel-section'>
                        {data?.images && data.images.length > 0 ? (
                            <div className='property-images'>
                                {/* 이미지 표시 로직 */}
                            </div>
                        ) : (
                            <div className='image-placeholder'>이미지 영역</div>
                        )}
                        <div className='info-group'>
                            <h4>매물 정보</h4>
                            <p>보증금: {data?.deposit?.toLocaleString()}만원</p>
                            <p>월세: {data?.monthlyRent?.toLocaleString()}만원</p>
                            <p>주소: {data?.address}</p>
                            <p>면적: {data?.area}㎡</p>
                            <div className='options-group'>
                                <h5>옵션정보</h5>
                                {optionsData.length > 0 ? (
                                    <div className='options-list'>
                                        {optionsData.map((option) => (
                                            <span key={option.optionId} className='option-tag'>
                                                {option.optionName || option.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-options">옵션 정보 없음</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // 공인중개사 상세정보
                    <div className='detail-panel-section'>
                        <div className='agent-profile'>
                            <div className='agent-image-container'>
                                <img 
                                    src={data?.profileImage || '/default-agent.png'} 
                                    alt={data?.username} 
                                    className='agent-detail-image'
                                />
                            </div>
                        </div>

                        <div className='agent-additional-info'>
                            <div className='info-row'>
                                <h5>이름</h5>
                                <p>{data?.username}</p>
                            </div>

                            <div className='info-row'>
                                <h5>공인중개사 사무소</h5>
                                <p>{data?.title}</p>
                            </div>

                            <div className='info-row'>
                                <h5>주소</h5>
                                <p>{data?.address}</p>
                            </div>

                            <div className='info-row'>
                                <h5>등록번호</h5>
                                <p>{data?.registrationNumber}</p>
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

                            <button 
                                className='view-properties-button'
                                onClick={() => onViewProperties(data?.userId)}
                            >
                                매물 보기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailPanel;