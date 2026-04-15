'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Heart, Clock, Flame, Users, Star,
  CheckCircle2, AlertTriangle, Lightbulb, BookOpen
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CommentSection } from '@/components/shared/CommentSection';
import { RatingStars } from '@/components/shared/RatingStars';
import { ShareButtons } from '@/components/shared/ShareButtons';
import { PrintButton } from '@/components/shared/PrintButton';
import { RecipeTimer } from '@/components/shared/RecipeTimer';
import { AdBanner } from '@/components/shared/AdBanner';
import { FontSizeControl } from '@/components/shared/FontSizeControl';
import { ReadingModeOverlay } from '@/components/shared/ReadingModeOverlay';
import { SkeletonRecipe } from '@/components/shared/SkeletonCard';
import { cn } from '@/lib/utils';

const DIFFICULTY_COLORS: Record<string, string> = {
  'سهل': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'متوسط': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'صعب': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const TYPE_LABELS: Record<string, string> = {
  cooking: 'طبخ',
  beauty: 'تجميل',
  haircare: 'شعر',
  skincare: 'بشرة',
  health: 'صحة',
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function RecipePage() {
  const { selectedRecipe, goBack, toggleFavorite, isFavorite, toggleReadingMode } = useStore();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  if (!selectedRecipe) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-6"
      >
        <SkeletonRecipe />
      </motion.div>
    );
  }

  const recipe = selectedRecipe;
  const saved = isFavorite(recipe.id);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const totalTime = recipe.prepTime + recipe.cookTime;
  const checkedCount = checkedIngredients.size;
  const totalIngredients = recipe.ingredients.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="py-6"
    >
      {/* Recipe Timer - floating */}
      <RecipeTimer prepTime={recipe.prepTime} cookTime={recipe.cookTime} />

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
        <img src={recipe.thumbnail} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 pattern-dots opacity-[0.06]" />
        <div className="absolute bottom-5 right-5 flex items-center gap-2">
          <span className="glass px-4 py-1.5 rounded-full text-white text-xs font-bold bg-gradient-primary border-0">
            {TYPE_LABELS[recipe.type] || recipe.type}
          </span>
          <span className={cn('glass px-3 py-1.5 text-xs font-bold rounded-full', DIFFICULTY_COLORS[recipe.difficulty])}>
            {recipe.difficulty}
          </span>
        </div>
      </motion.div>

      {/* Title & Meta */}
      <div className="max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-text-main leading-relaxed mb-2"
        >
          {recipe.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-text-subtle text-sm leading-relaxed mb-8"
        >
          {recipe.description}
        </motion.p>

        {/* Info Cards - Glass with gradient icons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {totalTime > 0 && (
            <div className="glass-subtle rounded-2xl p-4 text-center card-hover glow-primary-hover">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary/15 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="text-[11px] text-text-subtle mb-0.5">الوقت</p>
              <p className="font-heading font-bold text-text-main text-sm">{totalTime} دقيقة</p>
            </div>
          )}
          {recipe.servings > 0 && (
            <div className="glass-subtle rounded-2xl p-4 text-center card-hover glow-primary-hover">
              <div className="w-10 h-10 rounded-xl bg-gradient-rose-purple/15 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-[11px] text-text-subtle mb-0.5">الأشخاص</p>
              <p className="font-heading font-bold text-text-main text-sm">{recipe.servings}</p>
            </div>
          )}
          {recipe.calories > 0 && (
            <div className="glass-subtle rounded-2xl p-4 text-center card-hover glow-primary-hover">
              <div className="w-10 h-10 rounded-xl bg-gradient-warm/15 flex items-center justify-center mx-auto mb-2">
                <Flame className="h-5 w-5 text-accent" />
              </div>
              <p className="text-[11px] text-text-subtle mb-0.5">السعرات</p>
              <p className="font-heading font-bold text-text-main text-sm">{recipe.calories} سعرة</p>
            </div>
          )}
          <div className="glass-subtle rounded-2xl p-4 text-center card-hover glow-gold-hover">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mx-auto mb-2">
              <Star className="h-5 w-5 text-accent" />
            </div>
            <p className="text-[11px] text-text-subtle mb-0.5">التقييم</p>
            <p className="font-heading font-bold text-text-main text-sm">{recipe.rating.average}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="flex flex-wrap items-center gap-3 mb-10"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleFavorite(recipe.id, 'recipe')}
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
          <ShareButtons title={recipe.title} />

          {/* Print Button */}
          <PrintButton label="طباعة" />
        </motion.div>

        {/* Font Size Control, Print Button, and Reading Mode - Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="flex items-center gap-3 mb-6 glass-subtle rounded-xl px-4 py-2.5 w-fit"
        >
          <FontSizeControl />
          <div className="w-px h-5 bg-border/50" />
          <PrintButton label="طباعة" />
          <div className="w-px h-5 bg-border/50" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleReadingMode}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium glass-subtle text-text-subtle hover:text-primary transition-all duration-300 cursor-pointer"
            type="button"
            aria-label="وضع القراءة"
          >
            <BookOpen className="h-4 w-4" />
            وضع القراءة
          </motion.button>
        </motion.div>

        {/* Rating Stars below info cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.27 }}
          className="mb-10 glass-subtle rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-main">قيّمي هذه الوصفة:</span>
            <RatingStars itemId={recipe.id} initialRating={recipe.rating.average} size="md" />
            <span className="text-xs text-text-subtle">
              ({recipe.rating.count} تقييم)
            </span>
          </div>
        </motion.div>

        {/* Ingredients, Steps, Tips & Warnings - wrapped in ReadingModeOverlay */}
        <ReadingModeOverlay>
        {/* Ingredients - Glass-strong container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold text-text-main flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-gradient-primary" />
              المكونات
            </h2>
            {totalIngredients > 0 && (
              <span className="glass-subtle px-3 py-1 rounded-full text-[11px] text-text-subtle">
                {checkedCount}/{totalIngredients}
              </span>
            )}
          </div>
          <div className="glass-strong rounded-2xl divide-y divide-border/50">
            {recipe.ingredients.map((ing, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleIngredient(i)}
                className={cn(
                  'flex items-center gap-3 w-full px-5 py-3.5 text-right transition-all duration-300 cursor-pointer',
                  checkedIngredients.has(i) && 'opacity-60'
                )}
              >
                <div className={cn(
                  'w-5.5 h-5.5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-300',
                  checkedIngredients.has(i)
                    ? 'bg-gradient-primary'
                    : 'border-2 border-border'
                )}>
                  {checkedIngredients.has(i) && (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  )}
                </div>
                <span className={cn(
                  'flex-1 text-sm transition-all duration-300',
                  checkedIngredients.has(i) && 'line-through text-text-subtle'
                )}>
                  {ing.amount && (
                    <span className="font-medium text-primary">{ing.amount} {ing.unit} </span>
                  )}
                  {ing.name}
                  {ing.optional && <span className="text-text-subtle text-xs mr-1">(اختياري)</span>}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Steps - Numbered with gradient circles */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mb-10"
        >
          <h2 className="text-xl font-heading font-bold text-text-main mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-gradient-warm" />
            خطوات التحضير
          </h2>
          <div className="space-y-4">
            {recipe.steps.map((step) => (
              <motion.div
                key={step.order}
                variants={staggerItem}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-primary text-white text-sm font-bold flex items-center justify-center shadow-[var(--shadow-sm)]">
                  {step.order}
                </div>
                <div className="flex-1 glass-subtle rounded-2xl p-5 card-hover">
                  <p className="text-sm text-text-main leading-relaxed">{step.instruction}</p>
                  {step.duration && (
                    <span className="inline-flex items-center gap-1.5 mt-3 text-xs text-text-subtle glass-subtle px-2.5 py-1 rounded-full">
                      <Clock className="h-3 w-3" /> {step.duration}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Section - Glass-strong with accent gradient border & golden glow */}
        {recipe.tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 relative"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-l from-accent/20 via-accent/5 to-transparent blur-xl opacity-40" />
            <div className="relative glass-strong rounded-2xl p-6 sm:p-7 border border-accent/20">
              <h3 className="font-heading font-bold text-text-main mb-4 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
                  <Lightbulb className="h-4.5 w-4.5 text-white" />
                </div>
                نصائح
              </h3>
              <ul className="space-y-3">
                {recipe.tips.map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="text-sm text-text-main/80 leading-relaxed flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Warnings Section - Glass-strong with red styling */}
        {recipe.warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-10"
          >
            <div className="glass-strong rounded-2xl p-6 sm:p-7 border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/5">
              <h3 className="font-heading font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                  <AlertTriangle className="h-4.5 w-4.5 text-white" />
                </div>
                تحذيرات
              </h3>
              <ul className="space-y-3">
                {recipe.warnings.map((warn, i) => (
                  <li key={i} className="text-sm text-red-700/80 dark:text-red-400/80 leading-relaxed flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 flex-shrink-0" />
                    {warn}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
        </ReadingModeOverlay>

        {/* Comment Section below tips */}
        <CommentSection itemId={recipe.id} itemType="recipe" />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-8 border-t border-border">
          {recipe.tags.map((tag) => (
            <span key={tag} className="px-3.5 py-1.5 bg-gradient-primary/10 text-primary text-xs font-medium rounded-full border border-primary/15">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
