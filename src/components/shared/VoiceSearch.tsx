'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function VoiceSearch() {
  const { setSearchQuery, toggleSearch } = useStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<unknown | null>(null);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new (SpeechRecognition as new () => unknown)() as Record<string, unknown>;
    recognition.lang = 'ar-SA';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: unknown) => {
      const e = event as { results: Iterable<{ 0: { transcript: string }; isFinal: boolean }> };
      const result = Array.from(e.results).map((r) => r[0].transcript).join('');
      setTranscript(result);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        setSearchQuery(transcript);
        toggleSearch();
        setTranscript('');
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    (recognition as { start: () => void }).start();
    setIsListening(true);
    setTranscript('');
  }, [setSearchQuery, toggleSearch, transcript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      (recognitionRef.current as { stop: () => void }).stop();
    }
    setIsListening(false);
  }, []);

  const handleClick = () => {
    if (!isSupported) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      {/* Floating Voice Search Button - bottom-right above bottom nav */}
      <div className="fixed bottom-24 left-4 z-40 lg:bottom-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className={cn(
            'relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
            isListening
              ? 'glass-strong bg-gradient-primary text-white shadow-[var(--shadow-glow)] animate-glow'
              : 'glass-strong text-primary shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)]'
          )}
          aria-label={isListening ? 'إيقاف البحث الصوتي' : 'بحث صوتي'}
          type="button"
        >
          {/* Gradient border ring when listening */}
          {isListening && (
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gradient-primary opacity-30"
            />
          )}
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <MicOff className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Mic className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Transcript bubble */}
        <AnimatePresence>
          {isListening && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full left-0 mb-3 glass-strong rounded-xl px-4 py-2.5 max-w-[220px] shadow-[var(--shadow-lg)]"
            >
              <p className="text-xs text-text-main text-right leading-relaxed">{transcript}</p>
              <span className="text-[10px] text-primary mt-1 block">جاري الاستماع...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Not supported tooltip */}
        <AnimatePresence>
          {!isSupported && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 mb-3 glass-strong rounded-xl px-4 py-2.5 max-w-[240px] shadow-[var(--shadow-lg)]"
            >
              <p className="text-xs text-text-subtle text-right">
                البحث الصوتي غير مدعوم في هذا المتصفح
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
