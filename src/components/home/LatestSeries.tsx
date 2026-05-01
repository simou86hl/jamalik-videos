'use client';

import { motion } from 'framer-motion';
import { Play, Star, Clock } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { CATEGORIES } from '@/lib/constants';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function LatestSeries() {
  const { selectSeries } = useStore();
  const sorted = [...ALL_SERIES].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main">
          أحدث المسلسلات
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {sorted.map((series) => {
          const cat = CATEGORIES.find((c) => c.slug === series.category);

          return (
            <motion.button
              key={series.id}
              variants={itemVariants}
              onClick={() => selectSeries(series)}
              className="glass rounded-2xl overflow-hidden card-hover-lift cursor-pointer group text-right"
            >
              {/* Thumbnail */}
              <div className="relative h-[200px] sm:h-[240px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${series.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded-full glass text-[10px] font-bold text-white">
                    {cat?.name}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold text-white',
                    series.status === 'مستمر' ? 'bg-success/90' : 'bg-primary/90'
                  )}>
                    {series.status}
                  </span>
                </div>

                {/* Play Icon */}
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
          );
        })}
      </motion.div>
    </section>
  );
}
