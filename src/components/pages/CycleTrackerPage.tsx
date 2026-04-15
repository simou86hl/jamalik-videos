'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flower2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Heart,
  Droplets,
  Thermometer,
  AlertCircle,
  Frown,
  Meh,
  Smile,
  Laugh,
  PartyPopper,
  Save,
  X,
  Info,
  Moon,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { CycleDay, CycleData } from '@/types';

// ─── Easing ───────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Phase config ─────────────────────────────────────────────
const PHASE_CONFIG: Record<
  CycleDay['phase'],
  { label: string; color: string; bg: string; border: string; light: string; description: string; tips: string[] }
> = {
  menstrual: {
    label: 'الدورة',
    color: 'text-red-500',
    bg: 'bg-red-500',
    border: 'border-red-500/30',
    light: 'bg-red-500/10',
    description: 'فترة الحيض — تحتاجين لراحة إضافية وعناية خاصة بجسمك',
    tips: [
      'تناولي أطعمة غنية بالحديد مثل السبانخ واللحوم',
      'استخدمي كمادات دافئة لتخفيف الآلام',
      'تجنبي الكافيين والمشروبات الباردة',
      'احصلي على قسط كافٍ من النوم',
      'مارسي تمارين خفيفة مثل المشي واليوغا',
    ],
  },
  follicular: {
    label: 'الجريبي',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500/30',
    light: 'bg-emerald-500/10',
    description: 'فترة نمو البويضات — طاقتكِ في ارتفاع وهو وقت مثالي للبدء بمشاريع جديدة',
    tips: [
      'استغلي الطاقة العالية في ممارسة الرياضة',
      'جرّبي وصفات طبيعية جديدة للبشرة',
      'ابدئي مشاريع جديدة أو تحديات',
      'ركزي على الأطعمة البروتينية الصحية',
      'بشرة شديدة الامتصاص — استغلي الماسكات',
    ],
  },
  ovulation: {
    label: 'الإباضة',
    color: 'text-sky-500',
    bg: 'bg-sky-500',
    border: 'border-sky-500/30',
    light: 'bg-sky-500/10',
    description: 'فترة الإباضة — قمة الخصوبة والطاقة والجاذبية الطبيعية',
    tips: [
      'أنتِ في أقصى إشراقك — استمتعي!',
      'بشرة شديدة النضارة — مكياج خفيف يكفي',
      'شعركِ يمتص العناصر الغذائية بشكل أفضل',
      'انتبهي لتغيرات الإفرازات المهبلية',
      'شربي الكثير من الماء للحفاظ على الترطيب',
    ],
  },
  luteal: {
    label: 'الأصفر',
    color: 'text-amber-500',
    bg: 'bg-amber-500',
    border: 'border-amber-500/30',
    light: 'bg-amber-500/10',
    description: 'فترة ما قبل الحيض — قد تشعرين بتغيرات مزاجية وعضلية',
    tips: [
      'تناولي أطعمة غنية بالمغنيسيوم كالموز والشوكولاتة',
      'مارسي اليوغا والتأمل لتقليل التوتر',
      'استخدمي زيوت مهدئة مثل اللافندر',
      'نوّعي في وجباتك وتجنبي الأطعمة المالحة',
      'نامي مبكراً واحصلي على راحة كافية',
    ],
  },
};

// ─── Symptoms list ────────────────────────────────────────────
const SYMPTOMS = [
  { id: 'cramps', label: 'تشنجات', icon: AlertCircle },
  { id: 'headache', label: 'صداع', icon: Thermometer },
  { id: 'fatigue', label: 'إرهاق', icon: Frown },
  { id: 'bloating', label: 'انتفاخ', icon: Droplets },
  { id: 'acne', label: 'حبوب', icon: AlertCircle },
  { id: 'backpain', label: 'ألم ظهر', icon: Frown },
  { id: 'insomnia', label: 'أرق', icon: Moon },
  { id: 'cravings', label: 'شهية مفرطة', icon: Heart },
];

// ─── Mood options ─────────────────────────────────────────────
const MOODS: { value: CycleDay['mood']; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'great', label: 'ممتاز', icon: PartyPopper, color: 'text-green-500' },
  { value: 'good', label: 'جيد', icon: Laugh, color: 'text-emerald-400' },
  { value: 'okay', label: 'عادي', icon: Smile, color: 'text-amber-400' },
  { value: 'bad', label: 'سيء', icon: Meh, color: 'text-orange-400' },
  { value: 'terrible', label: 'سيء جداً', icon: Frown, color: 'text-red-400' },
];

// ─── Flow levels ──────────────────────────────────────────────
const FLOW_LEVELS = [
  { value: 0, label: 'لا يوجد', dots: 0 },
  { value: 1, label: 'خفيف', dots: 1 },
  { value: 2, label: 'متوسط', dots: 2 },
  { value: 3, label: 'كثيف', dots: 3 },
];

// ─── Month names (Arabic) ─────────────────────────────────────
const MONTH_NAMES = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

const DAY_NAMES = ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];

