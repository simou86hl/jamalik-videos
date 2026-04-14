'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Link2, Check, MessageCircle, Users } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback - do nothing
    }
  };

  const shareText = encodeURIComponent(`تصفحي: ${title} - جمالكِ`);

  const shareOptions = [
    {
      name: 'نسخ الرابط',
      icon: copied ? Check : Link2,
      onClick: copyLink,
      className: 'glass-subtle text-text-subtle hover:text-primary hover:bg-primary/5',
    },
    {
      name: 'تويتر',
      icon: MessageCircle,
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`, '_blank'),
      className: 'glass-subtle text-text-subtle hover:text-sky-500 hover:bg-sky-500/5',
    },
    {
      name: 'فيسبوك',
      icon: Users,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'),
      className: 'glass-subtle text-text-subtle hover:text-blue-600 hover:bg-blue-600/5',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <Share2 className="h-4 w-4 text-text-subtle/60" />
      <span className="text-xs text-text-subtle/60 ml-1">مشاركة:</span>
      {shareOptions.map((option) => (
        <motion.button
          key={option.name}
          whileTap={{ scale: 0.9 }}
          onClick={option.onClick}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${option.className}`}
          aria-label={option.name}
          type="button"
        >
          <option.icon className="h-3.5 w-3.5" />
        </motion.button>
      ))}
    </motion.div>
  );
}
