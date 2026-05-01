'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { ALL_SERIES } from '@/data/seriesData';
import { SeriesCard } from '@/components/shared/SeriesCard';

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
  const sorted = [...ALL_SERIES].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section className="py-6">
      <div className="flex items-center gap-2 mb-4">
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
        {sorted.map((series) => (
          <motion.div key={series.id} variants={itemVariants}>
            <SeriesCard series={series} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
