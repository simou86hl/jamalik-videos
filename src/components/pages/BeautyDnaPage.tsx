'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dna,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Droplets,
  Scissors,
  Heart,
  Palette,
  Moon,
  Sun,
  Star,
  Flower2,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

// ─── Easing ───────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Quiz steps definition ────────────────────────────────────
interface QuizStep {
  id: string;
  title: string;
  question: string;
  options: { value: string; label: string; icon: React.ElementType }[];
}

const QUIZ_STEPS: QuizStep[] = [
  {
    id: 'skin',
    title: 'نوع البشرة',
    question: 'ما هو نوع بشرتك؟',
    options: [
      { value: 'oily', label: 'دهنية', icon: Droplets },
      { value: 'dry', label: 'جافة', icon: Sun },
      { value: 'combination', label: 'مختلطة', icon: Sparkles },
      { value: 'sensitive', label: 'حساسة', icon: Heart },
      { value: 'normal', label: 'عادية', icon: Flower2 },
    ],
  },
  {
    id: 'hair',
    title: 'نوع الشعر',
    question: 'كيف تصفين شعرك؟',
    options: [
      { value: 'straight', label: 'أملس', icon: Scissors },
      { value: 'wavy', label: 'مموج', icon: Moon },
      { value: 'curly', label: 'مجعد', icon: Star },
      { value: 'coily', label: 'كثيف مجعد', icon: Dna },
      { value: 'thinning', label: 'خفيف', icon: Droplets },
    ],
  },
  {
    id: 'lifestyle',
    title: 'نمط الحياة',
    question: 'كيف تصفين نمط حياتك اليومي؟',
    options: [
      { value: 'active', label: 'نشطة ورياضية', icon: Heart },
      { value: 'busy', label: 'مشغولة وحيوية', icon: Sun },
      { value: 'relaxed', label: 'هادئة ومسترخية', icon: Moon },
      { value: 'creative', label: 'إبداعية ومتنوعة', icon: Palette },
      { value: 'balanced', label: 'متوازنة', icon: Flower2 },
    ],
  },
  {
    id: 'concerns',
    title: 'المشاكل',
    question: 'ما هو أكبر قلقك الجمالي؟',
    options: [
      { value: 'acne', label: 'حبوب الشباب', icon: Droplets },
      { value: 'aging', label: 'علامات التقدم بالعمر', icon: Moon },
      { value: 'hairloss', label: 'تساقط الشعر', icon: Scissors },
      { value: 'dullness', label: 'بهتان البشرة', icon: Sparkles },
      { value: 'dryness', label: 'الجفاف', icon: Sun },
    ],
  },
  {
    id: 'preferences',
    title: 'التفضيلات',
    question: 'ما الذي تفضلينه في منتجات العناية؟',
    options: [
      { value: 'natural', label: 'مكونات طبيعية', icon: Flower2 },
      { value: 'luxury', label: 'منتجات فاخرة', icon: Star },
      { value: 'minimal', label: 'روتين بسيط', icon: Moon },
      { value: 'science', label: 'تركيبات علمية', icon: Dna },
      { value: 'affordable', label: 'بأسعار مناسبة', icon: Heart },
    ],
  },
];

// ─── Beauty DNA results ───────────────────────────────────────
interface BeautyDnaResult {
  name: string;
  emoji: string;
  description: string;
  skincare: string[];
  haircare: string[];
  makeup: string[];
  compatibleProducts: string[];
  beautyScore: number;
}

