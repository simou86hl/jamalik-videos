'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TIPS } from '@/data/seedData';
import { CATEGORIES } from '@/lib/constants';
import type { CategorySlug, Tip } from '@/types';
import { cn } from '@/lib/utils';

const arabicMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

const arabicDays = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];

function getCategoryLabel(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name || slug;
}

function getTipForDay(tips: Tip[], day: number, month: number): Tip | null {
  // Use a deterministic distribution of tips across days
  const tipIndex = ((day - 1 + month * 7) % tips.length);
  return tips[tipIndex] || null;
}

export function DailyCalendarPage() {
  const { goBack } = useStore();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');

  const filteredTips = useMemo(() => {
    if (activeCategory === 'all') return TIPS;
    return TIPS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const selectedTip = useMemo(() => {
    if (!selectedDay) return null;
    return getTipForDay(filteredTips, selectedDay, currentMonth);
  }, [selectedDay, filteredTips, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
    setSelectedDay(null);
  };

  const isToday = (day: number) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const categoryOptions: { slug: CategorySlug | 'all'; label: string }[] = [
    { slug: 'all', label: 'الكل' },
    ...CATEGORIES.map((c) => ({ slug: c.slug, label: c.name })),
  ];

  // Build calendar grid (pad first days)
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

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

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative rounded-3xl overflow-hidden mb-8"
      >
        <div className="bg-gradient-primary p-8 sm:p-10 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Calendar className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-2 relative z-10">
            التقويم اليومي
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            نصيحة يومية لنضارة جمالك وصحتك
          </p>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {categoryOptions.map((cat) => (
          <motion.button
            key={cat.slug}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setActiveCategory(cat.slug);
              setSelectedDay(null);
            }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer',
              activeCategory === cat.slug
                ? 'bg-gradient-primary text-white'
                : 'glass-subtle text-text-subtle hover:text-text-main'
            )}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-strong rounded-2xl p-5"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevMonth}
              className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center text-text-subtle hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
            <h3 className="text-lg font-heading font-bold text-gradient">
              {arabicMonths[currentMonth]} {currentYear}
            </h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleNextMonth}
              className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center text-text-subtle hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {arabicDays.map((day) => (
              <div key={day} className="text-center text-xs text-text-subtle font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-16" />;
              }
              const tip = getTipForDay(filteredTips, day, currentMonth);
              const isSelected = selectedDay === day;
              const todayHighlight = isToday(day);

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer relative',
                    'text-xs hover:bg-primary/5',
                    isSelected && 'bg-gradient-primary text-white shadow-[var(--shadow-glow)]',
                    todayHighlight && !isSelected && 'ring-2 ring-primary/30',
                    !isSelected && !todayHighlight && 'glass-subtle'
                  )}
                >
                  <span className={cn(
                    'font-bold text-sm mb-0.5',
                    isSelected ? 'text-white' : todayHighlight ? 'text-primary' : 'text-text-main'
                  )}>
                    {day}
                  </span>
                  {tip && (
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isSelected ? 'bg-white/60' : 'bg-gradient-primary'
                    )} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Day Tip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {selectedTip && selectedDay ? (
              <motion.div
                key={`${selectedDay}-${selectedTip.id}`}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="glass-strong gradient-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary/15 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-subtle">نصيحة يوم {selectedDay}</p>
                    <span className="text-xs glass-subtle px-2 py-0.5 rounded-full text-primary font-medium">
                      {getCategoryLabel(selectedTip.category)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text-main leading-relaxed font-medium">
                  {selectedTip.content}
                </p>
                <div className="mt-4 pt-4 border-t border-border/20">
                  <p className="text-[10px] text-text-subtle/60">
                    {arabicMonths[currentMonth]} {selectedDay}، {currentYear}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="glass-strong rounded-2xl p-8 text-center"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-10 w-10 text-text-subtle/20 mx-auto mb-3" />
                </motion.div>
                <p className="text-sm text-text-subtle">
                  اختاري يوماً من التقويم لعرض النصيحة
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips Summary */}
          <div className="mt-4 glass-strong rounded-2xl p-5">
            <h4 className="text-sm font-heading font-bold text-gradient mb-3">إحصائيات الشهر</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-subtle">إجمالي النصائح</span>
                <span className="text-sm font-bold text-text-main">{daysInMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-subtle">الأقسام المغطاة</span>
                <span className="text-sm font-bold text-text-main">
                  {new Set(filteredTips.map((t) => t.category)).size} أقسام
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-subtle">الفلتر النشط</span>
                <span className="text-xs glass-subtle px-2 py-0.5 rounded-full text-primary font-medium">
                  {activeCategory === 'all' ? 'الكل' : getCategoryLabel(activeCategory)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
