'use client';

import { motion } from 'framer-motion';
import { Flame, ChevronLeft, Star, Play, Heart } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { Series } from '@/types';

function PopularCard({ series }: { series: Series }) {
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

        {/* Views Badge */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <span className="px-1.5 py-px rounded-full text-[7px] font-bold text-white bg-orange-500/90 flex items-center gap-0.5">
            <Flame className="h-2 w-2" />
            {(series.views / 1000).toFixed(0)}K
          </span>
        </div>

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
          className="absolute bottom-12 left-1.5 z-10 w-6 h-6 rounded-full glass flex items-center justify-center cursor-pointer"
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

export function MostWatched() {
  const popular = [...ALL_SERIES]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  if (popular.length === 0) return null;

  return (
    <section className="py-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
        <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">الأعلى مشاهدة</h2>
      </div>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {popular.map((s) => <PopularCard key={s.id} series={s} />)}
      </div>
    </section>
  );
}
