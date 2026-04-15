'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  ArrowRight,
  Clock,
  Flame,
  Heart,
  Scissors,
  Sparkles,
  ChefHat,
  Leaf,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { RecipeType } from '@/types';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const categories: { id: RecipeType | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'الكل', icon: BookOpen },
  { id: 'cooking', label: 'طبخ', icon: ChefHat },
  { id: 'beauty', label: 'تجميل', icon: Sparkles },
  { id: 'haircare', label: 'شعر', icon: Scissors },
  { id: 'skincare', label: 'بشرة', icon: Leaf },
  { id: 'health', label: 'صحة', icon: Heart },
];

interface GeneratedRecipe {
  id: string;
  name: string;
  category: RecipeType;
  description: string;
  prepTime: number;
  calories: number;
  difficulty: string;
  ingredients: string[];
  steps: string[];
}

const RECIPE_DATABASE: { keywords: string[]; recipe: GeneratedRecipe }[] = [
  {
    keywords: ['بيض', 'أومليت', 'فطار'],
    recipe: {
      id: 'r1',
      name: 'أومليت الخضار الصحي',
      category: 'cooking',
      description: 'وجبة فطور غنية بالبروتين والفيتامينات، مثالية لبداية يوم نشيط',
      prepTime: 15,
      calories: 280,
      difficulty: 'سهل',
      ingredients: ['٣ بيضات', 'فلفل ملون مفروم', 'طماطم مقطعة', 'بصل أخضر', 'جبنة شيدر', 'ملح وفلفل أسود', 'زيت زيتون'],
      steps: ['اخفقي البيض مع الملح والفلفل', 'سخني الزيت في مقلاة على نار متوسطة', 'أضيفي البصل ثم الفلفل والطماطم', 'صبي البيض واتركيه حتى يتماسك', 'رشي الجبنة واطوي الأومليت نصفين', 'قدميه مع خبز محمص'],
    },
  },
  {
    keywords: ['عسل', 'ليمون', 'ماسك', 'تفتيح'],
    recipe: {
      id: 'r2',
      name: 'ماسك العسل والليمون للتفتيح',
      category: 'skincare',
      description: 'ماسك طبيعي فعال لتفتيح البشرة وإزالة التصبغات وترطيبها بعمق',
      prepTime: 25,
      calories: 0,
      difficulty: 'سهل',
      ingredients: ['٢ ملاعق كبيرة عسل طبيعي', 'عصير نصف ليمونة', '١ ملعقة صغيرة زيت زيتون', '١ ملعقة كبيرة زبادي'],
      steps: ['اخلطي جميع المكونات في وعاء صغير', 'نظفي وجهك جيداً بالماء الدافئ', 'وزعي الماسك على وجهك بالتساوي', 'اتركيه لمدة ١٥-٢٠ دقيقة', 'اغسلي بماء دافئ ورطبي بشرتك', 'كرري مرتين أسبوعياً للنتيجة الأفضل'],
    },
  },
  {
    keywords: ['شعر', 'زيت', 'أرغان', 'جوز'],
    recipe: {
      id: 'r3',
      name: 'حمام زيت الأرغان والجوز للشعر',
      category: 'haircare',
      description: 'حمام زيت مغذي يمنح الشعر لمعاناً وحيوية ويعالج التلف والتقصف',
      prepTime: 45,
      calories: 0,
      difficulty: 'متوسط',
      ingredients: ['٣ ملاعق كبيرة زيت أرغان', '٢ ملاعق كبيرة زيت جوز الهند', '١ ملعقة كبيرة عسل', '٣ قطرات زيت اللافندر'],
      steps: ['سخني الزيوت مع العسل على نار هادئة جداً', 'دلّكي فروة الرأس بلطف لمدة ١٠ دقائق', 'وزعي على طول الشعر حتى الأطراف', 'غطي الشعر بقبعة دافئة أو منشفة ساخنة', 'اتركي لمدة ٣٠ دقيقة', 'اغسلي بالشامبو مرتين ثم بالبلسم'],
    },
  },
  {
    keywords: ['سلمون', 'سمك', 'بروتين', 'صحي'],
    recipe: {
      id: 'r4',
      name: 'فيليه سلمون مشوي بالأعشاب',
      category: 'health',
      description: 'وجبة غنية بأوميغا ٣ والبروتين، مثالية لصحة القلب والبشرة',
      prepTime: 30,
      calories: 420,
      difficulty: 'متوسط',
      ingredients: ['قطعة فيليه سلمون ٢٠٠غ', 'ليمونة', 'أعشاب طازجة (إكليل، شبت)', '٣ فصوص ثوم', 'ملح وفلفل', 'زيت زيتون', 'خضار سوتيه'],
      steps: ['تبّلي السلمون بالليمون والأعشاب والثوم', 'اتركيه يتتبل لمدة ١٥ دقيقة', 'اشويه على نار متوسطة ٥ دقائق لكل جانب', 'قدميه مع الخضار السوتيه', 'يزين بأعواد الليمون والأعشاب الطازجة'],
    },
  },
  {
    keywords: ['شوكولاتة', 'حلوى', 'كيك', 'كاكاو'],
    recipe: {
      id: 'r5',
      name: 'كيك الشوكولاتة السريع',
      category: 'cooking',
      description: 'كيك شوكولاتة غني وهش يُحضر في دقائق معدودة بدون فرن',
      prepTime: 10,
      calories: 350,
      difficulty: 'سهل',
      ingredients: ['٤ ملاعق كبيرة دقيق', '٤ ملاعق كبيرة سكر', '٢ ملاعق كبيرة كاكاو', '١ بيضة', '٣ ملاعق كبيرة حليب', '٢ ملاعق كبيرة زيت', 'رشة بيكنج باودر'],
      steps: ['اخلطي المكونات الجافة معاً', 'أضيفي البيضة والحليب والزيت', 'اخلطي حتى تحصلي على خليط متجانس', 'ضعيه في كوب وادخليه الميكروويف ٩٠ ثانية', 'زينيه بالشوكولاتة المذابة أو النوتيلا', 'قدميه فوراً ساخناً'],
    },
  },
  {
    keywords: ['قهوة', 'مقشر', 'جسم', 'سكر'],
    recipe: {
      id: 'r6',
      name: 'مقشر القهوة والسكر للجسم',
      category: 'beauty',
      description: 'مقشر طبيعي يزيل الخلايا الميتة وينعم البشرة ويحسن الدورة الدموية',
      prepTime: 15,
      calories: 0,
      difficulty: 'سهل',
      ingredients: ['نصف كوب قهوة مطحونة', 'نصف كوب سكر بني', 'ربع كوب زيت جوز الهند', '١ ملعقة صغيرة فانيليا'],
      steps: ['اخلطي القهوة مع السكر', 'أضيفي زيت جوز الهند والفانيليا', 'افركي الجسم بحركات دائرية في الاستحمام', 'ركزي على المرفقين والركبتين', 'اشطفي بماء دافئ', 'رطبي الجسم بكريم مرطب'],
    },
  },
];

