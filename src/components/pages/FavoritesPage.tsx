'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';
import { SeriesCard } from '@/components/shared/SeriesCard';

export function FavoritesPage() {
  const { favorites } = useStore();
  const favSeries = ALL_SERIES.filter((s) => favorites.includes(s.id));

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <Heart className="h-5 w-5 text-primary fill-primary" />
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-main">
          مسلسلاتي المفضلة
        </h1>
        <span className="text-sm text-text-subtle">({favSeries.length})</span>
      </motion.div>

      {favSeries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Heart className="h-16 w-16 text-text-subtle/30 mb-4" />
          <p className="text-text-subtle text-sm">لا توجد مسلسلات في المفضلة</p>
          <p className="text-text-subtle/60 text-xs mt-1">أضف مسلسلات لمشاهدتها لاحقاً</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favSeries.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      )}
    </div>
  );
}
