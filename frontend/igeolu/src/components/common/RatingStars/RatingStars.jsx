
import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating }) => {
  const MAX_STARS = 5;
  const fullStars = Math.floor(rating || 0);

  return (
    <div className="flex items-center">
      <div className="flex gap-0.5">
        {[...Array(MAX_STARS)].map((_, index) => (
          <Star
            key={index}
            size={18}
            fill={index < fullStars ? '#FBBF24' : 'transparent'}
            stroke={index < fullStars ? '#FBBF24' : '#E5E7EB'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="ml-2 text-xl font-bold text-gray-800">
        {rating ? rating.toFixed(1) : '-'}
      </span>
    </div>
  );
};

export default RatingStars;