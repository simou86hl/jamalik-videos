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
  const { selectSeries, toggleFavorite, isFavorite, watchProgress } = useStore();
  const favorited = isFavorite(series.id);
  const isXs = size === 'xs';

  // Get latest watch progress for this series
  const seriesProgress = watchProgress
    .filter((p) => p.seriesId === series.id)
    .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())[0];
  const progressPercent = seriesProgress ? Math.min(100, (seriesProgress.timestamp / 2700) * 100) : 0;

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
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-0.5">
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

        {/* Watch Progress Bar */}
        {seriesProgress && (
          <div className="w-full h-0.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Title - wider container scaled down: text gets more room, less truncation */}
        <div
          className="overflow-hidden"
          style={{
            transform: 'scale(0.65)',
            transformOrigin: 'top right',
            width: 'calc(100% / 0.65)',
            marginBottom: '-5px',
            lineHeight: '1.3'
          }}
        >
          <h3 className="text-[10px] font-medium text-text-main truncate text-right block whitespace-nowrap">
            {series.title}
          </h3>
        </div>

        {/* Rating + Year - same trick */}
        <div
          style={{
            transform: 'scale(0.65)',
            transformOrigin: 'top left',
            width: 'calc(100% / 0.65)',
            lineHeight: '1.3'
          }}
        >
          <div className="flex items-center gap-0.5">
            <Star className="h-2 w-2 text-accent fill-accent" />
            <span className="text-[9px] text-text-subtle">{series.rating.average}</span>
            <span className="text-[8px] text-text-muted">·</span>
            <span className="text-[9px] text-text-subtle">{series.year}</span>
          </div>
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
          {/* Watch Progress Bar */}
          {seriesProgress && (
            <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
          <h3 className="text-[9px] font-bold text-white truncate mb-0.5">
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
