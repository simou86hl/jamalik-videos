'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function NewsletterSubscription() {
  const { newsletterSubscribed, subscribeNewsletter } = useStore();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    subscribeNewsletter();
    setSubscribing(false);
    setShowSuccess(true);
    setEmail('');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden my-10"
    >
      {/* Decorative background blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/8 blob-1 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary/8 blob-2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-accent/5 blob-1 pointer-events-none" />

      {/* Banner */}
      <div className="relative glass-strong rounded-2xl p-6 sm:p-8 gradient-border">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Icon & Text */}
          <div className="flex-1 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-heading font-bold text-text-main">
                اشتركي في نشرتنا البريدية
              </h3>
            </div>
            <p className="text-sm text-text-subtle leading-relaxed max-w-md">
              احصلي على أحدث المقالات والوصفات والنصائح مباشرة في بريدك الإلكتروني.
              انضمي لعائلة جمالكِ!
            </p>
          </div>

          {/* Form / Success */}
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 glass-subtle rounded-full px-6 py-3"
              >
                <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.15 }}
                  >
                    <Check className="h-4 w-4 text-success" />
                  </motion.div>
                </div>
                <span className="text-sm font-medium text-success">
                  تم الاشتراك بنجاح! 🎉
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubscribe}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  required
                  disabled={subscribing || newsletterSubscribed}
                  className="flex-1 sm:w-64 glass-subtle rounded-full px-5 py-3 text-sm text-text-main placeholder:text-text-subtle/40 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={subscribing || newsletterSubscribed}
                  className={cn(
                    'flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium cursor-pointer transition-all whitespace-nowrap',
                    newsletterSubscribed
                      ? 'bg-success/15 text-success'
                      : 'btn-primary'
                  )}
                >
                  {subscribing ? (
                    <Sparkles className="h-4 w-4 animate-spin-slow" />
                  ) : newsletterSubscribed ? (
                    <>
                      <Check className="h-4 w-4" />
                      مشتركة
                    </>
                  ) : (
                    'اشتركي'
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
