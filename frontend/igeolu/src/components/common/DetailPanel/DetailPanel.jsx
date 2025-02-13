

// import React, { useState } from 'react';
// import { X, ArrowLeft } from 'lucide-react';
// import axios from 'axios';
// import './DetailPanel.css';

// const DetailPanel = ({ isVisible, onClose, type, data, onViewProperties }) => {
//     const [view, setView] = useState('main'); // 'main', 'propertyList', 'propertyDetail'
//     const [selectedProperty, setSelectedProperty] = useState(null);
//     const [properties, setProperties] = useState([]);

//     if (!isVisible) return null;

//     // 매물 데이터인 경우의 type 체크
//     const isPropMarker = data?.type === 'room';
//     const displayType = isPropMarker ? 'room' : type;

//     const handleViewProperties = async () => {
//         try {
//             const response = await axios.get(`https://i12d205.p.ssafy.io/api/properties`, {
//                 params: { userId: data.userId }
//             });
//             setProperties(response.data);
//             setView('propertyList');
//             onViewProperties(data.userId);
//         } catch (error) {
//             console.error('Error fetching properties:', error);
//         }
//     };

//     const handlePropertyClick = (property) => {
//         setSelectedProperty(property);
//         setView('propertyDetail');
//     };

//     return (
//         <div className='detail-panel'>
//             <div className='detail-panel-header'>
//                 <h3>
//                     {view === 'propertyList' ? '매물 목록' :
//                      view === 'propertyDetail' ? '매물 상세정보' :
//                      displayType === 'room' ? '매물 상세정보' : '공인중개사 정보'}
//                 </h3>
//                 <div className="header-buttons">
//                     {(view === 'propertyList' || view === 'propertyDetail') && (
//                         <button 
//                             className='detail-back-button'
//                             onClick={() => {
//                                 setView('main');
//                                 setSelectedProperty(null);
//                             }}
//                         >
//                             <ArrowLeft size={20} />
//                         </button>
//                     )}
//                     <button className='detail-close-button' onClick={() => {
//                         onClose();
//                         setView('main');
//                         setSelectedProperty(null);
//                     }}>
//                         <X size={20} />
//                     </button>
//                 </div>
//             </div>
            
//             <div className='detail-panel-content'>
//                 {view === 'propertyList' ? (
//                     <div className='property-list-view'>
//                         {properties.map((property) => (
//                             <div
//                                 key={property.propertyId}
//                                 className='property-list-item'
//                                 onClick={() => handlePropertyClick(property)}
//                             >
//                                 <div className='property-list-item-content'>
//                                     <div className='property-list-price'>
//                                         <span className='deposit'>{property.deposit?.toLocaleString()}만원</span>
//                                         <span className='monthly-rent'>{property.monthlyRent?.toLocaleString()}만원</span>
//                                     </div>
//                                     <div className='property-list-info'>
//                                         <span className='address'>{property.address}</span>
//                                         <span className='area'>{property.area}㎡</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : view === 'propertyDetail' ? (
//                     <div className='detail-panel-section'>
//                         <div className='property-image-slider'>
//                             <span>매물 이미지</span>
//                         </div>
//                         <div className='property-detail-info'>
//                             <div className='property-price-info'>
//                                 <div className='price-row'>
//                                     <span className='price-label'>보증금</span>
//                                     <span className='price-value'>{selectedProperty?.deposit?.toLocaleString()}만원</span>
//                                 </div>
//                                 <div className='price-row'>
//                                     <span className='price-label'>월세</span>
//                                     <span className='price-value'>{selectedProperty?.monthlyRent?.toLocaleString()}만원</span>
//                                 </div>
//                             </div>
//                             <div className='property-basic-info'>
//                                 <div className='info-item'>
//                                     <span className='info-label'>주소</span>
//                                     <span className='info-value'>{selectedProperty?.address}</span>
//                                 </div>
//                                 <div className='info-item'>
//                                     <span className='info-label'>면적</span>
//                                     <span className='info-value'>{selectedProperty?.area}㎡ ({Math.floor(selectedProperty?.area * 0.3025)}평)</span>
//                                 </div>
//                                 <div className='info-item'>
//                                     <span className='info-label'>층수</span>
//                                     <span className='info-value'>{selectedProperty?.floor}층</span>
//                                 </div>
//                                 <div className='info-item'>
//                                     <span className='info-label'>방향</span>
//                                     <span className='info-value'>{selectedProperty?.direction || '-'}</span>
//                                 </div>
//                             </div>
//                             <div className='property-options'>
//                                 <h5>옵션 정보</h5>
//                                 <div className='options-list'>
//                                     {Array.isArray(selectedProperty?.options) && selectedProperty.options.map((option, index) => (
//                                         <span key={`${option.optionId || index}`} className='option-tag'>
//                                             {option.optionName}
//                                         </span>
//                                     ))}
//                                     {(!selectedProperty?.options || !Array.isArray(selectedProperty?.options) || selectedProperty.options.length === 0) && (
//                                         <span className='no-options'>제공된 옵션 정보가 없습니다</span>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : displayType === 'room' ? (
//                     <div className='detail-panel-section'>
//                         <div className='property-image-slider'>
//                             <span>매물 이미지</span>
//                         </div>
                        
