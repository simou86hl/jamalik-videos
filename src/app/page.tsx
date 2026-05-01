'use client';

import { useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Theater, Laugh, Swords, Heart, Globe,
  Music, Palette, BookOpen, Star,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CategoryBar } from '@/components/shared/CategoryBar';
import { SearchBar } from '@/components/shared/SearchBar';
import { BackToTop } from '@/components/shared/BackToTop';
import { PullToRefresh } from '@/components/shared/PullToRefresh';
import { HeroSlider } from '@/components/home/HeroSlider';
import { ContinueWatching } from '@/components/home/ContinueWatching';
import { FeaturedSeries } from '@/components/home/FeaturedSeries';
import { RecentlyAdded } from '@/components/home/RecentlyAdded';
import { MostWatched } from '@/components/home/MostWatched';
import { BroadcastSchedule } from '@/components/home/BroadcastSchedule';
import { CategorySection } from '@/components/home/CategorySection';
import { SearchModal } from '@/components/shared/SearchModal';
import { SeriesDetailPage } from '@/components/pages/SeriesDetailPage';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { FavoritesPage } from '@/components/pages/FavoritesPage';
import { ContinueWatchingPage } from '@/components/pages/ContinueWatchingPage';
import { CATEGORY_COLORS } from '@/lib/constants';

const pageVariants = {
  initial: { opacity: 0, y: 16, scale: 0.995 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.998,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function Home() {
  const { currentPage } = useStore();
  const touchStartX = useRef<number | null>(null);

  // Swipe navigation handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    // Find the closest overflow-x-auto container from the touch point
    const touchY = e.changedTouches[0].clientY;
    const elementAtPoint = document.elementFromPoint(endX, touchY);

    if (!elementAtPoint) {
      touchStartX.current = null;
      return;
    }

    // Walk up to find the nearest scrollable horizontal container
    const scrollContainer = elementAtPoint.closest('.overflow-x-auto') as HTMLElement | null;

    if (scrollContainer) {
      const scrollAmount = Math.abs(diff) * 1.5;
      if (diff > 80) {
        // Swipe left (RTL: scroll right visually, but in RTL the container scrolls from right)
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else if (diff < -80) {
        // Swipe right
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }

    touchStartX.current = null;
  }, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col relative overflow-x-hidden">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 pattern-dots opacity-[0.03] pointer-events-none z-0" />

      <Navbar />

      {/* Category Bar - Sticky below navbar, full width */}
      <CategoryBar showAll sticky />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <PullToRefresh>
                <div className="pt-2 sm:pt-4">
                  <HeroSlider />
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <SearchBar />
                </div>

                <ContinueWatching />
                <FeaturedSeries />
                <RecentlyAdded />
                <MostWatched />
                <BroadcastSchedule />

                {/* Category sections with accent colors */}
                <CategorySection
                  title="مسلسلات تركية"
                  category="turkish"
                  icon={<Globe className="h-4 w-4" />}
                />
                <CategorySection
                  title="دراما كورية"
                  category="korean"
                  icon={<Star className="h-4 w-4" />}
                />
                <CategorySection
                  title="دراما عربية"
                  category="drama"
                  icon={<Theater className="h-4 w-4" />}
                />
                <CategorySection
                  title="مسلسلات هندية"
                  category="indian"
                  icon={<Music className="h-4 w-4" />}
                />
                <CategorySection
                  title="كوميدي"
                  category="comedy"
                  icon={<Laugh className="h-4 w-4" />}
                />
                <CategorySection
                  title="أكشن وإثارة"
                  category="action"
                  icon={<Swords className="h-4 w-4" />}
                />
                <CategorySection
                  title="رومانسي"
                  category="romantic"
                  icon={<Heart className="h-4 w-4" />}
                />
                <CategorySection
                  title="رسوم متحركة"
                  category="cartoon"
                  icon={<Palette className="h-4 w-4" />}
                />
                <CategorySection
                  title="وثائقيات"
                  category="documentary"
                  icon={<BookOpen className="h-4 w-4" />}
                />
              </PullToRefresh>
            </motion.div>
          )}

          {currentPage === 'series-detail' && (
            <motion.div
              key={`series-detail-${useStore.getState().selectedSeries?.id || ''}`}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SeriesDetailPage />
            </motion.div>
          )}

          {(currentPage === 'category' || currentPage === 'search') && (
            <motion.div
              key={`category-${currentPage}`}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CategoryPage />
            </motion.div>
          )}

          {currentPage === 'favorites' && (
            <motion.div
              key="favorites"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FavoritesPage />
            </motion.div>
          )}

          {currentPage === 'continue-watching' && (
            <motion.div
              key="continue-watching"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ContinueWatchingPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SearchModal />
      <BackToTop />
      <Footer />
    </div>
  );
}
