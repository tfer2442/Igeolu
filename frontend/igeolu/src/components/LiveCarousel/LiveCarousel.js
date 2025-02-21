// src/components/LiveCarousel/LiveCarousel.js
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './LiveCarousel.css';

const LiveCarousel = ({ liveData, currentIndex, onPrev, onNext }) => {
  if (!liveData || liveData.length === 0) return null;

  return (
    <div className="live-carousel-container">
      <button className="carousel-button prev" onClick={onPrev}>
        <ChevronLeft size={24} />
      </button>

      <p className="live-date">
        {new Date(liveData[currentIndex].createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })} 라이브
      </p>

      <button className="carousel-button next" onClick={onNext}>
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default LiveCarousel;