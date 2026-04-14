'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  itemId: string;
  initialRating?: number;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingStars({ itemId, initialRating = 0, interactive = true, size = 'md' }: RatingStarsProps) {
  const { submitRating, userRatings } = useStore();
  const [hovered, setHovered] = useState(0);

  const existingRating = userRatings.find((r) => r.itemId === itemId);
  const currentRating = existingRating ? existingRating.rating : initialRating;

  const handleClick = (rating: number) => {
    if (!interactive) return;
    submitRating(itemId, rating);
  };

  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-6 w-6' : 'h-4.5 w-4.5';
  const gap = size === 'sm' ? 'gap-0.5' : size === 'lg' ? 'gap-1.5' : 'gap-1';

  return (
    <div className="flex items-center gap-2">
      <div className={cn('flex items-center', gap, interactive && 'cursor-pointer')}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={cn('transition-transform duration-200', interactive && 'hover:scale-110 cursor-pointer')}
            disabled={!interactive}
            type="button"
            aria-label={`تقييم ${star} نجوم`}
          >
            <Star
              className={cn(
                starSize,
                'transition-colors duration-200',
                (hovered || currentRating) >= star
                  ? 'text-accent fill-accent'
                  : 'text-text-subtle/30'
              )}
            />
          </button>
        ))}
      </div>
      {currentRating > 0 && (
        <span className="text-xs text-text-subtle font-medium">{currentRating}.0</span>
      )}
    </div>
  );
}
