'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, SlidersHorizontal } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';
import { CATEGORIES } from '@/lib/constants';
import { SeriesCard } from '@/components/shared/SeriesCard';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function CategoryPage() {
  const { selectedCategory, searchQuery } = useStore();
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
    <div className="py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Film className="h-5 w-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-main">
            {title}
          </h1>
        </div>
        {desc && (
          <p className="text-sm text-text-subtle">{desc}</p>
        )}
        <p className="text-xs text-text-subtle mt-1">{filtered.length} مسلسل</p>
      </motion.div>

      {/* Sort Bar */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar">
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
                ? 'bg-gradient-primary text-white'
                : 'glass-subtle text-text-subtle hover:text-primary'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Film className="h-16 w-16 text-text-subtle/30 mb-4" />
          <p className="text-text-subtle">لا توجد مسلسلات</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {filtered.map((series) => (
            <motion.div key={series.id} variants={itemVariants}>
              <SeriesCard series={series} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
