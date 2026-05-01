'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import { HERO_SLIDE_INTERVAL_MS } from '@/lib/constants';
import { ALL_SERIES, HERO_SLIDES } from '@/data/seriesData';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const { selectSeries } = useStore();
  const total = HERO_SLIDES.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + total) % total), [total]);

  useEffect(() => {
    const timer = setInterval(next, HERO_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next]);

  const handleWatchNow = (slideId: string) => {
    const series = ALL_SERIES.find((s) => s.id === slideId);
    if (series) selectSeries(series);
  };

  return (
    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden rounded-2xl lg:rounded-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_SLIDES[current].image})` }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 lg:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="max-w-lg"
          >
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 rounded-full glass text-xs font-bold text-white mb-3">
              {HERO_SLIDES[current].category === 'turkish' ? 'تركية' :
               HERO_SLIDES[current].category === 'drama' ? 'دراما' :
               HERO_SLIDES[current].category === 'action' ? 'أكشن' :
               HERO_SLIDES[current].category === 'documentary' ? 'وثائقي' :
               HERO_SLIDES[current].category}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-2 leading-tight">
              {HERO_SLIDES[current].title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/80 mb-4 line-clamp-2">
              {HERO_SLIDES[current].subtitle}
            </p>

            {/* Rating + CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleWatchNow(HERO_SLIDES[current].seriesId)}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Play className="h-4 w-4 fill-white" />
                شاهد الآن
              </button>
              <div className="flex items-center gap-1 glass px-3 py-1.5 rounded-full">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="text-xs font-bold text-white">
                  {ALL_SERIES.find((s) => s.id === HERO_SLIDES[current].seriesId)?.rating.average || '0'}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
        aria-label="السابق"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
        aria-label="التالي"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              'h-2 rounded-full transition-all duration-300 cursor-pointer',
              idx === current
                ? 'w-8 bg-gradient-primary'
                : 'w-2 bg-white/40 hover:bg-white/60'
            )}
            aria-label={`الشريحة ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
