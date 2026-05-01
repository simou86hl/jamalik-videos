'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Theater, Laugh, Swords, Heart, Globe,
  Music, Palette, BookOpen, Star, TrendingUp, Clock,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CategoryBar } from '@/components/shared/CategoryBar';
import { HeroSlider } from '@/components/home/HeroSlider';
import { ContinueWatching } from '@/components/home/ContinueWatching';
import { FeaturedSeries } from '@/components/home/FeaturedSeries';
import { CategorySection } from '@/components/home/CategorySection';
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
            >
              <div className="pt-2 sm:pt-4">
                <HeroSlider />
              </div>
              <ContinueWatching />
              <FeaturedSeries />

              {/* Category sections - all horizontal scroll matching FeaturedSeries style */}
              <CategorySection
                title="مسلسلات تركية"
                category="turkish"
                icon={<Globe className="h-5 w-5 text-primary" />}
              />
              <CategorySection
                title="دراما كورية"
                category="korean"
                icon={<Star className="h-5 w-5 text-primary" />}
              />
              <CategorySection
                title="دراما عربية"
                category="drama"
                icon={<Theater className="h-5 w-5 text-primary" />}
              />
              <CategorySection
                title="مسلسلات هندية"
                category="indian"
                icon={<Music className="h-5 w-5 text-primary" />}
              />
              <CategorySection
                title="كوميدي"
                category="comedy"
                icon={<Laugh className="h-5 w-5 text-primary" />}
              />
              <CategorySection
                title="أكشن وإثارة"
                category="action"
                icon={<Swords className="h-5 w-5 text-primary" />}
              />
              <CategorySection
                title="رومانسي"
                category="romantic"
                icon={<Heart className="h-5 w-5 text-primary" />}
              />
              <CategorySection
                title="رسوم متحركة"
                category="cartoon"
                icon={<Palette className="h-5 w-5 text-primary" />}
              />
              <CategorySection
                title="وثائقيات"
                category="documentary"
                icon={<BookOpen className="h-5 w-5 text-primary" />}
              />
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
