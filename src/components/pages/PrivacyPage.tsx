'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Database,
  Cookie,
  Users,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { STATIC_PAGES } from '@/data/staticPages';

const sectionIcons: Record<string, React.ElementType> = {
  'priv-intro': Shield,
  'priv-collect': Database,
  'priv-use': Lock,
  'priv-share': Users,
  'priv-security': Shield,
  'priv-rights': Lock,
  'priv-cookies': Cookie,
};

export function PrivacyPage() {
  const { goBack } = useStore();
  const page = STATIC_PAGES.privacy;
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

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

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative rounded-3xl overflow-hidden mb-10"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Shield className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            {page.title}
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            {page.subtitle}
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table of Contents - Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-72 flex-shrink-0">
          <div className="glass-strong rounded-2xl p-5 sticky top-24">
            <h3 className="text-base font-heading font-bold text-gradient mb-4">فهرس المحتوى</h3>
            <nav className="space-y-1">
              {page.content.map((section) => {
                const Icon = sectionIcons[section.id] || Shield;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleScroll(section.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-right cursor-pointer ${
                      activeSection === section.id
                        ? 'bg-gradient-primary/10 text-primary font-medium'
                        : 'text-text-subtle hover:text-text-main hover:bg-glass-subtle'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Accordion TOC */}
          <div className="lg:hidden mb-6">
            {page.content.map((section) => {
              const Icon = sectionIcons[section.id] || Shield;
              return (
                <motion.div
                  key={section.id}
                  layout
                  className="glass-strong rounded-2xl overflow-hidden mb-3"
                >
                  <button
                    onClick={() => setOpenMobileSection(openMobileSection === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between p-4 text-right cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-bold text-text-main text-sm">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      {section.title}
                    </span>
                    {openMobileSection === section.id ? (
                      <ChevronUp className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-subtle flex-shrink-0" />
                    )}
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openMobileSection === section.id ? 'auto' : 0, opacity: openMobileSection === section.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div id={`mobile-${section.id}`} className="px-4 pb-4 text-sm text-text-secondary leading-relaxed">
                      {section.body}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Content Sections */}
          <div className="hidden lg:block space-y-8 print:space-y-6">
            {page.content.map((section, index) => {
              const Icon = sectionIcons[section.id] || Shield;
              return (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="glass-strong rounded-2xl p-6 scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-heading font-bold text-gradient">{section.title}</h2>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{section.body}</p>
                </motion.section>
              );
            })}
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center">
            <p className="text-xs text-text-subtle">
              آخر تحديث: يناير ٢٠٢٥
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
