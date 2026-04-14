'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Tv } from 'lucide-react';

interface VideoEmbedProps {
  url: string;
  title?: string;
}

export function VideoEmbed({ url, title = 'فيديو' }: VideoEmbedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract YouTube video ID
  const getYouTubeId = (videoUrl: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getYouTubeId(url);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !videoId) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="glass-strong rounded-2xl p-8 text-center">
        <p className="text-sm text-text-subtle">رابط الفيديو غير صالح</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      ref={containerRef}
      className="my-6"
    >
      <div className="glass-strong rounded-2xl overflow-hidden shadow-lg">
        {/* Responsive 16:9 container */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isLoaded ? 0 : 1 }}
              className="absolute inset-0 bg-card flex items-center justify-center"
            >
              {/* Placeholder with thumbnail */}
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-black/30" />
              {/* Play button */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Play className="h-7 w-7 text-white mr-[-2px]" fill="white" />
              </div>
              {/* YouTube badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 glass rounded-lg px-3 py-1.5">
                <Tv className="h-4 w-4 text-red-500" />
                <span className="text-xs text-white font-medium">{title}</span>
              </div>
            </motion.div>
          )}

          {isVisible && (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-2xl"
              onLoad={() => setIsLoaded(true)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
