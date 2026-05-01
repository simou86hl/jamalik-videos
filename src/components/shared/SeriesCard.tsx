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
  showRating?: boolean;
  showStatus?: boolean;
}

export function SeriesCard({
  series,
  size = 'md',
  showRating = true,
  showStatus = true,
}: SeriesCardProps) {
  const { selectSeries, toggleFavorite, isFavorite } = useStore();
  const cat = CATEGORIES.find((c) => c.slug === series.category);
  const favorited = isFavorite(series.id);

  const heightMap = { sm: 'h-[160px]', md: 'h-[240px]', lg: 'h-[320px]' };
  const widthClass = size === 'sm' ? 'w-[120px] sm:w-[140px]' : size === 'md' ? 'w-full' : 'w-full';

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => selectSeries(series)}
      className={cn(
        'glass rounded-2xl overflow-hidden cursor-pointer group text-right relative card-hover',
        widthClass
      )}
    >
      {/* Thumbnail */}
      <div className={cn('relative overflow-hidden', heightMap[size])}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${series.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 rounded-full glass text-[10px] font-bold text-white">
            {cat?.name}
          </span>
        </div>

        {/* Status Badge */}
        {showStatus && (
          <div className="absolute top-2 left-2">
            <span className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold text-white',
              series.status === 'مستمر' ? 'bg-success/90' : 'bg-primary/90'
            )}>
              {series.status}
            </span>
          </div>
        )}

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
            <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
          </div>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(series.id);
          }}
          className="absolute bottom-2 left-2 z-10 w-8 h-8 rounded-full glass flex items-center justify-center cursor-pointer"
          aria-label="إضافة للمفضلة"
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              favorited ? 'text-primary fill-primary' : 'text-white'
            )}
          />
        </motion.button>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
          <h3 className={cn(
            'font-bold text-white line-clamp-1 mb-1',
            size === 'sm' ? 'text-[11px]' : size === 'md' ? 'text-sm' : 'text-base'
          )}>
            {series.title}
          </h3>
          {showRating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-accent fill-accent" />
                <span className="text-[10px] font-bold text-white">{series.rating.average}</span>
              </div>
              <span className="text-[10px] text-white/70">{series.year}</span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
