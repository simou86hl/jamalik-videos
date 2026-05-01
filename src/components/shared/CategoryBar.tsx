'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Theater, Laugh, Swords, Heart, Globe,
  Music, Palette, BookOpen, Tv, Star, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, getSmartCategories } from '@/lib/utils';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={scrollContainerRef}
      className={cn(
        'relative group/bar w-full overflow-hidden',
        sticky && 'sticky top-16 z-40 bg-bg/90 backdrop-blur-lg border-b border-border/30'
      )}
    >
      <div className={cn(
        'relative',
        sticky ? 'py-2' : ''
      )}>
        {/* Scroll fade indicators - desktop only */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg/80 to-transparent z-[5] pointer-events-none opacity-0 group-hover/bar:opacity-100 transition-opacity" />
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg/80 to-transparent z-[5] pointer-events-none opacity-0 group-hover/bar:opacity-100 transition-opacity" />

        {/* Scroll buttons - desktop only */}
        <button
          onClick={() => scroll('left')}
          className="hidden lg:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-bg border border-border/50 items-center justify-center cursor-pointer opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 hover:shadow-md"
          aria-label="تمرير لليمين"
        >
          <ChevronRight className="h-3.5 w-3.5 text-text-main" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden lg:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-bg border border-border/50 items-center justify-center cursor-pointer opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 hover:shadow-md"
          aria-label="تمرير لليسار"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-text-main" />
        </button>

        {/* Chips row - contained with padding */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto no-scrollbar py-1 overscroll-x-contain px-4 sm:px-6 lg:px-8 scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* "الكل" chip */}
          {showAll && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAllClick}
              data-active={isAllActive}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap
                ${isAllActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-bg-secondary text-text-subtle hover:text-text-main border border-border/50'
                }`}
            >
              <Tv className="h-3 w-3" />
              الكل
            </motion.button>
          )}

          {getSmartCategories().map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon] || Tv;
            const isActive = selectedCategory === cat.slug;

            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(cat.slug)}
                data-active={isActive}
                className={`
                  flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                  text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap
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

          {/* Right spacer so last chip can be scrolled to center */}
          <div className="flex-shrink-0 w-4 lg:w-10" />
        </div>
      </div>
    </div>
  );
}
