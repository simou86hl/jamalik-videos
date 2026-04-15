'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Droplets,
  Moon,
  Sparkles,
  Dumbbell,
  Book,
  Apple,
  Footprints,
  Star,
  Flame,
  X,
  Zap,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { DEFAULT_HABITS } from '@/data/featuresData';
import { cn } from '@/lib/utils';
import type { Habit } from '@/types';

// ─── Easing ───────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Icon map ─────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  Droplets,
  Moon,
  Sparkles,
  Dumbbell,
  Book,
  Apple,
  Footprints,
  Star,
};

// ─── Extra addable habits ─────────────────────────────────────
const EXTRA_HABITS: Omit<Habit, 'id' | 'log'>[] = [
  { name: 'تأمل وتهدئة', icon: 'Zap', category: 'wellness', target: 10, unit: 'دقائق' },
  { name: 'شاي أعشاب', icon: 'Droplets', category: 'health', target: 3, unit: 'كؤوس' },
  { name: 'تمارين إطالة', icon: 'Dumbbell', category: 'fitness', target: 15, unit: 'دقيقة' },
  { name: 'قراءة كتاب', icon: 'Book', category: 'wellness', target: 20, unit: 'صفحة' },
  { name: 'ابتسامة صباحية', icon: 'Star', category: 'wellness', target: 1, unit: 'مرة' },
];

// ─── Helper: date string ──────────────────────────────────────
function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function arabicDay(d: Date): string {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return days[d.getDay()];
}

