'use client';

import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';

export function ContinueWatching() {
  const { getContinueWatching, selectSeries } = useStore();
  const progressList = getContinueWatching();

  if (progressList.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main">
          تابع المشاهدة
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {progressList.slice(0, 10).map((progress, idx) => {
          const series = ALL_SERIES.find((s) => s.id === progress.seriesId);
          if (!series) return null;

          const season = series.seasons.find((s) => s.number === progress.seasonNumber);
          const episode = season?.episodes.find((e) => e.number === progress.episodeNumber);

          return (
            <motion.button
              key={`${progress.seriesId}-${progress.seasonNumber}-${progress.episodeNumber}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              onClick={() => selectSeries(series)}
              className="flex-shrink-0 w-[180px] sm:w-[200px] glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative h-[100px] bg-card overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${episode?.thumbnail || series.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-bold text-text-main line-clamp-1 mb-1">
                  {series.title}
                </p>
                <p className="text-[10px] text-text-subtle mb-2">
                  الموسم {progress.seasonNumber} - الحلقة {progress.episodeNumber}
                </p>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (progress.timestamp / 2700) * 100)}%` }}
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
