'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  ArrowRight,
  Camera,
  ImageIcon,
  RotateCcw,
  Droplets,
  Sparkles,
  Sun,
  Moon,
  Shield,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

type SkinTypeName = 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';

interface SkinAnalysisResult {
  skinType: SkinTypeName;
  skinTypeLabel: string;
  skinTypeAr: string;
  skinTypePercentage: number;
  concerns: {
    name: string;
    severity: 'low' | 'medium' | 'high';
    severityAr: string;
    severityPercent: number;
  }[];
  scores: {
    label: string;
    icon: React.ElementType;
    value: number;
    color: string;
  }[];
  morningRoutine: {
    step: string;
    product: string;
  }[];
  eveningRoutine: {
    step: string;
    product: string;
  }[];
}

const SIMULATED_RESULTS: SkinAnalysisResult = {
  skinType: 'combination',
  skinTypeLabel: 'Combination',
  skinTypeAr: 'بشرة مختلطة',
  skinTypePercentage: 78,
  concerns: [
    { name: 'البقع الداكنة', severity: 'medium', severityAr: 'متوسط', severityPercent: 55 },
    { name: 'المسام الواسعة', severity: 'medium', severityAr: 'متوسط', severityPercent: 60 },
    { name: 'حب الشباب', severity: 'low', severityAr: 'خفيف', severityPercent: 30 },
    { name: 'الجفاف', severity: 'low', severityAr: 'خفيف', severityPercent: 25 },
    { name: 'التجاعيد', severity: 'low', severityAr: 'خفيف', severityPercent: 15 },
    { name: 'الحساسية', severity: 'medium', severityAr: 'متوسط', severityPercent: 40 },
  ],
  scores: [
    { label: 'الترطيب', icon: Droplets, value: 72, color: 'bg-blue-500' },
    { label: 'المرونة', icon: Sparkles, value: 85, color: 'bg-purple-500' },
    { label: 'النضارة', icon: Sun, value: 68, color: 'bg-amber-500' },
    { label: 'التوحيد', icon: Shield, value: 60, color: 'bg-green-500' },
  ],
  morningRoutine: [
    { step: 'تنظيف', product: 'غسول رغوي للبشرة المختلطة' },
    { step: 'تونر', product: 'تونر ماء الورد والألوفيرا' },
    { step: 'سيروم', product: 'سيروم فيتامين سي للنضارة' },
    { step: 'مرطب', product: 'كريم مرطب خفيف بدون زيوت' },
    { step: 'حماية', product: 'واقي شمس SPF 50 خفيف' },
  ],
  eveningRoutine: [
    { step: 'إزالة المكياج', product: 'زيت إزالة مكياج لطيف' },
    { step: 'تنظيف', product: 'غسول لطيف بماء دافئ' },
    { step: 'تونر', product: 'تونر حمض الهيالورونيك' },
    { step: 'سيروم', product: 'سيروم الريتينول (مرتين أسبوعياً)' },
    { step: 'ترطيب ليلي', product: 'كريم ليلي مغذٍ بالنياسيناميد' },
  ],
};

const skinTypeDescriptions: Record<SkinTypeName, string> = {
  oily: 'بشرتك دهنية — تحتاج منتجات خالية من الزيوت وتنظيف منتظم للسيطرة على اللمعان',
  dry: 'بشرتك جافة — تحتاج ترطيباً عميقاً ومنتجات غنية بالزيوت الطبيعية لمنع التشقق',
  combination: 'بشرتك مختلطة — دهنية في منطقة T وجافة في الخدود — تحتاج روتين متوازن',
  sensitive: 'بشرتك حساسة — تجنبي المنتجات العطرية والقاسية واستخدمي مكونات لطيفة',
  normal: 'بشرتك طبيعية — محظوظة! حافظي على روتينك الأساسي واستخدمي واقي الشمس يومياً',
};

const severityColor = (s: string) => {
  if (s === 'high') return 'text-red-500 bg-red-500/10';
  if (s === 'medium') return 'text-amber-500 bg-amber-500/10';
  return 'text-green-500 bg-green-500/10';
};

