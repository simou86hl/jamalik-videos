'use client';

import { useState, useEffect } from 'react';
import {
  Search, Menu, X, Heart, User, Home, Sparkles,
  Bell, ShoppingBag, Shirt, ChefHat, Scissors,
  Dumbbell, Palette, Leaf, Brain, GitCompareArrows,
  Gift, Globe, Info, FileText, Shield, Phone, ChevronLeft,
  Video, Play, Clock, Eye, ThumbsUp, Filter,
  MessageCircle, Wand2, Scan, Trophy, Target, Dna,
  CheckCircle, Flower2, Users, Radio, ScanLine, FlaskConical, Film,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { NAV_LINKS, SITE_NAME, FOOTER_LINKS } from '@/lib/constants';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { VoiceSearch } from '@/components/shared/VoiceSearch';
import { CartDrawer } from '@/components/shared/CartDrawer';
import { cn } from '@/lib/utils';
import type { SitePage, CategorySlug } from '@/types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  fashion: Shirt,
  cooking: ChefHat,
  skincare: Sparkles,
  haircare: Scissors,
  fitness: Dumbbell,
  beauty: Palette,
  health: Heart,
  natural: Leaf,
};

const MORE_MENU_ITEMS: { label: string; page: SitePage; icon: React.ElementType }[] = [
  { label: 'مساعد جمالكِ الذكي', page: 'ai-chat', icon: MessageCircle },
  { label: 'مولّد الوصفات الذكي', page: 'ai-recipe', icon: Wand2 },
  { label: 'محلل البشرة والشعر', page: 'skin-analyzer', icon: Scan },
  { label: 'مستشار الأزياء الذكي', page: 'style-advisor', icon: Sparkles },
  { label: 'نقاط جمالكِ', page: 'gamification', icon: Trophy },
  { label: 'التحديات الجماعية', page: 'challenges', icon: Target },
  { label: 'ملف جمالكِ الشخصي', page: 'beauty-dna', icon: Dna },
  { label: 'متتبع العادات', page: 'habit-tracker', icon: CheckCircle },
  { label: 'متتبع الدورة الشهرية', page: 'cycle-tracker', icon: Flower2 },
  { label: 'مجتمع جمالكِ', page: 'community', icon: Users },
  { label: 'جلسات الخبراء', page: 'expert-sessions', icon: Radio },
  { label: 'ماسح المنتجات', page: 'product-scanner', icon: ScanLine },
  { label: 'مختبر الوصفات الطبيعية', page: 'recipe-lab', icon: FlaskConical },
  { label: 'خزانة ملابسي', page: 'wardrobe', icon: Shirt },
  { label: 'استوديو الفيديوهات', page: 'video-studio', icon: Film },
  { label: 'الاختبارات', page: 'quiz', icon: Brain },
  { label: 'مقارنة المنتجات', page: 'compare', icon: GitCompareArrows },
  { label: 'الدعوة والأصدقاء', page: 'referral', icon: Gift },
  { label: 'الإشعارات', page: 'notifications', icon: Bell },
];

const USEFUL_LINKS: { label: string; page: SitePage; icon: React.ElementType }[] = [
  { label: 'من نحن', page: 'about', icon: Info },
  { label: 'سياسة الخصوصية', page: 'privacy', icon: Shield },
  { label: 'شروط الاستخدام', page: 'about', icon: FileText },
  { label: 'تواصل معنا', page: 'contact', icon: Phone },
];

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

  const handleMobileNav = (page: SitePage) => {
    navigateTo(page);
    toggleMobileMenu();
  };

  const handleCategoryTap = (slug: CategorySlug) => {
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
                <Sparkles className="h-5 w-5 text-white relative z-10" />
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
              </button>

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

              <button
                onClick={() => setCartOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center glass-subtle transition-all duration-300 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:scale-105 relative group"
                aria-label="سلة التسوق"
              >
                <ShoppingBag className="h-[18px] w-[18px] text-text-subtle transition-colors duration-300 group-hover:text-primary" />
              </button>

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

      {/* ═══ Mobile Menu Overlay — Organized & Compact ═══ */}
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
                      <Sparkles className="h-4 w-4 text-white" />
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
                  {/* ── الأقسام (Category Chips Grid) ── */}
                  <div>
                    <h4 className="text-[11px] font-bold text-text-subtle uppercase tracking-wider mb-2 px-1">
                      الأقسام
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {FOOTER_LINKS.categories.slice(0, 7).map((cat, index) => {
                        const Icon = CATEGORY_ICONS[cat.slug];
                        return (
                          <motion.button
                            key={cat.slug}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => handleCategoryTap(cat.slug as CategorySlug)}
                            className={cn(
                              'flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer',
                              isActive(cat.slug)
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'glass-subtle text-text-subtle hover:text-primary hover:bg-primary/5'
                            )}
                          >
                            {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0" />}
                            <span className="truncate">{cat.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── روابط مفيدة ── */}
                  <div>
                    <h4 className="text-[11px] font-bold text-text-subtle uppercase tracking-wider mb-2 px-1">
                      روابط مفيدة
                    </h4>
                    <div className="space-y-0.5">
                      {USEFUL_LINKS.map((link, i) => {
                        const Icon = link.icon;
                        return (
                          <motion.button
                            key={link.label}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + i * 0.03 }}
                            onClick={() => handleMobileNav(link.page)}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-text-subtle hover:text-primary hover:bg-primary/5 transition-all duration-200 w-full cursor-pointer group"
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

                  {/* ── المزيد ── */}
                  <div>
                    <h4 className="text-[11px] font-bold text-text-subtle uppercase tracking-wider mb-2 px-1">
                      المزيد
                    </h4>
                    <div className="space-y-0.5">
                      {MORE_MENU_ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <motion.button
                            key={item.page}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.03 }}
                            onClick={() => handleMobileNav(item.page)}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-text-subtle hover:text-primary hover:bg-primary/5 transition-all duration-200 w-full cursor-pointer group"
                          >
                            <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <Icon className="h-3 w-3" />
                            </div>
                            {item.label}
                            {item.page === 'notifications' && unreadCount > 0 && (
                              <span className="mr-auto bg-gradient-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            )}
                            {item.page !== 'notifications' && (
                              <ChevronLeft className="h-3 w-3 mr-auto opacity-30" />
                            )}
                          </motion.button>
                        );
                      })}
                      {/* Language */}
                      <motion.button
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + MORE_MENU_ITEMS.length * 0.03 }}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-text-subtle hover:text-primary hover:bg-primary/5 transition-all duration-200 w-full cursor-pointer group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Globe className="h-3 w-3" />
                        </div>
                        اللغة العربية
                        <ChevronLeft className="h-3 w-3 mr-auto opacity-30" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* ─── Bottom: Login + Theme ─── */}
                <div className="border-t border-border/30 px-4 py-3 flex items-center gap-2">
                  <button
                    onClick={() => handleMobileNav('login')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium glass-subtle text-text-subtle hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5" />
                    تسجيل الدخول
                  </button>
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
            { page: 'videos' as SitePage, Icon: Video, label: 'فيديوهات' },
            { page: 'login' as SitePage, Icon: User, label: 'حسابي' },
          ].map((tab) => {
            const isActiveTab = tab.page === 'search'
              ? false
              : currentPage === tab.page || (tab.page === 'login' && (currentPage === 'profile' || currentPage === 'register' || currentPage === 'login'));

            return (
              <button
                key={tab.page}
                onClick={() => tab.action ? tab.action() : navigateTo(tab.page)}
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

      <VoiceSearch />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
