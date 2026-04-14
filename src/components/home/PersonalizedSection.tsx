'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye } from 'lucide-react';
import { ARTICLES } from '@/data/seedData';
import { useStore } from '@/store/useStore';
import { ArticleCard } from '@/components/cards/ArticleCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] },
  },
};

export function PersonalizedSection() {
  const viewedArticles = useStore((s) => s.viewedArticles);

  const recommended = useMemo(() => {
    if (viewedArticles.length > 0) {
      const viewed = ARTICLES.filter((a) => viewedArticles.includes(a.id));
      const viewedCategories = [...new Set(viewed.map((a) => a.category))];
      const sameCategoryArticles = ARTICLES.filter(
        (a) =>
          viewedCategories.includes(a.category) &&
          !viewedArticles.includes(a.id)
      );
      if (sameCategoryArticles.length > 0) {
        return sameCategoryArticles.slice(0, 6);
      }
    }
    return ARTICLES.filter((a) => a.isFeatured).slice(0, 6);
  }, [viewedArticles]);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="py-8"
    >
      {/* Section header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="glass-strong rounded-2xl px-5 py-4 inline-flex items-center gap-3 gradient-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">
              <span className="text-gradient">مقترحات لكِ</span>
            </h2>
            <p className="text-text-subtle text-xs">
              {viewedArticles.length > 0
                ? 'بناءً على اهتماماتك'
                : 'مقالات مميزة ننصحك بها'}
            </p>
          </div>
        </div>
      </motion.div>

      {recommended.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="glass-subtle rounded-2xl p-8 text-center"
        >
          <Eye className="h-10 w-10 text-text-subtle/40 mx-auto mb-3" />
          <p className="text-text-subtle text-sm">
            تصفحي المقالات لتحصل على اقتراحات مخصصة
          </p>
        </motion.div>
      ) : (
        <>
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 sm:hidden">
            {recommended.map((article) => (
              <motion.div
                key={article.id}
                variants={itemVariants}
                className="min-w-[280px] flex-shrink-0"
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>

          {/* Desktop: grid */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {recommended.map((article) => (
              <motion.div key={article.id} variants={itemVariants}>
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.section>
  );
}