function formatArabicDate(d: Date): string {
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Streak calculator ────────────────────────────────────────
function getStreak(log: Record<string, number>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    if (log[key] && log[key] > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ─── Component ────────────────────────────────────────────────
export function HabitTrackerPage() {
  const { goBack } = useStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const todayKey = toDateKey(selectedDate);
  const isToday =
    toDateKey(selectedDate) === toDateKey(new Date());

  // ─── Date navigation ───────────────────────────────────────
  const prevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
    setEditValues({});
  };
  const nextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
    setEditValues({});
  };
  const goToToday = () => {
    setSelectedDate(new Date());
    setEditValues({});
  };

  // ─── Toggle / update habit ─────────────────────────────────
  const toggleHabit = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const currentValue = h.log[todayKey] || 0;
        const newValue = currentValue > 0 ? 0 : h.target;
        return { ...h, log: { ...h.log, [todayKey]: newValue } };
      })
    );
  };

  const updateHabitValue = (habitId: string, value: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        return { ...h, log: { ...h.log, [todayKey]: value } };
      })
    );
  };

  const [nextId, setNextId] = useState(1);

  const addHabit = (template: Omit<Habit, 'id' | 'log'>) => {
    const newHabit: Habit = {
      ...template,
      id: `h-custom-${nextId}`,
      log: {},
    };
    setNextId((p) => p + 1);
    setHabits((prev) => [...prev, newHabit]);
    setShowAddHabit(false);
  };

  // ─── Weekly data for bar chart ─────────────────────────────
  const weeklyData = useMemo(() => {
    const days: { key: string; label: string; total: number; max: number }[] = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday

    let maxTotal = 1;
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const key = toDateKey(d);
      let total = 0;
      let max = 0;
      habits.forEach((h) => {
        total += h.log[key] || 0;
        max += h.target;
      });
      if (total > maxTotal) maxTotal = total;
      const dayLabels = ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
      days.push({ key, label: dayLabels[i], total, max });
    }
    return { days, maxTotal };
  }, [selectedDate, habits]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-6"
    >
      {/* Back */}
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

      {/* ─── Hero ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease }}
        className="relative rounded-3xl overflow-hidden mb-10"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <CheckCircle className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            متتبع العادات اليومية
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            تابعي عاداتك اليومية وحققي أهدافك الصحية والجمالية
          </p>
        </div>
      </motion.div>

      {/* ─── Date Navigation ─────────────────────────────────── */}
      <div className="glass-strong rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={prevDay}
            className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-text-main hover:text-primary transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>

          <div className="text-center">
            <div className="text-sm font-heading font-bold text-text-main">
              {arabicDay(selectedDate)}
            </div>
            <div className="text-xs text-text-subtle">{formatArabicDate(selectedDate)}</div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={nextDay}
            className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-text-main hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        </div>

        {!isToday && (
          <div className="mt-3 text-center">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={goToToday}
              className="btn-primary text-xs px-4 py-1.5"
            >
              العودة لليوم
            </motion.button>
          </div>
        )}
      </div>

      {/* ─── Weekly Summary Bar Chart ────────────────────────── */}
      <div className="glass-strong rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-heading font-bold text-text-main mb-4">ملخص الأسبوع</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.days.map((day) => {
            const heightPct = weeklyData.maxTotal > 0 ? (day.total / weeklyData.maxTotal) * 100 : 0;
            const isCurrentDay = day.key === toDateKey(new Date());
            return (
              <div key={day.key} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-text-subtle font-medium">
                  {day.total > 0 ? day.total : ''}
                </span>
                <div className="w-full h-24 rounded-lg bg-border-light/60 relative overflow-hidden flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPct, 4)}%` }}
                    transition={{ duration: 0.5, ease }}
                    className={cn(
                      'w-full rounded-lg transition-all',
                      isCurrentDay ? 'bg-gradient-primary' : 'bg-gradient-primary/60'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-semibold',
                    isCurrentDay ? 'text-primary' : 'text-text-subtle'
                  )}
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Habits List ─────────────────────────────────────── */}
      <div className="space-y-3 mb-6">
        {habits.map((habit, idx) => {
          const Icon = iconMap[habit.icon] || CheckCircle;
          const currentValue = habit.log[todayKey] || 0;
          const progress = Math.min(100, (currentValue / habit.target) * 100);
          const isComplete = currentValue >= habit.target;
          const streak = getStreak(habit.log);
          const isEditing = editValues[habit.id] !== undefined;

          // Progress ring values
          const radius = 22;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (progress / 100) * circumference;

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, ease }}
              className={cn(
                'glass-strong rounded-2xl p-4 transition-all',
                isComplete && 'ring-1 ring-success/30'
              )}
            >
              <div className="flex items-center gap-4">
                {/* Progress ring */}
                <div className="relative flex-shrink-0">
                  <svg width="56" height="56" className="-rotate-90">
                    <circle
                      cx="28" cy="28" r={radius}
                      fill="none"
                      stroke="var(--border-color)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="28" cy="28" r={radius}
                      fill="none"
                      stroke={isComplete ? 'var(--success)' : 'var(--primary)'}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.6, ease }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        isComplete ? 'text-success' : 'text-primary'
                      )}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-heading font-bold text-text-main truncate">
                      {habit.name}
                    </h4>
                    {streak > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-0.5 text-[10px] font-bold text-accent flex-shrink-0"
                      >
                        <Flame className="h-3 w-3" />
                        {streak}
                      </motion.span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-text-subtle">
                      {currentValue} / {habit.target} {habit.unit}
                    </span>
                    {isComplete && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[10px] font-bold text-success"
                      >
                        ✓ مكتمل
                      </motion.span>
                    )}
                  </div>

                  {/* Mini progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-border-light overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease }}
                      className={cn(
                        'h-full rounded-full',
                        isComplete ? 'bg-success' : 'bg-gradient-primary'
                      )}
                    />
                  </div>
                </div>

                {/* Toggle / value controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isEditing && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabit(habit.id)}
                      className={cn(
                        'w-12 h-7 rounded-full transition-all relative cursor-pointer',
                        isComplete
                          ? 'bg-success shadow-sm'
                          : 'bg-border'
                      )}
                    >
                      <motion.div
                        animate={{ x: isComplete ? -22 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={cn(
                          'absolute top-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center',
                          isComplete ? 'bg-white left-0.5' : 'bg-white right-0.5'
                        )}
                        style={{ [isComplete ? 'right' : 'left']: '2px' }}
                      >
                        {isComplete && (
                          <CheckCircle className="h-3.5 w-3.5 text-success" />
                        )}
                      </motion.div>
                    </motion.button>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (isEditing) {
                        setEditValues((prev) => {
                          const next = { ...prev };
                          delete next[habit.id];
                          return next;
                        });
                      } else {
                        setEditValues((prev) => ({
                          ...prev,
                          [habit.id]: currentValue,
                        }));
                      }
                    }}
                    className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-subtle hover:text-primary transition-colors"
                  >
                    {isEditing ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </motion.button>
                </div>
              </div>

              {/* Value input */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-border-light flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        max={habit.target * 3}
                        value={editValues[habit.id] ?? 0}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            [habit.id]: Math.max(0, parseInt(e.target.value) || 0),
                          }))
                        }
                        className="w-20 text-center text-sm bg-input-bg border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary"
                      />
                      <span className="text-xs text-text-subtle">{habit.unit}</span>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          const val = editValues[habit.id] ?? 0;
                          updateHabitValue(habit.id, val);
                          setEditValues((prev) => {
                            const next = { ...prev };
                            delete next[habit.id];
                            return next;
                          });
                        }}
                        className="btn-primary text-xs px-4 py-1.5"
                      >
                        حفظ
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Add Habit Button ────────────────────────────────── */}
      <AnimatePresence>
        {showAddHabit && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease }}
            className="glass-strong rounded-2xl p-5 mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-bold text-text-main">
                أضيفي عادة جديدة
              </h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddHabit(false)}
                className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-subtle"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXTRA_HABITS.map((template, idx) => {
                const Icon = iconMap[template.icon] || Zap;
                const alreadyAdded = habits.some((h) => h.name === template.name);
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={alreadyAdded}
                    onClick={() => addHabit(template)}
                    className={cn(
                      'glass-subtle rounded-xl p-3 flex items-center gap-3 transition-all text-right',
                      alreadyAdded
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-primary/5'
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-main">{template.name}</div>
                      <div className="text-xs text-text-subtle">
                        الهدف: {template.target} {template.unit}
                      </div>
                    </div>
                    {alreadyAdded && (
                      <CheckCircle className="h-4 w-4 text-success mr-auto flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showAddHabit && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddHabit(true)}
          className="btn-outline w-full flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          أضيفي عادة جديدة
        </motion.button>
      )}
    </motion.div>
  );
}
