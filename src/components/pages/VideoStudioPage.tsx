'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  ArrowRight,
  Camera,
  Upload,
  Play,
  Heart,
  Eye,
  Sparkles,
  Star,
  Layers,
  Music,
  Wand2,
  X,
  Video,
  Volume2,
  Lightbulb,
  TrendingUp,
  Clock,
  ChevronLeft,
  Info,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, formatNumber } from '@/lib/utils';

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

interface BeautyFilter {
  id: string;
  name: string;
  nameAr: string;
  thumbnail: string;
  color: string;
}

interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface MyVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  createdAt: string;
}

interface TrendingSound {
  id: string;
  title: string;
  artist: string;
  uses: string;
  duration: string;
}

interface Tip {
  title: string;
  description: string;
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const BEAUTY_FILTERS: BeautyFilter[] = [
  { id: 'f1', name: 'Glow', nameAr: 'توهّج', thumbnail: '✨', color: '#FFD700' },
  { id: 'f2', name: 'Smooth', nameAr: 'تنعيم', thumbnail: '🌿', color: '#2E7D52' },
  { id: 'f3', name: 'Brighten', nameAr: 'إشراق', thumbnail: '☀️', color: '#F59E0B' },
  { id: 'f4', name: 'Blush', nameAr: 'أحمر خدود', thumbnail: '🌸', color: '#EC4899' },
  { id: 'f5', name: 'Matte', nameAr: 'مات', thumbnail: '🎨', color: '#8B5CF6' },
  { id: 'f6', name: 'Soft Focus', nameAr: 'تركيز ناعم', thumbnail: '💫', color: '#06B6D4' },
  { id: 'f7', name: 'Rose', nameAr: 'وردي', thumbnail: '🌹', color: '#E11D48' },
  { id: 'f8', name: 'Natural', nameAr: 'طبيعي', thumbnail: '🍃', color: '#10B981' },
];

const VIDEO_TEMPLATES: VideoTemplate[] = [
  { id: 't1', name: 'قبل وبعد', description: 'قارني النتائج قبل وبعد الاستخدام', icon: Layers, color: '#EC4899' },
  { id: 't2', name: 'درس تعليمي', description: 'شاركي خطوات روتينك التجميلي', icon: Lightbulb, color: '#F59E0B' },
  { id: 't3', name: 'جهّزني معك', description: 'GRWM - روتينك الصباحي أو المسائي', icon: Sparkles, color: '#8B5CF6' },
  { id: 't4', name: 'تحوّل جذري', description: 'أظهري تحوّل إطلالتك خطوة بخطوة', icon: Wand2, color: '#E11D48' },
  { id: 't5', name: 'مراجعة منتج', description: 'شاركي رأيك في منتج تجميلي', icon: Star, color: '#06B6D4' },
  { id: 't6', name: 'هاكات تجميل', description: 'نصائح وحيل سريعة للجمال', icon: Info, color: '#10B981' },
];

const MY_VIDEOS: MyVideo[] = [
  {
    id: 'v1',
    title: 'روتين المساء للعناية بالبشرة',
    thumbnail: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=200&h=300&fit=crop',
    duration: '0:45',
    views: 1240,
    likes: 89,
    createdAt: 'منذ يومين',
  },
  {
    id: 'v2',
    title: 'قبل وبعد ماسك العسل',
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=300&fit=crop',
    duration: '1:20',
    views: 3560,
    likes: 234,
    createdAt: 'منذ أسبوع',
  },
  {
    id: 'v3',
    title: 'GRWM سهرة عيد ميلاد',
    thumbnail: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=300&fit=crop',
    duration: '2:10',
    views: 5890,
    likes: 412,
    createdAt: 'منذ أسبوعين',
  },
];

const TRENDING_SOUNDS: TrendingSound[] = [
  { id: 's1', title: 'لحظة سعادة', artist: 'فيروز', uses: '١٢.٣K', duration: '0:15' },
  { id: 's2', title: 'Beauty Beat', artist: 'Trending Audio', uses: '٨.٧K', duration: '0:30' },
  { id: 's3', title: 'رومانسي', artist: 'عمرو دياب', uses: '٦.١K', duration: '0:20' },
  { id: 's4', title: 'Makeup Tutorial Beat', artist: 'Creator Studio', uses: '٤.٥K', duration: '0:45' },
  { id: 's5', title: 'نسم علينا الهوى', artist: 'أم كلثوم', uses: '٣.٨K', duration: '0:25' },
];

const VIDEO_TIPS: Tip[] = [
  { title: 'الإضاءة هي السر', description: 'استخدمي إضاءة طبيعية من النافذة. تجنبي الإضاءة الخلفية القوية.' },
  { title: 'خلفية نظيفة ومنظمة', description: 'اختاري خلفية بسيطة تبرز المحتوى. يمكنك استخدام خلفية بيضاء أو وردي فاتح.' },
  { title: 'التخطيط المسبق', description: 'اكتبي الخطوات التي ستعرضينها وحدّدي المدة المناسبة لكل خطوة.' },
  { title: 'التقطيع الجذاب', description: 'ابدئي بهوك قوي في أول ٣ ثوان. استخدمي انتقالات سلسة بين المشاهد.' },
  { title: 'الموسيقى المناسبة', description: 'اختاري موسيقى خلفية مناسبة لا تطغى على صوتك.' },
];

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function VideoStudioPage() {
  const { goBack } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeSection, setActiveSection] = useState<'create' | 'filters' | 'templates' | 'videos' | 'tips' | 'sounds'>('create');

