'use client';

import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  count?: number;
}

export default function Rating({ rating, count }: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  // If the fractional part is >= 0.75, treat as full star
  const adjustedFull = rating - Math.floor(rating) >= 0.75 ? fullStars + 1 : fullStars;
  const adjustedEmpty = 5 - adjustedFull - (rating - Math.floor(rating) >= 0.75 ? 0 : hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: adjustedFull }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-3.5 h-3.5 text-star fill-star"
          />
        ))}

        {/* Half star */}
        {hasHalf && rating - Math.floor(rating) < 0.75 && (
          <div className="relative w-3.5 h-3.5">
            <Star className="absolute inset-0 w-3.5 h-3.5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-[50%]">
              <Star className="w-3.5 h-3.5 text-star fill-star" />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: adjustedEmpty }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="w-3.5 h-3.5 text-gray-300"
          />
        ))}
      </div>

      {count !== undefined && (
        <span className="text-sub text-xs">({count})</span>
      )}
    </div>
  );
}
