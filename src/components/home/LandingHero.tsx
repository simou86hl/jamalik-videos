'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Info } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function LandingHero() {
  const { navigateTo } = useStore();

  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl my-6">
      {/* Parallax background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      <div className="absolute inset-0 pattern-dots opacity-[0.05] pointer-events-none" />

      {/* Animated floating decorative elements */}
      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] left-[10%] w-24 h-24 bg-primary/10 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [10, -20, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[15%] right-[10%] w-32 h-32 bg-secondary/10 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[30%] right-[20%] w-16 h-16 bg-accent/15 rounded-full blur-xl"
      />

      {/* Floating sparkles */}
      <motion.div
        animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
        className="absolute top-[20%] right-[30%]"
      >
        <Sparkles className="h-5 w-5 text-primary/40" />
      </motion.div>
      <motion.div
        animate={{ y: [6, -12, 6], opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-[25%] left-[25%]"
      >
        <Sparkles className="h-4 w-4 text-secondary/40" />
      </motion.div>
      <motion.div
        animate={{ y: [-6, 10, -6], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute top-[50%] left-[15%]"
      >
        <Sparkles className="h-3 w-3 text-accent/40" />
      </motion.div>

      {/* Gradient blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-10 py-16">
        {/* Sparkle icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mx-auto mb-8 shadow-[var(--shadow-glow)]"
        >
          <Sparkles className="h-10 w-10 text-white" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold mb-4 leading-tight"
        >
          <span className="text-gradient">جمالكِ</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-text-subtle text-base sm:text-lg lg:text-xl max-w-lg mx-auto mb-10 leading-relaxed"
        >
          موقعك الشامل للجمال والعناية
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigateTo('home')}
            className="btn-primary glow-primary-hover text-sm sm:text-base px-8 py-3 flex items-center gap-2 cursor-pointer"
          >
            ابدئي التصفح
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateTo('about')}
            className="btn-outline text-sm sm:text-base px-8 py-3 flex items-center gap-2 cursor-pointer"
          >
            تعرفي علينا
            <Info className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-primary/30 mx-auto flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
