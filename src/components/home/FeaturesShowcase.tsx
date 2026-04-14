'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle, Brain, ChefHat, Lightbulb, GitCompareArrows, Timer
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] },
  },
};

const FEATURES = [
  {
    title: 'تعليقات تفاعلية',
    description: 'شاركي آراءك وتفاعلي مع مجتمع جمالكِ النشط',
    icon: <MessageCircle className="h-6 w-6" />,
    gradient: 'from-pink-500 to-rose-400',
    shadowColor: 'shadow-pink-500/20',
  },
  {
    title: 'اختبارات ذكية',
    description: 'اكتشفي نوع بشرتك وشعرك واسلوبك الموضي',
    icon: <Brain className="h-6 w-6" />,
    gradient: 'from-purple-500 to-violet-400',
    shadowColor: 'shadow-purple-500/20',
  },
  {
    title: 'وصفات مميزة',
    description: 'وصفات طبيعية وشهية من المطبخ العربي والعالمي',
    icon: <ChefHat className="h-6 w-6" />,
    gradient: 'from-orange-500 to-amber-400',
    shadowColor: 'shadow-orange-500/20',
  },
  {
    title: 'نصائح يومية',
    description: 'نصائح جديدة كل يوم للعناية بجمالك وصحتك',
    icon: <Lightbulb className="h-6 w-6" />,
    gradient: 'from-amber-500 to-yellow-400',
    shadowColor: 'shadow-amber-500/20',
  },
  {
    title: 'مقارنات المنتجات',
    description: 'قارني بين المنتجات واختاري الأنسب لبشرتك',
    icon: <GitCompareArrows className="h-6 w-6" />,
    gradient: 'from-green-500 to-emerald-400',
    shadowColor: 'shadow-green-500/20',
  },
  {
    title: 'مؤقت الوصفات',
    description: 'مؤقت ذكي يساعدك في إعداد وصفاتك بدقة',
    icon: <Timer className="h-6 w-6" />,
    gradient: 'from-rose-500 to-pink-400',
    shadowColor: 'shadow-rose-500/20',
  },
];

export function FeaturesShowcase() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="py-10"
    >
      {/* Section header */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gradient mb-3">
          مميزات جمالكِ
        </h2>
        <motion.div
          variants={itemVariants}
          className="w-20 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full mx-auto mb-3"
        />
        <p className="text-text-subtle text-sm max-w-md mx-auto">
          كل ما تحتاجينه في مكان واحد لتعزز جمالك وصحتك
        </p>
      </motion.div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="glass-strong rounded-2xl p-5 sm:p-6 h-full card-hover gradient-border relative overflow-hidden group">
              {/* Decorative background */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

              {/* Feature number */}
              <div className="absolute top-4 left-4 text-[40px] font-heading font-bold text-primary/5 leading-none select-none">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg ${feature.shadowColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-text-main text-base mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-text-subtle text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
