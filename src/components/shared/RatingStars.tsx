'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({
  rating,
  size = 'md',
  interactive = false,
  onChange,
}: RatingStarsProps) {
  const sizeMap = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' };
  const gapMap = { sm: 'gap-0.5', md: 'gap-0.5', lg: 'gap-1' };

  return (
    <div className={cn('flex items-center', gapMap[size])}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const half = !filled && star - 0.5 <= rating;

        return (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange?.(star)}
            disabled={!interactive}
            className={cn(
              'relative transition-transform duration-200',
              interactive && 'cursor-pointer hover:scale-125',
              !interactive && 'cursor-default'
            )}
            aria-label={`${star} نجوم`}
          >
            {/* Background (empty) star */}
            <Star className={cn(sizeMap[size], 'text-border')} />

            {/* Filled star overlay */}
            {(filled || half) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : '50%' }}
              >
                <Star
                  className={cn(
                    sizeMap[size],
                    'text-accent fill-accent'
                  )}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
