'use client';

import { motion } from 'framer-motion';
import { Star, Heart, Play } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { Series } from '@/types';

interface SeriesCardProps {
  series: Series;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function SeriesCard({ series, size = 'sm' }: SeriesCardProps) {
  const { selectSeries, toggleFavorite, isFavorite } = useStore();
  const favorited = isFavorite(series.id);
  const isXs = size === 'xs';

  const sizeClasses = {
    xs: 'w-full',
    sm: 'w-[130px] sm:w-[150px]',
    md: 'w-[160px] sm:w-[180px]',
    lg: 'w-[180px] sm:w-[200px]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => selectSeries(series)}
      className={cn(
        'rounded-2xl overflow-hidden cursor-pointer group relative card-hover-lift',
        sizeClasses[size]
      )}
    >
      {/* Thumbnail container - aspect ratio for xs, fixed height for others */}
      <div className={cn(
        'relative overflow-hidden',
        isXs ? 'aspect-[2/3]' : (size === 'sm' ? 'h-[185px] sm:h-[210px]' : size === 'md' ? 'h-[220px] sm:h-[250px]' : 'h-[250px] sm:h-[280px]')
      )}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${series.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Status Badge */}
        <div className={cn('absolute top-1 right-1', !isXs && 'top-1.5 right-1.5')}>
          <span className={cn(
            'px-1 py-0.5 rounded-full font-bold text-white',
            isXs ? 'text-[7px]' : 'text-[9px]',
            series.status === 'مستمر' ? 'bg-success/90' : 'bg-primary/90'
          )}>
            {series.status}
          </span>
        </div>

        {/* Favorite */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(series.id); }}
          className={cn(
            'absolute left-1 z-10 rounded-full glass flex items-center justify-center cursor-pointer',
            isXs ? 'top-1 w-4 h-4' : 'top-1.5 left-1.5 w-6 h-6'
          )}
          aria-label="إضافة للمفضلة"
        >
          <Heart
            className={cn(
              'transition-colors',
              isXs ? 'h-2 w-2' : 'h-3 w-3',
              favorited ? 'text-primary fill-primary' : 'text-white/80'
            )}
          />
        </motion.button>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={cn(
            'rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30',
            isXs ? 'w-7 h-7' : 'w-10 h-10'
          )}>
            <Play className={cn('text-white fill-white mr-[-2px]', isXs ? 'h-2.5 w-2.5' : 'h-4 w-4')} />
          </div>
        </div>

        {/* Bottom Info */}
        <div className={cn('absolute bottom-0 left-0 right-0', isXs ? 'px-1 py-0.5' : 'p-2.5')}>
          <h3 className={cn(
            'font-semibold text-white',
            isXs ? 'text-[6px] leading-tight line-clamp-2' : 'text-[11px] sm:text-xs font-bold line-clamp-1'
          )}>
            {series.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Star className={cn('text-accent fill-accent', isXs ? 'h-1.5 w-1.5' : 'h-2.5 w-2.5')} />
              <span className={cn('font-bold text-white', isXs ? 'text-[8px]' : 'text-[10px]')}>
                {series.rating.average}
              </span>
            </div>
            <span className={cn('text-white/50', isXs ? 'text-[7px]' : 'text-[9px]')}>
              {series.year}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
