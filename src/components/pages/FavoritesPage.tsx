'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ARTICLES, RECIPES } from '@/data/seedData';
import type { Article, Recipe } from '@/types';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { RecipeCard } from '@/components/cards/RecipeCard';

import { cn } from '@/lib/utils';

export function FavoritesPage() {
  const { favorites, goBack, navigateTo } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'recipes'>('all');

  const favoriteArticles = useMemo(
    () => favorites.filter((f) => f.type === 'article').map((f) => ARTICLES.find((a) => a.id === f.itemId)).filter((a): a is Article => a !== undefined),
    [favorites]
  );

  const favoriteRecipes = useMemo(
    () => favorites.filter((f) => f.type === 'recipe').map((f) => RECIPES.find((r) => r.id === f.itemId)).filter((r): r is Recipe => r !== undefined),
    [favorites]
  );

  const isEmpty = favorites.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6"
    >
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-text-subtle hover:text-primary transition-colors mb-6 cursor-pointer"
      >
        <ArrowRight className="h-4 w-4" /> العودة
      </button>

      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-main mb-2 flex items-center gap-3">
        <Heart className="h-7 w-7 text-primary" /> المفضلة
      </h1>
      <p className="text-text-subtle text-sm mb-6">
        {favorites.length} عنصر محفوظ
      </p>

      {isEmpty ? (
        <div className="py-20 text-center">
          <Heart className="h-16 w-16 text-text-subtle/20 mx-auto mb-4" />
          <p className="text-text-subtle text-lg mb-2">لا توجد عناصر محفوظة</p>
          <p className="text-text-subtle text-sm mb-6">ابدئي بحفظ المقالات والوصفات المفضلة لديك</p>
          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-colors cursor-pointer"
          >
            تصفحي المحتوى
          </button>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-border pb-3">
            {(['all', 'articles', 'recipes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'text-sm font-medium pb-1 transition-colors cursor-pointer border-b-2',
                  activeTab === tab ? 'text-primary border-primary' : 'text-text-subtle border-transparent hover:text-text-main'
                )}
              >
                {tab === 'all' ? `الكل (${favorites.length})` : tab === 'articles' ? `المقالات (${favoriteArticles.length})` : `الوصفات (${favoriteRecipes.length})`}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {(activeTab === 'all' || activeTab === 'articles') && favoriteArticles.length > 0 && (
              <div>
                {activeTab === 'all' && (
                  <h2 className="text-lg font-heading font-bold text-text-main mb-4">المقالات المحفوظة</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'recipes') && favoriteRecipes.length > 0 && (
              <div>
                {activeTab === 'all' && (
                  <h2 className="text-lg font-heading font-bold text-text-main mb-4">الوصفات المحفوظة</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
