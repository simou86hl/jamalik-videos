'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Check, Gift } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const newsletterSubscribed = useStore((s) => s.newsletterSubscribed);
  const subscribeNewsletter = useStore((s) => s.subscribeNewsletter);

  const handleSubscribe = () => {
    if (!email.trim() || newsletterSubscribed) return;
    subscribeNewsletter();
    setSubscribed(true);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  return (
    <section className="py-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-hero">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-pulse-slow" />

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-dots opacity-[0.04] pointer-events-none" />

        <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-16 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-glow)]"
          >
            <Mail className="h-7 w-7 text-white" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-4"
          >
            <span className="text-gradient">لا تفوّتي أي نصيحة</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-text-subtle text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed"
          >
            اشتركي في نشرتنا البريدية لتصلك أحدث النصائح والوصفات والعروض الحصرية مباشرة إلى بريدك الإلكتروني
          </motion.p>

          {/* Email input + button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex-1 relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                      placeholder="بريدك الإلكتروني"
                      className="w-full pr-10 pl-4 py-3 text-sm glass-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-text-main placeholder:text-text-subtle/50 transition-all duration-300"
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    disabled={!email.trim()}
                    className="btn-primary text-sm px-6 py-3 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Gift className="h-4 w-4" />
                    اشتركي الآن
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-strong rounded-2xl p-6 flex flex-col items-center gap-3"
                >
                  {showSuccess && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.3)]"
                    >
                      <Check className="h-8 w-8 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                  <p className="text-text-main font-heading font-bold text-base">
                    تم الاشتراك بنجاح! 🎉
                  </p>
                  <p className="text-text-subtle text-xs flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    ستصلك أحدث النصائح قريباً
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Privacy note */}
          {!subscribed && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-text-subtle/50 text-[11px] mt-4"
            >
              لن نشارك بريدك مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
