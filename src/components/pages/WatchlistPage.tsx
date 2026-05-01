'use client';

import { motion } from 'framer-motion';
import { Bookmark, X, Play, Film, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';
import { getRelativeTime } from '@/lib/utils';

export function WatchlistPage() {
  const { watchlist, removeFromWatchlist, selectSeries } = useStore();

  const sortedWatchlist = [...watchlist].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );

  const handleItemClick = (item: typeof watchlist[0]) => {
    const series = ALL_SERIES.find((s) => s.id === item.seriesId);
    if (series) {
      selectSeries(series);
    }
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bookmark className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-main">
            قائمة المشاهدة
          </h1>
          <p className="text-xs text-text-subtle">
            {sortedWatchlist.length > 0
              ? `${sortedWatchlist.length} حلقة`
              : 'لا توجد حلقات محفوظة'}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {sortedWatchlist.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
            <Bookmark className="h-8 w-8 text-text-subtle/30" />
          </div>
          <p className="text-text-subtle text-sm font-medium mb-1">لم تضف أي حلقات بعد</p>
          <p className="text-text-subtle/60 text-xs">أضف حلقات إلى قائمة المشاهدة لتعود إليها لاحقاً</p>
        </motion.div>
      )}

      {/* Watchlist Items */}
      {sortedWatchlist.length > 0 && (
        <div className="space-y-3">
          {sortedWatchlist.map((item, idx) => (
            <motion.div
              key={`${item.seriesId}-${item.seasonNumber}-${item.episodeNumber}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="glass rounded-xl overflow-hidden group"
            >
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.seriesThumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-text-main truncate mb-0.5">
                    {item.seriesTitle}
                  </h3>
                  <p className="text-xs text-text-subtle truncate">
                    الموسم {item.seasonNumber} - {item.episodeTitle}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-text-subtle/60">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{getRelativeTime(item.addedAt)}</span>
                  </div>
                </div>

                {/* Remove Button */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(item.seriesId, item.seasonNumber, item.episodeNumber);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-subtle/40 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer flex-shrink-0"
                  aria-label="إزالة من القائمة"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
