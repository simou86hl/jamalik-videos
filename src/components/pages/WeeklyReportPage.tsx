'use client';
import { motion } from 'framer-motion';
import { CalendarDays, TrendingUp, Clock, BarChart3, Eye, Star, Tv } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';
import { cn } from '@/lib/utils';

export function WeeklyReportPage() {
  const { watchProgress } = useStore();

  // Filter to this week (last 7 days)
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyProgress = watchProgress.filter(p => new Date(p.lastWatched) >= weekAgo);

  const weeklyEpisodes = weeklyProgress.length;
  const weeklySeries = new Set(weeklyProgress.map(p => p.seriesId)).size;

  // Daily breakdown
  const dailyCounts: Record<string, number> = {};
  const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const dayName = DAYS[d.getDay()];
    dailyCounts[dayName] = weeklyProgress.filter(p => {
      const pd = new Date(p.lastWatched);
      return pd.toDateString() === d.toDateString();
    }).length;
  }
  const maxDaily = Math.max(...Object.values(dailyCounts), 1);

  // Top series this week
  const seriesCounts: Record<string, number> = {};
  weeklyProgress.forEach(p => { seriesCounts[p.seriesId] = (seriesCounts[p.seriesId] || 0) + 1; });
  const topWeeklySeries = Object.entries(seriesCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="pt-4 pb-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <CalendarDays className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-main">التقرير الأسبوعي</h1>
        </div>
        <p className="text-sm text-text-subtle mr-10">ملخص مشاهدتك خلال الأسبوع</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { icon: Eye, label: 'حلقات', value: weeklyEpisodes, color: 'text-blue-500' },
          { icon: Tv, label: 'مسلسل', value: weeklySeries, color: 'text-rose-500' },
          { icon: Clock, label: 'دقيقة تقريباً', value: weeklyEpisodes * 42, color: 'text-emerald-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-3 text-center">
            <s.icon className={cn('h-5 w-5 mx-auto mb-1', s.color)} />
            <p className="text-lg font-bold text-text-main">{s.value}</p>
            <p className="text-[9px] text-text-subtle">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Daily Chart */}
      <div className="glass rounded-2xl p-4 mb-4">
        <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-violet-500" /> النشاط اليومي
        </h3>
        <div className="flex items-end justify-between gap-1 h-32">
          {DAYS.map((day, i) => {
            const count = dailyCounts[day] || 0;
            const pct = (count / maxDaily) * 100;
            return (
              <div key={day} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[8px] text-text-subtle">{count}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(pct, 4)}%` }} transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={cn('w-full rounded-t-md min-h-[4px]', count > 0 ? 'bg-gradient-to-t from-violet-500 to-purple-400' : 'bg-bg-secondary')} />
                <span className="text-[8px] text-text-subtle">{day.slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Series This Week */}
      {topWeeklySeries.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-500" /> الأكثر مشاهدة هذا الأسبوع
          </h3>
          <div className="space-y-2">
            {topWeeklySeries.map(([id, count], i) => {
              const s = ALL_SERIES.find(sr => sr.id === id);
              if (!s) return null;
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text-muted w-4">#{i + 1}</span>
                  <div className="w-8 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${s.thumbnail})` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text-main truncate">{s.title}</p>
                    <p className="text-[9px] text-text-subtle">{count} حلقات</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weeklyEpisodes === 0 && (
        <div className="text-center py-12">
          <CalendarDays className="h-12 w-12 text-text-subtle/30 mx-auto mb-3" />
          <p className="text-sm text-text-subtle">لا توجد مشاهدات هذا الأسبوع</p>
          <p className="text-[10px] text-text-muted mt-1">ابدأ المشاهدة وعد الأسبوع القادم!</p>
        </div>
      )}
    </div>
  );
}
