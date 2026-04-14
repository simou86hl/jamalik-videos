'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function RecipeTimer({ prepTime, cookTime }: { prepTime: number; cookTime: number }) {
  const { timerState, startTimer, pauseTimer, resetTimer, tickTimer } = useStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState.isRunning, tickTimer]);

  const minutes = Math.floor(timerState.remainingSeconds / 60);
  const seconds = timerState.remainingSeconds % 60;
  const totalTime = prepTime + cookTime;

  const formatTime = (mins: number, secs: number) =>
    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-24 left-4 z-40 lg:bottom-8">
      <div className="glass-strong gradient-border rounded-2xl p-4 shadow-[var(--shadow-xl)] min-w-[180px]">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-text-subtle">
            {timerState.label || 'مؤقت الوصفة'}
          </span>
        </div>

        {timerState.isRunning || timerState.remainingSeconds > 0 ? (
          <>
            <p className="text-2xl font-heading font-bold text-text-main text-center mb-3 font-mono">
              {formatTime(minutes, seconds)}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={timerState.isRunning ? pauseTimer : () => {}}
                className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white cursor-pointer"
              >
                {timerState.isRunning ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={resetTimer}
                className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center text-text-subtle hover:text-primary cursor-pointer transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            {prepTime > 0 && (
              <button
                onClick={() => startTimer(prepTime * 60, 'التحضير')}
                className="w-full text-xs py-2 rounded-xl glass-subtle text-text-subtle hover:text-primary hover:bg-primary/5 cursor-pointer transition-all font-medium"
              >
                تحضير {prepTime} د
              </button>
            )}
            {cookTime > 0 && (
              <button
                onClick={() => startTimer(cookTime * 60, 'الطبخ')}
                className="w-full text-xs py-2 rounded-xl bg-gradient-primary text-white cursor-pointer font-medium"
              >
                طبخ {cookTime} د
              </button>
            )}
          </div>
        )}

        {totalTime > 0 && timerState.remainingSeconds === 0 && !timerState.isRunning && (
          <p className="text-[10px] text-text-subtle/60 text-center mt-2">
            المجموع: {totalTime} دقيقة
          </p>
        )}
      </div>
    </div>
  );
}
