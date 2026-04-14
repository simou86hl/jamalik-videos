'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, X, Video } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] },
  },
};

const VIDEOS = [
  {
    id: 'vid-1',
    title: 'روتين العناية بالبشرة خطوة بخطوة',
    thumbnail: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=400&fit=crop',
    duration: '12:30',
  },
  {
    id: 'vid-2',
    title: 'تسريحات سهرة في 5 دقائق',
    thumbnail: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&h=400&fit=crop',
    duration: '5:45',
  },
  {
    id: 'vid-3',
    title: 'وصفات ماسكات طبيعية من المطبخ',
    thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop',
    duration: '8:20',
  },
  {
    id: 'vid-4',
    title: 'تمارين يوغا للاسترخاء والمرونة',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
    duration: '15:00',
  },
];

export function VideoSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="py-8"
    >
      {/* Section header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center shadow-md shadow-rose-500/20">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main">
              فيديوهات <span className="text-gradient">تعليمية</span>
            </h2>
            <p className="text-text-subtle text-xs">تعلّمي خطوة بخطوة</p>
          </div>
        </div>
      </motion.div>

      {/* Video cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {VIDEOS.map((video) => (
          <motion.div
            key={video.id}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => setShowModal(true)}
            className="cursor-pointer group"
          >
            <div className="glass-strong rounded-2xl overflow-hidden card-hover gradient-border relative">
              {/* Thumbnail */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-full glass-strong flex items-center justify-center shadow-[var(--shadow-xl)] group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                  >
                    <Play className="h-6 w-6 text-white mr-[-2px]" fill="white" />
                  </motion.div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 left-2 glass-strong rounded-lg px-2 py-1 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-white/80" />
                  <span className="text-[11px] text-white font-medium">{video.duration}</span>
                </div>
              </div>

              {/* Title */}
              <div className="p-3.5">
                <h3 className="font-heading font-bold text-text-main text-sm leading-relaxed line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {video.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coming soon modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong gradient-border rounded-2xl p-8 max-w-sm w-full text-center relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 left-3 w-8 h-8 rounded-full glass-subtle flex items-center justify-center text-text-subtle hover:text-text-main transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-glow)]">
                <Video className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-heading font-bold text-text-main text-lg mb-2">
                قريباً
              </h3>
              <p className="text-text-subtle text-sm leading-relaxed">
                فيديو تعليمي قادم قريباً. تابعينا لمعرفة آخر التحديثات!
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="btn-primary text-sm px-6 py-2.5 mt-5 cursor-pointer"
              >
                حسناً
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
