'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ARTICLES } from '@/data/seedData';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { shuffleArray } from '@/lib/utils';
import type { CategorySlug } from '@/types';

export function PersonalizedSuggestions() {
  const { viewedArticles } = useStore();

  const suggestions = useMemo(() => {
    if (viewedArticles.length > 0) {
      // Get categories the user has viewed
      const viewedCats = new Set<CategorySlug>();
      viewedArticles.forEach((id) => {
        const article = ARTICLES.find((a) => a.id === id);
        if (article) viewedCats.add(article.category);
      });

      // Find articles matching those categories that user hasn't viewed
      const matched = ARTICLES.filter(
        (a) => viewedCats.has(a.category) && !viewedArticles.includes(a.id)
      );

      if (matched.length > 0) {
        return shuffleArray(matched).slice(0, 6);
      }
    }

    // Fallback: show random featured articles
    const featured = ARTICLES.filter((a) => a.isFeatured);
    return shuffleArray(featured).slice(0, 6);
  }, [viewedArticles]);

  if (suggestions.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-10"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary/15 flex items-center justify-center">
          <Sparkles className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold text-text-main">
            مقترحات لكِ
          </h2>
          <p className="text-xs text-text-subtle">
            {viewedArticles.length > 0
              ? 'بناءً على اهتماماتك'
              : 'مقالات مميزة ننصحك بقراءتها'}
          </p>
        </div>
      </div>

      {/* Horizontal scroll of ArticleCards */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
        {suggestions.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="min-w-[280px] sm:min-w-[300px] flex-shrink-0 snap-start"
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
