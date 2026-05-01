'use client';

import { motion } from 'framer-motion';
import { Star, Play, TrendingUp, Heart, Sparkles } from 'lucide-react';
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

function isRecentlyAdded(series: Series): boolean {
  const created = new Date(series.createdAt).getTime();
  return (Date.now() - created) < 30 * 24 * 60 * 60 * 1000;
}

function PosterCard({ series }: { series: Series }) {
  const { selectSeries, toggleFavorite, isFavorite } = useStore();
  const favorited = isFavorite(series.id);
  const isNew = isRecentlyAdded(series);

  return (
    <motion.button
      variants={itemVariants}
      onClick={() => selectSeries(series)}
      className="flex-shrink-0 w-[120px] sm:w-[140px] rounded-2xl overflow-hidden card-hover-lift cursor-pointer group relative"
    >
      <div className="relative h-[170px] sm:h-[198px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${series.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10">
            <span className="px-1.5 py-px rounded-full text-[7px] font-bold text-white bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-sm flex items-center gap-0.5">
              <Sparkles className="h-2 w-2" />
              جديد
            </span>
          </div>
        )}

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
          className={cn('absolute left-1.5 z-10 w-6 h-6 rounded-full glass flex items-center justify-center cursor-pointer', isNew ? 'bottom-1.5' : 'top-1.5')}
        >
          <Heart className={cn('h-3 w-3 transition-colors', favorited ? 'text-primary fill-primary' : 'text-white/80')} />
        </motion.button>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Play className="h-3.5 w-3.5 text-white fill-white mr-[-2px]" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <h3 className="text-[9px] font-bold text-white truncate mb-0.5">
            {series.title}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="h-2 w-2 text-accent fill-accent" />
              <span className="text-[9px] font-bold text-white">{series.rating.average}</span>
            </div>
            <span className="text-[8px] text-white/50">{series.year}</span>
            <span className="text-[8px] text-white/30">|</span>
            <span className="text-[8px] text-white/50">{series.seasons.length} مواسم</span>
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
    <section className="py-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">
          مسلسلات مميزة
        </h2>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {featured.map((series) => (
          <PosterCard key={series.id} series={series} />
        ))}
      </div>
    </section>
  );
}
