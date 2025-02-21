
import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating }) => {
  const MAX_STARS = 5;
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2;
  
  for (let i = 1; i <= MAX_STARS; i++) {
    if (i <= roundedRating) {
      // 꽉 찬 별
      stars.push(
        <Star 
          key={i} 
          size={18} 
          color="#FBBF24" 
          fill="#FBBF24"
          strokeWidth={1.5}
        />
      );
    } else if (i - 0.5 === roundedRating) {
      // 반 별
      stars.push(
        <div key={i} style={{ position: 'relative', width: '18px', height: '18px' }}>
          {/* 회색 별 (뒤) */}
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <Star 
              size={18} 
              color="#E5E7EB" 
              fill="#E5E7EB"
              strokeWidth={1.5}
            />
          </div>
          {/* 노란 반별 (앞) */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '50%', 
            overflow: 'hidden' 
          }}>
            <Star 
              size={18} 
              color="#FBBF24" 
              fill="#FBBF24"
              strokeWidth={1.5}
            />
          </div>
        </div>
      );
    } else {
      // 빈 별
      stars.push(
        <Star 
          key={i} 
          size={18} 
          color="#E5E7EB" 
          fill="#E5E7EB"
          strokeWidth={1.5}
        />
      );
    }
  }

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {stars}
    </div>
  );
};

export default RatingStars;