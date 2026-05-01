'use client';

import { motion } from 'framer-motion';
import { Star, Play, TrendingUp } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function FeaturedSeries() {
  const { selectSeries } = useStore();
  const featured = ALL_SERIES.filter((s) => s.isFeatured);

  if (featured.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main">
          مسلسلات مميزة
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {featured.map((series) => (
          <motion.button
            key={series.id}
            variants={itemVariants}
            onClick={() => selectSeries(series)}
            className="flex-shrink-0 w-[160px] sm:w-[180px] glass rounded-2xl overflow-hidden card-hover-lift cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="relative h-[220px] sm:h-[250px] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${series.thumbnail})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold text-white',
                  series.status === 'مستمر' ? 'bg-success' : 'bg-primary'
                )}>
                  {series.status}
                </span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                  <Play className="h-5 w-5 text-white fill-white" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
                  {series.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    <span className="text-[10px] font-bold text-white">{series.rating.average}</span>
                  </div>
                  <span className="text-[10px] text-white/70">{series.year}</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
