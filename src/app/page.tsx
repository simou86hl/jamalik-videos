'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Theater, Laugh, Swords, Heart, Globe,
  Music, Palette, BookOpen, Star, Baby,
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
import { WatchlistPage } from '@/components/pages/WatchlistPage';
import { ProfilePage } from '@/components/pages/ProfilePage';
import { AchievementsPage } from '@/components/pages/AchievementsPage';
import { WeeklyReportPage } from '@/components/pages/WeeklyReportPage';
import { WatchPartyPage } from '@/components/pages/WatchPartyPage';
import { RequestSeriesModal } from '@/components/shared/RequestSeriesModal';
import { useSmartPrefetch } from '@/hooks/useSmartPrefetch';
import { CATEGORY_COLORS } from '@/lib/constants';
import { SparkleEffect } from '@/components/shared/SparkleEffect';
import type { SitePage } from '@/types';

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
  const { currentPage, toggleMobileMenu, isKidsMode, toggleKidsMode } = useStore();
  const touchStartX = useRef<number | null>(null);
  const isEdgeSwipe = useRef(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  // Handle request page as modal
  useEffect(() => {
    if (currentPage === 'request') {
      setIsRequestOpen(true);
    }
  }, [currentPage]);

  // Smart Prefetching
  useSmartPrefetch();

  // Swipe navigation handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;

    // Check if this is an edge swipe (right edge for RTL)
    const touchX = e.touches[0].clientX;
    const distFromRight = window.innerWidth - touchX;
    if (distFromRight < 25) {
      isEdgeSwipe.current = true;
    } else {
      isEdgeSwipe.current = false;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    // Edge swipe: open mobile menu
    if (isEdgeSwipe.current && diff > 60) {
      toggleMobileMenu();
      touchStartX.current = null;
      isEdgeSwipe.current = false;
      return;
    }

    isEdgeSwipe.current = false;

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
  }, [toggleMobileMenu]);

  return (
    <div
      className="min-h-screen bg-bg flex flex-col relative overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
            >
              <PullToRefresh>
                {/* Kids Mode Banner */}
                {isKidsMode && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center gap-3"
                  >
                    <Baby className="h-6 w-6 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold">وضع الأطفال مفعّل</p>
                      <p className="text-[10px] opacity-80">محتوى مناسب للأطفال فقط</p>
                    </div>
                    <button
                      onClick={toggleKidsMode}
                      className="mr-auto text-[10px] underline opacity-80 hover:opacity-100 cursor-pointer flex-shrink-0"
                    >
                      إيقاف
                    </button>
                  </motion.div>
                )}

                {!isKidsMode && (
                  <>
                    <div className="pt-2 sm:pt-4 relative">
                      <HeroSlider />
                      <SparkleEffect count={12} />
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
                  </>
                )}

                {/* Always show cartoon section (and only this in kids mode) */}
                <CategorySection
                  title="رسوم متحركة"
                  category="cartoon"
                  icon={<Palette className="h-4 w-4" />}
                />

                {!isKidsMode && (
                  <CategorySection
                    title="وثائقيات"
                    category="documentary"
                    icon={<BookOpen className="h-4 w-4" />}
                  />
                )}
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

          {currentPage === 'watchlist' && (
            <motion.div
              key="watchlist"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WatchlistPage />
            </motion.div>
          )}

          {currentPage === 'profile' && (
            <motion.div
              key="profile"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ProfilePage />
            </motion.div>
          )}

          {currentPage === 'achievements' && (
            <motion.div
              key="achievements"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AchievementsPage />
            </motion.div>
          )}

          {currentPage === 'report' && (
            <motion.div
              key="report"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WeeklyReportPage />
            </motion.div>
          )}

          {currentPage === 'watchparty' && (
            <motion.div
              key="watchparty"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WatchPartyPage />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Request Series Modal - rendered outside main to avoid z-index stacking issues */}
      <RequestSeriesModal
        isOpen={isRequestOpen}
        onClose={() => {
          setIsRequestOpen(false);
          useStore.getState().goBack();
        }}
      />

      <SearchModal />
      <BackToTop />
      <Footer />
    </div>
  );
}