const defaultRecipe: GeneratedRecipe = {
  id: 'r-default',
  name: 'وصفة سحرية مخصصة لكِ',
  category: 'beauty',
  description: 'وصفة طبيعية مبنية على المكونات المتاحة لديكِ لتحصلي على أفضل النتائج',
  prepTime: 20,
  calories: 0,
  difficulty: 'سهل',
  ingredients: ['المكونات التي ذكرتِها', 'عسل طبيعي (ملزمة)', 'زيت زيتون أو جوز الهند', 'مكونات إضافية حسب الرغبة'],
  steps: [
    'جهزي جميع المكونات واغسليها جيداً',
    'اخلطي المكونات الجافة أولاً ثم أضيفي السائلة',
    'اخلطي حتى تحصلي على قوام متجانس ومتماسك',
    'وزعي الخليط بالتساوي على المنطقة المرغوبة',
    'اتركيه لمدة ١٥-٢٠ دقيقة',
    'اغسلي بماء دافئ ورطبي جيداً',
  ],
};

function findRecipe(text: string, category: RecipeType | 'all'): GeneratedRecipe {
  const lowerText = text.toLowerCase();

  if (category !== 'all') {
    const catMatch = RECIPE_DATABASE.find(
      (r) =>
        r.recipe.category === category &&
        r.keywords.some((k) => lowerText.includes(k))
    );
    if (catMatch) return catMatch.recipe;
  }

  const match = RECIPE_DATABASE.find((r) => r.keywords.some((k) => lowerText.includes(k)));
  if (match) return match.recipe;

  // Try category match only
  if (category !== 'all') {
    const catRecipe = RECIPE_DATABASE.find((r) => r.recipe.category === category);
    if (catRecipe) return catRecipe.recipe;
  }

  return defaultRecipe;
}

