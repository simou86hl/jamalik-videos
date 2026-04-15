'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine,
  Search,
  ShieldAlert,
  Droplets,
  ShoppingBag,
  Star,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Leaf,
  Eye,
  History,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// Types & Animation
// ─────────────────────────────────────────────
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ScanResult {
  name: string;
  brand: string;
  image: string;
  safetyScore: number;
  ingredients: { name: string; status: 'safe' | 'warning' | 'avoid' }[];
  skinCompatibility: number;
  halalCertified: boolean;
  priceComparison: { store: string; price: number }[];
}

interface ScanHistoryItem {
  id: string;
  name: string;
  brand: string;
  safetyScore: number;
  scannedAt: string;
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const MOCK_RESULT: ScanResult = {
  name: 'كريم الترطيب المرطب العميق',
  brand: 'لوريال باريس',
  image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&h=200&fit=crop',
  safetyScore: 78,
  ingredients: [
    { name: 'حمض الهيالورونيك', status: 'safe' },
    { name: 'جليسرين نباتي', status: 'safe' },
    { name: 'فيتامين E', status: 'safe' },
    { name: 'بارابين', status: 'warning' },
    { name: 'عطر صناعي', status: 'warning' },
    { name: 'فثالات', status: 'avoid' },
  ],
  skinCompatibility: 85,
  halalCertified: true,
  priceComparison: [
    { store: 'نون', price: 89 },
    { store: 'أمازون', price: 95 },
    { store: 'سوق كوم', price: 82 },
  ],
};

const MOCK_SCAN_HISTORY: ScanHistoryItem[] = [
  { id: 'sh1', name: 'سيروم فيتامين سي', brand: 'ذا اورديناري', safetyScore: 92, scannedAt: 'منذ ساعة' },
  { id: 'sh2', name: 'واقي الشمس SPF 50', brand: 'نيتروجينا', safetyScore: 65, scannedAt: 'منذ 3 ساعات' },
  { id: 'sh3', name: 'شامبو الأرغان', brand: 'أوجي إكس', safetyScore: 84, scannedAt: 'أمس' },
];

const LABEL_TIPS = [
  { icon: Eye, title: 'اقرئي المكونات بالكامل', desc: 'المكونات مرتبة تنازلياً حسب الكمية — أول ٥ مكونات هي الأهم.' },
  { icon: ShieldAlert, title: 'تجنبي هذه المكونات', desc: 'البارابين، الفثالات، السيليكونات الضارة، الكبريتات القاسية.' },
  { icon: Leaf, title: 'ابحثي عن الشهادات', desc: 'شهادة الحلال، عضوي، خالٍ من القسوة، نباتي ١٠٠٪.' },
  { icon: Droplets, title: 'اختاري حسب نوع بشرتك', desc: 'البشرة الدهنية: لا تحتوي زيوت ثقيلة. الجافة: تحتوي حمض هيالورونيك.' },
];

// ─────────────────────────────────────────────
// Safety Score Circle
// ─────────────────────────────────────────────
function SafetyScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#2e7d52' : score >= 50 ? '#e6a23c' : '#c2185b';
  const label = score >= 80 ? 'آمن' : score >= 50 ? 'متوسط' : 'غير آمن';

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4, ease }}
          className="text-2xl font-heading font-extrabold"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-text-subtle font-medium">{label}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Ingredient Badge
// ─────────────────────────────────────────────
function IngredientBadge({ name, status }: { name: string; status: 'safe' | 'warning' | 'avoid' }) {
  const config = {
    safe: { icon: CheckCircle, bg: 'bg-green-500/10', text: 'text-green-600', label: 'آمن' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'تنبيه' },
    avoid: { icon: XCircle, bg: 'bg-red-500/10', text: 'text-red-500', label: 'تجنبي' },
  };
  const c = config[status];
  const Icon = c.icon;

  return (
    <div className={cn('flex items-center gap-2 rounded-xl px-3 py-2', c.bg)}>
      <Icon className={cn('h-4 w-4 flex-shrink-0', c.text)} />
      <span className={cn('text-sm font-medium flex-1', 'text-text-main')}>{name}</span>
      <span className={cn('text-xs font-bold', c.text)}>{c.label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function ProductScannerPage() {
  const { goBack } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [scanHistory] = useState<ScanHistoryItem[]>(MOCK_SCAN_HISTORY);

  const handleScan = useCallback(() => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(MOCK_RESULT);
    }, 2500);
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({ ...MOCK_RESULT, name: searchQuery || MOCK_RESULT.name });
    }, 1500);
  }, [searchQuery]);

  const safeCount = scanResult?.ingredients.filter((i) => i.status === 'safe').length || 0;
  const warningCount = scanResult?.ingredients.filter((i) => i.status === 'warning').length || 0;
  const avoidCount = scanResult?.ingredients.filter((i) => i.status === 'avoid').length || 0;

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
            <ScanLine className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            ماسح المنتجات الذكي
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            امسحي أي منتج لتعرفي مكوناته وسلامته لبشرتك
          </p>
        </div>
      </motion.div>

      {/* Scanner Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease }}
        className="glass-strong rounded-2xl overflow-hidden gradient-border mb-6"
      >
        <div className="p-6">
          {/* Camera / scan area */}
          <div className="relative w-full aspect-square max-w-xs mx-auto mb-6 rounded-2xl overflow-hidden bg-bg-secondary border-2 border-dashed border-border">
            {isScanning ? (
              <>
                <div className="absolute inset-0 bg-primary/5" />
                <motion.div
                  animate={{ y: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-primary shadow-[0_0_12px_rgba(194,24,91,0.6)]"
                />
                {/* Corner brackets */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-3 border-r-3 border-primary rounded-tr-lg" />
                <div className="absolute top-3 left-3 w-8 h-8 border-t-3 border-l-3 border-primary rounded-tl-lg" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-3 border-r-3 border-primary rounded-br-lg" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-3 border-l-3 border-primary rounded-bl-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm font-medium text-primary"
                  >
                    جاري التحليل...
                  </motion.p>
                </div>
              </>
            ) : scanResult ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="text-center"
                >
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-text-secondary font-medium">تم التحليل بنجاح</p>
                </motion.div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <ScanLine className="h-10 w-10 text-text-subtle" />
                <p className="text-sm text-text-subtle text-center px-4">
                  وجّهي الكاميرا نحو الباركود أو المكونات
                </p>
              </div>
            )}
          </div>

          {/* Scan button */}
          <div className="flex justify-center mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScan}
              disabled={isScanning}
              className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer',
                isScanning
                  ? 'bg-primary/20'
                  : 'bg-gradient-primary shadow-[0_0_24px_rgba(194,24,91,0.4)]'
              )}
            >
              {isScanning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <ScanLine className="h-8 w-8 text-white" />
                </motion.div>
              ) : (
                <ScanLine className="h-8 w-8 text-white" />
              )}
            </motion.button>
          </div>

          {/* Or search manually */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-subtle">أو ابحثي يدوياً</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="اسم المنتج أو الماركة..."
              className="flex-1 px-4 py-3 rounded-xl bg-input-bg border border-border text-sm text-text-main placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              dir="rtl"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={isScanning}
              className="btn-primary px-5 flex items-center gap-2 text-sm"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">بحث</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Scan Result */}
      <AnimatePresence mode="wait">
        {scanResult && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease }}
            className="space-y-5"
          >
            {/* Product Info Card */}
            <div className="glass-strong rounded-2xl overflow-hidden gradient-border">
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4 mb-5">
                  <img
                    src={scanResult.image}
                    alt={scanResult.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/10"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-heading font-bold text-text-main mb-1">
                      {scanResult.name}
                    </h3>
                    <p className="text-sm text-text-subtle mb-2">{scanResult.brand}</p>
                    {scanResult.halalCertified && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                        <Leaf className="h-3 w-3" />
                        حلال معتمد
                      </span>
                    )}
                  </div>
                </div>

                {/* Safety Score */}
                <SafetyScoreCircle score={scanResult.safetyScore} />

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="text-center glass-subtle rounded-xl py-3">
                    <p className="text-lg font-bold text-green-600">{safeCount}</p>
                    <p className="text-xs text-text-subtle">آمن</p>
                  </div>
                  <div className="text-center glass-subtle rounded-xl py-3">
                    <p className="text-lg font-bold text-amber-500">{warningCount}</p>
                    <p className="text-xs text-text-subtle">تنبيه</p>
                  </div>
                  <div className="text-center glass-subtle rounded-xl py-3">
                    <p className="text-lg font-bold text-red-500">{avoidCount}</p>
                    <p className="text-xs text-text-subtle">تجنبي</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="glass-strong rounded-2xl p-5 sm:p-6">
              <h3 className="text-base font-heading font-bold text-text-main mb-4 flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                تحليل المكونات
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {scanResult.ingredients.map((ing, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx, duration: 0.3, ease }}
                  >
                    <IngredientBadge name={ing.name} status={ing.status} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Skin Compatibility */}
            <div className="glass-strong rounded-2xl p-5 sm:p-6">
              <h3 className="text-base font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                توافق البشرة
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-3 rounded-full bg-border overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scanResult.skinCompatibility}%` }}
                      transition={{ duration: 1, ease, delay: 0.3 }}
                      className={cn(
                        'h-full rounded-full',
                        scanResult.skinCompatibility >= 80
                          ? 'bg-green-500'
                          : scanResult.skinCompatibility >= 50
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      )}
                    />
                  </div>
                </div>
                <span className="text-lg font-heading font-bold text-text-main min-w-[3rem] text-center">
                  {scanResult.skinCompatibility}%
                </span>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="glass-strong rounded-2xl p-5 sm:p-6">
              <h3 className="text-base font-heading font-bold text-text-main mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                مقارنة الأسعار
              </h3>
              <div className="space-y-2">
                {scanResult.priceComparison
                  .sort((a, b) => a.price - b.price)
                  .map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx, duration: 0.3 }}
                      className={cn(
                        'flex items-center justify-between rounded-xl px-4 py-3',
                        idx === 0 ? 'bg-green-500/10 border border-green-500/20' : 'glass-subtle'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Star className="h-4 w-4 text-green-500 fill-green-500" />}
                        <span className="text-sm font-medium text-text-main">{item.store}</span>
                      </div>
                      <span className={cn('text-sm font-bold', idx === 0 ? 'text-green-600' : 'text-text-main')}>
                        {item.price} ر.س
                      </span>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Scans */}
      {!scanResult && !isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease }}
          className="glass-strong rounded-2xl p-5 sm:p-6 mb-6"
        >
          <h3 className="text-base font-heading font-bold text-text-main mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            عمليات المسح الأخيرة
          </h3>
          <div className="space-y-3">
            {scanHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 glass-subtle rounded-xl px-4 py-3"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white',
                    item.safetyScore >= 80
                      ? 'bg-green-500'
                      : item.safetyScore >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  )}
                >
                  {item.safetyScore}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">{item.name}</p>
                  <p className="text-xs text-text-subtle">{item.brand}</p>
                </div>
                <span className="text-xs text-text-subtle flex-shrink-0">{item.scannedAt}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease }}
        className="glass-strong rounded-2xl overflow-hidden gradient-border"
      >
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full p-5 sm:p-6 flex items-center justify-between cursor-pointer"
        >
          <h3 className="text-base font-heading font-bold text-text-main flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            نصائح لقراءة ملصقات المنتجات
          </h3>
          {showTips ? (
            <ChevronUp className="h-5 w-5 text-text-subtle" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-subtle" />
          )}
        </button>

        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
                {LABEL_TIPS.map((tip, idx) => {
                  const Icon = tip.icon;
                  return (
                    <div key={idx} className="glass-subtle rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text-main mb-1">{tip.title}</h4>
                          <p className="text-xs text-text-secondary leading-relaxed">{tip.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