//                         <div className='property-detail-info'>
//                             <div className='property-price-info'>
//                                 <div className='price-row'>
//                                     <span className='price-label'>보증금</span>
//                                     <span className='price-value'>{data?.deposit?.toLocaleString()}만원</span>
//                                 </div>
//                                 <div className='price-row'>
//                                     <span className='price-label'>월세</span>
//                                     <span className='price-value'>{data?.monthlyRent?.toLocaleString()}만원</span>
//                                 </div>
//                             </div>

//                             <div className='property-basic-info'>
//                                 <div className='info-item'>
//                                     <span className='info-label'>주소</span>
//                                     <span className='info-value'>{data?.address}</span>
//                                 </div>
//                                 <div className='info-item'>
//                                     <span className='info-label'>면적</span>
//                                     <span className='info-value'>{data?.area}㎡ ({Math.floor(data?.area * 0.3025)}평)</span>
//                                 </div>
//                                 <div className='info-item'>
//                                     <span className='info-label'>층수</span>
//                                     <span className='info-value'>{data?.floor}층</span>
//                                 </div>
//                                 <div className='info-item'>
//                                     <span className='info-label'>방향</span>
//                                     <span className='info-value'>{data?.direction || '-'}</span>
//                                 </div>
//                             </div>

//                             <div className='property-options'>
//                                 <h5>옵션 정보</h5>
//                                 <div className='options-list'>
//                                     {Array.isArray(data?.options) && data.options.map((option, index) => (
//                                         <span key={`${option.optionId || index}`} className='option-tag'>
//                                             {option.optionName}
//                                         </span>
//                                     ))}
//                                     {(!data?.options || !Array.isArray(data?.options) || data.options.length === 0) && (
//                                         <span className='no-options'>제공된 옵션 정보가 없습니다</span>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className='detail-panel-section'>
//                         <div className='agent-profile-card'>
//                             <div className='agent-profile-header'>
//                                 <div className='agent-image-wrapper'>
//                                     <img 
//                                         src={data?.profileImage || '/default-agent.png'} 
//                                         alt={data?.username} 
//                                         className='agent-detail-image'
//                                     />
//                                 </div>
//                                 <div className='agent-primary-info'>
//                                     <h4 className='agent-name'>{data?.username}</h4>
//                                     <p className='agent-title'>{data?.title}</p>
//                                     <div className='agent-stats'>
//                                         <div className='stat-item'>
//                                             <span className='stat-label'>라이브</span>
//                                             <span className='stat-value'>{data?.liveCount || 0}회</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className='agent-content-section'>
//                                 <p className='agent-description'>{data?.content}</p>
//                             </div>

//                             <div className='agent-info-grid'>
//                                 <div className='info-grid-item'>
//                                     <span className='info-grid-label'>등록번호</span>
//                                     <span className='info-grid-value'>{data?.registrationNumber}</span>
//                                 </div>
//                                 <div className='info-grid-item'>
//                                     <span className='info-grid-label'>연락처</span>
//                                     <span className='info-grid-value'>{data?.tel}</span>
//                                 </div>
//                                 <div className='info-grid-item full-width'>
//                                     <span className='info-grid-label'>주소</span>
//                                     <span className='info-grid-value'>{data?.address}</span>
//                                 </div>
//                             </div>

//                             <button 
//                                 className='view-properties-button'
//                                 onClick={handleViewProperties}
//                             >
//                                 매물 보기
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DetailPanel;