  const sections: { key: typeof activeSection; label: string; icon: React.ElementType }[] = [
    { key: 'create', label: 'إنشاء', icon: Camera },
    { key: 'filters', label: 'فلاتر', icon: Sparkles },
    { key: 'templates', label: 'قوالب', icon: Layers },
    { key: 'videos', label: 'فيديوهاتي', icon: Video },
    { key: 'sounds', label: 'أصوات', icon: Music },
    { key: 'tips', label: 'نصائح', icon: Lightbulb },
  ];

  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(() => setIsRecording(false), 3000);
  };

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
            <Film className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            استوديو الفيديوهات
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            أنشئي فيديوهات تجميل قصيرة ومبتكرة
          </p>
        </div>
      </motion.div>

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <motion.button
              key={sec.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSection(sec.key)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex-shrink-0 cursor-pointer',
                activeSection === sec.key
                  ? 'btn-primary'
                  : 'glass-subtle text-text-secondary hover:text-text-main'
              )}
            >
              <Icon className="h-4 w-4" />
              {sec.label}
            </motion.button>
          );
        })}
      </div>

      {/* ── Create Section ── */}
      {activeSection === 'create' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="space-y-5"
        >
          {/* Record / Upload */}
          <div className="glass-strong rounded-2xl overflow-hidden gradient-border">
            <div className="p-6 sm:p-8">
              {/* Camera preview area */}
              <div className="relative w-full aspect-[9/16] max-w-xs mx-auto rounded-2xl overflow-hidden bg-bg-secondary border-2 border-dashed border-border mb-6">
                {isRecording ? (
                  <>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-red-500"
                      />
                      <span className="text-xs font-bold text-white bg-red-500/80 px-2 py-0.5 rounded-full">
                        REC
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-red-500/80"
                      >
                        <div className="w-6 h-6 rounded-sm bg-white" />
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-text-subtle text-center px-4">
                      سجّلي فيديو أو ارفعي من معرض الصور
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRecord}
                  disabled={isRecording}
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer',
                    isRecording
                      ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                      : 'bg-gradient-primary shadow-[0_0_24px_rgba(194,24,91,0.4)]'
                  )}
                >
                  {isRecording ? (
                    <div className="w-6 h-6 rounded-sm bg-white" />
                  ) : (
                    <Camera className="h-7 w-7 text-white" />
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="glass-subtle rounded-full p-4 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <Upload className="h-6 w-6" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-strong rounded-2xl p-4 text-center">
              <Video className="h-5 w-5 text-primary mx-auto mb-1.5" />
              <p className="text-xl font-heading font-bold text-text-main">{MY_VIDEOS.length}</p>
              <p className="text-xs text-text-subtle">فيديو</p>
            </div>
            <div className="glass-strong rounded-2xl p-4 text-center">
              <Eye className="h-5 w-5 text-primary mx-auto mb-1.5" />
              <p className="text-xl font-heading font-bold text-text-main">
                {formatNumber(MY_VIDEOS.reduce((s, v) => s + v.views, 0))}
              </p>
              <p className="text-xs text-text-subtle">مشاهدة</p>
            </div>
            <div className="glass-strong rounded-2xl p-4 text-center">
              <Heart className="h-5 w-5 text-primary mx-auto mb-1.5" />
              <p className="text-xl font-heading font-bold text-text-main">
                {formatNumber(MY_VIDEOS.reduce((s, v) => s + v.likes, 0))}
              </p>
              <p className="text-xs text-text-subtle">إعجاب</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Filters Section ── */}
      {activeSection === 'filters' && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-5"
        >
          <div className="glass-strong rounded-2xl p-5 sm:p-6">
            <h3 className="text-base font-heading font-bold text-text-main mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              فلاتر الجمال
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {BEAUTY_FILTERS.map((filter) => (
                <motion.button
                  key={filter.id}
                  variants={staggerItem}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(selectedFilter === filter.id ? null : filter.id)}
                  className={cn(
                    'rounded-2xl overflow-hidden text-center transition-all cursor-pointer',
                    'border-2',
                    selectedFilter === filter.id
                      ? 'border-primary shadow-[0_0_16px_rgba(194,24,91,0.2)]'
                      : 'border-transparent'
                  )}
                >
                  <div
                    className="aspect-square flex items-center justify-center text-4xl"
                    style={{ backgroundColor: `${filter.color}15` }}
                  >
                    {filter.thumbnail}
                  </div>
                  <div
                    className="p-3 text-sm font-medium text-text-main"
                    style={{ backgroundColor: `${filter.color}08` }}
                  >
                    {filter.nameAr}
                    <span className="block text-xs text-text-subtle">{filter.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Filter preview info */}
            <AnimatePresence>
              {selectedFilter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="bg-primary/5 rounded-xl p-4 flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-text-main">
                        فلتر {BEAUTY_FILTERS.find((f) => f.id === selectedFilter)?.nameAr} مُفعّل
                      </p>
                      <p className="text-xs text-text-subtle">سيتم تطبيقه عند تسجيل الفيديو القادم</p>
                    </div>
                    <button
                      onClick={() => setSelectedFilter(null)}
                      className="text-text-subtle hover:text-red-500 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ── Templates Section ── */}
      {activeSection === 'templates' && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {VIDEO_TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <motion.div
                key={template.id}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="glass-strong rounded-2xl overflow-hidden card-hover gradient-border cursor-pointer"
              >
                <div className="p-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${template.color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: template.color }} />
                  </div>
                  <h3 className="text-base font-heading font-bold text-text-main mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2">{template.description}</p>
                  <div className="mt-3 flex items-center justify-end">
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      استخدمي القالب
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── My Videos Section ── */}
      {activeSection === 'videos' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="space-y-4"
        >
          {MY_VIDEOS.length > 0 ? (
            MY_VIDEOS.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4, ease }}
                className="glass-strong rounded-2xl overflow-hidden card-hover flex"
              >
                {/* Thumbnail */}
                <div className="relative w-28 sm:w-36 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                    <span className="text-[10px] text-white font-medium">{video.duration}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="text-sm font-heading font-bold text-text-main line-clamp-2 mb-2">
                      {video.title}
                    </h4>
                    <p className="text-xs text-text-subtle flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {video.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-subtle mt-2">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {formatNumber(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {formatNumber(video.likes)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-strong rounded-2xl p-10 text-center">
              <Video className="h-12 w-12 text-text-subtle mx-auto mb-3" />
              <p className="text-text-subtle text-sm">لا توجد فيديوهات بعد، ابدئي بإنشاء أول فيديو!</p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Trending Sounds Section ── */}
      {activeSection === 'sounds' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="space-y-4"
        >
          <div className="glass-strong rounded-2xl p-5 sm:p-6 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-base font-heading font-bold text-text-main">
                الأصوات الرائجة
              </h3>
            </div>
            <p className="text-xs text-text-subtle">أكثر الأصوات استخداماً في محتوى التجميل</p>
          </div>

          {TRENDING_SOUNDS.map((sound, idx) => (
            <motion.div
              key={sound.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35, ease }}
              className="glass-strong rounded-2xl p-4 card-hover flex items-center gap-4"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <Volume2 className="h-5 w-5 text-primary" />
              </motion.button>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-heading font-bold text-text-main truncate">
                  {sound.title}
                </h4>
                <p className="text-xs text-text-subtle">{sound.artist}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 text-xs text-text-subtle">
                <span className="hidden sm:inline">{sound.duration}</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {sound.uses}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Tips Section ── */}
      {activeSection === 'tips' && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          <div className="glass-strong rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="text-base font-heading font-bold text-text-main">
                كيف تنشئين محتوى تجميل جذاب
              </h3>
            </div>
            <p className="text-xs text-text-subtle">نصائح احترافية لتحسين فيديوهاتك</p>
          </div>

          {VIDEO_TIPS.map((tip, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className="glass-strong rounded-2xl p-5 card-hover"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-text-main mb-1">{tip.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
