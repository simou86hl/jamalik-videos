'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { SeriesCard } from '@/components/shared/SeriesCard';
import { useStore } from '@/store/useStore';
import type { SeriesCategorySlug } from '@/types';

interface CategorySectionProps {
  title: string;
  category: SeriesCategorySlug;
  icon: React.ReactNode;
  /** Layout variant - 'scroll' for horizontal row, 'grid' for 2-row grid */
  variant?: 'scroll' | 'grid';
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function CategorySection({ title, category, icon, variant = 'scroll' }: CategorySectionProps) {
  const { navigateTo, selectCategory } = useStore();
  const series = ALL_SERIES.filter((s) => s.category === category);

  if (series.length === 0) return null;

  const handleSeeAll = () => {
    selectCategory(category);
    navigateTo('category');
  };

  if (variant === 'grid') {
    const displaySeries = series.slice(0, 6);

    return (
      <section className="py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">
              {title}
            </h2>
            <span className="text-xs text-text-subtle">({series.length})</span>
          </div>
          {series.length > 6 && (
            <button
              onClick={handleSeeAll}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              عرض الكل
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3"
        >
          {displaySeries.map((s) => (
            <motion.div key={s.id} variants={gridItemVariants}>
              <SeriesCard series={s} size="xs" />
            </motion.div>
          ))}
        </motion.div>
      </section>
    );
  }

  // Default: horizontal scroll variant
  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">
            {title}
          </h2>
          <span className="text-xs text-text-subtle">({series.length})</span>
        </div>
        <button
          onClick={handleSeeAll}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          عرض الكل
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} size="sm" />
        ))}
      </div>
    </section>
  );
}
