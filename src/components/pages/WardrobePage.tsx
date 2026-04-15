'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shirt,
  ArrowRight,
  Plus,
  Star,
  Sparkles,
  Filter,
  X,
  Camera,
  Trash2,
  BarChart3,
  Shuffle,
  Palette,
  Sun,
  Gem,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { SAMPLE_WARDROBE } from '@/data/featuresData';
import { cn, generateId } from '@/lib/utils';
import type { WardrobeItem } from '@/types';

// ─────────────────────────────────────────────
// Types & Animation
// ─────────────────────────────────────────────
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
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

const CATEGORY_OPTIONS: WardrobeItem['category'][] = [
  'top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory', 'scarf', 'bag',
];

const CATEGORY_LABELS: Record<WardrobeItem['category'], string> = {
  top: 'أعلى',
  bottom: 'أسفل',
  dress: 'فستان',
  outerwear: 'معطف',
  shoes: 'حذاء',
  accessory: 'إكسسوار',
  scarf: 'وشاح',
  bag: 'حقيبة',
};

const SEASON_OPTIONS: WardrobeItem['season'][] = ['spring', 'summer', 'fall', 'winter', 'all'];

const SEASON_LABELS: Record<WardrobeItem['season'], string> = {
  spring: 'ربيع',
  summer: 'صيف',
  fall: 'خريف',
  winter: 'شتاء',
  all: 'كل المواسم',
};

const SEASON_ICONS: Record<WardrobeItem['season'], React.ElementType> = {
  spring: Sparkles,
  summer: Sun,
  fall: Palette,
  winter: Gem,
  all: Sun,
};

const OCCASION_OPTIONS: WardrobeItem['occasion'][] = ['casual', 'formal', 'work', 'party', 'sport'];

const OCCASION_LABELS: Record<WardrobeItem['occasion'], string> = {
  casual: 'كاجوال',
  formal: 'رسمي',
  work: 'عمل',
  party: 'حفلة',
  sport: 'رياضة',
};

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FFB6C1', '#FF6B6B', '#4169E1', '#8B4513',
  '#FFD700', '#808080', '#90EE90', '#DDA0DD', '#F5DEB3', '#2E7D52',
];

