'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, Send, CheckCircle } from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  seriesTitle?: string;
  episodeTitle?: string;
}

const ISSUE_TYPES = [
  'الحلقة لا تعمل',
  'الصوت غير متزامن',
  'جودة الصورة سيئة',
  'ترجمة غير دقيقة',
  'الحلقة مكررة',
  'مشكلة أخرى',
];

export function ReportIssueModal({ isOpen, onClose, seriesTitle, episodeTitle }: ReportIssueModalProps) {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedIssue) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedIssue('');
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
            className="fixed bottom-0 left-0 right-0 z-[61] max-h-[85vh] rounded-t-3xl glass-strong overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <Flag className="h-4 w-4 text-orange-500" />
                بلّغ عن مشكلة
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
                <p className="text-base font-bold text-text-main">تم الإبلاغ بنجاح</p>
                <p className="text-sm text-text-subtle mt-1">سنعمل على حل المشكلة في أقرب وقت</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {(seriesTitle || episodeTitle) && (
                  <div className="glass-subtle rounded-xl p-3 text-xs text-text-subtle">
                    {seriesTitle && <p>المسلسل: <span className="font-bold text-text-main">{seriesTitle}</span></p>}
                    {episodeTitle && <p>الحلقة: <span className="font-bold text-text-main">{episodeTitle}</span></p>}
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold text-text-main mb-2">نوع المشكلة</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ISSUE_TYPES.map(issue => (
                      <button key={issue} onClick={() => setSelectedIssue(issue)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-medium transition-all cursor-pointer border ${
                          selectedIssue === issue ? 'bg-primary/10 border-primary text-primary' : 'glass-subtle border-transparent text-text-subtle'
                        }`}>
                        {issue}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-text-main mb-2">تفاصيل إضافية (اختياري)</p>
                  <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3}
                    className="w-full glass-subtle rounded-xl p-3 text-xs text-text-main placeholder-text-muted border border-border/30 focus:border-primary/50 outline-none resize-none"
                    placeholder="اشرح المشكلة بتفصيل..." />
                </div>

                <button onClick={handleSubmit} disabled={!selectedIssue}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send className="h-4 w-4" />
                  إرسال البلاغ
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
