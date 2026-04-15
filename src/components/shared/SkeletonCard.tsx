'use client';
import { motion } from 'framer-motion';

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
      <div className="aspect-[16/10] bg-border/30" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded-full bg-border/30" />
        <div className="h-4 w-full rounded-lg bg-border/20" />
        <div className="h-4 w-3/4 rounded-lg bg-border/20" />
        <div className="pt-3 border-t border-border/30 flex justify-between">
          <div className="h-3 w-20 rounded-full bg-border/20" />
          <div className="h-3 w-16 rounded-full bg-border/20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-20 rounded-full bg-border/30" />
      <div className="aspect-[21/9] rounded-3xl bg-border/30" />
      <div className="max-w-3xl space-y-4">
        <div className="h-8 w-3/4 rounded-lg bg-border/20" />
        <div className="flex gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-7 w-24 rounded-full bg-border/20" />)}
        </div>
        <div className="space-y-3 pt-4">
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="h-4 rounded-lg bg-border/15" style={{width: `${70 + Math.random() * 30}%`}} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonRecipe() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-20 rounded-full bg-border/30" />
      <div className="aspect-[21/9] rounded-3xl bg-border/30" />
      <div className="max-w-3xl space-y-4">
        <div className="h-8 w-2/3 rounded-lg bg-border/20" />
        <div className="h-4 w-full rounded-lg bg-border/20" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-border/15" />
          ))}
        </div>
      </div>
    </div>
  );
}
