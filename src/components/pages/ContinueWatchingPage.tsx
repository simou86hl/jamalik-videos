'use client';

import { motion } from 'framer-motion';
import { Clock, Play, Film } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';

export function ContinueWatchingPage() {
  const { getContinueWatching, selectSeries } = useStore();
  const progressList = getContinueWatching();

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <Clock className="h-5 w-5 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-main">
          تابع المشاهدة
        </h1>
        <span className="text-sm text-text-subtle">({progressList.length})</span>
      </motion.div>

      {progressList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Film className="h-16 w-16 text-text-subtle/30 mb-4" />
          <p className="text-text-subtle text-sm">لا توجد مشاهدات سابقة</p>
          <p className="text-text-subtle/60 text-xs mt-1">ابدأ بمشاهدة مسلسل وسيظهر هنا</p>
        </div>
      ) : (
        <div className="space-y-3">
          {progressList.map((progress) => {
            const series = ALL_SERIES.find((s) => s.id === progress.seriesId);
            if (!series) return null;

            const season = series.seasons.find((s) => s.number === progress.seasonNumber);
            const episode = season?.episodes.find((e) => e.number === progress.episodeNumber);
            const progressPercent = Math.min(100, (progress.timestamp / 2700) * 100);

            return (
              <motion.button
                key={`${progress.seriesId}-${progress.seasonNumber}-${progress.episodeNumber}`}
                onClick={() => selectSeries(series)}
                className="w-full glass rounded-2xl overflow-hidden flex items-center gap-4 p-3 cursor-pointer card-hover group text-right"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${episode?.thumbnail || series.thumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Play className="h-3 w-3 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-text-main line-clamp-1">{series.title}</h3>
                  <p className="text-[11px] text-text-subtle mt-0.5">
                    الموسم {progress.seasonNumber} - الحلقة {progress.episodeNumber}
                    {episode && <span className="mr-2">({episode.duration})</span>}
                  </p>
                  {/* Progress bar */}
                  <div className="w-full max-w-xs h-1.5 bg-border rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex-shrink-0">
                  <span className="btn-primary text-[10px] px-3 py-1.5 flex items-center gap-1">
                    <Play className="h-3 w-3 fill-white" />
                    تابع
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
