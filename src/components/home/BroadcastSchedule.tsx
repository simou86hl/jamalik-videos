'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Play, Bell, BellRing } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const SCHEDULE_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const SCHEDULE_TIMES = ['7:00 م', '8:00 م', '8:30 م', '9:00 م', '9:30 م', '10:00 م'];

function getNextEpisodeInfo(index: number): { day: string; time: string } {
  return {
    day: SCHEDULE_DAYS[index % SCHEDULE_DAYS.length],
    time: SCHEDULE_TIMES[index % SCHEDULE_TIMES.length],
  };
}

export function BroadcastSchedule() {
  const { selectSeries, toggleBroadcastReminder, isBroadcastReminder } = useStore();
  const ongoingSeries = ALL_SERIES.filter((s) => s.status === 'مستمر');

  if (ongoingSeries.length === 0) return null;

  return (
    <section className="py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-cyan-500" />
          </div>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">
            جدول البث
          </h2>
          <span className="text-xs text-text-subtle">({ongoingSeries.length})</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {ongoingSeries.map((series, idx) => {
          const { day, time } = getNextEpisodeInfo(idx);
          const latestSeason = series.seasons[series.seasons.length - 1];
          const nextEpisodeNum = latestSeason
            ? latestSeason.episodes.length + 1
            : 1;
          const hasReminder = isBroadcastReminder(series.id);

          return (
            <motion.button
              key={series.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => selectSeries(series)}
              className="flex-shrink-0 w-[200px] sm:w-[220px] rounded-2xl glass overflow-hidden cursor-pointer group relative"
            >
              {/* Bell reminder button - top-left */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBroadcastReminder(series.id);
                }}
                className={cn(
                  'absolute top-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer',
                  hasReminder
                    ? 'bg-primary/20 text-primary'
                    : 'bg-black/30 text-text-subtle hover:text-primary'
                )}
                aria-label={hasReminder ? 'إزالة التذكير' : 'تفعيل التذكير'}
              >
                {hasReminder ? (
                  <BellRing className="h-3.5 w-3.5" />
                ) : (
                  <Bell className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Reminder badge */}
              {hasReminder && (
                <span className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded-full bg-primary/90 text-white text-[7px] font-bold">
                  تذكير مفعل
                </span>
              )}

              <div className="flex items-center gap-3 p-3">
                {/* Thumbnail */}
                <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${series.thumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Play className="h-3 w-3 text-white fill-white mr-[-1px]" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-right">
                  <h3 className="text-[11px] font-bold text-text-main truncate mb-1">
                    {series.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[9px] text-text-subtle mb-1">
                    <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
                    <span>الحلقة القادمة: يوم {day}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-accent">
                    <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                    <span>{time}</span>
                  </div>
                  <span className="inline-block mt-1 px-1.5 py-px rounded-full text-[7px] font-bold text-white bg-success/80">
                    الحلقة {nextEpisodeNum}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
