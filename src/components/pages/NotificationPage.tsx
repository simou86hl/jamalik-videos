'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  BellOff,
  CheckCheck,
  Sparkles,
  ChefHat,
  Scissors,
  Shirt,
  Heart,
  Info,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { NOTIFICATIONS_DATA } from '@/data/notifications';
import { CATEGORIES } from '@/lib/constants';
import { getRelativeTime } from '@/lib/utils';
import type { CategorySlug } from '@/types';
import { cn } from '@/lib/utils';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

type FilterTab = 'all' | 'unread' | 'articles' | 'recipes';

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'unread', label: 'غير مقروءة' },
  { key: 'articles', label: 'المقالات' },
  { key: 'recipes', label: 'الوصفات' },
];

const categoryIcons: Record<string, React.ElementType> = {
  skincare: Sparkles,
  haircare: Scissors,
  fashion: Shirt,
  health: Heart,
  cooking: ChefHat,
  beauty: Sparkles,
  fitness: Heart,
  natural: Sparkles,
  system: Info,
};

const categoryColors: Record<string, string> = {
  skincare: 'bg-gradient-primary/15 text-primary',
  haircare: 'bg-gradient-rose-purple/15 text-secondary',
  fashion: 'bg-gradient-warm/15 text-accent',
  health: 'bg-green-500/15 text-green-500',
  cooking: 'bg-orange-500/15 text-orange-500',
  beauty: 'bg-pink-500/15 text-pink-500',
  fitness: 'bg-teal-500/15 text-teal-500',
  natural: 'bg-emerald-500/15 text-emerald-500',
  system: 'bg-gradient-primary/15 text-primary',
};

export function NotificationPage() {
  const { goBack, notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  // Combine store notifications with static data (store overrides static by id)
  const allNotifications = useMemo(() => {
    const storeIds = new Set(notifications.map((n) => n.id));
    const staticNotifs = NOTIFICATIONS_DATA.filter((n) => !storeIds.has(n.id));
    return [...notifications, ...staticNotifs];
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case 'unread':
        return allNotifications.filter((n) => !n.read);
      case 'articles':
        return allNotifications.filter((n) => n.category !== 'cooking' && n.category !== 'system');
      case 'recipes':
        return allNotifications.filter((n) => n.category === 'cooking');
      default:
        return allNotifications;
    }
  }, [allNotifications, activeFilter]);

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  const getCategoryName = (cat: CategorySlug | 'system') => {
    if (cat === 'system') return 'نظام';
    return CATEGORIES.find((c) => c.slug === cat)?.name || cat;
  };

  const getCategoryIcon = (cat: CategorySlug | 'system') => {
    return categoryIcons[cat] || Bell;
  };

  const getCategoryColor = (cat: CategorySlug | 'system') => {
    return categoryColors[cat] || 'bg-gradient-primary/15 text-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-6"
    >
      {/* Back button */}
      <motion.button
        whileHover={{ x: 4 }}
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-text-subtle hover:text-primary transition-colors mb-6 cursor-pointer group"
      >
        <span className="glass-subtle rounded-full p-1.5 group-hover:bg-primary/10 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </span>
        العودة
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative rounded-3xl overflow-hidden mb-8"
      >
        <div className="bg-gradient-primary p-8 sm:p-10 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Bell className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-2 relative z-10">
            الإشعارات
          </h1>
          <div className="flex items-center justify-center gap-4 relative z-10">
            <span className="text-white/85 text-sm">{allNotifications.length} إشعار</span>
            {unreadCount > 0 && (
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                {unreadCount} غير مقروءة
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs & Mark All Read */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterTabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer',
                activeFilter === tab.key
                  ? 'bg-gradient-primary text-white shadow-[var(--shadow-glow)]'
                  : 'glass-subtle text-text-subtle hover:text-text-main'
              )}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleMarkAllRead}
            className="btn-primary text-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            قراءة الكل
          </motion.button>
        )}
      </div>

      {/* Notifications List */}
      <AnimatePresence mode="wait">
        {filteredNotifications.length > 0 ? (
          <motion.div
            key={activeFilter}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-3"
          >
            {filteredNotifications.map((notification) => {
              const Icon = getCategoryIcon(notification.category);
              const colorClass = getCategoryColor(notification.category);
              const isStoreNotif = notifications.some((n) => n.id === notification.id);

              return (
                <motion.div
                  key={notification.id}
                  variants={staggerItem}
                  layout
                  onClick={() => isStoreNotif && markNotificationRead(notification.id)}
                  className={cn(
                    'glass-subtle rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer card-hover',
                    !notification.read && 'gradient-border',
                    notification.read && 'opacity-80 hover:opacity-100'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={cn(
                          'text-sm font-bold text-text-main truncate',
                          !notification.read && 'text-text-main',
                          notification.read && 'text-text-secondary'
                        )}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-text-subtle leading-relaxed mb-2 line-clamp-2">
                        {notification.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] glass-subtle px-2 py-0.5 rounded-full text-text-subtle">
                          {getCategoryName(notification.category)}
                        </span>
                        <span className="text-[10px] text-text-subtle/60">
                          {getRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-2xl p-12 text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4"
            >
              <BellOff className="h-16 w-16 text-text-subtle/20 mx-auto" />
            </motion.div>
            <h3 className="text-lg font-heading font-bold text-text-main mb-2">لا توجد إشعارات</h3>
            <p className="text-sm text-text-subtle">
              {activeFilter === 'unread'
                ? 'جميع الإشعارات مقروءة'
                : 'لا توجد إشعارات في هذا القسم حالياً'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