// ─────────────────────────────────────────────
// Add Item Form
// ─────────────────────────────────────────────
function AddItemForm({ onAdd, onCancel }: { onAdd: (item: WardrobeItem) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WardrobeItem['category']>('top');
  const [color, setColor] = useState('#000000');
  const [season, setSeason] = useState<WardrobeItem['season']>('all');
  const [occasion, setOccasion] = useState<WardrobeItem['occasion']>('casual');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      id: generateId(),
      name: name.trim(),
      category,
      color,
      season,
      occasion,
      image: `https://placehold.co/200x250/${color.replace('#', '')}/ffffff?text=${encodeURIComponent(name.charAt(0))}`,
      brand: '',
      favorite: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease }}
      className="glass-strong rounded-2xl p-5 sm:p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-heading font-bold text-text-main flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          إضافة قطعة جديدة
        </h3>
        <button onClick={onCancel} className="text-text-subtle hover:text-text-main cursor-pointer">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">اسم القطعة</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: فستان سهرة أسود"
            className="w-full px-4 py-2.5 rounded-xl bg-input-bg border border-border text-sm text-text-main placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            dir="rtl"
          />
        </div>

        {/* Category & Occasion row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1.5 block">التصنيف</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as WardrobeItem['category'])}
              className="w-full px-4 py-2.5 rounded-xl bg-input-bg border border-border text-sm text-text-main focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1.5 block">المناسبة</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as WardrobeItem['occasion'])}
              className="w-full px-4 py-2.5 rounded-xl bg-input-bg border border-border text-sm text-text-main focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              {OCCASION_OPTIONS.map((occ) => (
                <option key={occ} value={occ}>{OCCASION_LABELS[occ]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Season */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">الموسم</label>
          <div className="flex flex-wrap gap-2">
            {SEASON_OPTIONS.map((s) => {
              const SIcon = SEASON_ICONS[s];
              return (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                    season === s
                      ? 'btn-primary'
                      : 'glass-subtle text-text-secondary'
                  )}
                >
                  <SIcon className="h-3 w-3" />
                  {SEASON_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">اللون</label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  'w-8 h-8 rounded-full border-2 transition-all cursor-pointer',
                  color === c ? 'border-primary scale-110 shadow-lg' : 'border-border hover:scale-105'
                )}
                style={{ backgroundColor: c }}
              />
            ))}
            <label className="w-8 h-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden">
              <Camera className="h-3.5 w-3.5 text-text-subtle" />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
              />
            </label>
          </div>
        </div>

        {/* Image upload placeholder */}
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
          <Camera className="h-8 w-8 text-text-subtle mx-auto mb-2" />
          <p className="text-xs text-text-subtle">صورة القطعة (اختياري)</p>
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!name.trim()}
          className={cn(
            'w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2',
            !name.trim() && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Plus className="h-4 w-4" />
          إضافة القطعة
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Outfit Suggestion
// ─────────────────────────────────────────────
function OutfitSuggestion({ items }: { items: WardrobeItem[] }) {
  const [suggestion, setSuggestion] = useState<WardrobeItem[]>([]);
  const [hasSuggested, setHasSuggested] = useState(false);

  const generateOutfit = useCallback(() => {
    const categories = ['top', 'bottom', 'shoes'] as const;
    const selected: WardrobeItem[] = [];

    for (const cat of categories) {
      const catItems = items.filter((i) => i.category === cat);
      if (catItems.length > 0) {
        selected.push(catItems[Math.floor(Math.random() * catItems.length)]);
      }
    }

    // Try to add an accessory
    const accessories = items.filter((i) => i.category === 'accessory' || i.category === 'bag');
    if (accessories.length > 0) {
      selected.push(accessories[Math.floor(Math.random() * accessories.length)]);
    }

    setSuggestion(selected);
    setHasSuggested(true);
  }, [items]);

  return (
    <div className="glass-strong rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-heading font-bold text-text-main flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          اقتراح إطلالة
        </h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={generateOutfit}
          className="btn-outline flex items-center gap-2 text-xs px-4 py-2"
        >
          <Shuffle className="h-3.5 w-3.5" />
          اقتراح جديد
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {hasSuggested && suggestion.length > 0 ? (
          <motion.div
            key={suggestion.map((i) => i.id).join('-')}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease }}
            className="flex gap-3 overflow-x-auto pb-2 no-scrollbar"
          >
            {suggestion.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-28 text-center">
                <div className="w-28 h-36 rounded-xl overflow-hidden mb-2 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-[10px] text-white font-medium truncate block">
                      {item.name}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-text-subtle">
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-6">
            <Sparkles className="h-8 w-8 text-text-subtle mx-auto mb-2" />
            <p className="text-sm text-text-subtle">
              اضغطي على &quot;اقتراح جديد&quot; للحصول على إطلالة عشوائية
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Stats Card
// ─────────────────────────────────────────────
function StatsCard({ items }: { items: WardrobeItem[] }) {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const favoriteCount = items.filter((i) => i.favorite).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4, ease }}
      className="glass-strong rounded-2xl p-5 sm:p-6"
    >
      <h3 className="text-base font-heading font-bold text-text-main mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        إحصائيات الخزانة
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-subtle rounded-xl p-3 text-center">
          <p className="text-2xl font-heading font-bold text-primary">{items.length}</p>
          <p className="text-xs text-text-subtle">إجمالي القطع</p>
        </div>
        <div className="glass-subtle rounded-xl p-3 text-center">
          <p className="text-2xl font-heading font-bold text-amber-500">{favoriteCount}</p>
          <p className="text-xs text-text-subtle">المفضلة</p>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(categoryCounts)
          .sort(([, a], [, b]) => b - a)
          .map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="text-xs text-text-secondary w-16 truncate">
                {CATEGORY_LABELS[cat as WardrobeItem['category']]}
              </span>
              <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / items.length) * 100}%` }}
                  transition={{ duration: 0.6, ease }}
                  className="h-full rounded-full bg-gradient-primary"
                />
              </div>
              <span className="text-xs font-bold text-text-main w-6 text-center">{count}</span>
            </div>
          ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function WardrobePage() {
  const { goBack } = useStore();
  const [items, setItems] = useState<WardrobeItem[]>([...SAMPLE_WARDROBE]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<WardrobeItem['category'] | 'all'>('all');
  const [seasonFilter, setSeasonFilter] = useState<WardrobeItem['season'] | 'all'>('all');
  const [occasionFilter, setOccasionFilter] = useState<WardrobeItem['occasion'] | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const handleAddItem = useCallback((item: WardrobeItem) => {
    setItems((prev) => [...prev, item]);
    setShowAddForm(false);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i))
    );
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (categoryFilter !== 'all') result = result.filter((i) => i.category === categoryFilter);
    if (seasonFilter !== 'all') result = result.filter((i) => i.season === seasonFilter || i.season === 'all');
    if (occasionFilter !== 'all') result = result.filter((i) => i.occasion === occasionFilter);
    if (favoritesOnly) result = result.filter((i) => i.favorite);
    return result;
  }, [items, categoryFilter, seasonFilter, occasionFilter, favoritesOnly]);

  const hasActiveFilters =
    categoryFilter !== 'all' || seasonFilter !== 'all' || occasionFilter !== 'all' || favoritesOnly;

  const clearFilters = useCallback(() => {
    setCategoryFilter('all');
    setSeasonFilter('all');
    setOccasionFilter('all');
    setFavoritesOnly(false);
  }, []);

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
            <Shirt className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            خزانة ملابسي
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            نظّمي ملابسك واستكشفي إطلالات جديدة
          </p>
        </div>
      </motion.div>

      {/* Add Item Button */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          إضافة قطعة
        </motion.button>

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
        </motion.button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-text-subtle hover:text-red-500 transition-colors cursor-pointer"
          >
            إزالة التصفية
          </button>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <AddItemForm onAdd={handleAddItem} onCancel={() => setShowAddForm(false)} />
        )}
      </AnimatePresence>

      {/* Filters */}
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
              {/* Category */}
              <div>
                <h4 className="text-sm font-bold text-text-main mb-2">التصنيف</h4>
                <div className="flex flex-wrap gap-2">
                  {(['all', ...CATEGORY_OPTIONS] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat === 'all' ? 'all' : (cat as WardrobeItem['category']))}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                        categoryFilter === cat
                          ? 'btn-primary'
                          : 'glass-subtle text-text-secondary hover:text-text-main'
                      )}
                    >
                      {cat === 'all' ? 'الكل' : CATEGORY_LABELS[cat as WardrobeItem['category']]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div>
                <h4 className="text-sm font-bold text-text-main mb-2">الموسم</h4>
                <div className="flex flex-wrap gap-2">
                  {(['all', ...SEASON_OPTIONS] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeasonFilter(s === 'all' ? 'all' : (s as WardrobeItem['season']))}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                        seasonFilter === s
                          ? 'btn-primary'
                          : 'glass-subtle text-text-secondary hover:text-text-main'
                      )}
                    >
                      {s === 'all' ? 'الكل' : SEASON_LABELS[s as WardrobeItem['season']]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <h4 className="text-sm font-bold text-text-main mb-2">المناسبة</h4>
                <div className="flex flex-wrap gap-2">
                  {(['all', ...OCCASION_OPTIONS] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOccasionFilter(o === 'all' ? 'all' : (o as WardrobeItem['occasion']))}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                        occasionFilter === o
                          ? 'btn-primary'
                          : 'glass-subtle text-text-secondary hover:text-text-main'
                      )}
                    >
                      {o === 'all' ? 'الكل' : OCCASION_LABELS[o as WardrobeItem['occasion']]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorites toggle */}
              <button
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer',
                  favoritesOnly
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600'
                    : 'glass-subtle text-text-secondary'
                )}
              >
                <Star className={cn('h-4 w-4', favoritesOnly && 'fill-amber-500')} />
                المفضلة فقط
                {favoritesOnly && <span className="text-xs">✓</span>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outfit Suggestion */}
      {items.length >= 3 && <OutfitSuggestion items={items} />}

      {/* Wardrobe Grid */}
      {filteredItems.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          key={`${categoryFilter}-${seasonFilter}-${occasionFilter}-${favoritesOnly}`}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="glass-strong rounded-2xl overflow-hidden card-hover gradient-border group relative"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full aspect-[3/4] object-cover"
                />

                {/* Favorite button */}
                <button
                  onClick={() => handleToggleFavorite(item.id)}
                  className={cn(
                    'absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer',
                    item.favorite
                      ? 'bg-amber-500/90 text-white'
                      : 'bg-black/30 text-white/70 hover:bg-amber-500/80 hover:text-white'
                  )}
                >
                  <Star className={cn('h-4 w-4', item.favorite && 'fill-white')} />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 text-white/70 hover:bg-red-500/80 hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Category badge */}
                <div className="absolute bottom-2 right-2">
                  <span className="text-[10px] bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h4 className="text-sm font-heading font-bold text-text-main truncate">
                  {item.name}
                </h4>
                {item.brand && (
                  <p className="text-xs text-text-subtle truncate">{item.brand}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-10 text-center mb-6"
        >
          <Shirt className="h-12 w-12 text-text-subtle mx-auto mb-3" />
          <p className="text-text-subtle text-sm mb-3">
            {hasActiveFilters ? 'لا توجد قطع تطابق التصفية' : 'خزانتك فارغة، أضيفي قطعتك الأولى!'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="text-sm text-primary font-medium hover:underline cursor-pointer"
            >
              إزالة التصفية
            </button>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary text-sm px-6 py-2"
            >
              إضافة قطعة
            </button>
          )}
        </motion.div>
      )}

      {/* Stats */}
      {items.length > 0 && <StatsCard items={items} />}
    </motion.div>
  );
}
