'use client';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Heart, Star, Tv, Trophy, Flame, Eye } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function ProfilePage() {
  const { watchProgress, favorites, userRatings, categoryViews } = useStore();

  // Calculate stats
  const uniqueSeries = new Set(watchProgress.map(p => p.seriesId)).size;
  const totalEpisodesWatched = watchProgress.length;
  const totalRatings = Object.keys(userRatings).length;
  const topCategory = Object.entries(categoryViews).sort((a, b) => b[1] - a[1])[0];
  const topCategoryName = topCategory ? CATEGORIES.find(c => c.slug === topCategory[0])?.name : 'لم يحدد بعد';
  const avgRating = totalRatings > 0 ? (Object.values(userRatings).reduce((a, b) => a + b, 0) / totalRatings).toFixed(1) : '0';

  // Find most watched series
  const seriesWatchCounts: Record<string, number> = {};
  watchProgress.forEach(p => { seriesWatchCounts[p.seriesId] = (seriesWatchCounts[p.seriesId] || 0) + 1; });
  const mostWatched = Object.entries(seriesWatchCounts).sort((a, b) => b[1] - a[1])[0];
  const mostWatchedSeries = mostWatched ? ALL_SERIES.find(s => s.id === mostWatched[0]) : null;

  const stats = [
    { icon: Tv, label: 'مسلسل شاهدته', value: uniqueSeries, color: 'from-rose-500 to-pink-500', textColor: 'text-rose-500' },
    { icon: Eye, label: 'حلقة شاهدتها', value: totalEpisodesWatched, color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-500' },
    { icon: Heart, label: 'مسلسل مفضل', value: favorites.length, color: 'from-pink-500 to-rose-500', textColor: 'text-pink-500' },
    { icon: Star, label: 'تقييمات', value: totalRatings, color: 'from-amber-500 to-orange-500', textColor: 'text-amber-500' },
  ];

  return (
    <div className="pt-4 pb-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-main">ملف المشاهدة</h1>
        </div>
        <p className="text-sm text-text-subtle mr-10">إحصائيات مشاهدتك الشخصية</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4 relative overflow-hidden">
            <div className={cn('absolute top-0 left-0 w-16 h-16 rounded-full bg-gradient-to-br opacity-10 blur-xl', stat.color)} />
            <stat.icon className={cn('h-5 w-5 mb-2', stat.textColor)} />
            <p className="text-2xl font-bold text-text-main">{stat.value}</p>
            <p className="text-[11px] text-text-subtle">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      <div className="glass rounded-2xl p-4 mb-4">
        <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" /> رؤى المشاهدة
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-subtle">التصنيف المفضل</span>
            <span className="text-xs font-bold text-primary">{topCategoryName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-subtle">متوسط التقييم</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-accent fill-accent" />
              <span className="text-xs font-bold text-text-main">{avgRating}</span>
            </div>
          </div>
          {mostWatchedSeries && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-subtle">الأكثر مشاهدة</span>
              <span className="text-xs font-bold text-primary">{mostWatchedSeries.title}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-subtle">مسلسل مكتمل</span>
            <span className="text-xs font-bold text-text-main">
              {watchProgress.filter(p => p.timestamp > 2000).length}
            </span>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      {Object.keys(categoryViews).length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-500" /> توزيع المشاهدة
          </h3>
          <div className="space-y-2">
            {Object.entries(categoryViews).sort((a, b) => b[1] - a[1]).map(([slug, count]) => {
              const cat = CATEGORIES.find(c => c.slug === slug);
              const maxViews = Math.max(...Object.values(categoryViews));
              const pct = Math.round((count / maxViews) * 100);
              return (
                <div key={slug} className="flex items-center gap-2">
                  <span className="text-[10px] text-text-subtle w-16 truncate">{cat?.name}</span>
                  <div className="flex-1 h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full bg-gradient-primary rounded-full" />
                  </div>
                  <span className="text-[10px] text-text-subtle w-6 text-left">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
