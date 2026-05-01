'use client';

import { motion } from 'framer-motion';
import { Star, Heart, Play } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Series } from '@/types';

interface SeriesCardProps {
  series: Series;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function SeriesCard({ series, size = 'sm' }: SeriesCardProps) {
  const { selectSeries, toggleFavorite, isFavorite } = useStore();
  const cat = CATEGORIES.find((c) => c.slug === series.category);
  const favorited = isFavorite(series.id);

  const sizeClasses = {
    xs: 'w-[105px] sm:w-[120px] md:w-[135px]',
    sm: 'w-[130px] sm:w-[150px]',
    md: 'w-[160px] sm:w-[180px]',
    lg: 'w-[180px] sm:w-[200px]',
  };

  const heightClasses = {
    xs: 'h-[150px] sm:h-[170px] md:h-[192px]',
    sm: 'h-[185px] sm:h-[210px]',
    md: 'h-[220px] sm:h-[250px]',
    lg: 'h-[250px] sm:h-[280px]',
  };

  const isXs = size === 'xs';

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
      {/* Thumbnail */}
      <div className={cn('relative overflow-hidden', heightClasses[size])}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${series.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Status Badge - top right */}
        <div className="absolute top-1.5 right-1.5">
          <span className={cn(
            'px-1.5 py-0.5 rounded-full font-bold text-white',
            isXs ? 'text-[8px]' : 'text-[9px]',
            series.status === 'مستمر' ? 'bg-success/90' : 'bg-primary/90'
          )}>
            {series.status}
          </span>
        </div>

        {/* Favorite Button - top left */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(series.id);
          }}
          className={cn(
            'absolute top-1.5 left-1.5 z-10 rounded-full glass flex items-center justify-center cursor-pointer',
            isXs ? 'w-5 h-5' : 'w-6 h-6'
          )}
          aria-label="إضافة للمفضلة"
        >
          <Heart
            className={cn(
              'transition-colors',
              isXs ? 'h-2.5 w-2.5' : 'h-3 w-3',
              favorited ? 'text-primary fill-primary' : 'text-white/80'
            )}
          />
        </motion.button>

        {/* Play Button Overlay - center */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={cn(
            'rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30',
            isXs ? 'w-8 h-8' : 'w-10 h-10'
          )}>
            <Play className={cn('text-white fill-white mr-[-2px]', isXs ? 'h-3 w-3' : 'h-4 w-4')} />
          </div>
        </div>

        {/* Bottom Info */}
        <div className={cn('absolute bottom-0 left-0 right-0', isXs ? 'p-1.5' : 'p-2.5')}>
          <h3 className={cn(
            'font-bold text-white line-clamp-1 mb-0.5',
            isXs ? 'text-[10px]' : 'text-[11px] sm:text-xs'
          )}>
            {series.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Star className={cn('text-accent fill-accent', isXs ? 'h-2 w-2' : 'h-2.5 w-2.5')} />
              <span className={cn('font-bold text-white', isXs ? 'text-[9px]' : 'text-[10px]')}>
                {series.rating.average}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className={cn('text-white/50', isXs ? 'text-[8px]' : 'text-[9px]')}>
                {series.year}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
