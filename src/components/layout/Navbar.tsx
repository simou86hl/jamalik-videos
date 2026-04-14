'use client';

import { useState, useEffect } from 'react';
import { Search, Menu, X, Heart, User, Home, Sparkles, Bell, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { VoiceSearch } from '@/components/shared/VoiceSearch';
import { CartDrawer } from '@/components/shared/CartDrawer';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const {
    currentPage,
    navigateTo,
    isMobileMenuOpen,
    toggleMobileMenu,
    toggleSearch,
    notifications,
  } = useStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (slug: string) =>
    currentPage === slug ||
    (slug !== 'home' && slug !== 'search' && slug !== 'favorites' && currentPage === 'category' && useStore.getState().selectedCategory === slug);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Desktop & Tablet Navbar */}
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
            {/* Logo with glow hover */}
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center transition-all duration-500 group-hover:shadow-[var(--shadow-glow)] group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-white relative z-10" />
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-60 blur-lg transition-opacity duration-500" />
              </div>
              <span className="text-xl font-heading font-bold text-gradient">
                {SITE_NAME}
              </span>
            </button>

            {/* Desktop Nav Links with gradient underline indicator */}
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
                          : navigateTo('category')
                  }
                  className={cn(
                    'relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer group',
                    isActive(link.slug)
                      ? 'text-primary font-bold'
                      : 'text-text-subtle hover:text-primary'
                  )}
                >
                  {link.label}
                  {/* Gradient underline indicator for active link */}
                  {isActive(link.slug) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-full bg-gradient-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {/* Hover underline for inactive links */}
                  {!isActive(link.slug) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-primary rounded-full transition-all duration-300 group-hover:w-5" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Actions with hover glow */}
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
              </button>

              {/* Bell - Notifications */}
              <button
                onClick={() => navigateTo('notifications')}
                className="w-9 h-9 rounded-full flex items-center justify-center glass-subtle transition-all duration-300 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:scale-105 relative group"
                aria-label="الإشعارات"
              >
                <Bell className="h-[18px] w-[18px] text-text-subtle transition-colors duration-300 group-hover:text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-gradient-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag - Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center glass-subtle transition-all duration-300 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:scale-105 relative group"
                aria-label="سلة التسوق"
              >
                <ShoppingBag className="h-[18px] w-[18px] text-text-subtle transition-colors duration-300 group-hover:text-primary" />
              </button>

              {/* Language Switcher (desktop only) */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              <button
                onClick={() => navigateTo('login')}
                className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center glass-subtle transition-all duration-300 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:scale-105 group"
                aria-label="حسابي"
              >
                <User className="h-[18px] w-[18px] text-text-subtle transition-colors duration-300 group-hover:text-primary" />
              </button>

              <ThemeToggle />

              {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
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
              className="fixed top-0 right-0 bottom-0 w-[300px] glass-strong z-50 lg:hidden shadow-[var(--shadow-xl)] gradient-border"
            >
              <div className="flex flex-col h-full p-6">
                {/* Logo */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-heading font-bold text-gradient">
                      {SITE_NAME}
                    </span>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="w-9 h-9 rounded-full flex items-center justify-center glass-subtle cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
                  >
                    <X className="h-5 w-5 text-text-main" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1.5 flex-1">
                  {NAV_LINKS.map((link, index) => (
                    <motion.button
                      key={link.slug}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 200,
                        delay: index * 0.04,
                      }}
                      onClick={() => {
                        if (link.slug === 'home') navigateTo('home');
                        else if (link.slug === 'search') { toggleSearch(); toggleMobileMenu(); }
                        else if (link.slug === 'favorites') navigateTo('favorites');
                        else {
                          useStore.getState().selectCategory(link.slug as 'fashion');
                          navigateTo('category');
                        }
                        toggleMobileMenu();
                      }}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer',
                        isActive(link.slug)
                          ? 'bg-primary/10 text-primary font-bold relative'
                          : 'text-text-subtle hover:text-primary hover:bg-primary/5'
                      )}
                    >
                      {isActive(link.slug) && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-primary" />
                      )}
                      {link.label}
                    </motion.button>
                  ))}
                </nav>

                {/* User Actions */}
                <div className="border-t border-border/50 pt-4 space-y-2">
                  <button
                    onClick={() => { navigateTo('notifications'); toggleMobileMenu(); }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-text-subtle hover:text-primary hover:bg-primary/5 transition-all w-full cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <Bell className="h-4 w-4" />
                      الإشعارات
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-gradient-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { navigateTo('login'); toggleMobileMenu(); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-subtle hover:text-primary hover:bg-primary/5 transition-all w-full cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    تسجيل الدخول
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav - Premium with floating active indicator */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong lg:hidden safe-area-bottom border-t border-border/30">
        <div className="flex items-center justify-around h-[72px] px-2">
          <button
            onClick={() => navigateTo('home')}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-2xl transition-all duration-300 cursor-pointer',
              currentPage === 'home' ? 'text-primary' : 'text-text-subtle'
            )}
          >
            {/* Floating gradient circle for active */}
            {currentPage === 'home' && (
              <motion.span
                layoutId="bottom-nav-active"
                className="absolute inset-0 rounded-2xl bg-gradient-primary/10 border border-primary/20"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Home className={cn('h-[22px] w-[22px] relative z-10', currentPage === 'home' && 'drop-shadow-[0_0_6px_rgba(194,24,91,0.5)]')} />
            <span className="text-[10px] font-bold relative z-10">الرئيسية</span>
          </button>

          <button
            onClick={toggleSearch}
            className="relative flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-2xl text-text-subtle transition-all duration-300 cursor-pointer"
          >
            <Search className="h-[22px] w-[22px]" />
            <span className="text-[10px] font-medium">بحث</span>
          </button>

          <button
            onClick={() => navigateTo('favorites')}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-2xl transition-all duration-300 cursor-pointer',
              currentPage === 'favorites' ? 'text-primary' : 'text-text-subtle'
            )}
          >
            {currentPage === 'favorites' && (
              <motion.span
                layoutId="bottom-nav-active"
                className="absolute inset-0 rounded-2xl bg-gradient-primary/10 border border-primary/20"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Heart className={cn('h-[22px] w-[22px] relative z-10', currentPage === 'favorites' && 'drop-shadow-[0_0_6px_rgba(194,24,91,0.5)]')} />
            <span className="text-[10px] font-bold relative z-10">المفضلة</span>
          </button>

          <button
            onClick={() => navigateTo('login')}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-2xl transition-all duration-300 cursor-pointer',
              currentPage === 'login' || currentPage === 'profile' ? 'text-primary' : 'text-text-subtle'
            )}
          >
            {(currentPage === 'login' || currentPage === 'profile') && (
              <motion.span
                layoutId="bottom-nav-active"
                className="absolute inset-0 rounded-2xl bg-gradient-primary/10 border border-primary/20"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <User className={cn('h-[22px] w-[22px] relative z-10', (currentPage === 'login' || currentPage === 'profile') && 'drop-shadow-[0_0_6px_rgba(194,24,91,0.5)]')} />
            <span className="text-[10px] font-bold relative z-10">حسابي</span>
          </button>
        </div>
      </nav>

      {/* Voice Search - Floating */}
      <VoiceSearch />

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
