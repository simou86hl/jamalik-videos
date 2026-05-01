'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusCircle, Send, CheckCircle } from 'lucide-react';

interface RequestSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestSeriesModal({ isOpen, onClose }: RequestSeriesModalProps) {
  const [seriesName, setSeriesName] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!seriesName.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSeriesName('');
      setDetails('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 z-[61] max-h-[80vh] rounded-t-3xl glass-strong overflow-hidden safe-area-bottom" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px) + 4.5rem)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-primary" />
                طلب مسلسل
              </h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center cursor-pointer">
                <X className="h-4 w-4 text-text-main" />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                </motion.div>
                <p className="text-base font-bold text-text-main">تم إرسال الطلب</p>
                <p className="text-sm text-text-subtle mt-1">سنحاول إضافة المسلسل في أقرب وقت</p>
              </div>
            ) : (
              <div className="p-5 space-y-4 pb-2">
                <div>
                  <p className="text-xs font-bold text-text-main mb-2">اسم المسلسل *</p>
                  <input type="text" value={seriesName} onChange={e => setSeriesName(e.target.value)}
                    className="w-full glass-subtle rounded-xl p-3 text-sm text-text-main placeholder-text-muted border border-border/30 focus:border-primary/50 outline-none"
                    placeholder="مثال: مسلسل الحفرة" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-main mb-2">تفاصيل (اختياري)</p>
                  <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3}
                    className="w-full glass-subtle rounded-xl p-3 text-xs text-text-main placeholder-text-muted border border-border/30 focus:border-primary/50 outline-none resize-none"
                    placeholder="البلد، السنة، الممثلين..." />
                </div>
                <button onClick={handleSubmit} disabled={!seriesName.trim()}
                  className="w-full flex items-center justify-center gap-2.5 text-base font-bold text-white rounded-2xl py-4 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_6px_24px_rgba(194,24,91,0.35)] active:scale-[0.98] transition-transform"
                  style={{ background: 'var(--gradient-primary)' }}>
                  <Send className="h-5 w-5" />
                  إرسال الطلب
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
