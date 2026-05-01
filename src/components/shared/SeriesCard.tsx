'use client';

import { motion } from 'framer-motion';
import { Star, Heart, Play } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Series } from '@/types';

interface SeriesCardProps {
  series: Series;
  size?: 'sm' | 'md' | 'lg';
}

export function SeriesCard({ series, size = 'sm' }: SeriesCardProps) {
  const { selectSeries, toggleFavorite, isFavorite } = useStore();
  const cat = CATEGORIES.find((c) => c.slug === series.category);
  const favorited = isFavorite(series.id);

  const sizeClasses = {
    sm: 'w-[130px] sm:w-[150px]',
    md: 'w-[160px] sm:w-[180px]',
    lg: 'w-[180px] sm:w-[200px]',
  };

  const heightClasses = {
    sm: 'h-[185px] sm:h-[210px]',
    md: 'h-[220px] sm:h-[250px]',
    lg: 'h-[250px] sm:h-[280px]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => selectSeries(series)}
      className={cn(
        'flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group relative card-hover-lift',
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
        <div className="absolute top-2 right-2">
          <span className={cn(
            'px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white',
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
          className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full glass flex items-center justify-center cursor-pointer"
          aria-label="إضافة للمفضلة"
        >
          <Heart
            className={cn(
              'h-3 w-3 transition-colors',
              favorited ? 'text-primary fill-primary' : 'text-white/80'
            )}
          />
        </motion.button>

        {/* Play Button Overlay - center */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Play className="h-4 w-4 text-white fill-white mr-[-2px]" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <h3 className="text-[11px] sm:text-xs font-bold text-white line-clamp-1 mb-1">
            {series.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-2.5 w-2.5 text-accent fill-accent" />
              <span className="text-[10px] font-bold text-white">{series.rating.average}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-white/50">{cat?.name}</span>
              <span className="text-[9px] text-white/30">|</span>
              <span className="text-[9px] text-white/50">{series.year}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
