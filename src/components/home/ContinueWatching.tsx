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
    <section className="py-5">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">
          تابع المشاهدة
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
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
              className="flex-shrink-0 w-[130px] sm:w-[150px] rounded-2xl overflow-hidden cursor-pointer group relative"
            >
              {/* Thumbnail */}
              <div className="relative h-[185px] sm:h-[210px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${series.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Play className="h-4 w-4 text-white fill-white mr-[-2px]" />
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-[11px] sm:text-xs font-bold text-white line-clamp-1 mb-1">
                    {series.title}
                  </p>
                  <p className="text-[9px] text-white/60 mb-1.5">
                    الموسم {progress.seasonNumber} - الحلقة {progress.episodeNumber}
                  </p>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (progress.timestamp / 2700) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
