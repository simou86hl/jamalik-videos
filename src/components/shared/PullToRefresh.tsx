'use client';

import { useState, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => void;
}

const PULL_THRESHOLD = 60;

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only trigger if scrolled to top
    if (window.scrollY <= 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    if (window.scrollY > 0) {
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, currentY - startY.current);
    // Add resistance after threshold
    const damped = diff > PULL_THRESHOLD
      ? PULL_THRESHOLD + (diff - PULL_THRESHOLD) * 0.3
      : diff;
    setPullDistance(Math.min(damped, 120));
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      if (onRefresh) onRefresh();
      // Show refreshing state for 1 second
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1000);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, isRefreshing, onRefresh]);

  const rotation = Math.min(pullDistance / PULL_THRESHOLD, 1) * 360;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Pull indicator */}
      <div className="flex justify-center overflow-hidden" style={{ height: isRefreshing ? 48 : pullDistance }}>
        <AnimatePresence mode="wait">
          {isRefreshing ? (
            <motion.div
              key="refreshing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-2"
            >
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <span className="text-xs text-text-subtle mt-1">جاري التحديث...</span>
            </motion.div>
          ) : pullDistance > 5 ? (
            <motion.div
              key="pulling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-2"
            >
              <RefreshCw
                className="h-5 w-5 text-text-subtle transition-transform"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {children}
    </div>
  );
}