// ─── Helper: cycle math ───────────────────────────────────────
function getPhaseForDay(dayOffset: number, periodLength: number, cycleLength: number): CycleDay['phase'] {
  if (dayOffset < periodLength) return 'menstrual';
  if (dayOffset < periodLength + (cycleLength - periodLength) * 0.4) return 'follicular';
  if (dayOffset < periodLength + (cycleLength - periodLength) * 0.6) return 'ovulation';
  return 'luteal';
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}



// ─── Component ────────────────────────────────────────────────
export function CycleTrackerPage() {
  const { goBack } = useStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [cycleData, setCycleData] = useState<CycleData>({
    averageLength: 28,
    periodLength: 5,
    lastPeriodDate: toDateKey(new Date()),
    log: [],
  });

  // ─── Calendar generation ────────────────────────────────────
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { date: Date; key: string; dayOfMonth: number; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({ date: d, key: toDateKey(d), dayOfMonth: d.getDate(), isCurrentMonth: false });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, key: toDateKey(d), dayOfMonth: i, isCurrentMonth: true });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, key: toDateKey(d), dayOfMonth: i, isCurrentMonth: false });
    }

    return days;
  }, [currentMonth]);

  // ─── Get / set log for a day ───────────────────────────────
  const getDayLog = (key: string): CycleDay | undefined => {
    return cycleData.log.find((d) => d.date === key);
  };

  const updateDayLog = (key: string, updates: Partial<CycleDay>) => {
    setCycleData((prev) => {
      const existing = prev.log.find((d) => d.date === key);
      if (existing) {
        return {
          ...prev,
          log: prev.log.map((d) => (d.date === key ? { ...d, ...updates } : d)),
        };
      }
      return {
        ...prev,
        log: [
          ...prev.log,
          {
            date: key,
            phase: getPhaseForDay(
              Math.floor(
                (new Date(key).getTime() - new Date(prev.lastPeriodDate).getTime()) / 86400000
              ),
              prev.periodLength,
              prev.averageLength
            ),
            symptoms: [],
            mood: null,
            notes: '',
            flowLevel: 0,
            ...updates,
          },
        ],
      };
    });
  };

  // ─── Cycle stats ────────────────────────────────────────────
  const nextPeriodDate = useMemo(() => {
    const last = new Date(cycleData.lastPeriodDate);
    last.setDate(last.getDate() + cycleData.averageLength);
    return last;
  }, [cycleData]);

  const todayKey = toDateKey(new Date());
  const currentPhase = getPhaseForDay(
    Math.floor((new Date().getTime() - new Date(cycleData.lastPeriodDate).getTime()) / 86400000),
    cycleData.periodLength,
    cycleData.averageLength
  );
  const currentPhaseInfo = PHASE_CONFIG[currentPhase];
  const selectedDayLog = selectedDayKey ? getDayLog(selectedDayKey) : null;

  // ─── Month navigation ───────────────────────────────────────
  const prevMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

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

      {/* ─── Hero ────────────────────────────────────────────── */}
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
            <Flower2 className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            متتبع الدورة الشهرية
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            تابعي دورتكِ الشهرية واحصلي على نصائح مخصصة لكل مرحلة
          </p>
        </div>
      </motion.div>

      {/* ─── Phase description panel ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ease }}
        className={cn('glass-strong rounded-2xl p-5 mb-6 border-r-4', currentPhaseInfo.border)}
      >
        <div className="flex items-start gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', currentPhaseInfo.light)}>
            <Info className={cn('h-5 w-5', currentPhaseInfo.color)} />
          </div>
          <div className="flex-1">
            <h3 className={cn('font-heading font-bold mb-1', currentPhaseInfo.color)}>
              المرحلة الحالية: {currentPhaseInfo.label}
            </h3>
            <p className="text-sm text-text-secondary mb-3 leading-relaxed">
              {currentPhaseInfo.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {currentPhaseInfo.tips.map((tip, i) => (
                <span key={i} className="text-[11px] glass px-2.5 py-1 rounded-full text-text-secondary">
                  {tip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Cycle stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'متوسط الدورة', value: `${cycleData.averageLength} يوم`, color: 'text-primary' },
          { label: 'مدة الدورة', value: `${cycleData.periodLength} أيام`, color: 'text-red-500' },
          { label: 'الدورة القادمة', value: nextPeriodDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }), color: 'text-amber-500' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ease }}
            className="glass-strong rounded-2xl p-4 text-center"
          >
            <div className={cn('text-lg font-heading font-bold mb-0.5', stat.color)}>
              {stat.value}
            </div>
            <div className="text-[10px] text-text-subtle font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ─── Phase legend ────────────────────────────────────── */}
      <div className="glass-strong rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {(Object.keys(PHASE_CONFIG) as CycleDay['phase'][]).map((phase) => (
            <div key={phase} className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 rounded-full', PHASE_CONFIG[phase].bg)} />
              <span className="text-xs text-text-subtle">{PHASE_CONFIG[phase].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Calendar ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ease }}
        className="glass-strong rounded-2xl p-5 mb-6"
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={prevMonth}
            className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center text-text-main hover:text-primary transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
          <h3 className="font-heading font-bold text-text-main">
            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={nextMonth}
            className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center text-text-main hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map((name) => (
            <div key={name} className="text-center text-[10px] text-text-subtle font-medium py-1">
              {name}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const phase = getPhaseForDay(
              Math.max(0, Math.floor((day.date.getTime() - new Date(cycleData.lastPeriodDate).getTime()) / 86400000)),
              cycleData.periodLength,
              cycleData.averageLength
            );
            const phaseConf = PHASE_CONFIG[phase];
            const isToday = day.key === todayKey;
            const isSelected = day.key === selectedDayKey;
            const hasLog = !!getDayLog(day.key);

            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDayKey(day.key === selectedDayKey ? null : day.key)}
                className={cn(
                  'aspect-square rounded-xl flex flex-col items-center justify-center transition-all text-xs relative',
                  !day.isCurrentMonth && 'opacity-30',
                  isToday && 'ring-2 ring-primary',
                  isSelected && 'ring-2 ring-primary bg-primary/10',
                  hasLog && day.key !== selectedDayKey && 'font-bold'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-medium',
                    phase === 'menstrual' ? phaseConf.color : '',
                    !day.isCurrentMonth && 'text-text-subtle',
                    isToday && 'text-primary font-bold'
                  )}
                >
                  {day.dayOfMonth}
                </span>
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full mt-0.5',
                    phaseConf.bg
                  )}
                />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ─── Day Detail Panel ────────────────────────────────── */}
      <AnimatePresence>
        {selectedDayKey && (
          <motion.div
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 16, height: 0 }}
            transition={{ duration: 0.35, ease }}
            className="glass-strong gradient-border rounded-2xl overflow-hidden mb-6"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-text-main flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  {new Date(selectedDayKey + 'T00:00:00').toLocaleDateString('ar-EG', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDayKey(null)}
                  className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-subtle"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Flow level */}
              <div className="mb-5">
                <p className="text-xs text-text-subtle font-medium mb-2 flex items-center gap-1">
                  <Droplets className="h-3.5 w-3.5" />
                  مستوى التدفق
                </p>
                <div className="flex items-center gap-2">
                  {FLOW_LEVELS.map((level) => {
                    const isActive = (selectedDayLog?.flowLevel ?? 0) === level.value;
                    return (
                      <motion.button
                        key={level.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateDayLog(selectedDayKey, { flowLevel: level.value })}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-xs font-medium transition-all border',
                          isActive
                            ? 'bg-gradient-primary text-white border-transparent'
                            : 'glass-subtle text-text-secondary border-transparent hover:border-primary/20'
                        )}
                      >
                        {level.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Mood selector */}
              <div className="mb-5">
                <p className="text-xs text-text-subtle font-medium mb-2 flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  المزاج
                </p>
                <div className="flex items-center justify-between gap-2">
                  {MOODS.map((mood) => {
                    const isActive = selectedDayLog?.mood === mood.value;
                    const MoodIcon = mood.icon;
                    return (
                      <motion.button
                        key={mood.value}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateDayLog(selectedDayKey, { mood: mood.value })}
                        className={cn(
                          'flex flex-col items-center gap-1 p-2 rounded-xl transition-all border',
                          isActive
                            ? 'bg-primary/10 border-primary/30'
                            : 'border-transparent hover:bg-border-light/50'
                        )}
                      >
                        <MoodIcon className={cn('h-5 w-5', isActive ? mood.color : 'text-text-subtle')} />
                        <span className={cn('text-[10px] font-medium', isActive ? mood.color : 'text-text-subtle')}>
                          {mood.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-5">
                <p className="text-xs text-text-subtle font-medium mb-2 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  الأعراض
                </p>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map((symptom) => {
                    const isActive = selectedDayLog?.symptoms.includes(symptom.id);
                    const SymptomIcon = symptom.icon;
                    return (
                      <motion.button
                        key={symptom.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const current = selectedDayLog?.symptoms || [];
                          const newSymptoms = isActive
                            ? current.filter((s) => s !== symptom.id)
                            : [...current, symptom.id];
                          updateDayLog(selectedDayKey, { symptoms: newSymptoms });
                        }}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                          isActive
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'glass-subtle border-transparent text-text-secondary hover:border-primary/20'
                        )}
                      >
                        <SymptomIcon className="h-3 w-3" />
                        {symptom.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <p className="text-xs text-text-subtle font-medium mb-2">ملاحظات</p>
                <textarea
                  value={selectedDayLog?.notes || ''}
                  onChange={(e) => updateDayLog(selectedDayKey, { notes: e.target.value })}
                  placeholder="أضيفي ملاحظاتك هنا..."
                  rows={2}
                  className="w-full text-sm bg-input-bg border border-border rounded-xl px-4 py-3 text-text-main placeholder:text-text-subtle focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Save */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                <Save className="h-4 w-4" />
                حفظ التسجيل
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
