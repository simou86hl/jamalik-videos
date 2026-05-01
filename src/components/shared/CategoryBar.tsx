'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Theater, Laugh, Swords, Heart, Globe,
  Music, Palette, BookOpen, Tv, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { useStore } from '@/store/useStore';
import type { SeriesCategorySlug } from '@/types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Theater, Laugh, Swords, Heart, Globe, Music, Palette, BookOpen,
};

interface CategoryBarProps {
  /** Show "الكل" chip to go back to home */
  showAll?: boolean;
}

export function CategoryBar({ showAll = false }: CategoryBarProps) {
  const { selectedCategory, selectCategory, navigateTo, currentPage } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (slug: SeriesCategorySlug) => {
    selectCategory(slug);
    navigateTo('category');
  };

  const handleAllClick = () => {
    navigateTo('home');
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative group/bar">
      {/* Scroll buttons - desktop only */}
      <button
        onClick={() => scroll('left')}
        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full glass items-center justify-center cursor-pointer opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 hover:shadow-md"
        aria-label="تمرير لليمين"
      >
        <ChevronRight className="h-4 w-4 text-text-main" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full glass items-center justify-center cursor-pointer opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 hover:shadow-md"
        aria-label="تمرير لليسار"
      >
        <ChevronLeft className="h-4 w-4 text-text-main" />
      </button>

      {/* Chips row */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-0.5"
      >
        {/* "الكل" chip */}
        {showAll && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAllClick}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer
              ${!selectedCategory || currentPage === 'home'
                ? 'bg-gradient-primary text-white shadow-sm'
                : 'glass-subtle text-text-subtle hover:text-text-main'
              }`}
          >
            <Tv className="h-3.5 w-3.5" />
            الكل
          </motion.button>
        )}

        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.icon] || Tv;
          const isActive = selectedCategory === cat.slug;

          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
                text-xs font-bold transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'glass-subtle text-text-subtle hover:text-text-main hover:bg-bg-secondary'
                }
              `}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
