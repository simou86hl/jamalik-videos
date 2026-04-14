'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Gift,
  Copy,
  Check,
  Users,
  Award,
  Star,
  Zap,
  Crown,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ShareButtons } from '@/components/shared/ShareButtons';
import { cn } from '@/lib/utils';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const howItWorksSteps = [
  {
    step: 1,
    title: 'شاركي كود الإحالة',
    description: 'احصلي على كود إحالة فريد وشاركيه مع صديقاتك عبر وسائل التواصل الاجتماعي أو الرسائل',
    icon: Copy,
  },
  {
    step: 2,
    title: 'سجّلن باستخدام الكود',
    description: 'عندما تسجّل صديقتك باستخدام كودك تصبحان في برنامج الإحالة',
    icon: Users,
  },
  {
    step: 3,
    title: 'احصلي على مكافآتك',
    description: 'كل تسجيل جديد بكودك يمنحك نقاط ومكافآت حصرية يمكنك استبدالها بعروض مميزة',
    icon: Gift,
  },
  {
    step: 4,
    title: 'ترقّي في المستويات',
    description: 'كلما زاد عدد الإحالات ترقيتِ في المستويات وحصلتِ على مكافآت أكبر وامتيازات أكثر',
    icon: Crown,
  },
];

const rewardTiers = [
  {
    tier: 'برونزي',
    minReferrals: 1,
    maxReferrals: 4,
    reward: 'خصم 10% على العروض',
    color: 'bg-amber-600',
    gradient: 'from-amber-500/20 to-amber-600/10',
    icon: Star,
  },
  {
    tier: 'فضي',
    minReferrals: 5,
    maxReferrals: 14,
    reward: 'خصم 20% + وصول مبكر للمحتوى',
    color: 'bg-gray-400',
    gradient: 'from-gray-300/20 to-gray-400/10',
    icon: Star,
  },
  {
    tier: 'ذهبي',
    minReferrals: 15,
    maxReferrals: 29,
    reward: 'خصم 30% + محتوى حصري',
    color: 'bg-amber-500',
    gradient: 'from-amber-400/20 to-amber-500/10',
    icon: Crown,
  },
  {
    tier: 'ماسي',
    minReferrals: 30,
    reward: 'عضوية VIP مدى الحياة',
    color: 'bg-sky-400',
    gradient: 'from-sky-300/20 to-sky-400/10',
    icon: Sparkles,
  },
];

export function ReferralPage() {
  const { goBack, referralCode, generateReferralCode } = useStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!referralCode) {
      generateReferralCode();
    }
  }, [referralCode, generateReferralCode]);

  const handleCopyCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback - do nothing
    }
  };

  const currentTier = rewardTiers.find((t) => {
    if (t.minReferrals === undefined) return false;
    return t.minReferrals <= 0 && (t.maxReferrals === undefined || 0 <= t.maxReferrals);
  }) || rewardTiers[0];

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

      {/* Hero with Referral Code */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative rounded-3xl overflow-hidden mb-10"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          {/* Decorative elements */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-4 left-8"
          >
            <Gift className="h-8 w-8 text-white/20" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3, delay: 1, repeat: Infinity }}
            className="absolute bottom-6 right-12"
          >
            <Zap className="h-6 w-6 text-white/20" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4 relative z-10"
          >
            <Gift className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            برنامج الإحالة
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto mb-8 relative z-10">
            شاركي كودك مع صديقاتك واحصلي على مكافآت حصرية!
          </p>

          {/* Referral Code Display */}
          <div className="relative z-10 max-w-sm mx-auto">
            <p className="text-xs text-white/60 mb-2">كود إحالتك الفريد</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 font-mono text-xl font-bold tracking-wider text-white border border-white/20">
                {referralCode || '...'}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyCode}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl px-4 py-3 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-300" />
                ) : (
                  <Copy className="h-5 w-5 text-white" />
                )}
              </motion.button>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-green-300 mt-2"
              >
                تم نسخ الكود بنجاح!
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
      >
        {[
          { label: 'الدعوات المرسلة', value: '0', icon: Users, gradient: 'bg-gradient-primary/15', iconColor: 'text-primary' },
          { label: 'التسجيلات الناجحة', value: '0', icon: Check, gradient: 'bg-gradient-rose-purple/15', iconColor: 'text-secondary' },
          { label: 'مستواك الحالي', value: currentTier?.tier || 'برونزي', icon: Award, gradient: 'bg-gradient-warm/15', iconColor: 'text-accent' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={staggerItem} className="glass-strong rounded-2xl p-5 text-center card-hover">
            <div className={cn('w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center', stat.gradient)}>
              <stat.icon className={cn('h-6 w-6', stat.iconColor)} />
            </div>
            <div className="text-xl font-heading font-extrabold text-gradient mb-1">{stat.value}</div>
            <p className="text-xs text-text-subtle">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* How it Works */}
      <div className="mb-10">
        <h3 className="text-xl font-heading font-bold text-text-main mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-gradient-primary" />
          كيف يعمل البرنامج؟
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {howItWorksSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-strong rounded-2xl p-5 text-center card-hover relative"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-gradient-primary text-white flex items-center justify-center font-heading font-bold text-lg mb-4">
                {step.step}
              </div>
              <h4 className="font-bold text-text-main text-sm mb-2">{step.title}</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{step.description}</p>
              {i < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -left-3 w-6 h-px bg-gradient-primary/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reward Tiers */}
      <div className="mb-10">
        <h3 className="text-xl font-heading font-bold text-text-main mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-gradient-primary" />
          مستويات المكافآت
        </h3>
        <div className="space-y-3">
          {rewardTiers.map((tier, i) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                'glass-strong rounded-2xl p-5 border border-transparent transition-all',
                tier.tier === currentTier?.tier && 'gradient-border'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white flex-shrink-0', tier.gradient)}>
                  <tier.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-heading font-bold text-text-main">{tier.tier}</h4>
                    {tier.tier === currentTier?.tier && (
                      <span className="text-[10px] bg-gradient-primary text-white px-2 py-0.5 rounded-full font-medium">
                        مستواك الحالي
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">{tier.reward}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="text-xs text-text-subtle">
                    {tier.minReferrals}+ إحالة
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Share Section */}
      <div className="glass-strong gradient-border rounded-2xl p-6 text-center">
        <h3 className="text-lg font-heading font-bold text-text-main mb-2">ابدئي بمشاركة كودك الآن</h3>
        <p className="text-sm text-text-secondary mb-4">شاركي كود الإحالة مع صديقاتك واحصلي على مكافآت</p>
        <ShareButtons title={`سجّلي في جمالكِ باستخدام كود الإحالة: ${referralCode}`} />
      </div>
    </motion.div>
  );
}
