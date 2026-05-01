'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, SlidersHorizontal } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';
import { CATEGORIES } from '@/lib/constants';
import { SeriesCard } from '@/components/shared/SeriesCard';
import { cn } from '@/lib/utils';

export function CategoryPage() {
  const { selectedCategory, searchQuery, navigateTo } = useStore();
  const [sortBy, setSortBy] = useState<'rating' | 'views' | 'year' | 'name'>('rating');

  // Determine series to show
  let filtered = searchQuery
    ? ALL_SERIES.filter((s) => {
        const q = searchQuery.toLowerCase();
        const fields = [s.title, s.description, ...s.cast, ...s.tags].join(' ').toLowerCase();
        return fields.includes(q);
      })
    : selectedCategory
      ? ALL_SERIES.filter((s) => s.category === selectedCategory)
      : ALL_SERIES;

  // Sort
  switch (sortBy) {
    case 'rating':
      filtered = [...filtered].sort((a, b) => b.rating.average - a.rating.average);
      break;
    case 'views':
      filtered = [...filtered].sort((a, b) => b.views - a.views);
      break;
    case 'year':
      filtered = [...filtered].sort((a, b) => parseInt(b.year) - parseInt(a.year));
      break;
    case 'name':
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'ar'));
      break;
  }

  const category = selectedCategory ? CATEGORIES.find((c) => c.slug === selectedCategory) : null;
  const title = searchQuery ? `نتائج البحث: "${searchQuery}"` : category?.name || 'جميع المسلسلات';
  const desc = searchQuery ? `تم العثور على ${filtered.length} مسلسل` : category?.description || '';

  return (
    <div className="pt-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <Film className="h-5 w-5 text-primary flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-main truncate">
            {title}
          </h1>
        </div>
        {desc && (
          <p className="text-sm text-text-subtle mr-7">{desc}</p>
        )}
        <p className="text-xs text-text-subtle mt-0.5 mr-7">{filtered.length} مسلسل</p>
      </motion.div>

      {/* Sort Bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
        <SlidersHorizontal className="h-4 w-4 text-text-subtle flex-shrink-0" />
        {[
          { key: 'rating' as const, label: 'الأعلى تقييماً' },
          { key: 'views' as const, label: 'الأكثر مشاهدة' },
          { key: 'year' as const, label: 'الأحدث' },
          { key: 'name' as const, label: 'الاسم' },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setSortBy(option.key)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer',
              sortBy === option.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-bg-secondary text-text-subtle hover:text-primary border border-border/50'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Grid - smaller cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Film className="h-16 w-16 text-text-subtle/30 mb-4" />
          <p className="text-text-subtle">لا توجد مسلسلات</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {filtered.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      )}
    </div>
  );
}
