'use client';

import { Printer } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrintButtonProps {
  label?: string;
}

export function PrintButton({ label = 'طباعة' }: PrintButtonProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium glass-subtle text-text-subtle hover:text-primary transition-all duration-300 cursor-pointer"
      type="button"
      aria-label={label}
    >
      <Printer className="h-4 w-4" />
      {label}
    </motion.button>
  );
}
