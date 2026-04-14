'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Sun, Moon, BookOpen } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface ReadingModeOverlayProps {
  children: ReactNode;
}

export function ReadingModeOverlay({ children }: ReadingModeOverlayProps) {
  const { isReadingMode, toggleReadingMode, fontSize, setFontSize } = useStore();
  const [progress, setProgress] = useState(0);
  const [isDarkReading, setIsDarkReading] = useState(false);
  const fontSizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  const getCustomFontSize = (size: 'small' | 'medium' | 'large') =>
    size === 'small' ? 16 : size === 'large' ? 22 : 18;
  const [customFontSize, setCustomFontSize] = useState(getCustomFontSize(fontSize));
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const totalScrollable = scrollHeight - clientHeight;
    setProgress(totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isReadingMode]);

  useEffect(() => {
    if (isReadingMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isReadingMode]);

  const increaseFont = () => {
    const next = Math.min(customFontSize + 2, 28);
    setCustomFontSize(next);
  };

  const decreaseFont = () => {
    const next = Math.max(customFontSize - 2, 14);
    setCustomFontSize(next);
  };

  return (
    <AnimatePresence>
      {isReadingMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col"
          style={{
            backgroundColor: isDarkReading ? '#1a1a2e' : '#fdf8f4',
            color: isDarkReading ? '#e8eaf6' : '#1a1a2e',
          }}
        >
          {/* Progress bar */}
          <div className="fixed top-0 left-0 right-0 z-[61] h-1 bg-border/30">
            <motion.div
              className="h-full bg-gradient-primary"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Top toolbar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b"
            style={{ borderColor: isDarkReading ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
          >
            {/* Right: close + title */}
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleReadingMode}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  backgroundColor: isDarkReading ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <X className="h-4 w-4" />
              </motion.button>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 opacity-50" />
                <span className="text-sm font-medium opacity-70">وضع القراءة</span>
              </div>
            </div>

            {/* Left: controls */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDarkReading(!isDarkReading)}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  backgroundColor: isDarkReading ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }}
                aria-label={isDarkReading ? 'وضع فاتح' : 'وضع داكن'}
                type="button"
              >
                {isDarkReading ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.button>

              {/* Divider */}
              <div className="w-px h-5 opacity-15" />

              {/* Font size controls */}
              <div className="flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={decreaseFont}
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors text-xs"
                  style={{
                    backgroundColor: isDarkReading ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  }}
                  type="button"
                >
                  <Minus className="h-3.5 w-3.5" />
                </motion.button>
                <span className="text-[11px] font-medium w-8 text-center opacity-50">
                  {customFontSize}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={increaseFont}
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors text-xs"
                  style={{
                    backgroundColor: isDarkReading ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  }}
                  type="button"
                >
                  <Plus className="h-3.5 w-3.5" />
                </motion.button>
              </div>

              {/* Divider */}
              <div className="w-px h-5 opacity-15" />

              {/* Font size preset buttons */}
              <div className="hidden sm:flex items-center gap-1">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all',
                      fontSize === size
                        ? 'bg-gradient-primary text-white'
                        : 'opacity-40 hover:opacity-70'
                    )}
                    style={
                      fontSize !== size
                        ? { backgroundColor: isDarkReading ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }
                        : {}
                    }
                    type="button"
                  >
                    {size === 'small' ? 'صغير' : size === 'medium' ? 'متوسط' : 'كبير'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content area - scrollable */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto"
          >
            <div
              className="max-w-[680px] mx-auto px-6 sm:px-8 py-8"
              style={{
                fontSize: `${customFontSize}px`,
                lineHeight: '2',
                fontFamily: "'Tajawal', 'Cairo', Georgia, serif",
              }}
            >
              {children}
            </div>
          </div>

          {/* Bottom progress indicator */}
          <div className="px-6 py-3 text-center border-t"
            style={{ borderColor: isDarkReading ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
          >
            <span className="text-xs opacity-40">
              {Math.round(progress)}% تمت القراءة
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
