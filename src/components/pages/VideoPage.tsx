'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Play, Clock, Eye, ThumbsUp, Filter,
  Sparkles, Palette, ChefHat, Dumbbell, Shirt,
  Scissors, Heart, Leaf, X, TrendingUp, ChevronLeft,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  VIDEOS, VIDEO_CATEGORIES,
  getFeaturedVideos, getVideosByCategory, formatViews,
} from '@/data/videoData';
import type { VideoCategorySlug } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  skincare: Sparkles,
  beauty: Palette,
  cooking: ChefHat,
  fitness: Dumbbell,
  fashion: Shirt,
  haircare: Scissors,
  health: Heart,
  natural: Leaf,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] },
  },
};

export function VideoPage() {
  const { navigateTo, selectCategory } = useStore();
  const [activeCategory, setActiveCategory] = useState<VideoCategorySlug | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const featuredVideos = useMemo(() => getFeaturedVideos(), []);
  const filteredVideos = useMemo(() => getVideosByCategory(activeCategory), [activeCategory]);

  const handleCategoryTap = (slug: VideoCategorySlug) => {
    setActiveCategory((prev) => (prev === slug ? null : slug));
    setShowFilters(false);
  };

  const activeVideo = selectedVideo
    ? VIDEOS.find((v) => v.id === selectedVideo)
    : null;

  return (
    <div className="py-4 sm:py-6">
      {/* ─── Page Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 flex items-center justify-center shadow-[var(--shadow-glow)]">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-main">
                فيديوهات <span className="text-gradient">تعليمية</span>
              </h1>
              <p className="text-text-subtle text-sm">تعلّمي خطوة بخطوة مع أفضل المحتوى</p>
            </div>
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl glass-subtle text-xs font-medium text-text-subtle hover:text-primary transition-colors cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
            تصفية
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 text-xs text-text-subtle">
          <span className="flex items-center gap-1">
            <Video className="h-3.5 w-3.5 text-primary" />
            {VIDEOS.length} فيديو
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
            {featuredVideos.length} مميز
          </span>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="flex items-center gap-1 text-primary font-medium hover:underline cursor-pointer"
            >
              إلغاء التصفية
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </motion.div>

      {/* ─── Category Filters ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        {/* Mobile: Collapsible */}
        <div className="lg:hidden">
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-3"
              >
                <div className="flex flex-wrap gap-2 pb-2">
                  {VIDEO_CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.id];
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryTap(cat.id)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer',
                          activeCategory === cat.id
                            ? 'bg-gradient-primary text-white shadow-sm'
                            : 'glass-subtle text-text-subtle hover:text-primary hover:bg-primary/5'
                        )}
                      >
                        {Icon && <Icon className="h-3.5 w-3.5" />}
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: Horizontal scroll */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {VIDEO_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryTap(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer',
                  activeCategory === cat.id
                    ? 'bg-gradient-primary text-white shadow-[var(--shadow-glow)]'
                    : 'glass-subtle text-text-subtle hover:text-primary hover:bg-primary/5'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center',
                  activeCategory === cat.id ? 'bg-white/20' : 'bg-primary/10'
                )}>
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                </div>
                {cat.name}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ─── Featured Videos Section ─── */}
      {!activeCategory && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={containerVariants}
          className="mb-8"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-heading font-bold text-text-main">
              فيديوهات <span className="text-gradient-warm">مميزة</span>
            </h2>
          </motion.div>

          {/* Featured Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
            {featuredVideos.slice(0, 6).map((video) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => setSelectedVideo(video.id)}
                className="cursor-pointer group flex-shrink-0 sm:flex-shrink w-[280px] sm:w-auto"
              >
                <div className="glass-strong rounded-2xl overflow-hidden card-hover gradient-border relative">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full glass-strong flex items-center justify-center shadow-[var(--shadow-xl)] group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                      >
                        <Play className="h-5 w-5 text-white mr-[-2px]" fill="white" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      <span className="glass-strong rounded-lg px-2 py-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-white/80" />
                        <span className="text-[11px] text-white font-medium">{video.duration}</span>
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-gradient-to-r from-accent to-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                        مميز
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-heading font-bold text-text-main text-sm leading-relaxed line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2 text-text-subtle">
                      <span className="text-[11px] flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatViews(video.views)}
                      </span>
                      <span className="text-[11px]">
                        {VIDEO_CATEGORIES.find((c) => c.id === video.category)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── All Videos Grid ─── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-heading font-bold text-text-main">
            {activeCategory
              ? `${VIDEO_CATEGORIES.find((c) => c.id === activeCategory)?.name}`
              : 'جميع الفيديوهات'}
          </h2>
          <span className="text-text-subtle text-xs bg-primary/10 px-2 py-0.5 rounded-full">
            {filteredVideos.length}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => setSelectedVideo(video.id)}
                className="cursor-pointer group"
              >
                <div className="glass-strong rounded-2xl overflow-hidden card-hover gradient-border relative">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/35 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-11 h-11 rounded-full glass-strong flex items-center justify-center shadow-[var(--shadow-lg)] group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                      >
                        <Play className="h-4.5 w-4.5 text-white mr-[-1px]" fill="white" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      <span className="glass-strong rounded-lg px-2 py-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-white/80" />
                        <span className="text-[11px] text-white font-medium">{video.duration}</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-heading font-bold text-text-main text-sm leading-relaxed line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {video.title}
                    </h3>
                    <p className="text-text-subtle text-xs mt-1 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/30">
                      <div className="flex items-center gap-3 text-text-subtle">
                        <span className="text-[11px] flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViews(video.views)}
                        </span>
                        <span className="text-[11px] flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {formatViews(video.likes)}
                        </span>
                      </div>
                      <span className="text-[10px] text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded-md">
                        {VIDEO_CATEGORIES.find((c) => c.id === video.category)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Video className="h-7 w-7 text-primary/40" />
            </div>
            <p className="text-text-subtle text-sm">لا توجد فيديوهات في هذا القسم حالياً</p>
          </div>
        )}
      </motion.div>

      {/* ─── Video Detail Modal ─── */}
      <AnimatePresence>
        {selectedVideo && activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg sm:rounded-2xl glass-strong gradient-border overflow-hidden relative max-h-[90vh] overflow-y-auto rounded-t-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Thumbnail / Video player placeholder */}
              <div className="relative aspect-video w-full">
                <img
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center shadow-[var(--shadow-xl)]">
                    <Play className="h-7 w-7 text-white mr-[-2px]" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 glass-strong rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-white/80" />
                  <span className="text-xs text-white font-medium">{activeVideo.duration}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-heading font-bold text-text-main text-lg leading-relaxed mb-2">
                  {activeVideo.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {activeVideo.description}
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-text-subtle text-sm">
                    <Eye className="h-4 w-4" />
                    {formatViews(activeVideo.views)} مشاهدة
                  </span>
                  <span className="flex items-center gap-1.5 text-text-subtle text-sm">
                    <ThumbsUp className="h-4 w-4" />
                    {formatViews(activeVideo.likes)} إعجاب
                  </span>
                </div>

                {/* Category badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-lg font-medium">
                    {VIDEO_CATEGORIES.find((c) => c.id === activeVideo.category)?.name}
                  </span>
                </div>

                {/* Coming soon note */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-text-subtle text-xs text-center">
                    سيتم تفعيل تشغيل الفيديو قريباً
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
