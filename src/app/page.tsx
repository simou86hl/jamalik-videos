'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ContinueWatching } from '@/components/home/ContinueWatching';
import { FeaturedSeries } from '@/components/home/FeaturedSeries';
import { LatestSeries } from '@/components/home/LatestSeries';
import { SearchModal } from '@/components/shared/SearchModal';
import { SeriesDetailPage } from '@/components/pages/SeriesDetailPage';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { FavoritesPage } from '@/components/pages/FavoritesPage';
import { ContinueWatchingPage } from '@/components/pages/ContinueWatchingPage';

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

  return (
    <div className="min-h-screen bg-bg flex flex-col relative">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 pattern-dots opacity-[0.03] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="pt-4 sm:pt-6">
                <HeroSlider />
              </div>
              <ContinueWatching />
              <CategoryGrid />
              <FeaturedSeries />
              <LatestSeries />
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
      <Footer />
    </div>
  );
}
