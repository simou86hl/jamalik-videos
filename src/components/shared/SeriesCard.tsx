'use client';

import { motion } from 'framer-motion';
import { Star, Heart, Play } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Series } from '@/types';

interface SeriesCardProps {
  series: Series;
}

export function SeriesCard({ series }: SeriesCardProps) {
  const { selectSeries, toggleFavorite, isFavorite } = useStore();
  const cat = CATEGORIES.find((c) => c.slug === series.category);
  const favorited = isFavorite(series.id);

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => selectSeries(series)}
      className="w-full glass rounded-2xl overflow-hidden cursor-pointer group text-right relative card-hover-lift"
    >
      {/* Thumbnail */}
      <div className="relative h-[220px] sm:h-[260px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${series.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Status Badge - top right */}
        <div className="absolute top-2.5 right-2.5">
          <span className={cn(
            'px-2 py-0.5 rounded-full text-[10px] font-bold text-white',
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
          className="absolute top-2.5 left-2.5 z-10 w-7 h-7 rounded-full glass flex items-center justify-center cursor-pointer"
          aria-label="إضافة للمفضلة"
        >
          <Heart
            className={cn(
              'h-3.5 w-3.5 transition-colors',
              favorited ? 'text-primary fill-primary' : 'text-white/80'
            )}
          />
        </motion.button>

        {/* Play Button Overlay - center */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Play className="h-5 w-5 text-white fill-white mr-[-2px]" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white line-clamp-1 mb-1.5">
            {series.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="h-3 w-3 text-accent fill-accent" />
              <span className="text-[11px] font-bold text-white">{series.rating.average}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/50">{cat?.name}</span>
              <span className="text-[10px] text-white/30">|</span>
              <span className="text-[10px] text-white/50">{series.year}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
