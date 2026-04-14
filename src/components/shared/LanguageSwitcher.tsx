'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  label: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
    setIsOpen(false);
    // Store preference in localStorage for now
    if (typeof window !== 'undefined') {
      localStorage.setItem('jamalik-locale', lang.code);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass-subtle text-text-subtle hover:text-primary transition-all cursor-pointer text-xs font-medium"
        type="button"
        aria-label="تغيير اللغة"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{selectedLang.label}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 glass-strong rounded-xl shadow-[var(--shadow-lg)] overflow-hidden min-w-[160px] z-50"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors cursor-pointer',
                  selectedLang.code === lang.code
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-main hover:bg-primary/5 hover:text-primary'
                )}
                type="button"
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {selectedLang.code === lang.code && (
                  <motion.span
                    layoutId="lang-active"
                    className="w-1.5 h-1.5 rounded-full bg-primary mr-auto"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
