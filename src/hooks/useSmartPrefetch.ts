'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';

export function useSmartPrefetch() {
  const { watchProgress, favorites } = useStore();
  const prefetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Prefetch series that user is likely to navigate to
    const seriesToPrefetch = new Set<string>();

    // 1. Series in continue watching
    watchProgress.slice(0, 5).forEach(p => seriesToPrefetch.add(p.seriesId));

    // 2. Favorite series
    favorites.slice(0, 5).forEach(id => seriesToPrefetch.add(id));

    // Prefetch thumbnails and backdrops
    seriesToPrefetch.forEach(id => {
      if (prefetchedRef.current.has(id)) return;
      prefetchedRef.current.add(id);
      const series = ALL_SERIES.find(s => s.id === id);
      if (series) {
        // Prefetch images using link preload
        [series.thumbnail, series.backdrop].forEach(url => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'image';
          link.href = url;
          document.head.appendChild(link);
        });
      }
    });
  }, [watchProgress.length, favorites.length]);
}
