'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Play, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';
import { CATEGORIES } from '@/lib/constants';

export function SearchModal() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery, selectSeries } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const [localQuery, setLocalQuery] = useState('');

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useCallback(
    (q: string) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => setSearchQuery(q), 300);
    },
    [setSearchQuery]
  );

  const handleInputChange = (value: string) => {
    setLocalQuery(value);
    debouncedSearch(value);
  };

  const results = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || q.length < 2) return [];
    return ALL_SERIES.filter((s) => {
      const searchFields = [
        s.title,
        s.description,
        s.director,
        ...s.cast,
        ...s.tags,
      ].join(' ').toLowerCase();
      return searchFields.includes(q);
    }).slice(0, 10);
  }, [searchQuery]);

  const handleResultClick = (seriesId: string) => {
    const series = ALL_SERIES.find((s) => s.id === seriesId);
    if (series) selectSeries(series);
    setLocalQuery('');
    setSearchQuery('');
    closeSearch();
  };

  const handleBackdropClick = () => {
    setLocalQuery('');
    setSearchQuery('');
    closeSearch();
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-start justify-center pt-20 sm:pt-28 px-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleBackdropClick} />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="relative w-full max-w-xl glass-strong rounded-2xl shadow-[var(--shadow-xl)] overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border/30">
            <Search className="h-5 w-5 text-text-subtle flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => inputRef.current?.focus()}
              placeholder="ابحث عن مسلسل، ممثل، أو مخرج..."
              className="flex-1 bg-transparent text-text-main placeholder:text-text-subtle text-sm outline-none font-body"
              dir="rtl"
              autoFocus
            />
            {localQuery && (
              <button
                onClick={handleClear}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-border/30 transition-colors cursor-pointer"
              >
                <X className="h-3 w-3 text-text-subtle" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {searchQuery.length < 2 ? (
              <div className="p-8 text-center">
                <Search className="h-10 w-10 text-text-subtle/30 mx-auto mb-3" />
                <p className="text-sm text-text-subtle">اكتب على الأقل حرفين للبحث</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-text-subtle">لا توجد نتائج لـ &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {results.map((series) => {
                  const cat = CATEGORIES.find((c) => c.slug === series.category);
                  return (
                    <motion.button
                      key={series.id}
                      onClick={() => handleResultClick(series.id)}
                      className="flex items-center gap-3 p-3 w-full hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <div className="relative w-14 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${series.thumbnail})` }}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-4 w-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <h3 className="text-sm font-bold text-text-main line-clamp-1">{series.title}</h3>
                        <p className="text-[11px] text-text-subtle line-clamp-1 mt-0.5">{series.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            {cat?.name}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-accent fill-accent" />
                            <span className="text-[10px] font-bold text-text-secondary">{series.rating.average}</span>
                          </div>
                          <span className="text-[10px] text-text-subtle">{series.year}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