function getBeautyDnaResult(answers: Record<string, string>): BeautyDnaResult {
  // Simple scoring logic based on answers
  const { skin, hair, lifestyle, concerns, preferences } = answers;

  // Determine primary type based on combination
  if (skin === 'natural' || preferences === 'natural' || lifestyle === 'relaxed') {
    return {
      name: 'إلهة الطبيعة',
      emoji: '🌿',
      description: 'أنتِ تحبين الجمال الطبيعي البسيط وتهتمين بالعناية من الداخل. مظهرك الإشعاعي ينبع من ثقتك ورعايتك لذاتك.',
      skincare: ['تنظيف لطيف بالزيوت', 'ترطيب بالألوفيرا', 'ماسكات العسل والشوفان', 'واقي شمس معدني'],
      haircare: ['زيت جوز الهند أسبوعياً', 'شامبو خالي من السلفات', 'بلسم طبيعي بالأفوكادو'],
      makeup: ['كريم أساس خفيف', 'أحمر شفاه بلون طبيعي', 'ماسكارا طبيعية', 'بلاشر خوخي'],
      compatibleProducts: ['منتجات عضوية', 'زيوت نباتية', 'ماسكات منزلية', 'واقي شمس طبيعي'],
      beautyScore: 92,
    };
  }

  if (preferences === 'luxury' || lifestyle === 'creative' || hair === 'straight') {
    return {
      name: 'ملكة الأناقة',
      emoji: '👑',
      description: 'أنتِ تعشقين الفخامة والأناقة في كل تفصيلة. ذوقك الرفيع يظهر في اختياراتك الجمالية المميزة.',
      skincare: ['سيروم الهيالورونيك', 'كريم ليلي بالذهب', 'تونر بالورد', 'غسول فاخر'],
      haircare: ['سيروم الحرير', 'ماسك الكيراتين', 'زيت الأرغان الفاخر'],
      makeup: ['كريم أساس سيلكي', 'أحمر شفاه مات', 'كونتور محترف', 'ظلال عيون ساتان'],
      compatibleProducts: ['ماركات فاخرة', 'تركيبات مبتكرة', 'سيروم متقدمة', 'عطور مميزة'],
      beautyScore: 96,
    };
  }

  if (concerns === 'acne' || skin === 'oily' || skin === 'sensitive') {
    return {
      name: 'نبض الحيوية',
      emoji: '✨',
      description: 'بشرتك نشطة وتحتاج عناية خاصة. مع الروتين الصحي ستلاحظين فرقاً كبيراً في نضارة بشرتك.',
      skincare: ['غسول ساليسيليك', 'تونر خالي من الكحول', 'سيروم النياسيناميد', 'مرطب خفيف غير كوميدوني'],
      haircare: ['شامبو مضاد للقشرة', 'ماسك الطين', 'بخار فروة الرأس'],
      makeup: ['كريم أساس طبي', 'كونسيلر مضاد للعيوب', 'بودرة مات'],
      compatibleProducts: ['منتجات خالية من العطور', 'تركيبات طبية', 'حماية عالية SPF'],
      beautyScore: 85,
    };
  }

  if (lifestyle === 'active' || lifestyle === 'busy' || hair === 'thinning') {
    return {
      name: 'رياضية متألقة',
      emoji: '💪',
      description: 'أنتِ امرأة قوية ونشيطة. جمالك يكمن في طاقتك الإيجابية وحيويتك التي تنير كل مكان.',
      skincare: ['غسول بعد التمرين', 'سيروم فيتامين سي', 'مرطب مقاوم للعرق', 'واقي شمس رياضي'],
      haircare: ['شامبو عميق التنظيف', 'بخاخ ملح البحر', 'ماسك بروتين'],
      makeup: ['مكياج مقاوم للعرق', 'بلاشر كريمي', 'ملمع شفاه'],
      compatibleProducts: ['منتجات مقاومة للماء', 'عناية سريعة', 'منظفات غسول'],
      beautyScore: 88,
    };
  }

  // Default
  return {
    name: 'فراشة الموسمية',
    emoji: '🦋',
    description: 'أنتِ تتكيفين مع كل موسم وتتغيرين بجمالك. مرونتك وذكائك الجمالي من أقوى صفاتك.',
    skincare: ['ترطيب موسمي', 'حماية شمس يومية', 'تقشير أسبوعي', 'سيروم فيتامين سي'],
    haircare: ['عناية حسب الموسم', 'ماسك مرطب شتوي', 'بخار صيفي'],
    makeup: ['لوحة ألوان موسمية', 'كريم أساس متعدد الاستخدام', 'أحمر شفاه شفاف'],
    compatibleProducts: ['عناية متعددة الاستخدام', 'تركيبات موسمية', 'منتجات حماية'],
    beautyScore: 90,
  };
}

