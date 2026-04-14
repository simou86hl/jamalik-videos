'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Eye, Award, Users, BookOpen, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { STATIC_PAGES } from '@/data/staticPages';
import { cn } from '@/lib/utils';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString('ar-EG')}</>;
}

export function AboutPage() {
  const { goBack } = useStore();
  const page = STATIC_PAGES.about;
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const stats = [
    { label: 'مقالة وصفة', value: 500, icon: BookOpen },
    { label: 'مستخدمة نشطة', value: 100000, icon: Users },
    { label: 'وصفة طبخ', value: 10000, icon: Heart },
    { label: 'تقييم إيجابي', value: 98000, icon: Award },
  ];

  const team = [
    { name: 'نورة الحربي', role: 'محررة الموضة والأناقة', color: 'bg-gradient-primary' },
    { name: 'د. ليلى أحمد', role: 'استشارية البشرة والعناية', color: 'bg-gradient-rose-purple' },
    { name: 'هدى الشمري', role: 'خبيرة الشعر والتسريحات', color: 'bg-gradient-warm' },
    { name: 'أمل الدوسري', role: 'مدربة لياقة وتغذية', color: 'bg-gradient-primary' },
    { name: 'منى القحطاني', role: 'خبيرة التجميل والمكياج', color: 'bg-gradient-rose-purple' },
    { name: 'فاطمة البلوشي', role: 'طاهية ومؤلفة طبخ', color: 'bg-gradient-warm' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-6"
    >
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
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative rounded-3xl overflow-hidden mb-10"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          {/* Sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
              style={{
                top: `${15 + (i % 3) * 30}%`,
                right: `${10 + (i % 4) * 25}%`,
              }}
            >
              <Sparkles className="h-5 w-5 text-white/60" />
            </motion.div>
          ))}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Heart className="h-10 w-10 text-white/80 mx-auto fill-white/40" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">{page.title}</h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">{page.subtitle}</p>
        </div>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10"
      >
        {page.content.slice(0, 2).map((section) => (
          <motion.div key={section.id} variants={staggerItem} className="glass-strong rounded-2xl p-6 card-hover">
            <h3 className="text-lg font-heading font-bold text-gradient mb-3">{section.title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{section.body}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
        {stats.map((stat, i) => (
          <motion.div key={stat.label} variants={staggerItem} className="glass-strong rounded-2xl p-5 text-center card-hover">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-primary/15 flex items-center justify-center">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-gradient mb-1">
              <AnimatedCounter target={stat.value} />
            </div>
            <p className="text-xs text-text-subtle">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-6 mb-10"
      >
        <h3 className="text-lg font-heading font-bold text-gradient mb-3">{page.content[2].title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{page.content[2].body}</p>
      </motion.div>

      {/* Team */}
      <div className="mb-10">
        <h3 className="text-xl font-heading font-bold text-text-main mb-5 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-gradient-primary" />
          {page.content[3].title}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-strong rounded-2xl p-5 text-center card-hover"
            >
              <div className={cn('w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-3', member.color)}>
                {member.name.charAt(0)}
              </div>
              <h4 className="font-bold text-text-main text-sm mb-1">{member.name}</h4>
              <p className="text-xs text-text-subtle">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h3 className="text-xl font-heading font-bold text-text-main mb-5 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-gradient-primary" />
          الأسئلة الشائعة
        </h3>
        <div className="space-y-3">
          {page.faq.map((faq) => (
            <motion.div
              key={faq.id}
              layout
              className="glass-strong rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-right cursor-pointer"
              >
                <span className="font-bold text-text-main text-sm">{faq.question}</span>
                {openFaq === faq.id ? (
                  <ChevronUp className="h-4 w-4 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-text-subtle flex-shrink-0" />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === faq.id ? 'auto' : 0, opacity: openFaq === faq.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-strong gradient-border rounded-2xl p-8 text-center"
      >
        <Eye className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-heading font-bold text-text-main mb-2">نحب أن نسمع منك</h3>
        <p className="text-text-secondary text-sm mb-5">شاركينا رأيك واقتراحاتك لتحسين تجربتك معنا</p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => useStore.getState().navigateTo('contact')} className="btn-primary text-sm">
          تواصلي معنا
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
