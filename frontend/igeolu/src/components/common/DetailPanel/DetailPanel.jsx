
import ChatApi from '../../../services/ChatApi';
import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Building2,
  MessageCircle,
} from 'lucide-react';
import axios from 'axios';
import './DetailPanel.css';
import RatingStars from '../RatingStars/RatingStars';

const DetailPanel = ({
  isVisible,
  onClose,
  type,
  data,
  onViewProperties,
  view,
  setView,
  onSwitchToAgent,
  onChatRoomCreated, // 새로 추가된 prop
}) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchOptions = async () => {
      console.log('fetchOptions 호출됨', {
        viewType: view,
        dataType: data?.type,
        hasOptions: Boolean(data?.options),
        isOptionsArray: Array.isArray(data?.options),
        options: data?.options,
        hasSelectedProperty: Boolean(selectedProperty),
        selectedPropertyOptions: selectedProperty?.options,
      });

      // 뷰가 propertyDetail이고 selectedProperty가 있는 경우
      if (view === 'propertyDetail' && selectedProperty?.options) {
        // selectedProperty.options가 이미 완전한 옵션 객체 배열인 경우
        if (
          selectedProperty.options.length > 0 &&
          selectedProperty.options[0].optionId !== undefined
        ) {
          console.log('selectedProperty에서 완성된 옵션 데이터 사용');
          setOptionsData(selectedProperty.options);
          return;
        }
        // selectedProperty.options가 ID 배열인 경우
        else if (Array.isArray(selectedProperty.options)) {
          try {
            console.log('selectedProperty.options에서 ID 배열 사용');
            const response = await axios.get(
              'https://i12d205.p.ssafy.io/api/options'
            );
            const allOptions = response.data;
            const filteredOptions = allOptions.filter((option) =>
              selectedProperty.options.includes(option.optionId)
            );
            setOptionsData(filteredOptions);
            return;
          } catch (error) {
            console.error('옵션 정보 로드 실패 (selectedProperty):', error);
          }
        }
      }

      // 기존 로직 (일반 room 타입 처리)
      if (data?.options && Array.isArray(data.options)) {
        try {
          // data.options가 이미 완전한 옵션 객체 배열인 경우
          if (
            data.options.length > 0 &&
            data.options[0].optionId !== undefined
          ) {
            console.log('data.options에서 완성된 옵션 데이터 사용');
            setOptionsData(data.options);
            return;
          }

          console.log('data.options에서 ID 배열 사용하여 API 호출');
          const response = await axios.get(
            'https://i12d205.p.ssafy.io/api/options'
          );
          const allOptions = response.data;
          const filteredOptions = allOptions.filter((option) =>
            data.options.includes(option.optionId)
          );
          console.log('필터링된 옵션:', filteredOptions);
          setOptionsData(filteredOptions);
        } catch (error) {
          console.error('옵션 정보 로드 실패 (data):', error);
        }
      } else {
        // 옵션 데이터가 없으면 초기화
        setOptionsData([]);
      }
    };

    if (isVisible) {
      console.log('DetailPanel 데이터 변경:', {
        isVisible,
        type,
        dataType: data?.type,
        view,
        propertyId: data?.propertyId,
        hasOptions: Boolean(data?.options),
        selectedPropertyId: selectedProperty?.propertyId,
      });
      fetchOptions();
    }
  }, [isVisible, data, selectedProperty, view]);

  useEffect(() => {
    if (!isVisible) {
      setView('main');
      setSelectedProperty(null);
      setProperties([]);
      setOptionsData([]);
      setCurrentImageIndex(0);
    }
  }, [isVisible, setView]);

  useEffect(() => {
    if (data) {
      if (data.type === 'agent') {
        setView('main');
        setSelectedProperty(null);
        setProperties([]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && data.type !== 'room') {
      setView('main');
      setSelectedProperty(null);
    }
  }, [data, setView]);

  if (!isVisible) return null;

  const isPropMarker = data?.type === 'room';
  const displayType = isPropMarker ? 'room' : type;

  const handleCreateChatRoom = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser?.userId) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 1. 먼저 현재 채팅방 목록을 가져옴
      const existingRooms = await ChatApi.getChatRooms(
        currentUser.userId,
        currentUser.role
      );

      // 2. 현재 사용자와 상대방 사이의 활성화된 채팅방이 있는지 확인
      const existingRoom = existingRooms.find(
        (room) =>
          room.userId === data?.userId &&
          // roomStatus가 'REALTOR'가 아닌 경우만 유효한 채팅방으로 간주
          room.roomStatus !== 'REALTOR'
      );

      if (existingRoom) {
        // 3A. 기존 채팅방이 있다면 해당 채팅방으로 이동
        const roomData = {
          ...existingRoom,
          userName: data.name || data.username || data.userName,
          userProfileUrl: data.profileImageUrl || data.userProfileUrl || '',
        };
        onChatRoomCreated(roomData);
      } else {
        // 3B. 유효한 채팅방이 없다면 새로 생성
        // (채팅방이 없거나, roomStatus가 'REALTOR'인 경우)

        const response = await ChatApi.createChatRoom(
          currentUser.userId,
          data?.userId
        );

        if (response?.id) {
          const chatRoomsResponse = await ChatApi.getChatRooms(
            currentUser.userId,
            currentUser.role
          );
          const newChatRoom = chatRoomsResponse.find(
            (room) => room.roomId === response.id
          );

          if (newChatRoom) {
            const roomData = {
              ...newChatRoom, // 서버에서 받은 전체 데이터 사용
              userName: data.name || data.username || data.userName,
              userProfileUrl: data.profileImageUrl || data.userProfileUrl || '',
            };

            onChatRoomCreated(roomData);
          }
        }
      }
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      alert('채팅방 생성에 실패했습니다.');
    }
  };

  const handleViewProperties = async () => {
    try {
      const response = await axios.get(
        `https://i12d205.p.ssafy.io/api/properties`,
        {
          params: { userId: data.userId },
        }
      );
      console.log('공인중개사 매물 목록 응답:', response.data);
      setProperties(response.data);
      setView('propertyList');
      onViewProperties(data.userId, null, response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      setView('propertyList');
    }
  };

  const handlePropertyClick = (property) => {
    console.log('매물 선택:', {
      propertyId: property.propertyId,
      hasOptions: Boolean(property.options),
      options: property.options,
    });
    setSelectedProperty(property);
    setView('propertyDetail');
    setCurrentImageIndex(0);
    onViewProperties(data.userId, property.propertyId, properties);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    const images =
      view === 'propertyDetail' ? selectedProperty?.images : data?.images;
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    const images =
      view === 'propertyDetail' ? selectedProperty?.images : data?.images;
    if (images && images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const ImageSlider = ({ images }) => {
    if (!images || images.length === 0) {
      return <div className='no-image'>이미지가 없습니다</div>;
    }

    return (
      <div className='image-slider'>
        <img
          src={images[currentImageIndex]}
          alt='매물 이미지'
          className='slider-image'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/room-placeholder.jpg';
          }}
        />
        {images.length > 1 && (
          <>
            <div className='slider-controls'>
              <button onClick={handlePrevImage} className='slider-button'>
                <ChevronLeft size={24} />
              </button>
              <button onClick={handleNextImage} className='slider-button'>
                <ChevronRight size={24} />
              </button>
            </div>
            <div className='image-counter'>
              {currentImageIndex + 1} / {images.length}
            </div>
            <div className='image-thumbnails'>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail-wrapper ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                >
                  <img
                    src={image}
                    alt={`썸네일 ${index + 1}`}
                    className='thumbnail-image'
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/room-placeholder.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderOptions = () => {
    console.log('renderOptions 호출됨', {
      optionsDataLength: optionsData?.length,
      currentOptions: optionsData,
      view,
    });

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
          {view === 'propertyList'
            ? '매물 목록'
            : view === 'propertyDetail'
              ? '매물 상세정보'
              : displayType === 'room'
                ? '매물 상세정보'
                : '공인중개사 정보'}
        </h3>
        <div className='header-buttons'>
          {(view === 'propertyList' || view === 'propertyDetail') && (
            <button
              className='detail-back-button'
              onClick={() => {
                if (view === 'propertyDetail') {
                  setView('propertyList');
                  setSelectedProperty(null);
                  onViewProperties(data.userId, null, properties, true);
                } else {
                  setView('main');
                  setSelectedProperty(null);
                  onViewProperties(data.userId, null, null, true);
                }
              }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <button
            className='detail-close-button'
            onClick={() => {
              if (type === 'room') {
                onClose();
                setView('main');
                setSelectedProperty(null);
                setProperties([]);
              } else if (type === 'agent') {
                onClose('agent');
                setView('main');
                setSelectedProperty(null);
                setProperties([]);
              }
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className='detail-panel-content'>
        {view === 'propertyList' ? (
          <div className='property-list-view'>
            <div className='property-list-header'>
              <span className='total-count'>
                총 {properties.length}개의 매물
              </span>
            </div>
            <div className='property-list-content'>
              {properties.length > 0 ? (
                <div className='list-items'>
                  {properties.map((property) => (
                    <div
                      key={property.propertyId}
                      className='property-list-item'
                      onClick={() => handlePropertyClick(property)}
                    >
                      <div className='property-preview-image'>
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt='매물 이미지'
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/room-placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className='no-image-preview'>이미지 없음</div>
                        )}
                      </div>
                      <div className='property-list-item-content'>
                        <div className='property-list-price'>
                          <span className='deposit'>
                            {property.deposit?.toLocaleString()} /{' '}
                          </span>
                          <span className='monthly-rent'>
                            {property.monthlyRent?.toLocaleString()}
                          </span>
                        </div>
                        <div className='property-list-info'>
                          <span className='address'>{property.address}</span>
                          <div className='property-specs'>
                            <span>{property.area}㎡</span>
                            <span className='spec-divider'>|</span>
                            <span>
                              {formatFloorInfo(
                                property.currentFloor,
                                property.totalFloors
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='no-results'>
                  <Building2 size={48} />
                  <p>등록된 매물이 없습니다.</p>
                  <span>
                    공인중개사가 새로운 매물을 등록하면 이곳에 표시됩니다.
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : view === 'propertyDetail' ? (
          <div className='detail-panel-section'>
            <div className='property-image-slider'>
              <ImageSlider images={selectedProperty?.images} />
            </div>
            <div className='property-detail-info'>
              <div className='property-price-info'>
                <div className='price-row'>
                  <span className='price-label'>보증금</span>
                  <span className='price-value'>
                    {selectedProperty?.deposit?.toLocaleString()}만원
                  </span>
                </div>
                <div className='price-row'>
                  <span className='price-label'>월세</span>
                  <span className='price-value'>
                    {selectedProperty?.monthlyRent?.toLocaleString()}만원
                  </span>
                </div>
              </div>
              <div className='property-basic-info'>
                <div className='info-item'>
                  <span className='info-label'>주소</span>
                  <span className='info-value'>
                    {selectedProperty?.address}
                  </span>
                </div>
                <div className='info-item'>
                  <span className='info-label'>면적</span>
                  <span className='info-value'>
                    {selectedProperty?.area}㎡ (
                    {Math.floor(selectedProperty?.area * 0.3025)}평)
                  </span>
                </div>
                <div className='info-item'>
                  <span className='info-label'>층수</span>
                  <span className='info-value'>
                    {formatFloorInfo(
                      selectedProperty?.currentFloor,
                      selectedProperty?.totalFloors
                    )}
                  </span>
                </div>
              </div>
              <div className='property-options'>
                <h5>옵션 정보</h5>
                <div className='options-list'>{renderOptions()}</div>
              </div>
            </div>
          </div>
        ) : displayType === 'room' ? (
          <div className='detail-panel-section'>
            <div className='property-image-slider'>
              <ImageSlider images={data?.images} />
            </div>
            <div className='property-detail-info'>
              <div className='property-price-info'>
                <div className='price-row'>
                  <span className='price-label'>보증금</span>
                  <span className='price-value'>
                    {data?.deposit?.toLocaleString()}만원
                  </span>
                </div>
                <div className='price-row'>
                  <span className='price-label'>월세</span>
                  <span className='price-value'>
                    {data?.monthlyRent?.toLocaleString()}만원
                  </span>
                </div>
              </div>
              <div className='property-basic-info'>
                <div className='info-item'>
                  <span className='info-label'>주소</span>
                  <span className='info-value'>{data?.address}</span>
                </div>
                <div className='info-item'>
                  <span className='info-label'>면적</span>
                  <span className='info-value'>
                    {data?.area}㎡ ({Math.floor(data?.area * 0.3025)}평)
                  </span>
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
                <div className='options-list'>{renderOptions()}</div>
              </div>

              <button
                className='view-properties-button'
                onClick={() => onSwitchToAgent(data.userId)}
              >
                <Building2 size={20} />
                공인중개사 정보 보기
              </button>
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-agent.png';
                    }}
                  />
                </div>
                <div className='agent-primary-info'>
                  <h4 className='agent-name'>{data?.username}</h4>
                  <p className='agent-title'>{data?.title}</p>
                  <div className='agent-stats'>
                    <div className='agent-stat-row'>
                      <div className='rating-header'>
                        <span className='stat-label'>평점</span>
                        <span className='rating-text'>
                          {data?.ratingAvg?.toFixed(1) || '-'}
                        </span>
                      </div>
                      <div className='rating-value'>
                        <RatingStars
                          rating={data?.ratingAvg || 0}
                          showScore={false}
                        />
                      </div>
                    </div>

                    <div className='agent-stat-row'>
                      <div className='live-count'>
                        <span className='stat-label'>방송</span>
                        <span className='live-count-value'>
                          {data?.liveCount || 0}
                        </span>
                        <span className='live-count-text'>회</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {data?.content && (
                <div className='agent-content-section'>
                  <p className='agent-description'>{data.content}</p>
                </div>
              )}

              <div className='agent-info-grid'>
                <div className='info-grid-item'>
                  <span className='info-grid-label'>등록번호</span>
                  <span className='info-grid-value'>
                    {data?.registrationNumber || '-'}
                  </span>
                </div>
                <div className='info-grid-item'>
                  <span className='info-grid-label'>연락처</span>
                  <span className='info-grid-value'>{data?.tel || '-'}</span>
                </div>
                <div className='info-grid-item'>
                  <span className='info-grid-label'>주소</span>
                  <span className='info-grid-value'>
                    {data?.address || '-'}
                  </span>
                </div>
              </div>

              <div className='agent-action-buttons'>
                <button
                  className='view-properties-button'
                  onClick={handleViewProperties}
                >
                  <Building2 size={20} />
                  매물 보기
                </button>
                <button
                  className='mappage-chat-button'
                  onClick={handleCreateChatRoom}
                >
                  <MessageCircle size={20} />
                  채팅하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
