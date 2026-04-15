'use client';

import { motion } from 'framer-motion';
import {
  Trophy,
  ArrowRight,
  Flame,
  Star,
  Zap,
  BookOpen,
  ChefHat,
  Video,
  CheckCircle2,
  Crown,
  Lock,
  Users,
  Target,
  TrendingUp,
  Library,
  GraduationCap,
  Sparkles,
  Heart,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BADGES } from '@/data/featuresData';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    id: 'lb1',
    name: 'نورة العتيبي',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    points: 12450,
    level: 28,
  },
  {
    id: 'lb2',
    name: 'سارة المنصوري',
    avatar: 'https://images.unsplash.com/photo-1438761681033-696072aa579a?w=80&h=80&fit=crop',
    points: 11200,
    level: 25,
  },
  {
    id: 'lb3',
    name: 'فاطمة الشمري',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
    points: 9800,
    level: 22,
  },
  {
    id: 'lb4',
    name: 'ريم القحطاني',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop',
    points: 8600,
    level: 19,
  },
  {
    id: 'lb5',
    name: 'هند الدوسري',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop',
    points: 7200,
    level: 16,
  },
];

const userStats = [
  { id: 'articles', label: 'مقالات مقروءة', value: 47, icon: BookOpen, color: 'bg-gradient-primary' },
  { id: 'recipes', label: 'وصفات مجرّبة', value: 23, icon: ChefHat, color: 'bg-gradient-warm' },
  { id: 'videos', label: 'فيديوهات مشاهدة', value: 85, icon: Video, color: 'bg-gradient-rose-purple' },
  { id: 'challenges', label: 'تحديات مكتملة', value: 5, icon: Target, color: 'bg-gradient-sunset' },
];

const earnedBadgeIds = ['b1', 'b2', 'b4', 'b6', 'b9'];

function getIcon(name: string): React.ElementType {
  const iconMap: Record<string, React.ElementType> = {
    BookOpen: BookOpen,
    Library: Library,
    GraduationCap: GraduationCap,
    ChefHat: ChefHat,
    Flame: Flame,
    Zap: Zap,
    Star: Star,
    Users: Users,
    Sparkles: Sparkles,
    Trophy: Trophy,
    Video: Video,
    Heart: Heart,
    CheckCircle2: CheckCircle2,
    Lock: Lock,
  };
  return iconMap[name] || Star;
}

const rankStyles: Record<number, { bg: string; text: string; icon: React.ElementType }> = {
  1: { bg: 'bg-amber-500/15', text: 'text-amber-600', icon: Crown },
  2: { bg: 'bg-gray-400/15', text: 'text-gray-500', icon: Star },
  3: { bg: 'bg-orange-400/15', text: 'text-orange-600', icon: Star },
};

