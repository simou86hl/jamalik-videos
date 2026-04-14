'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  Check,
  X,
  ThumbsUp,
  ThumbsDown,
  GitCompare,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { COMPARISON_PRODUCTS } from '@/data/comparisons';
import type { CategorySlug } from '@/types';
import { cn } from '@/lib/utils';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-4 w-4',
            star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
          )}
        />
      ))}
      <span className="text-sm font-medium text-text-main mr-1">{rating}</span>
    </div>
  );
}

const comparisonCategories: { slug: CategorySlug | 'all'; label: string }[] = [
  { slug: 'all', label: 'الكل' },
  { slug: 'skincare', label: 'البشرة' },
  { slug: 'haircare', label: 'الشعر' },
  { slug: 'beauty', label: 'التجميل' },
];

export function ComparePage() {
  const { goBack } = useStore();
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return COMPARISON_PRODUCTS;
    return COMPARISON_PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Group into pairs for comparison
  const pairs = useMemo(() => {
    const result: [typeof COMPARISON_PRODUCTS[0], typeof COMPARISON_PRODUCTS[0]][] = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      if (i + 1 < filteredProducts.length) {
        result.push([filteredProducts[i], filteredProducts[i + 1]]);
      }
    }
    return result;
  }, [filteredProducts]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-6"
    >
      {/* Back button */}
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

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative rounded-3xl overflow-hidden mb-8"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <GitCompare className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            مقارنة المنتجات
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            قارني بين أفضل المنتجات واختاري ما يناسبك
          </p>
        </div>
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {comparisonCategories.map((cat) => (
          <motion.button
            key={cat.slug}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer',
              activeCategory === cat.slug
                ? 'bg-gradient-primary text-white shadow-[var(--shadow-glow)]'
                : 'glass-subtle text-text-subtle hover:text-text-main'
            )}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Comparison Pairs */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {pairs.map(([productA, productB]) => (
          <motion.div
            key={`${productA.id}-${productB.id}`}
            variants={staggerItem}
            className="glass-strong gradient-border rounded-3xl p-5 sm:p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[productA, productB].map((product) => (
                <div key={product.id} className="space-y-4">
                  {/* Product Header */}
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-primary/10 overflow-hidden mx-auto mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-heading font-bold text-text-main text-base mb-1">{product.name}</h3>
                    <p className="text-xs text-text-subtle mb-2">{product.brand}</p>
                    <RatingStars rating={product.rating} />
                    <p className="text-lg font-heading font-extrabold text-gradient mt-2">
                      {product.price} ر.س
                    </p>
                  </div>

                  {/* Description */}
                  <div className="glass-subtle rounded-xl p-4">
                    <p className="text-xs text-text-secondary leading-relaxed text-center">
                      {product.pros.join('، ') || 'لا يوجد وصف متاح'}
                    </p>
                  </div>

                  {/* Pros */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-green-500/15 flex items-center justify-center">
                        <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
                      </div>
                      <span className="text-sm font-medium text-green-600">المميزات</span>
                    </div>
                    <div className="space-y-1.5">
                      {product.pros.map((pro, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-text-secondary">{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cons */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-red-500/15 flex items-center justify-center">
                        <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
                      </div>
                      <span className="text-sm font-medium text-red-500">العيوب</span>
                    </div>
                    <div className="space-y-1.5">
                      {product.cons.map((con, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-text-secondary">{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {pairs.length === 0 && (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <GitCompare className="h-12 w-12 text-text-subtle/30 mx-auto mb-3" />
          <p className="text-text-subtle text-sm">لا توجد منتجات للمقارنة في هذا القسم حالياً</p>
        </div>
      )}
    </motion.div>
  );
}
