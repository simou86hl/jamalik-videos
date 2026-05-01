'use client';

import { motion } from 'framer-motion';
import {
  Theater, Laugh, Swords, Heart, Globe,
  Music, Palette, BookOpen, Tv,
  ChevronLeft,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { useStore } from '@/store/useStore';
import type { SeriesCategorySlug } from '@/types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Theater, Laugh, Swords, Heart, Globe, Music, Palette, BookOpen,
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  drama: 'from-purple-500 to-rose-500',
  comedy: 'from-amber-400 to-orange-500',
  action: 'from-red-500 to-rose-600',
  romantic: 'from-pink-400 to-fuchsia-500',
  turkish: 'from-teal-400 to-cyan-500',
  indian: 'from-amber-500 to-yellow-500',
  cartoon: 'from-indigo-400 to-violet-500',
  documentary: 'from-emerald-500 to-teal-500',
};

const CATEGORY_BG_SUBTLE: Record<string, string> = {
  drama: 'bg-purple-50 dark:bg-purple-500/8',
  comedy: 'bg-amber-50 dark:bg-amber-500/8',
  action: 'bg-red-50 dark:bg-red-500/8',
  romantic: 'bg-pink-50 dark:bg-pink-500/8',
  turkish: 'bg-teal-50 dark:bg-teal-500/8',
  indian: 'bg-yellow-50 dark:bg-yellow-500/8',
  cartoon: 'bg-indigo-50 dark:bg-indigo-500/8',
  documentary: 'bg-emerald-50 dark:bg-emerald-500/8',
};

const CATEGORY_ICON_BG: Record<string, string> = {
  drama: 'bg-purple-100 dark:bg-purple-500/15',
  comedy: 'bg-amber-100 dark:bg-amber-500/15',
  action: 'bg-red-100 dark:bg-red-500/15',
  romantic: 'bg-pink-100 dark:bg-pink-500/15',
  turkish: 'bg-teal-100 dark:bg-teal-500/15',
  indian: 'bg-yellow-100 dark:bg-yellow-500/15',
  cartoon: 'bg-indigo-100 dark:bg-indigo-500/15',
  documentary: 'bg-emerald-100 dark:bg-emerald-500/15',
};

const CATEGORY_ICON_COLOR: Record<string, string> = {
  drama: 'text-purple-600 dark:text-purple-400',
  comedy: 'text-amber-600 dark:text-amber-400',
  action: 'text-red-600 dark:text-red-400',
  romantic: 'text-pink-600 dark:text-pink-400',
  turkish: 'text-teal-600 dark:text-teal-400',
  indian: 'text-yellow-600 dark:text-yellow-400',
  cartoon: 'text-indigo-600 dark:text-indigo-400',
  documentary: 'text-emerald-600 dark:text-emerald-400',
};

const CATEGORY_LABEL_COLOR: Record<string, string> = {
  drama: 'text-purple-700 dark:text-purple-300',
  comedy: 'text-amber-700 dark:text-amber-300',
  action: 'text-red-700 dark:text-red-300',
  romantic: 'text-pink-700 dark:text-pink-300',
  turkish: 'text-teal-700 dark:text-teal-300',
  indian: 'text-yellow-700 dark:text-yellow-300',
  cartoon: 'text-indigo-700 dark:text-indigo-300',
  documentary: 'text-emerald-700 dark:text-emerald-300',
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function CategoryGrid() {
  const { selectCategory, navigateTo } = useStore();

  const handleCategoryClick = (slug: SeriesCategorySlug) => {
    selectCategory(slug);
    navigateTo('category');
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
            <Tv className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">
            تصفح الأقسام
          </h2>
        </div>
        <span className="text-xs text-text-subtle font-medium">8 أقسام</span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-30px' }}
        className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3"
      >
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.icon] || Tv;
          const gradient = CATEGORY_GRADIENTS[cat.slug] || 'from-primary to-secondary';
          const bgSubtle = CATEGORY_BG_SUBTLE[cat.slug] || 'bg-primary-lighter/30';
          const iconBg = CATEGORY_ICON_BG[cat.slug] || 'bg-primary/10';
          const iconColor = CATEGORY_ICON_COLOR[cat.slug] || 'text-primary';
          const labelColor = CATEGORY_LABEL_COLOR[cat.slug] || 'text-text-main';

          return (
            <motion.button
              key={cat.id}
              variants={itemVariants}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`
                relative overflow-hidden rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2
                cursor-pointer group text-center
                border border-border/50 dark:border-border/30
                transition-all duration-300 ease-out
                hover:scale-[1.04] hover:shadow-lg hover:border-transparent
                hover:shadow-[var(--shadow-md)]
                active:scale-[0.97]
                ${bgSubtle}
              `}
            >
              {/* Gradient accent bar at top */}
              <div className={`
                absolute top-0 left-0 right-0 h-[3px]
                bg-gradient-to-r ${gradient}
                opacity-60 group-hover:opacity-100 transition-opacity duration-300
                rounded-t-2xl
              `} />

              {/* Glow effect on hover */}
              <div className={`
                absolute top-0 left-1/2 -translate-x-1/2 w-20 h-16
                bg-gradient-to-b ${gradient}
                opacity-0 group-hover:opacity-10
                blur-2xl rounded-full
                transition-opacity duration-500
              `} />

              {/* Icon */}
              <div className={`
                relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl
                flex items-center justify-center
                ${iconBg}
                group-hover:scale-110
                transition-all duration-300
              `}>
                <Icon className={`h-5 w-5 sm:h-5.5 sm:w-5.5 ${iconColor} transition-colors duration-300`} />
              </div>

              {/* Label */}
              <span className={`
                text-[11px] sm:text-xs font-bold leading-tight
                ${labelColor}
                group-hover:opacity-80 transition-opacity duration-300
              `}>
                {cat.name}
              </span>

              {/* Arrow indicator on hover */}
              <ChevronLeft className="
                absolute bottom-2 left-2
                h-3 w-3 text-text-subtle/0
                group-hover:text-text-subtle/50
                transition-all duration-300
                -translate-x-1 group-hover:translate-x-0
              " />
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
