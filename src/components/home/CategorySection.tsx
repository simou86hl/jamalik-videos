'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Star, Play, Heart } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { Series, SeriesCategorySlug } from '@/types';

interface CategorySectionProps {
  title: string;
  category: SeriesCategorySlug;
  icon: React.ReactNode;
}

/* ─── Poster Card (same style as FeaturedSeries) ─── */
function PosterCard({ series }: { series: Series }) {
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
          <Heart
            className={cn('h-3 w-3 transition-colors', favorited ? 'text-primary fill-primary' : 'text-white/80')}
          />
        </motion.button>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Play className="h-3.5 w-3.5 text-white fill-white mr-[-2px]" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
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

/* ─── Category Section ─── */
export function CategorySection({ title, category, icon }: CategorySectionProps) {
  const { navigateTo, selectCategory } = useStore();
  const series = ALL_SERIES.filter((s) => s.category === category);

  if (series.length === 0) return null;

  return (
    <section className="py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">
            {title}
          </h2>
        </div>
        <button
          onClick={() => { selectCategory(category); navigateTo('category'); }}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          عرض الكل
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {series.map((s) => (
          <PosterCard key={s.id} series={s} />
        ))}
      </div>
    </section>
  );
}
