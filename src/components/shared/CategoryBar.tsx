'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Theater, Laugh, Swords, Heart, Globe,
  Music, Palette, BookOpen, Tv, Star, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { SeriesCategorySlug } from '@/types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Theater, Laugh, Swords, Heart, Globe, Music, Palette, BookOpen, Star,
};

interface CategoryBarProps {
  /** Show "الكل" chip to go back to home */
  showAll?: boolean;
  /** Sticky mode - sticks to top below navbar */
  sticky?: boolean;
}

export function CategoryBar({ showAll = false, sticky = false }: CategoryBarProps) {
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

  // Auto-scroll to active category
  useEffect(() => {
    if (selectedCategory && scrollRef.current) {
      const activeBtn = scrollRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCategory]);

  const isAllActive = !selectedCategory || currentPage === 'home';

  return (
    <div className={cn(
      'relative group/bar',
      sticky && 'sticky top-16 z-40 bg-bg/90 backdrop-blur-lg border-b border-border/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2'
    )}>
      {/* Scroll buttons - desktop only */}
      <button
        onClick={() => scroll('left')}
        className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-bg/80 border border-border/50 flex items-center justify-center cursor-pointer opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 hover:shadow-md"
        aria-label="تمرير لليمين"
      >
        <ChevronRight className="h-3 w-3 text-text-main" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="hidden lg:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-bg/80 border border-border/50 flex items-center justify-center cursor-pointer opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 hover:shadow-md"
        aria-label="تمرير لليسار"
      >
        <ChevronLeft className="h-3 w-3 text-text-main" />
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
            data-active={isAllActive}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer
              ${isAllActive
                ? 'bg-primary text-white shadow-sm'
                : 'bg-bg-secondary text-text-subtle hover:text-text-main border border-border/50'
              }`}
          >
            <Tv className="h-3 w-3" />
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
              data-active={isActive}
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full
                text-xs font-bold transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-bg-secondary text-text-subtle hover:text-text-main border border-border/50 hover:border-primary/30'
                }
              `}
            >
              <Icon className="h-3 w-3" />
              {cat.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