import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import './DetailPanel.css';

const DetailPanel = ({ isVisible, onClose, type, data, onViewProperties }) => {
    const [view, setView] = useState('main');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [properties, setProperties] = useState([]);
    const [optionsData, setOptionsData] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            if (data?.options && Array.isArray(data.options)) {
                try {
                    const response = await axios.get('https://i12d205.p.ssafy.io/api/options');
                    const allOptions = response.data;
                    const filteredOptions = allOptions.filter(option => 
                        data.options.includes(option.optionId)
                    );
                    setOptionsData(filteredOptions);
                    console.log('로드된 옵션 데이터:', filteredOptions);
                } catch (error) {
                    console.error('옵션 정보 로드 실패:', error);
                }
            }
        };

        if (isVisible && data) {
            fetchOptions();
        }
    }, [isVisible, data]);

    useEffect(() => {
        if (isVisible && data) {
            console.log('DetailPanel 데이터:', {
                type: type,
                isPropMarker: data?.type === 'room',
                propertyId: data?.propertyId,
                title: data?.title,
                deposit: data?.deposit,
                monthlyRent: data?.monthlyRent,
                address: data?.address,
                area: data?.area,
                currentFloor: data?.currentFloor,
                totalFloors: data?.totalFloors,
                options: optionsData,
                description: data?.description,
                images: data?.images,
                createdAt: data?.createdAt,
                updatedAt: data?.updatedAt,
                전체_데이터: data
            });
        }
    }, [isVisible, data, type, optionsData]);

    if (!isVisible) return null;

    const isPropMarker = data?.type === 'room';
    const displayType = isPropMarker ? 'room' : type;

    const handleViewProperties = async () => {
        try {
            const response = await axios.get(`https://i12d205.p.ssafy.io/api/properties`, {
                params: { userId: data.userId }
            });
            setProperties(response.data);
            setView('propertyList');
            onViewProperties(data.userId);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const handlePropertyClick = (property) => {
        setSelectedProperty(property);
        setView('propertyDetail');
    };

    const renderOptions = () => {
        if (!optionsData || optionsData.length === 0) {
            return <span className='no-options'>제공된 옵션 정보가 없습니다</span>;
        }

        return optionsData.map((option) => (
            <span key={option.optionId} className='option-tag'>
                {option.optionName}
            </span>
        ));
    };

    const formatFloorInfo = (currentFloor, totalFloors) => {
        if (currentFloor && totalFloors) {
            return `${currentFloor}층 / 전체 ${totalFloors}층`;
        } else if (currentFloor) {
            return `${currentFloor}층`;
        }
        return '-';
    };

    return (
        <div className='detail-panel'>
            <div className='detail-panel-header'>
                <h3>
                    {view === 'propertyList' ? '매물 목록' :
                     view === 'propertyDetail' ? '매물 상세정보' :
                     displayType === 'room' ? '매물 상세정보' : '공인중개사 정보'}
                </h3>
                <div className="header-buttons">
                    {(view === 'propertyList' || view === 'propertyDetail') && (
                        <button 
                            className='detail-back-button'
                            onClick={() => {
                                setView('main');
                                setSelectedProperty(null);
                            }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <button className='detail-close-button' onClick={() => {
                        onClose();
                        setView('main');
                        setSelectedProperty(null);
                    }}>
                        <X size={20} />
                    </button>
                </div>
            </div>
            
            <div className='detail-panel-content'>
                {view === 'propertyList' ? (
                    <div className='property-list-view'>
                        {properties.map((property) => (
                            <div
                                key={property.propertyId}
                                className='property-list-item'
                                onClick={() => handlePropertyClick(property)}
                            >
                                <div className='property-list-item-content'>
                                    <div className='property-list-price'>
                                        <span className='deposit'>{property.deposit?.toLocaleString()}만원</span>
                                        <span className='monthly-rent'>{property.monthlyRent?.toLocaleString()}만원</span>
                                    </div>
                                    <div className='property-list-info'>
                                        <span className='address'>{property.address}</span>
                                        <div className='property-specs'>
                                            <span>{property.area}㎡</span>
                                            <span className='spec-divider'>|</span>
                                            <span>{formatFloorInfo(property.currentFloor, property.totalFloors)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : view === 'propertyDetail' ? (
                    <div className='detail-panel-section'>
                        <div className='property-image-slider'>
                            <span>매물 이미지</span>
                        </div>
                        <div className='property-detail-info'>
                            <div className='property-price-info'>
                                <div className='price-row'>
                                    <span className='price-label'>보증금</span>
                                    <span className='price-value'>{selectedProperty?.deposit?.toLocaleString()}만원</span>
                                </div>
                                <div className='price-row'>
                                    <span className='price-label'>월세</span>
                                    <span className='price-value'>{selectedProperty?.monthlyRent?.toLocaleString()}만원</span>
                                </div>
                            </div>
                            <div className='property-basic-info'>
                                <div className='info-item'>
                                    <span className='info-label'>주소</span>
                                    <span className='info-value'>{selectedProperty?.address}</span>
                                </div>
                                <div className='info-item'>
                                    <span className='info-label'>면적</span>
                                    <span className='info-value'>{selectedProperty?.area}㎡ ({Math.floor(selectedProperty?.area * 0.3025)}평)</span>
                                </div>
                                <div className='info-item'>
                                    <span className='info-label'>층수</span>
                                    <span className='info-value'>
                                        {formatFloorInfo(selectedProperty?.currentFloor, selectedProperty?.totalFloors)}
                                    </span>
                                </div>
                            </div>
                            <div className='property-options'>
                                <h5>옵션 정보</h5>
                                <div className='options-list'>
                                    {renderOptions()}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : displayType === 'room' ? (
                    <div className='detail-panel-section'>
                        <div className='property-image-slider'>
                            <span>매물 이미지</span>
                        </div>
                        
                        <div className='property-detail-info'>
                            <div className='property-price-info'>
                                <div className='price-row'>
                                    <span className='price-label'>보증금</span>
                                    <span className='price-value'>{data?.deposit?.toLocaleString()}만원</span>
                                </div>
                                <div className='price-row'>
                                    <span className='price-label'>월세</span>
                                    <span className='price-value'>{data?.monthlyRent?.toLocaleString()}만원</span>
                                </div>
                            </div>

                            <div className='property-basic-info'>
                                <div className='info-item'>
                                    <span className='info-label'>주소</span>
                                    <span className='info-value'>{data?.address}</span>
                                </div>
                                <div className='info-item'>
                                    <span className='info-label'>면적</span>
                                    <span className='info-value'>{data?.area}㎡ ({Math.floor(data?.area * 0.3025)}평)</span>
                                </div>
                                <div className='info-item'>
                                    <span className='info-label'>층수</span>
                                    <span className='info-value'>
                                        {formatFloorInfo(data?.currentFloor, data?.totalFloors)}
                                    </span>
                                </div>
                            </div>

                            <div className='property-options'>
                                <h5>옵션 정보</h5>
                                <div className='options-list'>
                                    {renderOptions()}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='detail-panel-section'>
                        <div className='agent-profile-card'>
                            <div className='agent-profile-header'>
                                <div className='agent-image-wrapper'>
                                    <img 
                                        src={data?.profileImage || '/default-agent.png'} 
                                        alt={data?.username} 
                                        className='agent-detail-image'
                                    />
                                </div>
                                <div className='agent-primary-info'>
                                    <h4 className='agent-name'>{data?.username}</h4>
                                    <p className='agent-title'>{data?.title}</p>
                                    <div className='agent-stats'>
                                        <div className='stat-item'>
                                            <span className='stat-label'>라이브</span>
                                            <span className='stat-value'>{data?.liveCount || 0}회</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='agent-content-section'>
                                <p className='agent-description'>{data?.content}</p>
                            </div>

                            <div className='agent-info-grid'>
                                <div className='info-grid-item'>
                                    <span className='info-grid-label'>등록번호</span>
                                    <span className='info-grid-value'>{data?.registrationNumber}</span>
                                </div>
                                <div className='info-grid-item'>
                                    <span className='info-grid-label'>연락처</span>
                                    <span className='info-grid-value'>{data?.tel}</span>
                                </div>
                                <div className='info-grid-item full-width'>
                                    <span className='info-grid-label'>주소</span>
                                    <span className='info-grid-value'>{data?.address}</span>
                                </div>
                            </div>

                            <button 
                                className='view-properties-button'
                                onClick={handleViewProperties}
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