'use client';

import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft, Star, Play, Heart } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { Series } from '@/types';

function isRecentlyAdded(series: Series): boolean {
  const created = new Date(series.createdAt).getTime();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return (Date.now() - created) < thirtyDays;
}

function RecentCard({ series }: { series: Series }) {
  const { selectSeries, toggleFavorite, isFavorite } = useStore();
  const favorited = isFavorite(series.id);

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
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
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10">
          <span className="px-1.5 py-px rounded-full text-[7px] font-bold text-white bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-sm flex items-center gap-0.5">
            <Sparkles className="h-2 w-2" />
            جديد
          </span>
        </div>

        {/* Favorite */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(series.id); }}
          className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full glass flex items-center justify-center cursor-pointer"
        >
          <Heart className={cn('h-3 w-3 transition-colors', favorited ? 'text-primary fill-primary' : 'text-white/80')} />
        </motion.button>

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Play className="h-3.5 w-3.5 text-white fill-white mr-[-2px]" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <h3 className="text-[9px] font-bold text-white truncate mb-0.5">{series.title}</h3>
          <div className="flex items-center gap-1.5">
            <Star className="h-2 w-2 text-accent fill-accent" />
            <span className="text-[9px] font-bold text-white">{series.rating.average}</span>
            <span className="text-[8px] text-white/50">{series.year}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export function RecentlyAdded() {
  const recent = ALL_SERIES
    .filter((s) => isRecentlyAdded(s))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (recent.length === 0) return null;

  return (
    <section className="py-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-emerald-500" />
        </div>
        <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">أضيف مؤخراً</h2>
        <span className="text-xs text-text-subtle">({recent.length})</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {recent.map((s) => <RecentCard key={s.id} series={s} />)}
      </div>
    </section>
  );
}
