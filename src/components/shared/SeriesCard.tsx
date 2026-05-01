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

  /* ─── Grid layout (xs): title BELOW image like Netflix ─── */
  if (isXs) {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => selectSeries(series)}
        className="w-full cursor-pointer group"
      >
        {/* Image */}
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-1.5">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${series.thumbnail})` }}
          />

          {/* Status Badge */}
          <div className="absolute top-1 right-1">
            <span className={cn(
              'px-1 py-px rounded-full font-bold text-white text-[6px]',
              series.status === 'مستمر' ? 'bg-success/90' : 'bg-primary/90'
            )}>
              {series.status}
            </span>
          </div>

          {/* Favorite */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); toggleFavorite(series.id); }}
            className="absolute top-1 left-1 z-10 w-4 h-4 rounded-full glass flex items-center justify-center cursor-pointer"
          >
            <Heart className={cn('h-2 w-2 transition-colors', favorited ? 'text-primary fill-primary' : 'text-white/80')} />
          </motion.button>

          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Play className="h-2.5 w-2.5 text-white fill-white mr-[-2px]" />
            </div>
          </div>
        </div>

        {/* Title - BELOW image, full width, no truncation */}
        <h3 className="text-[11px] font-bold text-text-main leading-tight line-clamp-2 text-right">
          {series.title}
        </h3>

        {/* Rating + Year */}
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="h-2.5 w-2.5 text-accent fill-accent" />
          <span className="text-[10px] font-bold text-text-subtle">{series.rating.average}</span>
          <span className="text-[9px] text-text-muted">·</span>
          <span className="text-[10px] text-text-subtle">{series.year}</span>
        </div>
      </motion.button>
    );
  }

  /* ─── Scroll layout (sm/md/lg): title OVERLAY on image ─── */
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
      <div className={cn(
        'relative overflow-hidden',
        size === 'sm' ? 'h-[185px] sm:h-[210px]' : size === 'md' ? 'h-[220px] sm:h-[250px]' : 'h-[250px] sm:h-[280px]'
      )}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${series.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-1.5 right-1.5">
          <span className={cn(
            'px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white',
            series.status === 'مستمر' ? 'bg-success/90' : 'bg-primary/90'
          )}>
            {series.status}
          </span>
        </div>

        {/* Favorite */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(series.id); }}
          className="absolute top-1.5 left-1.5 z-10 w-6 h-6 rounded-full glass flex items-center justify-center cursor-pointer"
        >
          <Heart className={cn('h-3 w-3 transition-colors', favorited ? 'text-primary fill-primary' : 'text-white/80')} />
        </motion.button>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Play className="h-4 w-4 text-white fill-white mr-[-2px]" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <h3 className="text-[11px] sm:text-xs font-bold text-white line-clamp-1 mb-0.5">
            {series.title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-2.5 w-2.5 text-accent fill-accent" />
              <span className="text-[10px] font-bold text-white">{series.rating.average}</span>
            </div>
            <span className="text-[9px] text-white/70">{series.year}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
