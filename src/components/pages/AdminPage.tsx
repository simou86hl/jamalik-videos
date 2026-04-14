'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  FileText,
  ChefHat,
  MessageSquare,
  Heart,
  Plus,
  Edit3,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ARTICLES, RECIPES } from '@/data/seedData';
import { cn } from '@/lib/utils';
import { getRelativeTime } from '@/lib/utils';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const recentActivity = [
  { id: 'act-1', action: 'تم نشر مقال جديد', detail: '"10 قطع أساسية لخزانة ملابس"', time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), icon: FileText, color: 'text-primary bg-primary/10' },
  { id: 'act-2', action: 'وصفة جديدة مضافة', detail: '"حلى البقلاوة السهلة"', time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), icon: ChefHat, color: 'text-orange-500 bg-orange-500/10' },
  { id: 'act-3', action: 'تعليق جديد على مقال', detail: '"روتين العناية بالبشرة الدهنية"', time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), icon: MessageSquare, color: 'text-sky-500 bg-sky-500/10' },
  { id: 'act-4', action: 'مستخدمة جديدة سجلت', detail: '"سارة أحمد"', time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), icon: Users, color: 'text-green-500 bg-green-500/10' },
  { id: 'act-5', action: 'تم تعديل وصفة', detail: '"مهلبية بالفستق"', time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), icon: Edit3, color: 'text-amber-500 bg-amber-500/10' },
];

type ContentTab = 'articles' | 'recipes';

export function AdminPage() {
  const { goBack, favorites } = useStore();
  const [activeContentTab, setActiveContentTab] = useState<ContentTab>('articles');

  const stats = [
    { label: 'إجمالي المقالات', value: ARTICLES.length, icon: FileText, gradient: 'bg-gradient-primary/15', iconColor: 'text-primary' },
    { label: 'إجمالي الوصفات', value: RECIPES.length, icon: ChefHat, gradient: 'bg-gradient-warm/15', iconColor: 'text-accent' },
    { label: 'التعليقات', value: 342, icon: MessageSquare, gradient: 'bg-gradient-rose-purple/15', iconColor: 'text-secondary' },
    { label: 'المفضلات', value: favorites.length, icon: Heart, gradient: 'bg-pink-500/15', iconColor: 'text-pink-500' },
  ];

  const contentList = activeContentTab === 'articles' ? ARTICLES.slice(0, 8) : RECIPES.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-6"
    >
      {/* Back button */}
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

      {/* Demo Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-subtle rounded-xl p-3 mb-6 flex items-center gap-2"
      >
        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-600 font-medium">
          لوحة التحكم — عرض تجريبي
        </p>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative rounded-3xl overflow-hidden mb-8"
      >
        <div className="bg-gradient-primary p-8 sm:p-10 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <BarChart3 className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-2 relative z-10">
            لوحة التحكم
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            إدارة المحتوى والتفاعلات
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={staggerItem} className="glass-strong rounded-2xl p-5 text-center card-hover">
            <div className={cn('w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center', stat.gradient)}>
              <stat.icon className={cn('h-6 w-6', stat.iconColor)} />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-gradient mb-1">
              {stat.value}
            </div>
            <p className="text-xs text-text-subtle">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-8 flex-wrap"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          إضافة مقال
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="btn-outline flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          إضافة وصفة
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-1 glass-strong rounded-2xl p-5"
        >
          <h3 className="text-base font-heading font-bold text-gradient mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            النشاط الأخير
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', activity.color)}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-main">{activity.action}</p>
                  <p className="text-[10px] text-text-subtle truncate">{activity.detail}</p>
                  <p className="text-[10px] text-text-subtle/50 mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getRelativeTime(activity.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-strong rounded-2xl p-5"
        >
          <h3 className="text-base font-heading font-bold text-gradient mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            الإحصائيات
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-5 text-center min-h-[140px] flex flex-col items-center justify-center">
              <TrendingUp className="h-8 w-8 text-primary/30 mb-2" />
              <p className="text-xs text-text-subtle">رسم بياني للمشاهدات</p>
              <p className="text-[10px] text-text-subtle/50 mt-1">قريباً...</p>
            </div>
            <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl p-5 text-center min-h-[140px] flex flex-col items-center justify-center">
              <Eye className="h-8 w-8 text-secondary/30 mb-2" />
              <p className="text-xs text-text-subtle">رسم بياني للتفاعلات</p>
              <p className="text-[10px] text-text-subtle/50 mt-1">قريباً...</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Management Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-strong rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-heading font-bold text-gradient">إدارة المحتوى</h3>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveContentTab('articles')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                activeContentTab === 'articles'
                  ? 'bg-gradient-primary text-white'
                  : 'glass-subtle text-text-subtle hover:text-text-main'
              )}
            >
              المقالات
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveContentTab('recipes')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                activeContentTab === 'recipes'
                  ? 'bg-gradient-primary text-white'
                  : 'glass-subtle text-text-subtle hover:text-text-main'
              )}
            >
              الوصفات
            </motion.button>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-3 px-4 pb-3 border-b border-border/20 text-xs text-text-subtle font-medium">
          <div className="col-span-5">العنوان</div>
          <div className="col-span-2">القسم</div>
          <div className="col-span-2">المشاهدات</div>
          <div className="col-span-3 text-left">إجراءات</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border/10 max-h-96 overflow-y-auto">
          {contentList.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 px-4 py-3 items-center hover:bg-glass-subtle/50 rounded-lg transition-colors"
            >
              {/* Title */}
              <div className="sm:col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary/10 overflow-hidden flex-shrink-0 hidden sm:block">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-text-main truncate">{item.title}</p>
              </div>

              {/* Category */}
              <div className="sm:col-span-2">
                <span className="text-[10px] sm:text-xs glass-subtle px-2 py-0.5 rounded-full text-primary font-medium">
                  {'category' in item ? item.category : item.type}
                </span>
              </div>

              {/* Views */}
              <div className="sm:col-span-2">
                <span className="text-xs text-text-subtle">
                  {activeContentTab === 'articles'
                    ? (item as typeof ARTICLES[0]).stats.views.toLocaleString('ar-EG')
                    : (item as typeof RECIPES[0]).stats.views.toLocaleString('ar-EG')}
                </span>
              </div>

              {/* Actions */}
              <div className="sm:col-span-3 flex items-center gap-1 sm:justify-end">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-subtle hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  aria-label="عرض"
                  type="button"
                >
                  <Eye className="h-3.5 w-3.5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-subtle hover:text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                  aria-label="تعديل"
                  type="button"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-subtle hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  aria-label="حذف"
                  type="button"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
