'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function FontSizeControl() {
  const { fontSize, setFontSize } = useStore();

  const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  const labels: Record<string, string> = { small: 'ص', medium: 'م', large: 'ك' };
  const textSizes: Record<string, string> = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };

  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-text-subtle/60 ml-1">الخط:</span>
      {sizes.map((size) => (
        <motion.button
          key={size}
          whileTap={{ scale: 0.9 }}
          onClick={() => setFontSize(size)}
          className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer',
            fontSize === size
              ? 'bg-gradient-primary text-white shadow-[var(--shadow-sm)]'
              : 'glass-subtle text-text-subtle hover:text-primary'
          )}
          type="button"
          aria-label={`حجم الخط: ${labels[size]}`}
        >
          <span className={cn('font-bold', textSizes[size])}>{labels[size]}</span>
        </motion.button>
      ))}
    </div>
  );
}
