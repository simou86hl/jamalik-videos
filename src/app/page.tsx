'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { DailyTip } from '@/components/home/DailyTip';
import { LatestArticles } from '@/components/home/LatestArticles';
import { LatestRecipes } from '@/components/home/LatestRecipes';
import { SearchModal } from '@/components/shared/SearchModal';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { ArticlePage } from '@/components/pages/ArticlePage';
import { RecipePage } from '@/components/pages/RecipePage';
import { FavoritesPage } from '@/components/pages/FavoritesPage';
import { LoginPage } from '@/components/pages/LoginPage';
import { ProfilePage } from '@/components/pages/ProfilePage';
import { AboutPage } from '@/components/pages/AboutPage';
import { ContactPage } from '@/components/pages/ContactPage';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { QuizPage } from '@/components/pages/QuizPage';
import { ComparePage } from '@/components/pages/ComparePage';
import { ReferralPage } from '@/components/pages/ReferralPage';
import { NotificationPage } from '@/components/pages/NotificationPage';
import { DailyCalendarPage } from '@/components/pages/DailyCalendarPage';
import { AdminPage } from '@/components/pages/AdminPage';
import { VideoPage } from '@/components/pages/VideoPage';
import { ScrollToTopButton } from '@/components/shared/ScrollToTopButton';

const pageVariants = {
  initial: { opacity: 0, y: 16, scale: 0.995 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.998,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] as [number, number, number, number] },
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
              <CategoryGrid />
              <DailyTip />
              <LatestArticles />
              <LatestRecipes />
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

          {currentPage === 'article' && (
            <motion.div
              key="article"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ArticlePage />
            </motion.div>
          )}

          {currentPage === 'recipe' && (
            <motion.div
              key="recipe"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RecipePage />
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

          {(currentPage === 'login' || currentPage === 'register') && (
            <motion.div
              key={`login-${currentPage}`}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LoginPage />
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

          {currentPage === 'about' && (
            <motion.div
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AboutPage />
            </motion.div>
          )}

          {currentPage === 'contact' && (
            <motion.div
              key="contact"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ContactPage />
            </motion.div>
          )}

          {currentPage === 'privacy' && (
            <motion.div
              key="privacy"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <PrivacyPage />
            </motion.div>
          )}

          {currentPage === 'quiz' && (
            <motion.div
              key="quiz"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <QuizPage />
            </motion.div>
          )}

          {currentPage === 'compare' && (
            <motion.div
              key="compare"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ComparePage />
            </motion.div>
          )}

          {currentPage === 'referral' && (
            <motion.div
              key="referral"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ReferralPage />
            </motion.div>
          )}

          {currentPage === 'notifications' && (
            <motion.div
              key="notifications"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <NotificationPage />
            </motion.div>
          )}

          {currentPage === 'daily-calendar' && (
            <motion.div
              key="daily-calendar"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <DailyCalendarPage />
            </motion.div>
          )}

          {currentPage === 'admin' && (
            <motion.div
              key="admin"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AdminPage />
            </motion.div>
          )}

          {currentPage === 'videos' && (
            <motion.div
              key="videos"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <VideoPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SearchModal />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
