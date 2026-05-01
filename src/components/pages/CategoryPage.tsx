'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';
import { CATEGORIES } from '@/lib/constants';
import { CategoryBar } from '@/components/shared/CategoryBar';
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
    <div>
      {/* Category bar at top */}
      <div className="pt-4 sm:pt-6 mb-5">
        <CategoryBar showAll />
      </div>

      {/* Header with back button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center gap-3 mb-2">
          {/* Back button */}
          <button
            onClick={() => navigateTo('home')}
            className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors duration-200"
            aria-label="الرجوع للرئيسية"
          >
            <ArrowRight className="h-4 w-4 text-text-main" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <Film className="h-5 w-5 text-primary flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-main truncate">
              {title}
            </h1>
          </div>
        </div>
        {desc && (
          <p className="text-sm text-text-subtle mr-11">{desc}</p>
        )}
        <p className="text-xs text-text-subtle mt-0.5 mr-11">{filtered.length} مسلسل</p>
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
                ? 'bg-gradient-primary text-white shadow-sm'
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
