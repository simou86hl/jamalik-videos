'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Shirt,
  Briefcase,
  PartyPopper,
  Dumbbell,
  Flower2,
  Sun,
  Snowflake,
  Palette,
  Lightbulb,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BODY_TYPE_TIPS } from '@/data/featuresData';
import type { BodyType } from '@/types';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const bodyTypes: { id: BodyType; label: string; emoji: string }[] = [
  { id: 'slim', label: 'نحيفة', emoji: '👗' },
  { id: 'average', label: 'متوسطة', emoji: '👔' },
  { id: 'curvy', label: 'منحنية', emoji: '👗' },
  { id: 'plus', label: 'كاملة', emoji: '✨' },
];

const occasions = [
  { id: 'casual', label: 'كاجوال', icon: Shirt },
  { id: 'formal', label: 'رسمي', icon: Briefcase },
  { id: 'party', label: 'سهرة', icon: PartyPopper },
  { id: 'sport', label: 'رياضي', icon: Dumbbell },
];

const seasons = [
  { id: 'spring', label: 'ربيع', icon: Flower2, colors: ['#FFB7C5', '#98D8C8', '#F7DC6F', '#FADBD8', '#D5F5E3'] },
  { id: 'summer', label: 'صيف', icon: Sun, colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8A5C', '#A8E6CF'] },
  { id: 'fall', label: 'خريف', icon: ChevronDown, colors: ['#C0392B', '#E67E22', '#8B4513', '#D4A574', '#2C3E50'] },
  { id: 'winter', label: 'شتاء', icon: Snowflake, colors: ['#2C3E50', '#BDC3C7', '#1ABC9C', '#8E44AD', '#E74C3C'] },
];

interface OutfitCard {
  id: string;
  title: string;
  description: string;
  items: string[];
  colors: string[];
  tips: string[];
}

const OUTFIT_DATABASE: Record<string, OutfitCard[]> = {
  'slim-casual': [
    {
      id: 'o1',
      title: 'إطلالة كاجوال ناعمة',
      description: 'إطلالة مريحة وأنيقة تناسب النوع النحيف وتعطي حجم جميل',
      items: ['بلوزة منفوخة بأكمام واسعة', 'جينز عالي الخصر', 'حذاء كاجوال أبيض', 'حقيبة صليبية'],
      colors: ['#FFB7C5', '#F5F5DC', '#87CEEB'],
      tips: ['الطبقات تعطي حجم للجسم النحيف', 'الألوان الفاتحة تزيد من اتساع القوام'],
    },
    {
      id: 'o2',
      title: 'تنورة منقوشة مع تيشرت',
      description: 'تنسيق شاب وبسيط يناسب الخروجات اليومية',
      items: ['تيشرت قطني أبيض', 'تنورة ميدي منقوشة', 'صندل مسطح', 'نظارة شمسية'],
      colors: ['#FFC0CB', '#FFE4B5', '#E6E6FA'],
      tips: ['التنورة الواسعة تبرز الخصر', 'إكسسوارات بارزة تضيف لمسة أنثوية'],
    },
    {
      id: 'o3',
      title: 'سويتشيرت مع ليجينز',
      description: 'إطلالة رياضية أنيقة لليوم المدرسي أو التسوق',
      items: ['سويتشيرت أوفر سايز', 'ليجينز مريح', 'حذاء رياضي', 'كاب لون متباين'],
      colors: ['#DDA0DD', '#90EE90', '#F0E68C'],
      tips: ['الأحجام الكبيرة تعطي شكل متوازن', 'الألوان الزاهية تجذب الانتباه بإيجابية'],
    },
  ],
  default: [
    {
      id: 'd1',
      title: 'إطلالة أنيقة ومتعددة الاستخدامات',
      description: 'تنسيق يناسب مختلف المناسبات مع لمسة عصرية',
      items: ['فستان محابي أنيق', 'كعب متوسط', 'حقيبة يد أنيقة', 'إكسسوارات بسيطة'],
      colors: ['#F06292', '#CE93D8', '#F5C26B'],
      tips: ['اختاري ألوان تناسب لون بشرتكِ', 'الإكسسوارات البسيطة تضيف أناقة'],
    },
    {
      id: 'd2',
      title: 'عباية مطرزة مع تنورة',
      description: 'إطلالة عربية راقية تناسب المناسبات الرسمية',
      items: ['عباية مطرزة بالكريستال', 'تنورة داخلية حريرية', 'كعب عالي', 'شنطة كلاتش'],
      colors: ['#1A1A2E', '#C2185B', '#FFD700'],
      tips: ['العباية المطرزة تعطي إطلالة فاخرة', 'اختاري لون الكعب يتناسق مع التطريز'],
    },
    {
      id: 'd3',
      title: 'بدلة نسائية حديثة',
      description: 'إطلالة احترافية وقوية للعمل والاجتماعات',
      items: ['بنطلون واسع راقي', 'بلوزة ساتان', 'جاكيت متماثل', 'حذاء كعب مزين'],
      colors: ['#2C3E50', '#E91E63', '#FFFFFF'],
      tips: ['البدلة المنسقة تعطي ثقة بالنفس', 'الألوان الداكنة تطيل القوام'],
    },
  ],
};

function getOutfitKey(bodyType: BodyType, occasion: string): string {
  const key = `${bodyType}-${occasion}`;
  return OUTFIT_DATABASE[key] ? key : 'default';
}

export function StyleAdvisorPage() {
  const { goBack } = useStore();
  const [selectedBody, setSelectedBody] = useState<BodyType | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [outfits, setOutfits] = useState<OutfitCard[]>([]);

  const handleGenerate = useCallback(() => {
    if (!selectedBody || !selectedOccasion) return;
    setIsGenerating(true);
    setOutfits([]);

    setTimeout(() => {
      const key = getOutfitKey(selectedBody, selectedOccasion);
      setOutfits(OUTFIT_DATABASE[key]);
      setIsGenerating(false);
    }, 1500);
  }, [selectedBody, selectedOccasion]);

  const bodyTypeData = selectedBody ? BODY_TYPE_TIPS[selectedBody] : null;
  const seasonData = seasons.find((s) => s.id === selectedSeason);

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
        <div className="bg-gradient-warm p-8 sm:p-10 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <Sparkles className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mb-2 relative z-10">
            مستشار الأزياء الذكي
          </h1>
          <p className="text-white/85 text-sm sm:text-base max-w-lg mx-auto relative z-10">
            اختاري شكل جسمكِ والمناسبة وسنقترح عليكِ أفضل الإطلالات!
          </p>
        </div>
      </motion.div>

      {/* Body Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-5"
      >
        <h3 className="text-sm font-heading font-bold text-text-main mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-gradient-primary" />
          شكل الجسم
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {bodyTypes.map((bt) => (
            <motion.button
              key={bt.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedBody(bt.id)}
              className={cn(
                'glass-strong rounded-2xl p-4 text-center cursor-pointer transition-all border-2',
                selectedBody === bt.id
                  ? 'border-primary bg-primary/5 shadow-[var(--shadow-glow)]'
                  : 'border-transparent card-hover'
              )}
            >
              <motion.span
                animate={selectedBody === bt.id ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="text-3xl block mb-2"
              >
                {bt.emoji}
              </motion.span>
              <span className="text-sm font-medium text-text-main">{bt.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Body Type Tips */}
      <AnimatePresence>
        {bodyTypeData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-subtle rounded-xl p-4 mb-5"
          >
            <h4 className="text-xs font-heading font-bold text-text-secondary mb-2 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-accent" />
              نصائح لشكل الجسم {bodyTypeData.name}
            </h4>
            <ul className="space-y-1">
              {bodyTypeData.tips.map((tip, i) => (
                <li key={i} className="text-xs text-text-subtle flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Occasion Selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mb-5"
      >
        <h3 className="text-sm font-heading font-bold text-text-main mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-gradient-warm" />
          المناسبة
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {occasions.map((occ) => (
            <motion.button
              key={occ.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedOccasion(occ.id)}
              className={cn(
                'glass-strong rounded-2xl p-4 text-center cursor-pointer transition-all border-2',
                selectedOccasion === occ.id
                  ? 'border-primary bg-primary/5 shadow-[var(--shadow-glow)]'
                  : 'border-transparent card-hover'
              )}
            >
              <occ.icon
                className={cn(
                  'h-6 w-6 mx-auto mb-2 transition-colors',
                  selectedOccasion === occ.id ? 'text-primary' : 'text-text-subtle'
                )}
              />
              <span className="text-sm font-medium text-text-main">{occ.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Season Selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mb-6"
      >
        <h3 className="text-sm font-heading font-bold text-text-main mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-gradient-rose-purple" />
          الفصل
          <span className="text-xs text-text-subtle font-normal">(اختياري)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {seasons.map((season) => (
            <motion.button
              key={season.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedSeason(season.id === selectedSeason ? null : season.id)}
              className={cn(
                'glass-strong rounded-2xl p-4 text-center cursor-pointer transition-all border-2',
                selectedSeason === season.id
                  ? 'border-primary bg-primary/5 shadow-[var(--shadow-glow)]'
                  : 'border-transparent card-hover'
              )}
            >
              <season.icon
                className={cn(
                  'h-6 w-6 mx-auto mb-2 transition-colors',
                  selectedSeason === season.id ? 'text-primary' : 'text-text-subtle'
                )}
              />
              <span className="text-sm font-medium text-text-main">{season.label}</span>
              {/* Color palette dots */}
              <div className="flex justify-center gap-1 mt-2">
                {season.colors.slice(0, 3).map((color, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-white/50 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Season Color Palette */}
      <AnimatePresence>
        {seasonData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-subtle rounded-xl p-4 mb-5"
          >
            <h4 className="text-xs font-heading font-bold text-text-secondary mb-2.5 flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-primary" />
              ألوان موسم {seasonData.label}
            </h4>
            <div className="flex gap-2">
              {seasonData.colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="w-9 h-9 rounded-xl shadow-sm border border-border/50"
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Button */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleGenerate}
        disabled={!selectedBody || !selectedOccasion || isGenerating}
        className={cn(
          'w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all mb-6 cursor-pointer',
          selectedBody && selectedOccasion && !isGenerating
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
            جارٍ البحث عن أفضل الإطلالات...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            الحصول على نصائح
          </>
        )}
      </motion.button>

      {/* Outfit Results */}
      <AnimatePresence>
        {outfits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease }}
            className="space-y-4"
          >
            <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              إطلالات مقترحة لكِ
            </h3>

            {outfits.map((outfit, index) => (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.15, ease }}
                className="glass-strong gradient-border rounded-2xl overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-sunset p-5">
                  <h4 className="text-base font-heading font-bold text-text-main">{outfit.title}</h4>
                  <p className="text-xs text-text-secondary mt-1">{outfit.description}</p>
                </div>

                <div className="p-5">
                  {/* Color Palette */}
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="h-4 w-4 text-text-subtle" />
                    <span className="text-xs text-text-subtle">لوحة الألوان:</span>
                    <div className="flex gap-1.5">
                      {outfit.colors.map((color, i) => (
                        <span
                          key={i}
                          className="w-6 h-6 rounded-lg shadow-sm border border-border/50"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Clothing Items */}
                  <div className="mb-4">
                    <h5 className="text-xs font-heading font-bold text-text-secondary mb-2">قطع الملابس:</h5>
                    <div className="space-y-1.5">
                      {outfit.items.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.15 + i * 0.05 }}
                          className="flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-sm text-text-secondary">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-primary/5 rounded-xl p-3">
                    <h5 className="text-xs font-heading font-bold text-primary mb-1.5 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" />
                      نصائح:
                    </h5>
                    {outfit.tips.map((tip, i) => (
                      <p key={i} className="text-xs text-text-secondary leading-relaxed">
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