export function SkinAnalyzerPage() {
  const { goBack } = useStore();
  const [phase, setPhase] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [results] = useState<SkinAnalysisResult>(SIMULATED_RESULTS);

  const handleAnalyze = () => {
    setPhase('analyzing');
    setTimeout(() => {
      setPhase('results');
    }, 2500);
  };

  const handleRetake = () => {
    setPhase('upload');
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
        <div className="bg-gradient-rose-purple p-8 sm:p-10 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <Scan className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mb-2 relative z-10">
            محلل البشرة والشعر
          </h1>
          <p className="text-white/85 text-sm sm:text-base max-w-lg mx-auto relative z-10">
            صورة واحدة تكفي لتحليل نوع بشرتكِ والحصول على روتين مخصص
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Upload Phase */}
        {phase === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease }}
          >
            <motion.button
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              className="w-full glass-strong gradient-border rounded-2xl p-10 sm:p-14 cursor-pointer group relative overflow-hidden"
            >
              <div className="pattern-dots absolute inset-0 opacity-[0.03]" />
              <div className="flex flex-col items-center gap-4 relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="w-20 h-20 rounded-3xl bg-gradient-primary/15 flex items-center justify-center group-hover:bg-gradient-primary transition-all duration-300"
                >
                  <Camera className="h-9 w-9 text-primary group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-lg font-heading font-bold text-text-main mb-1">
                    اضغطي لتحليل بشرتكِ
                  </h3>
                  <p className="text-sm text-text-subtle">
                    التقطي صورة أو اختر صورة من المعرض
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-secondary" />
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Before/After Placeholders */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="glass-subtle rounded-2xl p-5 text-center">
                <div className="w-full aspect-square rounded-xl bg-gradient-sunset flex items-center justify-center mb-2">
                  <ImageIcon className="h-8 w-8 text-text-subtle" />
                </div>
                <span className="text-xs text-text-subtle font-medium">قبل</span>
              </div>
              <div className="glass-subtle rounded-2xl p-5 text-center opacity-50">
                <div className="w-full aspect-square rounded-xl bg-gradient-sunset flex items-center justify-center mb-2">
                  <Sparkles className="h-8 w-8 text-text-subtle" />
                </div>
                <span className="text-xs text-text-subtle font-medium">بعد (بعد التحليل)</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analyzing Phase */}
        {phase === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease }}
            className="glass-strong gradient-border rounded-2xl p-10 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-3xl bg-gradient-primary/15 flex items-center justify-center mx-auto mb-5"
            >
              <Scan className="h-9 w-9 text-primary" />
            </motion.div>
            <h3 className="text-lg font-heading font-bold text-text-main mb-2">
              جارٍ تحليل بشرتكِ...
            </h3>
            <p className="text-sm text-text-subtle mb-6">
              نحن نحلل نوع بشرتكِ ومستوى الترطيب والمشاكل المحتملة
            </p>
            {/* Animated progress bar */}
            <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-border overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
                className="h-full rounded-full bg-gradient-primary"
              />
            </div>
            <div className="flex justify-center gap-6 mt-6 text-xs text-text-subtle">
              {['نوع البشرة', 'المشاكل', 'الترطيب', 'الروتين'].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.6 }}
                  className="flex items-center gap-1.5"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ delay: i * 0.6, duration: 0.4 }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </motion.div>
                  {step}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Phase */}
        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease }}
            className="space-y-5"
          >
            {/* Skin Type Detection */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-strong rounded-2xl p-5"
            >
              <h3 className="text-sm font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                <Scan className="h-4 w-4 text-primary" />
                نوع البشرة
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-heading font-bold text-gradient">
                  {results.skinTypeAr}
                </span>
                <span className="text-sm text-primary font-semibold">
                  {results.skinTypePercentage}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-border overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${results.skinTypePercentage}%` }}
                  transition={{ duration: 1, delay: 0.3, ease }}
                  className="h-full rounded-full bg-gradient-primary"
                />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {skinTypeDescriptions[results.skinType]}
              </p>
            </motion.div>

            {/* Score Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-5"
            >
              <h3 className="text-sm font-heading font-bold text-text-main mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                نقاط البشرة
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {results.scores.map((score, index) => (
                  <motion.div
                    key={score.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center mx-auto mb-2">
                      <score.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="relative w-14 h-14 mx-auto mb-1.5">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border-color)" strokeWidth="4" />
                        <motion.circle
                          cx="28"
                          cy="28"
                          r="24"
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${(score.value / 100) * 150.8} 150.8`}
                          initial={{ strokeDasharray: '0 150.8' }}
                          animate={{ strokeDasharray: `${(score.value / 100) * 150.8} 150.8` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.15, ease }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-main">
                        {score.value}
                      </span>
                    </div>
                    <span className="text-[11px] text-text-subtle">{score.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Concerns */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-strong rounded-2xl p-5"
            >
              <h3 className="text-sm font-heading font-bold text-text-main mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                المشاكل المحتملة
              </h3>
              <div className="space-y-3">
                {results.concerns.map((concern, index) => (
                  <motion.div
                    key={concern.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm text-text-secondary flex-1">{concern.name}</span>
                    <span
                      className={cn(
                        'text-[10px] font-medium px-2 py-0.5 rounded-full',
                        severityColor(concern.severity)
                      )}
                    >
                      {concern.severityAr}
                    </span>
                    <div className="w-16 h-2 rounded-full bg-border overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${concern.severityPercent}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.08, ease }}
                        className={cn(
                          'h-full rounded-full',
                          concern.severity === 'high'
                            ? 'bg-red-500'
                            : concern.severity === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                        )}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Morning Routine */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-strong rounded-2xl p-5"
            >
              <h3 className="text-sm font-heading font-bold text-text-main mb-4 flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                روتين الصباح
              </h3>
              <div className="space-y-2.5">
                {results.morningRoutine.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-amber-600 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <span className="text-sm text-text-main font-medium">{item.step}</span>
                      <span className="text-xs text-text-subtle block">{item.product}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Evening Routine */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-strong rounded-2xl p-5"
            >
              <h3 className="text-sm font-heading font-bold text-text-main mb-4 flex items-center gap-2">
                <Moon className="h-4 w-4 text-purple-500" />
                روتين المساء
              </h3>
              <div className="space-y-2.5">
                {results.eveningRoutine.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-purple-600 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <span className="text-sm text-text-main font-medium">{item.step}</span>
                      <span className="text-xs text-text-subtle block">{item.product}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Retake Button */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRetake}
              className="w-full btn-outline flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              إعادة التحليل
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
