
"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  totalStars?: number;
}

export function StarRating({ rating, onRatingChange, totalStars = 5 }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={starValue}
            className={cn(
              "cursor-pointer transition-colors",
              starValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
            )}
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${starValue} out of ${totalStars}`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        );
      })}
    </div>
  );
}
