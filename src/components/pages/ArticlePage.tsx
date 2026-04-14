'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Heart, Clock, Eye, User, Calendar, BookOpen } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/lib/constants';
import { ARTICLES } from '@/data/seedData';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { CommentSection } from '@/components/shared/CommentSection';
import { RatingStars } from '@/components/shared/RatingStars';
import { ShareButtons } from '@/components/shared/ShareButtons';
import { FontSizeControl } from '@/components/shared/FontSizeControl';
import { PrintButton } from '@/components/shared/PrintButton';
import { ReadingModeOverlay } from '@/components/shared/ReadingModeOverlay';
import { AdBanner } from '@/components/shared/AdBanner';
import { PersonalizedSuggestions } from '@/components/shared/PersonalizedSuggestions';
import { formatDate, getReadingTime, cn } from '@/lib/utils';

export function ArticlePage() {
  const { selectedArticle, goBack, toggleFavorite, isFavorite } = useStore();

  if (!selectedArticle) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-subtle">المقال غير موجود</p>
        <button onClick={goBack} className="mt-4 text-primary text-sm cursor-pointer">العودة</button>
      </div>
    );
  }

  const article = selectedArticle;
  const cat = CATEGORIES.find((c) => c.slug === article.category);
  const saved = isFavorite(article.id);

  const related = ARTICLES.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  const titleWords = article.title.split(' ');
  const firstLine = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const secondLine = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="py-6"
    >
      {/* Back Button */}
      <motion.button
        whileHover={{ x: 4 }}
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-text-subtle hover:text-primary transition-colors mb-6 cursor-pointer group"
      >
        <span className="glass-subtle rounded-full p-1.5 group-hover:bg-primary/10 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </span>
        العودة
      </motion.button>

      {/* Hero Image with gradient overlay & pattern */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-8"
      >
        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-dots opacity-[0.06]" />
        {/* Category badge with glass effect */}
        <div className="absolute bottom-5 right-5">
          <span className="glass px-4 py-1.5 rounded-full text-white text-xs font-bold bg-gradient-primary border-0">
            {cat?.name}
          </span>
        </div>
      </motion.div>

      {/* Title & Meta */}
      <div className="max-w-3xl">
        {/* Title with gradient first line */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold leading-relaxed mb-6"
        >
          <span className="text-gradient">{firstLine}</span>
          {' '}
          <span className="text-text-main">{secondLine}</span>
        </motion.h1>

        {/* Meta info pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap items-center gap-3 text-text-subtle text-xs mb-8"
        >
          <span className="glass-subtle px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary/70" /> {article.author}
          </span>
          <span className="glass-subtle px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary/70" /> {formatDate(article.publishedAt)}
          </span>
          <span className="glass-subtle px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary/70" /> {getReadingTime(article.content)} دقائق قراءة
          </span>
          <span className="glass-subtle px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-primary/70" /> {article.stats.views} مشاهدة
          </span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleFavorite(article.id, 'article')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer',
              saved
                ? 'bg-gradient-primary text-white shadow-[var(--shadow-glow)]'
                : 'glass-subtle text-text-subtle hover:text-primary'
            )}
          >
            <Heart className={cn('h-4 w-4', saved && 'fill-white')} />
            {saved ? 'محفوظ' : 'حفظ'}
          </motion.button>

          {/* Share Buttons */}
          <ShareButtons title={article.title} />

          <span className="flex items-center gap-1.5 text-xs text-text-subtle glass-subtle px-3 py-1.5 rounded-full">
            <Heart className="h-3.5 w-3.5 text-primary" /> {article.stats.likes}
          </span>
        </motion.div>

        {/* Font Size Control, Print Button, and Reading Mode - Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="flex items-center gap-3 mb-10 glass-subtle rounded-xl px-4 py-2.5 w-fit"
        >
          <FontSizeControl />
          <div className="w-px h-5 bg-border/50" />
          <PrintButton label="طباعة" />
          <div className="w-px h-5 bg-border/50" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium glass-subtle text-text-subtle hover:text-primary transition-all duration-300 cursor-pointer"
            type="button"
            aria-label="وضع القراءة"
          >
            <BookOpen className="h-4 w-4" />
            وضع القراءة
          </motion.button>
        </motion.div>

        {/* Content Area - wrapped in ReadingModeOverlay */}
        <ReadingModeOverlay>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="prose prose-lg max-w-none text-text-main leading-[2] text-[15px]
              [&_h3]:font-heading [&_h3]:font-bold [&_h3]:text-lg [&_h3]:text-gradient [&_h3]:mt-10 [&_h3]:mb-4
              [&_p]:mb-5 [&_p]:text-text-main/90 [&_p]:leading-[2]
              [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-xl [&_h2]:text-gradient [&_h2]:mt-10 [&_h2]:mb-4
              [&_blockquote]:gradient-border [&_blockquote]:rounded-xl [&_blockquote]:bg-accent/5 [&_blockquote]:p-5
              [&_blockquote]:my-6 [&_blockquote]:text-text-secondary [&_blockquote]:italic [&_blockquote]:text-sm]
              [&_blockquote]:border-r-4 [&_blockquote]:border-r-accent
              [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:space-y-2
              [&_strong]:text-text-main [&_strong]:font-bold
              [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
              [&_img]:rounded-2xl [&_img]:my-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </ReadingModeOverlay>

        {/* Tags with gradient background */}
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
          {article.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="px-3.5 py-1.5 bg-gradient-primary/10 text-primary text-xs font-medium rounded-full border border-primary/15"
            >
              #{tag}
            </motion.span>
          ))}
        </div>

        {/* Rating Stars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8 glass-subtle rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-main">قيّمي هذا المقال:</span>
            <RatingStars itemId={article.id} size="md" />
          </div>
        </motion.div>

        {/* Comment Section */}
        <CommentSection itemId={article.id} itemType="article" />

        {/* Ad Banner */}
        <div className="mt-10">
          <AdBanner />
        </div>

        {/* Personalized Suggestions */}
        <PersonalizedSuggestions />

        {/* Related Articles Section */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-14"
          >
            <div className="gradient-border rounded-2xl p-6 sm:p-8 bg-card">
              <h2 className="text-xl font-heading font-bold text-text-main mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-gradient-primary" />
                مقالات ذات صلة
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
