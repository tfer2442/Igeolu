import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import './MyPageModal.css';
import LiveControllerApi from '../../services/LiveControllerApi';
import { FaRobot } from 'react-icons/fa';

const MyPageModal = ({ property, onClose }) => {
  const [summary, setSummary] = useState('');
  const [recordingInfo, setRecordingInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchRecordingInfo = async () => {
      try {
        setIsLoading(true);
        if (property.recordingId) {
          const recordingResponse = await LiveControllerApi.getRecordingInfo(
            property.recordingId
          );
          setRecordingInfo(recordingResponse);
        }
      } catch (error) {
        console.error('Error fetching recording info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (property) {
      fetchRecordingInfo();
    }
  }, [property]);

  const handleLoadSummary = async () => {
    try {
      setIsSummaryLoading(true);
      if (property.livePropertyId) {
        const summaryResponse = await LiveControllerApi.getLivePropertySummary(
          property.livePropertyId
        );
        
        // "매물 요약:" 부분을 처리하기 위해 먼저 ':' 으로 분리
        const [title, content] = summaryResponse['summary'].split(':');
        
        // 내용 부분을 '.' 으로 분할하고 각각 줄바꿈 처리
        const lines = content
          .split('.')
          .filter(line => line.trim()) // 빈 문자열 제거
          .map((line, index) => (
            <React.Fragment key={index}>
              {line.trim()}.
              <br />
            </React.Fragment>
          ));
          
        // 제목과 내용을 합쳐서 최종 요약본 생성
        const formattedSummary = (
          <>
            {title}:<br />
            {lines}
          </>
        );
        
        setSummary(formattedSummary);
      }
    } catch (error) {
      console.error('Error fetching property summary:', error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="loading">로딩중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-modal-overlay">
      <div className="mypage-modal-container">
        <div className="mypage-modal-header">
          <h2>{property.description}</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="mypage-modal-content">
          <div className="content-main">
            <div className="video-container">
              {recordingInfo?.url ? (
                <div className="video-wrapper">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video src={recordingInfo.url} controls />
                </div>
              ) : (
                <div className="video-placeholder">
                  <div className="play-button">
                    <div className="play-icon" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="thumbnails">
              {property.images.map((image, index) => (
                <div key={index} className="thumbnail">
                  <img src={image} alt={`Property view ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="content-info">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                음성요약
              </button>
              <button 
                className={`tab ${activeTab === 'memo' ? 'active' : ''}`}
                onClick={() => setActiveTab('memo')}
              >
                메모
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'summary' ? (
                <div className="summary-content">
                  {summary ? (
                    summary
                  ) : (
                    <div className="summary-loading-container">
                      {isSummaryLoading ? (
                        <div>요약 정보를 불러오는 중...</div>
                      ) : (
                        <button 
                          onClick={handleLoadSummary}
                          className="load-summary-button"
                        >
                          <FaRobot style={{ marginRight: '8px' }} />
                          요약 정보 불러오기
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="memo-content">
                  {property.memo || '메모가 없습니다.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MyPageModal.propTypes = {
  property: PropTypes.shape({
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    livePropertyId: PropTypes.number,
    recordingId: PropTypes.string,
    memo: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MyPageModal;