'use client';

import { useState, useEffect } from 'react';
import {
  Search, Menu, X, Heart, Home, Tv,
  Theater, Laugh, Swords, Globe, Music,
  Palette, BookOpen, ChevronLeft, Clock,
  MonitorPlay,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { NAV_LINKS, SITE_NAME, CATEGORIES } from '@/lib/constants';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import type { SitePage, SeriesCategorySlug } from '@/types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  drama: Theater,
  comedy: Laugh,
  action: Swords,
  romantic: Heart,
  turkish: Globe,
  indian: Music,
  cartoon: Palette,
  documentary: BookOpen,
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const {
    currentPage,
    navigateTo,
    isMobileMenuOpen,
    toggleMobileMenu,
    toggleSearch,
    favorites,
  } = useStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (slug: string) =>
    currentPage === slug ||
    (slug !== 'home' && slug !== 'search' && slug !== 'favorites' && slug !== 'continue-watching' &&
      currentPage === 'category' && useStore.getState().selectedCategory === slug);

  const handleMobileNav = (page: SitePage) => {
    navigateTo(page);
    toggleMobileMenu();
  };

  const handleCategoryTap = (slug: SeriesCategorySlug) => {
    useStore.getState().selectCategory(slug);
    navigateTo('category');
    toggleMobileMenu();
  };

  return (
    <>
      {/* ═══ Desktop & Tablet Navbar ═══ */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-500 ease-out',
          scrolled
            ? 'glass-strong border-b border-border/50 shadow-[var(--shadow-md)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center transition-all duration-500 group-hover:shadow-[var(--shadow-glow)] group-hover:scale-105">
                <Tv className="h-5 w-5 text-white relative z-10" />
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-60 blur-lg transition-opacity duration-500" />
              </div>
              <span className="text-xl font-heading font-bold text-gradient">
                {SITE_NAME}
              </span>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.slug}
                  onClick={() =>
                    link.slug === 'home'
                      ? navigateTo('home')
                      : link.slug === 'search'
                        ? toggleSearch()
                        : link.slug === 'favorites'
                          ? navigateTo('favorites')
                          : handleCategoryTap(link.slug as SeriesCategorySlug)
                  }
                  className={cn(
                    'relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer group',
                    isActive(link.slug)
                      ? 'text-primary font-bold'
                      : 'text-text-subtle hover:text-primary'
                  )}
                >
                  {link.label}
                  {isActive(link.slug) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-full bg-gradient-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isActive(link.slug) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-primary rounded-full transition-all duration-300 group-hover:w-5" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSearch}
                className="w-9 h-9 rounded-full flex items-center justify-center glass-subtle transition-all duration-300 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:scale-105 group"
                aria-label="بحث"
              >
                <Search className="h-[18px] w-[18px] text-text-subtle transition-colors duration-300 group-hover:text-primary" />
              </button>

              <button
                onClick={() => navigateTo('favorites')}
                className="w-9 h-9 rounded-full flex items-center justify-center glass-subtle transition-all duration-300 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:scale-105 relative group"
                aria-label="المفضلة"
              >
                <Heart className="h-[18px] w-[18px] text-text-subtle transition-colors duration-300 group-hover:text-primary" />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-gradient-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigateTo('continue-watching')}
                className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center glass-subtle transition-all duration-300 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:scale-105 group"
                aria-label="تابع المشاهدة"
              >
                <Clock className="h-[18px] w-[18px] text-text-subtle transition-colors duration-300 group-hover:text-primary" />
              </button>

              <ThemeToggle />

              <button
                onClick={toggleMobileMenu}
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center glass-subtle transition-all duration-300 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:scale-105"
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-text-main" />
                ) : (
                  <Menu className="h-5 w-5 text-text-main" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ Mobile Menu Overlay ═══ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] glass-strong z-50 lg:hidden shadow-[var(--shadow-xl)]"
            >
              <div className="flex flex-col h-full">
                {/* ─── Header ─── */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Tv className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-heading font-bold text-gradient">
                      {SITE_NAME}
                    </span>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="w-8 h-8 rounded-full flex items-center justify-center glass-subtle cursor-pointer transition-all duration-300"
                  >
                    <X className="h-4 w-4 text-text-main" />
                  </button>
                </div>

                {/* ─── Scrollable Content ─── */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-4">
                  {/* ── الأقسام ── */}
                  <div>
                    <h4 className="text-[11px] font-bold text-text-main uppercase tracking-wider mb-2 px-1">
                      الأقسام
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {CATEGORIES.map((cat) => {
                        const Icon = CATEGORY_ICONS[cat.slug] || Tv;
                        return (
                          <motion.button
                            key={cat.slug}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.02 * CATEGORIES.indexOf(cat) }}
                            onClick={() => handleCategoryTap(cat.slug)}
                            className={cn(
                              'flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer',
                              isActive(cat.slug)
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'glass-subtle text-text-main hover:text-primary hover:bg-primary/5'
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{cat.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── صفحات ── */}
                  <div>
                    <h4 className="text-[11px] font-bold text-text-main uppercase tracking-wider mb-2 px-1">
                      المزيد
                    </h4>
                    <div className="space-y-0.5">
                      {[
                        { label: 'المفضلة', page: 'favorites' as SitePage, icon: Heart },
                        { label: 'تابع المشاهدة', page: 'continue-watching' as SitePage, icon: Clock },
                      ].map((link, i) => {
                        const Icon = link.icon;
                        return (
                          <motion.button
                            key={link.page}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + i * 0.03 }}
                            onClick={() => handleMobileNav(link.page)}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-text-main hover:text-primary hover:bg-primary/5 transition-all duration-200 w-full cursor-pointer group font-medium"
                          >
                            <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <Icon className="h-3 w-3" />
                            </div>
                            {link.label}
                            <ChevronLeft className="h-3 w-3 mr-auto opacity-30" />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ─── Bottom: Theme ─── */}
                <div className="border-t border-border/30 px-4 py-3 flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ Mobile Bottom Nav ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-bottom border-t border-border/30 bg-bg/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-[64px] px-2">
          {[
            { page: 'home' as SitePage, Icon: Home, label: 'الرئيسية' },
            { page: 'search' as SitePage, Icon: Search, label: 'بحث', action: toggleSearch },
            { page: 'category' as SitePage, Icon: MonitorPlay, label: 'مسلسلات' },
            { page: 'favorites' as SitePage, Icon: Heart, label: 'المفضلة' },
          ].map((tab) => {
            const isActiveTab = tab.page === 'search'
              ? false
              : currentPage === tab.page;

            return (
              <button
                key={tab.page}
                onClick={() => {
                  if (tab.action) {
                    tab.action();
                  } else if (tab.page === 'category') {
                    navigateTo('category');
                  } else {
                    navigateTo(tab.page);
                  }
                }}
                className="relative flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                {isActiveTab && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-2xl bg-gradient-primary/10 border border-primary/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <tab.Icon
                  className={cn(
                    'h-[20px] w-[20px] relative z-10 transition-all duration-300',
                    isActiveTab
                      ? 'text-primary drop-shadow-[0_0_6px_rgba(194,24,91,0.5)]'
                      : 'text-text-main'
                  )}
                />
                <span className={cn(
                  'text-[10px] relative z-10 transition-colors',
                  isActiveTab ? 'font-bold text-primary' : 'font-semibold text-text-main'
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
