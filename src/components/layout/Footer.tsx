'use client';

import { SITE_NAME, FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { useStore } from '@/store/useStore';
import { Heart, Sparkles, Camera, MessageCircle, Users, Tv, Send, Film, Brain, GitCompareArrows, Gift, Bell, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CategorySlug } from '@/types';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Camera,
  twitter: MessageCircle,
  facebook: Users,
  tiktok: Film,
  youtube: Tv,
  snapchat: Send,
};

const MORE_LINKS = [
  { label: 'الاختبارات', page: 'quiz' as const, icon: Brain },
  { label: 'مقارنة المنتجات', page: 'compare' as const, icon: GitCompareArrows },
  { label: 'الدعوة والأصدقاء', page: 'referral' as const, icon: Gift },
  { label: 'الإشعارات', page: 'notifications' as const, icon: Bell },
];

export function Footer() {
  const { navigateTo, selectCategory } = useStore();

  return (
    <footer className="bg-gradient-hero mt-16 pb-20 lg:pb-0 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-gradient">
                {SITE_NAME}
              </span>
            </div>
            <p className="text-text-subtle text-sm leading-relaxed mb-4">
              موقع شامل للمرأة العربية يغطي الموضة والطبخ والعناية بالبشرة والشعر
              واللياقة والتجميل والصحة بنصائح ووصفات يومية.
            </p>
            {/* Social Icons with gradient hover */}
            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon] || MessageCircle;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full glass-subtle flex items-center justify-center text-text-subtle transition-all duration-300 hover:bg-gradient-primary hover:text-white hover:shadow-[var(--shadow-glow)] hover:scale-110 cursor-pointer group"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-bold text-gradient text-lg mb-4">الأقسام</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.categories.slice(0, 7).map((cat, i) => (
                <motion.li
                  key={cat.slug}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => {
                      selectCategory(cat.slug as CategorySlug);
                      navigateTo('category');
                    }}
                    className="text-sm text-text-subtle hover:text-primary transition-colors cursor-pointer hover:translate-x-1 inline-block duration-200"
                  >
                    {cat.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-heading font-bold text-gradient text-lg mb-4">روابط مفيدة</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.about.map((link, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="text-sm text-text-subtle hover:text-primary transition-colors cursor-pointer hover:translate-x-1 inline-block duration-200">
                    {link.label}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="font-heading font-bold text-gradient text-lg mb-4">المزيد</h3>
            <ul className="space-y-2.5">
              {MORE_LINKS.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.li
                    key={link.page}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => navigateTo(link.page)}
                      className="text-sm text-text-subtle hover:text-primary transition-colors cursor-pointer hover:translate-x-1 inline-flex items-center gap-2 duration-200"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                    </button>
                  </motion.li>
                );
              })}
              {/* Language Switcher placeholder */}
              <motion.li
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: MORE_LINKS.length * 0.05 }}
              >
                <span className="text-sm text-text-subtle hover:text-primary transition-colors cursor-pointer hover:translate-x-1 inline-flex items-center gap-2 duration-200">
                  <Globe className="h-3.5 w-3.5" />
                  اللغة العربية
                </span>
              </motion.li>
            </ul>
          </div>

          {/* Newsletter with gradient-border and glass effect */}
          <div>
            <h3 className="font-heading font-bold text-gradient text-lg mb-4">النشرة البريدية</h3>
            <div className="gradient-border rounded-2xl">
              <div className="glass p-5 rounded-2xl">
                <p className="text-sm text-text-subtle mb-4 leading-relaxed">
                  اشتركي لتلقي أحدث النصائح والوصفات مباشرة في بريدك
                </p>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    className="w-full px-4 py-2.5 text-sm glass-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-[var(--shadow-glow)] text-text-main placeholder:text-text-subtle/50 transition-all duration-300"
                  />
                  <button className={cn(
                    'btn-primary text-sm text-center',
                    'px-4 py-2.5 w-full'
                  )}>
                    اشتراك
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with glass-subtle and pattern-arabic */}
        <div className="mt-10 pt-6 relative">
          <div className="glass-subtle rounded-2xl px-6 py-5 relative overflow-hidden">
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 pattern-arabic opacity-30 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-text-subtle">
                © {new Date().getFullYear()} {SITE_NAME}. جميع الحقوق محفوظة. صُنع بـ{' '}
                <Heart className="inline h-3.5 w-3.5 text-primary fill-primary animate-pulse-heart" />
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-subtle hover:text-primary transition-colors cursor-pointer"
                    aria-label={social.name}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
