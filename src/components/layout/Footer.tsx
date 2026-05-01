'use client';

import { SITE_NAME, CATEGORIES } from '@/lib/constants';
import { useStore } from '@/store/useStore';
import {
  Heart, Tv, Camera, MessageCircle, Users,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Theater, Laugh, Swords, Music, Palette, BookOpen, Star,
} from 'lucide-react';
import type { SeriesCategorySlug, SitePage } from '@/types';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Camera,
  twitter: MessageCircle,
  facebook: Users,
};

const SOCIAL_LINKS = [
  { name: 'انستغرام', url: 'https://instagram.com/musalsalat', icon: 'instagram' },
  { name: 'تويتر', url: 'https://twitter.com/musalsalat', icon: 'twitter' },
  { name: 'فيسبوك', url: 'https://facebook.com/musalsalat', icon: 'facebook' },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  drama: Theater,
  comedy: Laugh,
  action: Swords,
  romantic: Heart,
  turkish: Globe,
  indian: Music,
  korean: Star,
  cartoon: Palette,
  documentary: BookOpen,
};

const QUICK_LINKS = [
  { label: 'المفضلة', page: 'favorites' as SitePage },
  { label: 'تابع المشاهدة', page: 'continue-watching' as SitePage },
];

export function Footer() {
  const { navigateTo, selectCategory } = useStore();

  const handleCategoryClick = (slug: string) => {
    selectCategory(slug as SeriesCategorySlug);
    navigateTo('category');
  };

  return (
    <footer className="bg-card/50 border-t border-border/30 mt-8 pb-20 lg:pb-4 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ─── Brand + Social Icons Row ─── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Tv className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-heading font-bold text-gradient">{SITE_NAME}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.icon] || MessageCircle;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full glass-subtle flex items-center justify-center text-text-subtle transition-all duration-300 hover:bg-gradient-primary hover:text-white hover:scale-110 cursor-pointer"
                  aria-label={social.name}
                >
                  <Icon className="h-3 w-3" />
                </a>
              );
            })}
          </div>
        </div>

        {/* ─── الأقسام (pill chips) ─── */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat.slug] || Tv;
              return (
                <motion.button
                  key={cat.slug}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium glass-subtle text-text-subtle hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                >
                  {Icon && <Icon className="h-2.5 w-2.5" />}
                  {cat.name}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ─── Quick Links ─── */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {QUICK_LINKS.map((link) => (
              <button
                key={link.page}
                onClick={() => navigateTo(link.page)}
                className="text-[11px] text-text-subtle hover:text-primary transition-colors duration-200 cursor-pointer py-0.5"
              >
                {link.label}
              </button>
            ))}
            <span className="text-border">|</span>
            <button className="flex items-center gap-1 text-[11px] text-text-subtle hover:text-primary transition-colors duration-200 cursor-pointer py-0.5">
              <Globe className="h-2.5 w-2.5" />
              العربية
            </button>
          </div>
        </div>

        {/* ─── Copyright ─── */}
        <div className="pt-3 border-t border-border/20 flex items-center justify-center gap-1">
          <p className="text-[10px] text-text-subtle/60">
            © {new Date().getFullYear()} {SITE_NAME}. جميع الحقوق محفوظة.
          </p>
          <Heart className="h-2.5 w-2.5 text-primary fill-primary" />
        </div>
      </div>
    </footer>
  );
}
