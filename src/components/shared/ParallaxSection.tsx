'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  className?: string;
  height?: string;
}

export function ParallaxSection({
  children,
  backgroundImage,
  className,
  height = 'h-48 sm:h-64',
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const bg = bgRef.current;
      if (!section || !bg) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate parallax when section is in view
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollProgress =
          (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = (scrollProgress - 0.5) * 60; // 60px parallax range
        bg.style.transform = `translateY(${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6 }}
      ref={sectionRef}
      className={cn('relative overflow-hidden my-8', height, className)}
    >
      {/* Parallax background */}
      {backgroundImage && (
        <>
          <div
            ref={bgRef}
            className="absolute inset-[-60px_0] bg-cover bg-center transition-transform duration-100 will-change-transform"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/80 to-bg" />
        </>
      )}

      {/* Decorative blobs if no background */}
      {!backgroundImage && (
        <>
          <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-primary/5 blob-1 pointer-events-none" />
          <div className="absolute bottom-4 left-12 w-20 h-20 rounded-full bg-secondary/5 blob-2 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-accent/3 blob-1 pointer-events-none" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        {children}
      </div>
    </motion.div>
  );
}
