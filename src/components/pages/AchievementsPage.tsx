'use client';
import { motion } from 'framer-motion';
import { Trophy, Eye, Zap, Compass, Star, Heart, Moon, Map, Award, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = { Eye, Zap, Compass, Star, Heart, Moon, Map, Award };

export function AchievementsPage() {
  const { achievements } = useStore();
  const unlocked = achievements.filter(a => a.unlockedAt).length;

  return (
    <div className="pt-4 pb-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-main">الإنجازات</h1>
          <span className="text-xs text-text-subtle mr-1">({unlocked}/{achievements.length})</span>
        </div>
        <p className="text-sm text-text-subtle mr-10">احصل على شارات بأنشطتك</p>
      </motion.div>

      {/* Progress bar */}
      <div className="glass rounded-2xl p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-subtle">التقدم</span>
          <span className="text-xs font-bold text-primary">{Math.round((unlocked / achievements.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(unlocked / achievements.length) * 100}%` }} transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((badge, i) => {
          const Icon = ICON_MAP[badge.icon] || Trophy;
          const isUnlocked = !!badge.unlockedAt;
          return (
            <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
              className={cn(
                'glass rounded-2xl p-4 text-center relative overflow-hidden transition-all',
                isUnlocked ? 'border-2 border-amber-400/30' : 'opacity-60'
              )}>
              {isUnlocked && <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
              <div className={cn(
                'w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2',
                isUnlocked ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-400/20' : 'bg-bg-secondary'
              )}>
                {isUnlocked ? <Icon className="h-6 w-6 text-white" /> : <Lock className="h-5 w-5 text-text-muted" />}
              </div>
              <p className="text-[11px] font-bold text-text-main">{badge.title}</p>
              <p className="text-[9px] text-text-subtle mt-0.5">{badge.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
