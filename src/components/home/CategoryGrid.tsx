'use client';

import { motion } from 'framer-motion';
import {
  Theater, Laugh, Swords, Heart, Globe,
  Music, Palette, BookOpen, Tv,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { useStore } from '@/store/useStore';
import type { SeriesCategorySlug } from '@/types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Theater, Laugh, Swords, Heart, Globe, Music, Palette, BookOpen,
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function CategoryGrid() {
  const { selectCategory, navigateTo } = useStore();

  const handleCategoryClick = (slug: SeriesCategorySlug) => {
    selectCategory(slug);
    navigateTo('category');
  };

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-5">
        <Tv className="h-5 w-5 text-primary" />
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main">
          تصفح الأقسام
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
      >
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.icon] || Tv;
          return (
            <motion.button
              key={cat.id}
              variants={itemVariants}
              onClick={() => handleCategoryClick(cat.slug)}
              className="card-hover glass rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center group-hover:bg-gradient-primary group-hover:scale-110 transition-all duration-300">
                <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-text-main group-hover:text-primary transition-colors duration-300">
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
