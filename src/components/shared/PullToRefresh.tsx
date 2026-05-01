'use client';

import { useState, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => void;
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const THRESHOLD = 70;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 5) return;
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 5) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) {
      const resistance = diff > THRESHOLD ? THRESHOLD + (diff - THRESHOLD) * 0.2 : diff;
      setPullDistance(Math.min(resistance, 120));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(0);
      if (onRefresh) onRefresh();
      setTimeout(() => setIsRefreshing(false), 1200);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <div className="flex justify-center overflow-hidden" style={{ height: pullDistance }}>
        <motion.div
          animate={{ rotate: pullDistance > 30 ? 360 : 0 }}
          transition={{ repeat: pullDistance >= THRESHOLD ? Infinity : 0, duration: 1 }}
          className="mt-2"
        >
          <RefreshCw className="h-5 w-5 text-primary" />
        </motion.div>
      </div>

      {/* Refreshing indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 40 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            >
              <RefreshCw className="h-4 w-4 text-primary" />
            </motion.div>
            <span className="text-xs text-text-subtle">جاري التحديث...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}
