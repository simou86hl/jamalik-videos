'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function SearchBar() {
  const { toggleSearch } = useStore();
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={toggleSearch}
        className={cn(
          'w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300',
          focused
            ? 'glass-strong border-primary/30'
            : 'glass-subtle border border-border/30 hover:border-primary/20'
        )}
      >
        <Search className="h-4 w-4 text-text-subtle flex-shrink-0" />
        <span className="text-sm text-text-subtle">ابحث عن مسلسل...</span>
      </motion.button>
    </div>
  );
}
