'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  ArrowRight,
  Check,
  ChevronLeft,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Baby,
  Shuffle,
  Filter,
  Droplets,
  Scissors,
  Hand,
  X,
  Beaker,
  Leaf,
  Heart,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { LAB_RECIPES } from '@/data/featuresData';
import { cn } from '@/lib/utils';
import type { LabRecipe, SkinType } from '@/types';

// ─────────────────────────────────────────────
// Animation & helpers
// ─────────────────────────────────────────────
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 18, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease },
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  face: 'الوجه',
  hair: 'الشعر',
  body: 'الجسم',
  skin: 'البشرة',
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  face: Droplets,
  hair: Scissors,
  body: Hand,
  skin: Sparkles,
};

const SKIN_LABELS: Record<SkinType, string> = {
  oily: 'دهنية',
  dry: 'جافة',
  combination: 'مختلطة',
  sensitive: 'حساسة',
  normal: 'عادية',
};

type CategoryFilter = 'all' | 'face' | 'hair' | 'body' | 'skin';

// ─────────────────────────────────────────────
// All unique ingredients
// ─────────────────────────────────────────────
const ALL_INGREDIENTS = Array.from(
  new Set(LAB_RECIPES.flatMap((r) => r.ingredients.map((i) => i.name)))
).sort();