export function AiRecipePage() {
  const { goBack, toggleFavorite, isFavorite } = useStore();
  const [ingredients, setIngredients] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecipeType | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!ingredients.trim()) return;
    setIsGenerating(true);
    setSaved(false);

    setTimeout(() => {
      const result = findRecipe(ingredients, selectedCategory);
      setRecipe(result);
      setIsGenerating(false);
    }, 1500);
  }, [ingredients, selectedCategory]);

  const handleSave = () => {
    if (!recipe) return;
    toggleFavorite(recipe.id, 'recipe');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const difficultyColor = (d: string) => {
    if (d === 'سهل') return 'text-green-500';
    if (d === 'متوسط') return 'text-amber-500';
    return 'text-red-500';
  };

  const categoryLabel = (cat: RecipeType): string => {
    const map: Record<RecipeType, string> = {
      cooking: 'طبخ',
      beauty: 'تجميل',
      haircare: 'شعر',
      skincare: 'بشرة',
      health: 'صحة',
    };
    return map[cat];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="py-6"
    >
      {/* Back Button */}
      <motion.button
        whileHover={{ x: 4 }}
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-text-subtle hover:text-primary transition-colors mb-4 cursor-pointer group"
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
        transition={{ duration: 0.5, delay: 0.1, ease }}
        className="relative rounded-3xl overflow-hidden mb-6"
      >
        <div className="bg-gradient-primary p-8 sm:p-10 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <Wand2 className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mb-2 relative z-10">
            مولّد الوصفات الذكي
          </h1>
          <p className="text-white/85 text-sm sm:text-base max-w-lg mx-auto relative z-10">
            اكتبي المكونات المتاحة لديكِ وسنساعدك في إيجاد أفضل وصفة!
          </p>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex items-center gap-1.5 flex-shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all cursor-pointer border',
                isActive
                  ? 'bg-gradient-primary text-white border-transparent shadow-[0_4px_12px_rgba(194,24,91,0.3)]'
                  : 'glass-subtle text-text-secondary hover:text-primary hover:border-primary/30'
              )}
            >
              <cat.icon className="h-3.5 w-3.5" />
              {cat.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Ingredients Input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="glass-strong rounded-2xl p-5 mb-6"
      >
        <label className="text-sm font-heading font-bold text-text-main mb-3 block">
          المكونات المتاحة لديكِ
        </label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="مثال: بيض، طماطم، بصل، جبنة، عسل..."
          rows={3}
          className="w-full bg-input-bg rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-subtle outline-none border border-border focus:border-primary/40 transition-colors resize-none"
        />
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          disabled={!ingredients.trim() || isGenerating}
          className={cn(
            'mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer',
            ingredients.trim() && !isGenerating
              ? 'btn-primary'
              : 'bg-border/50 text-text-subtle cursor-not-allowed'
          )}
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              جارٍ توليد الوصفة...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              توليد وصفة
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Generated Recipe */}
      <AnimatePresence>
        {recipe && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease }}
            className="glass-strong gradient-border rounded-2xl overflow-hidden"
          >
            {/* Recipe Header */}
            <div className="bg-gradient-rose-purple p-6 text-white relative">
              <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="text-[11px] bg-white/20 rounded-full px-3 py-1 inline-block mb-2">
                    {categoryLabel(recipe.category)}
                  </span>
                  <h2 className="text-xl font-heading font-bold">{recipe.name}</h2>
                  <p className="text-white/80 text-sm mt-1 leading-relaxed">{recipe.description}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  className="flex-shrink-0 ml-3 cursor-pointer"
                >
                  <Heart
                    className={cn(
                      'h-6 w-6 transition-colors',
                      saved || isFavorite(recipe.id)
                        ? 'text-white fill-white'
                        : 'text-white/60'
                    )}
                  />
                </motion.button>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mt-4 relative z-10">
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{recipe.prepTime} دقيقة</span>
                </div>
                {recipe.calories > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{recipe.calories} سعرة</span>
                  </div>
                )}
                <span className={cn('text-xs font-medium', difficultyColor(recipe.difficulty))}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>

            {/* Recipe Content */}
            <div className="p-5">
              {/* Ingredients */}
              <div className="mb-5">
                <h3 className="text-sm font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  المكونات
                </h3>
                <div className="space-y-2">
                  {recipe.ingredients.map((ing, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2.5"
                    >
                      <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-text-secondary">{ing}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 className="text-sm font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  خطوات التحضير
                </h3>
                <div className="space-y-3">
                  {recipe.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="flex gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed pt-1">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
