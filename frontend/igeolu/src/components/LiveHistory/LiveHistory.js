import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import MyPageModal from '../MyPageModal/MyPageModal';
import './LiveHistory.css';

const LiveHistory = ({ liveData, onSelectLive, selectedLiveId }) => {
  const [expandedLive, setExpandedLive] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const itemsPerPage = 5;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  const isNew = (dateString) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffHours = (now - created) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  const handlePropertyDetail = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  // 정렬된 데이터 준비
  const sortedData = [...liveData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setExpandedLive(null); // 페이지 변경 시 확장된 항목 초기화
  };

  return (
    <div className="live-history-container">
      <div className="live-history-header">
        <h3 className="live-history-title">라이브 히스토리</h3>
        <span className="live-history-count">총 {liveData.length}개의 라이브</span>
      </div>

      <div className="live-history-list">
        {currentItems.map((live) => {
          const isExpanded = expandedLive === live.liveId;
          const isSelected = selectedLiveId === live.liveId;
          
          return (
            <div 
              key={live.liveId}
              className={`live-history-item ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
            >
              <div 
                className="live-history-item-header"
                onClick={() => {
                  setExpandedLive(isExpanded ? null : live.liveId);
                  onSelectLive(live);
                }}
              >
                <div className="live-history-item-content">
                  <div className="live-history-item-title">
                    <div className="badge-container">
                      <span className="live-badge">LIVE</span>
                      {isNew(live.createdAt) && <span className="new-badge">NEW</span>}
                    </div>
                    <span className="live-date">{formatDate(live.createdAt)}</span>
                    <span className="live-time">{formatTime(live.createdAt)}</span>
                  </div>
                  
                  <div className="live-history-item-info">
                    <div className="info-item">
                      <Home size={16} />
                      <span>매물 {live.properties?.length || 0}개</span>
                    </div>
                  </div>
                </div>
                
                <div className="live-history-item-toggle">
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>
              
              {isExpanded && live.properties && (
                <div className="property-grid">
                  {live.properties.map((property) => (
                    <div 
                      key={property.propertyId}
                      className="property-card"
                    >
                      <div className="property-image-container">
                        <img
                          src={property.images[0]}
                          alt={property.description}
                          className="property-image"
                        />
                      </div>
                      <div className="property-details">
                        <p className="property-description">{property.description}</p>
                        <div className="property-footer">
                          <div className="property-price">
                            <p className="price-label">보증금/월세</p>
                            <p className="price-value">
                              {formatPrice(property.deposit)}/{formatPrice(property.monthlyRent)}만원
                            </p>
                          </div>
                          <button 
                            className="detail-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePropertyDetail(property);
                            }}
                          >
                            상세보기
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            title="처음으로"
          >
            {"<<"}
          </button>
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(Math.max(1, Math.floor((currentPage - 1) / 10) * 10))}
            disabled={currentPage <= 10}
            title="이전 10페이지"
          >
            {"<"}
          </button>
          
          {[...Array(10)].map((_, index) => {
            const pageNumber = Math.floor((currentPage - 1) / 10) * 10 + index + 1;
            if (pageNumber <= totalPages) {
              return (
                <button
                  key={pageNumber}
                  className={`pagination-number ${pageNumber === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            }
            return null;
          })}

          <button 
            className="pagination-button"
            onClick={() => handlePageChange(Math.min(totalPages, Math.ceil(currentPage / 10) * 10 + 1))}
            disabled={Math.ceil(currentPage / 10) * 10 >= totalPages}
            title="다음 10페이지"
          >
            {">"}
          </button>
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="마지막으로"
          >
            {">>"}
          </button>
        </div>
      )}

      {selectedProperty && (
        <MyPageModal
          property={selectedProperty}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default LiveHistory;