// ─── Component ────────────────────────────────────────────────
export function BeautyDnaPage() {
  const { goBack } = useStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [animDirection, setAnimDirection] = useState(1);

  const step = QUIZ_STEPS[currentStep];
  const progress = ((currentStep + (showResult ? 1 : 0)) / QUIZ_STEPS.length) * 100;
  const isStepComplete = !!answers[step.id];

  const handleSelect = (stepId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  };

  const handleNext = () => {
    if (currentStep < QUIZ_STEPS.length - 1) {
      setAnimDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setAnimDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
    setAnimDirection(1);
  };

  // ─── Result view ──────────────────────────────────────────
  if (showResult) {
    const result = getBeautyDnaResult(answers);
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
          onClick={handleRetake}
          className="flex items-center gap-2 text-sm text-text-subtle hover:text-primary transition-colors mb-6 cursor-pointer group"
        >
          <span className="glass-subtle rounded-full p-1.5 group-hover:bg-primary/10 transition-colors">
            <ArrowRight className="h-4 w-4" />
          </span>
          العودة
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="glass-strong gradient-border rounded-3xl overflow-hidden max-w-2xl mx-auto"
        >
          {/* Result header */}
          <div className="bg-gradient-primary p-8 text-center text-white relative">
            <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
              className="text-6xl mb-3 relative z-10"
            >
              {result.emoji}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ease }}
              className="text-2xl sm:text-3xl font-heading font-extrabold mb-2 relative z-10"
            >
              {result.name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ease }}
              className="text-sm text-white/85 max-w-md mx-auto relative z-10 leading-relaxed"
            >
              {result.description}
            </motion.p>
          </div>

          <div className="p-6 space-y-6">
            {/* Beauty Score */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ease }}
              className="glass-subtle rounded-2xl p-5 text-center"
            >
              <p className="text-xs text-text-subtle mb-2 font-medium">معدل الجمال</p>
              <div className="relative w-28 h-28 mx-auto mb-2">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-border-light"
                  />
                  <motion.circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - result.beautyScore / 100) }}
                    transition={{ delay: 0.8, duration: 1.2, ease }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-3xl font-heading font-extrabold text-gradient"
                  >
                    {result.beautyScore}%
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Recommendations */}
            {[
              { title: 'العناية بالبشرة', items: result.skincare, icon: Droplets, color: 'text-pink-500' },
              { title: 'العناية بالشعر', items: result.haircare, icon: Scissors, color: 'text-amber-500' },
              { title: 'المكياج', items: result.makeup, icon: Palette, color: 'text-purple-500' },
            ].map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.12, ease }}
                className="glass-subtle rounded-2xl p-5"
              >
                <h3 className="font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                  <section.icon className={cn('h-5 w-5', section.color)} />
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-primary flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Compatible products */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, ease }}
              className="glass-subtle rounded-2xl p-5"
            >
              <h3 className="font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                منتجات مناسبة لكِ
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.compatibleProducts.map((product, i) => (
                  <span
                    key={i}
                    className="text-xs glass px-3 py-1.5 rounded-full text-text-secondary font-medium"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Retake button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, ease }}
              className="pt-2"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleRetake}
                className="btn-outline w-full flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="h-4 w-4" />
                إعادة الاختبار
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ─── Quiz flow ────────────────────────────────────────────
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

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease }}
        className="relative rounded-3xl overflow-hidden mb-10"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Dna className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            ملف جمالكِ الشخصي
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            اكتشفي هويتك الجمالية الفريدة واحصلي على توصيات مخصصة لكِ
          </p>
        </div>
      </motion.div>

      {/* Step indicator */}
      <div className="glass-strong rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-heading font-bold text-text-main">
            {step.title}
          </span>
          <span className="text-xs glass-subtle px-3 py-1 rounded-full text-primary font-medium">
            {currentStep + 1} / {QUIZ_STEPS.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-border-light overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease }}
            className="h-full rounded-full bg-gradient-primary"
          />
        </div>
        {/* Step dots */}
        <div className="flex items-center justify-center gap-2">
          {QUIZ_STEPS.map((s, idx) => (
            <motion.div
              key={s.id}
              animate={{
                scale: idx === currentStep ? 1.3 : 1,
                backgroundColor: idx <= currentStep ? 'var(--primary)' : 'var(--border-color)',
              }}
              className="w-2.5 h-2.5 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: animDirection > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: animDirection > 0 ? -40 : 40 }}
          transition={{ duration: 0.3, ease }}
        >
          <div className="glass-strong rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-heading font-bold text-text-main text-center leading-relaxed">
              {step.question}
            </h3>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {step.options.map((option) => {
              const Icon = option.icon;
              const isSelected = answers[step.id] === option.value;
              return (
                <motion.button
                  key={option.value}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(step.id, option.value)}
                  className={cn(
                    'glass-strong rounded-2xl p-4 text-right transition-all cursor-pointer border-2',
                    'hover:shadow-md',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-transparent hover:border-primary/20'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                        isSelected
                          ? 'bg-gradient-primary text-white'
                          : 'bg-gradient-primary/10 text-primary'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        'text-sm font-semibold transition-all',
                        isSelected ? 'text-primary' : 'text-text-main'
                      )}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mr-auto"
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            {currentStep > 0 ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePrev}
                className="btn-outline flex-1 flex items-center justify-center gap-2 text-sm"
              >
                السابق
              </motion.button>
            ) : (
              <div className="flex-1" />
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!isStepComplete}
              className={cn(
                'flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all',
                isStepComplete
                  ? 'btn-primary'
                  : 'bg-border text-text-subtle cursor-not-allowed'
              )}
              onClick={handleNext}
            >
              {currentStep === QUIZ_STEPS.length - 1 ? (
                <>
                  اكتشفي نتيجتكِ
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
