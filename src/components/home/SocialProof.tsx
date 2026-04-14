'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, ChefHat, Users, Award } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
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

const STATS = [
  {
    label: 'أكثر من 1000 مقال',
    target: 1000,
    suffix: '+',
    icon: <BookOpen className="h-6 w-6" />,
    gradient: 'from-pink-500 to-rose-400',
    shadowColor: 'shadow-pink-500/20',
  },
  {
    label: 'أكثر من 500 وصفة',
    target: 500,
    suffix: '+',
    icon: <ChefHat className="h-6 w-6" />,
    gradient: 'from-orange-500 to-amber-400',
    shadowColor: 'shadow-orange-500/20',
  },
  {
    label: 'أكثر من 10000 مستخدمة',
    target: 10000,
    suffix: '+',
    icon: <Users className="h-6 w-6" />,
    gradient: 'from-purple-500 to-violet-400',
    shadowColor: 'shadow-purple-500/20',
  },
  {
    label: 'أكثر من 50 خبيرة',
    target: 50,
    suffix: '+',
    icon: <Award className="h-6 w-6" />,
    gradient: 'from-green-500 to-emerald-400',
    shadowColor: 'shadow-green-500/20',
  },
];

function AnimatedCounter({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('ar-EG');
  };

  return (
    <span className="text-2xl sm:text-3xl font-heading font-bold text-gradient tabular-nums">
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="py-10"
    >
      {/* Section header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main mb-2">
          أرقام <span className="text-gradient">نفخر بها</span>
        </h2>
        <p className="text-text-subtle text-sm">ثقة آلاف النساء العربيات في محتوى جمالكِ</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="glass-strong rounded-2xl p-5 sm:p-6 text-center card-hover gradient-border relative overflow-hidden group">
              {/* Background decoration */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg ${stat.shadowColor}`}
                >
                  {stat.icon}
                </div>

                {/* Counter */}
                <AnimatedCounter target={stat.target} suffix={stat.suffix} inView={inView} />

                {/* Label */}
                <p className="text-text-subtle text-xs sm:text-sm mt-2 font-medium leading-relaxed">
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
