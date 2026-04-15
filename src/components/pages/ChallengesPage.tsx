'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Users,
  Clock,
  Trophy,
  CheckCircle2,
  Sparkles,
  Heart,
  Leaf,
  Dumbbell,
  Palette,
  Scissors,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CHALLENGES } from '@/data/featuresData';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import type { Challenge, CategorySlug } from '@/types';

// ─── Icon map ─────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Heart,
  Leaf,
  Dumbbell,
  Palette,
  Scissors,
};

// ─── Category label map ───────────────────────────────────────
const categoryLabels: Record<CategorySlug, string> = {
  fashion: 'أزياء',
  cooking: 'طبخ',
  skincare: 'بشرة',
  haircare: 'شعر',
  fitness: 'لياقة',
  beauty: 'تجميل',
  health: 'صحة',
  natural: 'طبيعي',
};

// ─── Animation helpers ────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease },
  },
};

// ─── Component ────────────────────────────────────────────────
export function ChallengesPage() {
  const { goBack } = useStore();

  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  const activeChallenges = challenges.filter((c) => c.isActive);
  const joinedChallenges = challenges.filter((c) => c.joinedDate);
  const completedChallenges = challenges.filter((c) => c.progress >= 100);

  const toggleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.joinedDate) {
          return { ...c, joinedDate: null, progress: 0 };
        }
        return { ...c, joinedDate: new Date().toISOString(), progress: 0 };
      })
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
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

      {/* ─── Hero Header ─────────────────────────────────────── */}
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
            <Target className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            التحديات الجماعية
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            شاركي مع مجتمع جمالكِ في تحديات يومية وحققي أهدافك معاً
          </p>
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-6 relative z-10">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatNumber(challenges.length)}</div>
              <div className="text-xs text-white/70">تحدي متاح</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatNumber(challenges.reduce((s, c) => s + c.participants, 0))}
              </div>
              <div className="text-xs text-white/70">مشاركة</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">{formatNumber(joinedChallenges.length)}</div>
              <div className="text-xs text-white/70">انضممتِ</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Joined Challenges ────────────────────────────────── */}
      {joinedChallenges.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold text-text-main mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            تحدياتي الحالية
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {joinedChallenges.map((challenge) => {
              const Icon = iconMap[challenge.icon] || Sparkles;
              const isExpanded = expandedId === challenge.id;
              const daysLeft = challenge.joinedDate
                ? Math.max(0, challenge.duration - Math.floor((now - new Date(challenge.joinedDate).getTime()) / 86400000))
                : challenge.duration;

              return (
                <motion.div
                  key={challenge.id}
                  variants={staggerItem}
                  className="glass-strong gradient-border rounded-2xl overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-heading font-bold text-text-main truncate">
                            {challenge.title}
                          </h3>
                          <span className="text-xs glass-subtle px-3 py-1 rounded-full text-primary font-medium flex-shrink-0 mr-2">
                            {categoryLabels[challenge.category]}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mb-3 line-clamp-1">
                          {challenge.description}
                        </p>

                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-text-subtle mb-1">
                            <span>التقدم</span>
                            <span className="font-medium text-primary">{challenge.progress}%</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-border-light overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${challenge.progress}%` }}
                              transition={{ duration: 0.8, ease }}
                              className="h-full rounded-full bg-gradient-primary"
                            />
                          </div>
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-4 text-xs text-text-subtle mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {daysLeft} يوم متبقي
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {formatNumber(challenge.participants)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleExpand(challenge.id)}
                            className="btn-outline text-xs px-4 py-1.5 flex items-center gap-1"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-3.5 w-3.5" />
                                إخفاء المهام
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3.5 w-3.5" />
                                عرض المهام
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleJoin(challenge.id)}
                            className="text-xs px-4 py-1.5 rounded-full border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all font-medium"
                          >
                            مغادرة
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Tasks checklist */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-border-light">
                            <div className="space-y-2">
                              {challenge.tasks.map((task, idx) => {
                                const done = idx < Math.floor((challenge.progress / 100) * challenge.tasks.length);
                                return (
                                  <motion.div
                                    key={idx}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05, ease }}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-border-light/50 transition-colors"
                                  >
                                    <div
                                      className={cn(
                                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all',
                                        done
                                          ? 'bg-gradient-primary border-primary text-white'
                                          : 'border-border text-transparent'
                                      )}
                                    >
                                      {done && <CheckCircle2 className="h-4 w-4" />}
                                    </div>
                                    <span
                                      className={cn(
                                        'text-sm transition-all',
                                        done ? 'text-text-subtle line-through' : 'text-text-main'
                                      )}
                                    >
                                      {task}
                                    </span>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* ─── Completed Challenges ─────────────────────────────── */}
      {completedChallenges.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold text-text-main mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-success" />
            تحديات مكتملة
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {completedChallenges.map((challenge) => {
              return (
                <motion.div
                  key={challenge.id}
                  variants={staggerItem}
                  className="glass-strong rounded-2xl p-5 opacity-80"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-text-main truncate text-sm">
                        {challenge.title}
                      </h3>
                      <p className="text-xs text-text-subtle">
                        {categoryLabels[challenge.category]}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-success font-medium flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5" />
                    تم الإكمال بنجاح! 🎉
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* ─── Active Challenges Grid ───────────────────────────── */}
      <section>
        <h2 className="text-xl font-heading font-bold text-text-main mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          التحديات المتاحة
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {activeChallenges.map((challenge) => {
            const Icon = iconMap[challenge.icon] || Sparkles;
            const isJoined = !!challenge.joinedDate;

            return (
              <motion.div
                key={challenge.id}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="glass-strong rounded-2xl overflow-hidden card-hover gradient-border"
              >
                {/* Card top accent bar */}
                <div className="h-1 bg-gradient-primary" />
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-text-main text-base mb-1 leading-snug">
                        {challenge.title}
                      </h3>
                      <span className="text-xs glass-subtle px-3 py-0.5 rounded-full text-primary font-medium">
                        {categoryLabels[challenge.category]}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                    {challenge.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-text-subtle mb-5">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {challenge.duration} يوم
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {formatNumber(challenge.participants)}
                    </span>
                  </div>

                  {/* Join / Leave button */}
                  <AnimatePresence mode="wait">
                    <motion.button
                      key={isJoined ? 'joined' : 'join'}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.25, ease }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleJoin(challenge.id)}
                      className={cn(
                        'w-full py-2.5 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2',
                        isJoined
                          ? 'bg-gradient-primary text-white shadow-md'
                          : 'btn-outline'
                      )}
                    >
                      {isJoined ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          تم الانضمام — اضغطي للمغادرة
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4" />
                          انضمي للتحدي
                        </>
                      )}
                    </motion.button>
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </motion.div>
  );
}