// ─────────────────────────────────────────────
// Recipe Detail Modal
// ─────────────────────────────────────────────
function RecipeDetailModal({
  recipe,
  onClose,
}: {
  recipe: LabRecipe | null;
  onClose: () => void;
}) {
  if (!recipe) return null;

  const Icon = CATEGORY_ICONS[recipe.category] || FlaskConical;

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease } }}
          exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.25, ease } }}
          className="glass-strong rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-primary p-6 sm:p-8 relative">
            <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-xl font-heading font-bold text-white mb-1">{recipe.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs bg-white/15 px-3 py-1 rounded-full text-white">
                  {CATEGORY_LABELS[recipe.category]}
                </span>
                <span className="text-xs bg-white/15 px-3 py-1 rounded-full text-white flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {recipe.duration}
                </span>
                {recipe.pregnancySafe && (
                  <span className="text-xs bg-green-500/30 px-3 py-1 rounded-full text-white flex items-center gap-1">
                    <Baby className="h-3 w-3" />
                    آمن للحامل
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Ingredients */}
            <div>
              <h3 className="text-base font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary" />
                المكونات المطلوبة
              </h3>
              <div className="space-y-2">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-3 glass-subtle rounded-xl px-4 py-2.5">
                    <Leaf className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-text-main flex-1">{ing.name}</span>
                    <span className="text-xs text-text-subtle bg-border/50 px-2 py-0.5 rounded-lg">{ing.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div>
              <h3 className="text-base font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                خطوات التحضير
              </h3>
              <div className="space-y-3">
                {recipe.steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx, duration: 0.3, ease }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-base font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                الفوائد
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full font-medium"
                  >
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {recipe.warnings.length > 0 && (
              <div className="glass-subtle rounded-xl p-4">
                <h3 className="text-sm font-heading font-bold text-amber-600 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  تحذيرات
                </h3>
                <ul className="space-y-1.5">
                  {recipe.warnings.map((w, idx) => (
                    <li key={idx} className="text-xs text-text-secondary leading-relaxed flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">●</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suitable skin types */}
            {recipe.skinType.length > 0 && (
              <div>
                <h3 className="text-sm font-heading font-bold text-text-main mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  مناسب لأنواع البشرة
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.skinType.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
                    >
                      {SKIN_LABELS[s]}
                    </span>
                  ))}
                  {recipe.skinType.length === 0 && (
                    <span className="text-xs text-text-subtle">جميع أنواع البشرة</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function RecipeLabPage() {
  const { goBack } = useStore();
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [skinFilter, setSkinFilter] = useState<SkinType | 'all'>('all');
  const [pregnancyFilter, setPregnancyFilter] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<LabRecipe | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleIngredient = useCallback((name: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const filteredRecipes = useMemo(() => {
    let recipes = [...LAB_RECIPES];

    // Category filter
    if (categoryFilter !== 'all') {
      recipes = recipes.filter((r) => r.category === categoryFilter);
    }

    // Skin type filter
    if (skinFilter !== 'all') {
      recipes = recipes.filter(
        (r) => r.skinType.length === 0 || r.skinType.includes(skinFilter)
      );
    }

    // Pregnancy filter
    if (pregnancyFilter) {
      recipes = recipes.filter((r) => r.pregnancySafe);
    }

    // Sort by matching ingredient count (recipes with more matching ingredients first)
    if (selectedIngredients.size > 0) {
      recipes.sort((a, b) => {
        const aMatch = a.ingredients.filter((i) => selectedIngredients.has(i.name)).length;
        const bMatch = b.ingredients.filter((i) => selectedIngredients.has(i.name)).length;
        return bMatch - aMatch;
      });
    }

    return recipes;
  }, [categoryFilter, skinFilter, pregnancyFilter, selectedIngredients]);

  const handleSurpriseMe = useCallback(() => {
    const pool = filteredRecipes.length > 0 ? filteredRecipes : LAB_RECIPES;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setSelectedRecipe(random);
  }, [filteredRecipes]);

  const clearFilters = useCallback(() => {
    setCategoryFilter('all');
    setSkinFilter('all');
    setPregnancyFilter(false);
  }, []);

  const hasActiveFilters = categoryFilter !== 'all' || skinFilter !== 'all' || pregnancyFilter;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-6"
    >
      {/* Back */}
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease }}
        className="relative rounded-3xl overflow-hidden mb-8"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <FlaskConical className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            مختبر الوصفات الطبيعية
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            اكتشفي وصفات طبيعية من مكونات متوفرة في منزلك
          </p>
        </div>
      </motion.div>

      {/* Ingredient Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease }}
        className="glass-strong rounded-2xl p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-heading font-bold text-text-main flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            المكونات المتوفرة لديك
            {selectedIngredients.size > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                {selectedIngredients.size}
              </span>
            )}
          </h3>
          {selectedIngredients.size > 0 && (
            <button
              onClick={() => setSelectedIngredients(new Set())}
              className="text-xs text-text-subtle hover:text-red-500 transition-colors cursor-pointer"
            >
              مسح الكل
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {ALL_INGREDIENTS.map((name) => {
            const isSelected = selectedIngredients.has(name);
            return (
              <motion.button
                key={name}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleIngredient(name)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border',
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'glass-subtle text-text-secondary border-transparent hover:border-primary/30'
                )}
              >
                {isSelected && <Check className="h-3 w-3" />}
                {name}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Filters + Surprise Me */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer',
            hasActiveFilters ? 'btn-primary' : 'glass-subtle text-text-secondary'
          )}
        >
          <Filter className="h-4 w-4" />
          تصفية
          {hasActiveFilters && (
            <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
              !
            </span>
          )}
        </motion.button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-text-subtle hover:text-red-500 transition-colors cursor-pointer"
          >
            إزالة التصفية
          </button>
        )}

        <div className="flex-1" />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSurpriseMe}
          className="btn-outline flex items-center gap-2 text-sm"
        >
          <Shuffle className="h-4 w-4" />
          فاجئيني!
        </motion.button>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden mb-6"
          >
            <div className="glass-strong rounded-2xl p-5 space-y-4">
              {/* Category filter */}
              <div>
                <h4 className="text-sm font-bold text-text-main mb-2">التصنيف</h4>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'face', 'hair', 'body', 'skin'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                        categoryFilter === cat
                          ? 'btn-primary'
                          : 'glass-subtle text-text-secondary hover:text-text-main'
                      )}
                    >
                      {cat === 'all' ? 'الكل' : CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin type filter */}
              <div>
                <h4 className="text-sm font-bold text-text-main mb-2">نوع البشرة</h4>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'oily', 'dry', 'combination', 'sensitive', 'normal'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSkinFilter(s)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                        skinFilter === s
                          ? 'btn-primary'
                          : 'glass-subtle text-text-secondary hover:text-text-main'
                      )}
                    >
                      {s === 'all' ? 'الكل' : SKIN_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pregnancy filter */}
              <button
                onClick={() => setPregnancyFilter(!pregnancyFilter)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer',
                  pregnancyFilter
                    ? 'bg-green-500/10 border border-green-500/30 text-green-600'
                    : 'glass-subtle text-text-secondary'
                )}
              >
                <ShieldCheck className="h-4 w-4" />
                <Baby className="h-4 w-4" />
                آمن للحمل
                {pregnancyFilter && <Check className="h-3.5 w-3.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe Cards */}
      {filteredRecipes.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          key={`${categoryFilter}-${skinFilter}-${pregnancyFilter}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredRecipes.map((recipe) => {
            const Icon = CATEGORY_ICONS[recipe.category] || FlaskConical;
            const matchedCount = recipe.ingredients.filter((i) =>
              selectedIngredients.has(i.name)
            ).length;

            return (
              <motion.div
                key={recipe.id}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedRecipe(recipe)}
                className="glass-strong rounded-2xl overflow-hidden card-hover gradient-border cursor-pointer"
              >
                <div className="p-5">
                  {/* Category + badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs glass-subtle px-3 py-1 rounded-full text-primary font-medium flex items-center gap-1.5">
                      <Icon className="h-3 w-3" />
                      {CATEGORY_LABELS[recipe.category]}
                    </span>
                    {recipe.pregnancySafe && (
                      <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Baby className="h-3 w-3" />
                        آمن
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-heading font-bold text-text-main mb-3 line-clamp-2">
                    {recipe.name}
                  </h3>

                  {/* Matched ingredients */}
                  {selectedIngredients.size > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-subtle">المكونات المتوفرة</span>
                        <span className="font-bold text-primary">
                          {matchedCount}/{recipe.ingredients.length}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-border overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(matchedCount / recipe.ingredients.length) * 100}%`,
                          }}
                          transition={{ duration: 0.5, ease }}
                          className="h-full rounded-full bg-gradient-primary"
                        />
                      </div>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-text-subtle">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {recipe.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Beaker className="h-3.5 w-3.5" />
                      {recipe.ingredients.length} مكون
                    </span>
                    <ChevronLeft className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-10 text-center"
        >
          <FlaskConical className="h-12 w-12 text-text-subtle mx-auto mb-3" />
          <p className="text-text-subtle text-sm mb-3">لا توجد وصفات تطابق التصفية المحددة</p>
          <button
            onClick={clearFilters}
            className="text-sm text-primary font-medium hover:underline cursor-pointer"
          >
            إزالة التصفية
          </button>
        </motion.div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </motion.div>
  );
}
