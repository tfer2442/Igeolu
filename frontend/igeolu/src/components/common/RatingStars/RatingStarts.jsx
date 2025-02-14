import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating }) => {
  const MAX_STARS = 5;
  const fullStars = Math.floor(rating || 0);
  const hasHalfStar = (rating || 0) % 1 >= 0.5;

  return (
    <div className="flex items-center">
      <div className="flex gap-0.5">
        {[...Array(MAX_STARS)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className={index < fullStars 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-200'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="ml-2 font-bold text-xl text-gray-800">
        {rating ? rating.toFixed(1) : '-'}
      </span>
    </div>
  );
};

export default RatingStars;