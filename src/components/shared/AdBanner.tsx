'use client';

import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function AdBanner({ className }: { className?: string }) {
  return (
    <div className={cn('w-full rounded-2xl overflow-hidden', className)}>
      <div className="glass-subtle border border-border/30 rounded-2xl p-4 text-center">
        <p className="text-[10px] text-text-subtle/40 uppercase tracking-wider mb-1">إعلان</p>
        <p className="text-sm text-text-subtle">مساحة إعلانية</p>
      </div>
    </div>
  );
}
