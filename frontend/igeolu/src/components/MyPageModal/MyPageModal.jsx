// src/components/MyPageModal/MyPageModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import './MyPageModal.css';

const MyPageModal = ({ onClose }) => {
  const [mainImage, setMainImage] = useState('house1');
  const thumbnails = ['house1', 'house2', 'house3', 'house4'];

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="modal-close"
        >
          <X className="close-icon" />
        </button>

        {/* Modal header */}
        <div className="modal-header">
          <h2>남정옷통비앤제</h2>
        </div>

        {/* Modal content */}
        <div className="modal-content">
          {/* Main content - Video/Image */}
          <div className="main-content">
            <div className="main-image-container">
              <img 
                src={`/src/assets/images/${mainImage}.jpg`}
                alt="Property view"
                className="main-image"
              />
              {/* Play button overlay */}
              <div className="play-button-overlay">
                <div className="play-button">
                  <div className="play-icon" />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="description-container">
              <h3>물성보수 메모</h3>
              <p>
                구내 공사 평수에 있어서는 산업정보가 중요기 거부 거절한 정허입니다.
                오늘도 좋아라며 분야된 홍마금.
              </p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="thumbnails-container">
            {thumbnails.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(image)}
              >
                <img 
                  src={`/src/assets/images/${image}.jpg`}
                  alt={`Thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageModal;