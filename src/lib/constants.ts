import type { SeriesCategory, NavLink } from '@/types';

// ============================================================
// Site Information
// ============================================================

export const SITE_NAME = 'مسلسلات أونلاين';
export const SITE_DESCRIPTION =
  'شاهد أحدث المسلسلات العربية والعالمية بجودة عالية. دراما، كوميدي، أكشن، رومانسي، تركية، هندية، كرتون، وثائقي';
export const SITE_URL = 'https://musalsalat.online';

// ============================================================
// Categories (8 main categories)
// ============================================================

export const CATEGORIES: SeriesCategory[] = [
  { id: 'cat-1', name: 'دراما', slug: 'drama', icon: 'Theater', description: 'مسلسلات درامية مليئة بالتشويق والعواطف', image: '/images/categories/drama.jpg', order: 1 },
  { id: 'cat-2', name: 'كوميدي', slug: 'comedy', icon: 'Laugh', description: 'مسلسلات كوميدية تضحكك وتسعد يومك', image: '/images/categories/comedy.jpg', order: 2 },
  { id: 'cat-3', name: 'أكشن', slug: 'action', icon: 'Swords', description: 'مسلسلات أكشن وإثارة وتشويق لا يتوقف', image: '/images/categories/action.jpg', order: 3 },
  { id: 'cat-4', name: 'رومانسي', slug: 'romantic', icon: 'Heart', description: 'أجمل المسلسلات الرومانسية والعاطفية', image: '/images/categories/romantic.jpg', order: 4 },
  { id: 'cat-5', name: 'تركية', slug: 'turkish', icon: 'Globe', description: 'أشهر المسلسلات التركية المدبلجة والمترجمة', image: '/images/categories/turkish.jpg', order: 5 },
  { id: 'cat-6', name: 'هندية', slug: 'indian', icon: 'Music', description: 'مسلسلات هندية ممتعة وقصص حب مثيرة', image: '/images/categories/indian.jpg', order: 6 },
  { id: 'cat-7', name: 'كورية', slug: 'korean', icon: 'Star', description: 'أحدث الدراما الكورية المترجمة والمشهورة', image: '/images/categories/korean.jpg', order: 7 },
  { id: 'cat-8', name: 'كرتون', slug: 'cartoon', icon: 'Palette', description: 'أفضل الرسوم المتحركة للكبار والأطفال', image: '/images/categories/cartoon.jpg', order: 8 },
  { id: 'cat-9', name: 'وثائقي', slug: 'documentary', icon: 'BookOpen', description: 'وثائقيات مثيرة عن التاريخ والطبيعة والعلوم', image: '/images/categories/documentary.jpg', order: 9 },
];

// ============================================================
// Category Accent Colors
// ============================================================

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  drama:     { bg: 'bg-amber-500/10',  text: 'text-amber-500',    border: 'border-amber-500/20',  gradient: 'from-amber-500 to-orange-500' },
  comedy:    { bg: 'bg-yellow-500/10', text: 'text-yellow-500',   border: 'border-yellow-500/20', gradient: 'from-yellow-400 to-orange-400' },
  action:    { bg: 'bg-red-500/10',    text: 'text-red-500',      border: 'border-red-500/20',    gradient: 'from-red-500 to-rose-600' },
  romantic:  { bg: 'bg-pink-500/10',   text: 'text-pink-500',     border: 'border-pink-500/20',   gradient: 'from-pink-500 to-rose-500' },
  turkish:   { bg: 'bg-emerald-500/10',text: 'text-emerald-500',  border: 'border-emerald-500/20',gradient: 'from-emerald-500 to-teal-500' },
  indian:    { bg: 'bg-orange-500/10', text: 'text-orange-500',   border: 'border-orange-500/20', gradient: 'from-orange-500 to-amber-500' },
  korean:    { bg: 'bg-violet-500/10', text: 'text-violet-500',   border: 'border-violet-500/20', gradient: 'from-violet-500 to-purple-500' },
  cartoon:   { bg: 'bg-cyan-500/10',   text: 'text-cyan-500',     border: 'border-cyan-500/20',   gradient: 'from-cyan-400 to-blue-400' },
  documentary:{ bg: 'bg-slate-500/10', text: 'text-slate-400',    border: 'border-slate-500/20',  gradient: 'from-slate-400 to-gray-500' },
};

// ============================================================
// Navigation Links
// ============================================================

export const NAV_LINKS: NavLink[] = [
  { label: 'الرئيسية', slug: 'home' },
  { label: 'دراما', slug: 'drama', icon: 'Theater' },
  { label: 'كوميدي', slug: 'comedy', icon: 'Laugh' },
  { label: 'أكشن', slug: 'action', icon: 'Swords' },
  { label: 'رومانسي', slug: 'romantic', icon: 'Heart' },
  { label: 'تركية', slug: 'turkish', icon: 'Globe' },
  { label: 'هندية', slug: 'indian', icon: 'Music' },
  { label: 'كورية', slug: 'korean', icon: 'Star' },
  { label: 'كرتون', slug: 'cartoon', icon: 'Palette' },
  { label: 'وثائقي', slug: 'documentary', icon: 'BookOpen' },
];

// ============================================================
// Constants for UI behavior
// ============================================================

export const SERIES_PER_PAGE = 12;
export const SEARCH_DEBOUNCE_MS = 300;
export const HERO_SLIDE_INTERVAL_MS = 5000;
