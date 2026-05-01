'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { SeriesCard } from '@/components/shared/SeriesCard';
import type { SeriesCategorySlug, SitePage } from '@/types';

interface CategorySectionProps {
  title: string;
  category: SeriesCategorySlug;
  icon: React.ReactNode;
}

export function CategorySection({ title, category, icon }: CategorySectionProps) {
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
          <span className="text-xs text-text-subtle">({series.length})</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
    </section>
  );
}
