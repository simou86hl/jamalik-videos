'use client';

import { motion } from 'framer-motion';
import { Star, Play, TrendingUp, Heart } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { Series } from '@/types';

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

interface PosterCardProps {
  series: Series;
}

function PosterCard({ series }: PosterCardProps) {
  const { selectSeries, toggleFavorite, isFavorite } = useStore();
  const favorited = isFavorite(series.id);

  return (
    <motion.button
      variants={itemVariants}
      onClick={() => selectSeries(series)}
      className="flex-shrink-0 w-[130px] sm:w-[150px] rounded-2xl overflow-hidden card-hover-lift cursor-pointer group relative"
    >
      <div className="relative h-[185px] sm:h-[210px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${series.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
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
          className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full glass flex items-center justify-center cursor-pointer"
        >
          <Heart
            className={cn('h-3 w-3 transition-colors', favorited ? 'text-primary fill-primary' : 'text-white/80')}
          />
        </motion.button>

        {/* Play Button Overlay */}
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

export function FeaturedSeries() {
  const featured = ALL_SERIES.filter((s) => s.isFeatured);

  if (featured.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">
          مسلسلات مميزة
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {featured.map((series) => (
          <PosterCard key={series.id} series={series} />
        ))}
      </div>
    </section>
  );
}