export function GamificationPage() {
  const { goBack } = useStore();

  const points = 4850;
  const level = 12;
  const pointsToNextLevel = 1500;
  const currentLevelPoints = 850;
  const progressPercent = (currentLevelPoints / pointsToNextLevel) * 100;
  const streak = 14;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="py-6"
    >
      {/* Back Button */}
      <motion.button
        whileHover={{ x: 4 }}
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-text-subtle hover:text-primary transition-colors mb-4 cursor-pointer group"
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
        transition={{ duration: 0.5, delay: 0.1, ease }}
        className="relative rounded-3xl overflow-hidden mb-6"
      >
        <div className="bg-gradient-primary p-8 sm:p-10 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <Trophy className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mb-2 relative z-10">
            نقاط جمالكِ
          </h1>
          <p className="text-white/85 text-sm sm:text-base max-w-lg mx-auto relative z-10">
            اكتبي نقاطكِ وإنجازاتكِ وتنافسي مع المجتمع
          </p>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease }}
        className="glass-strong gradient-border rounded-2xl p-5 mb-5"
      >
        <div className="flex items-center gap-4 mb-4">
          {/* Avatar */}
          <div className="gradient-border-animated rounded-2xl p-[2px] flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <span className="text-2xl">👩</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-heading font-bold text-text-main">زائرة جمالكِ</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 bg-primary/10 rounded-full px-2.5 py-0.5">
                <Trophy className="h-3 w-3 text-primary" />
                <span className="text-xs font-bold text-primary">المستوى {level}</span>
              </div>
              <span className="text-xs text-text-subtle">
                {points.toLocaleString('ar-EG')} نقطة
              </span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-subtle">التقدم للمستوى التالي</span>
            <span className="text-xs text-primary font-semibold">
              {currentLevelPoints}/{pointsToNextLevel}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-border overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease }}
              className="h-full rounded-full bg-gradient-primary relative"
            >
              <div className="absolute inset-0 bg-gradient-card-shine" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Streak Counter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease }}
        className="glass-strong rounded-2xl p-5 mb-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl bg-gradient-warm flex items-center justify-center"
            >
              <Flame className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-sm font-heading font-bold text-text-main">نشاط متواصل</h3>
              <p className="text-xs text-text-subtle">استمري! أنتِ رائعة</p>
            </div>
          </div>
          <div className="text-left">
            <span className="text-3xl font-heading font-extrabold text-gradient">{streak}</span>
            <span className="block text-xs text-text-subtle">يوم</span>
          </div>
        </div>
        {/* Streak Dots */}
        <div className="flex gap-1 mt-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-2 rounded-full',
                i < (streak % 7 || 7) ? 'bg-gradient-warm' : 'bg-border'
              )}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-text-subtle">أمس</span>
          <span className="text-[10px] text-text-subtle">اليوم</span>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease }}
        className="glass-strong rounded-2xl p-5 mb-5"
      >
        <h3 className="text-sm font-heading font-bold text-text-main mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          إحصائياتكِ
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {userStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.3 + index * 0.08 }}
              className="glass-subtle rounded-xl p-4 text-center"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2',
                  stat.color
                )}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-xl font-heading font-bold text-text-main">{stat.value}</p>
              <p className="text-[11px] text-text-subtle mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badges Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease }}
        className="glass-strong rounded-2xl p-5 mb-5"
      >
        <h3 className="text-sm font-heading font-bold text-text-main mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent" />
          الأوسمة والإنجازات
          <span className="text-xs text-text-subtle font-normal">
            ({earnedBadgeIds.length}/{BADGES.length})
          </span>
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {BADGES.map((badge, index) => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            const Icon = getIcon(badge.icon);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                className={cn(
                  'rounded-xl p-3 text-center transition-all',
                  isEarned
                    ? 'glass-subtle card-hover cursor-pointer'
                    : 'opacity-40'
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2',
                    isEarned
                      ? 'bg-gradient-primary text-white'
                      : 'bg-border text-text-subtle'
                  )}
                >
                  {isEarned ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium block leading-tight',
                    isEarned ? 'text-text-main' : 'text-text-subtle'
                  )}
                >
                  {badge.name}
                </span>
                {!isEarned && (
                  <div className="mt-1.5">
                    <span className="text-[9px] text-text-subtle">🔒</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35, ease }}
        className="glass-strong rounded-2xl p-5"
      >
        <h3 className="text-sm font-heading font-bold text-text-main mb-4 flex items-center gap-2">
          <Crown className="h-4 w-4 text-amber-500" />
          لوحة المتصدرين
        </h3>
        <div className="space-y-2.5">
          {leaderboardData.map((entry, index) => {
            const rank = index + 1;
            const style = rankStyles[rank];
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.4 + index * 0.08 }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all',
                  rank <= 3 ? 'glass-subtle' : 'hover:bg-primary/5'
                )}
              >
                {/* Rank */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm',
                    style
                      ? `${style.bg} ${style.text}`
                      : 'bg-border/50 text-text-subtle'
                  )}
                >
                  {rank <= 3 ? <style.icon className="h-4 w-4" /> : rank}
                </div>

                {/* Avatar */}
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">{entry.name}</p>
                  <p className="text-[11px] text-text-subtle">المستوى {entry.level}</p>
                </div>

                {/* Points */}
                <div className="text-left flex-shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {entry.points.toLocaleString('ar-EG')}
                  </span>
                  <span className="block text-[10px] text-text-subtle">نقطة</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
