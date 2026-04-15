'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Clock,
  Calendar,
  User,
  X,
  Play,
  Video,
  Users,
  ArrowRight,
  ChevronLeft,
  Tag,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { EXPERT_SESSIONS } from '@/data/featuresData';
import { cn, formatDate } from '@/lib/utils';
import type { ExpertSession, CategorySlug } from '@/types';

// ─────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease },
  },
};

const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContent = {
  initial: { opacity: 0, scale: 0.92, y: 30 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.25, ease } },
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const CATEGORY_LABELS: Record<CategorySlug, string> = {
  fashion: 'أزياء',
  cooking: 'طبخ',
  skincare: 'بشرة',
  haircare: 'شعر',
  fitness: 'لياقة',
  beauty: 'تجميل',
  health: 'صحة',
  natural: 'طبيعي',
};

function getTimeUntilSession(date: string, time: string): string {
  const now = new Date();
  const target = new Date(`${date}T${time}:00`);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return 'مباشر الآن';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days} يوم ${hours} ساعة`;
  if (hours > 0) return `${hours} ساعة ${minutes} دقيقة`;
  if (minutes > 0) return `${minutes} دقيقة ${seconds} ثانية`;
  return `${seconds} ثانية`;
}

// ─────────────────────────────────────────────
// Session Card
// ─────────────────────────────────────────────
function SessionCard({
  session,
  onSelect,
  onToggleRegister,
}: {
  session: ExpertSession;
  onSelect: (s: ExpertSession) => void;
  onToggleRegister: (id: string) => void;
}) {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const update = () => setCountdown(getTimeUntilSession(session.date, session.time));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [session.date, session.time]);

  const isUpcoming = countdown !== 'مباشر الآن';

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      className="glass-strong rounded-2xl overflow-hidden card-hover gradient-border"
    >
      <div className="p-5 sm:p-6">
        {/* Top row: live badge + category */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs glass-subtle px-3 py-1 rounded-full text-primary font-medium flex items-center gap-1.5">
            <Tag className="h-3 w-3" />
            {CATEGORY_LABELS[session.category] || session.category}
          </span>
          {session.isLive ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              مباشر الآن
            </span>
          ) : isUpcoming ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              {countdown}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium text-text-subtle bg-text-subtle/10 px-3 py-1 rounded-full">
              <Play className="h-3 w-3" />
              مسجل
            </span>
          )}
        </div>

        {/* Expert info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={session.avatar}
            alt={session.expertName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-heading font-bold text-text-main truncate">
              {session.expertName}
            </h3>
            <p className="text-xs text-text-subtle">{session.specialty}</p>
          </div>
        </div>

        {/* Session title */}
        <h4 className="text-base font-heading font-bold text-text-main mb-3 line-clamp-1">
          {session.title}
        </h4>
        <p className="text-xs text-text-secondary line-clamp-2 mb-4">{session.description}</p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-subtle mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(session.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {session.time}
          </span>
          <span className="flex items-center gap-1">
            <Video className="h-3.5 w-3.5" />
            {session.duration}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(session)}
            className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
          >
            <span>التفاصيل</span>
            <ChevronLeft className="h-4 w-4" />
          </motion.button>

          {isUpcoming && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggleRegister(session.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold transition-all border-2',
                session.isRegistered
                  ? 'bg-green-500/10 border-green-500 text-green-600'
                  : 'btn-outline'
              )}
            >
              {session.isRegistered ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Users className="h-5 w-5" />
              )}
            </motion.button>
          )}

          {!isUpcoming && !session.isLive && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="btn-outline p-2 rounded-full"
            >
              <Play className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Session Detail Modal
// ─────────────────────────────────────────────
function SessionDetailModal({
  session,
  onClose,
  onToggleRegister,
}: {
  session: ExpertSession | null;
  onClose: () => void;
  onToggleRegister: (id: string) => void;
}) {
  const [modalCountdown, setModalCountdown] = useState('');

  useEffect(() => {
    if (session) {
      const update = () => setModalCountdown(getTimeUntilSession(session.date, session.time));
      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const isUpcoming = modalCountdown !== 'مباشر الآن';

  if (!session) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        variants={modalOverlay}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div
          key="modal-content"
          variants={modalContent}
          initial="initial"
          animate="animate"
          exit="exit"
          className="glass-strong rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header gradient */}
          <div className="bg-gradient-primary p-6 sm:p-8 relative">
            <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4 relative z-10">
              <img
                src={session.avatar}
                alt={session.expertName}
                className="w-16 h-16 rounded-2xl object-cover ring-3 ring-white/30"
              />
              <div>
                <h3 className="text-lg font-heading font-bold text-white">
                  {session.expertName}
                </h3>
                <p className="text-white/80 text-sm">{session.specialty}</p>
                {session.isLive && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-red-500/80 px-2 py-0.5 rounded-full mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    مباشر
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-xl font-heading font-bold text-text-main mb-2">
                {session.title}
              </h2>
              <span className="text-xs glass-subtle px-3 py-1 rounded-full text-primary font-medium inline-flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {CATEGORY_LABELS[session.category]}
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {session.description}
            </p>

            {/* Expert Bio (simulated) */}
            <div className="glass-subtle rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-heading font-bold text-text-main">
                  نبذة عن الخبيرة
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {session.expertName} خبيرة متخصصة في {session.specialty} مع خبرة تزيد عن ١٠ سنوات في مجالها. تقدم استشارات متخصصة ونصائح عملية تساعدك على تحقيق أفضل النتائج.
              </p>
            </div>

            {/* Session details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-subtle rounded-xl p-3 text-center">
                <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-text-subtle">التاريخ</p>
                <p className="text-sm font-bold text-text-main">{formatDate(session.date)}</p>
              </div>
              <div className="glass-subtle rounded-xl p-3 text-center">
                <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-text-subtle">الوقت</p>
                <p className="text-sm font-bold text-text-main">{session.time}</p>
              </div>
              <div className="glass-subtle rounded-xl p-3 text-center">
                <Video className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-text-subtle">المدة</p>
                <p className="text-sm font-bold text-text-main">{session.duration}</p>
              </div>
              <div className="glass-subtle rounded-xl p-3 text-center">
                <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-text-subtle">الحالة</p>
                <p className="text-sm font-bold text-text-main">
                  {session.isLive ? '🔴 مباشر' : isUpcoming ? '🟢 قادمة' : '⚪ مسجّلة'}
                </p>
              </div>
            </div>

            {/* Action */}
            {isUpcoming && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => onToggleRegister(session.id)}
                className={cn(
                  'w-full py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2',
                  session.isRegistered
                    ? 'bg-red-500/10 border-2 border-red-400 text-red-500 hover:bg-red-500/20'
                    : 'btn-primary'
                )}
              >
                {session.isRegistered ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    إلغاء التسجيل
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    تسجيل في الجلسة
                  </>
                )}
              </motion.button>
            )}

            {session.isLive && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                مشاهدة البث المباشر
              </motion.button>
            )}

            {!isUpcoming && !session.isLive && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full btn-outline py-3 text-sm font-bold flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                مشاهدة التسجيل
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
// Past Session Card (recorded)
// ─────────────────────────────────────────────
function PastSessionCard({ session }: { session: ExpertSession }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      className="glass-subtle rounded-2xl p-4 card-hover flex items-center gap-3"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Play className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-heading font-bold text-text-main truncate">
          {session.title}
        </h4>
        <p className="text-xs text-text-subtle truncate">
          {session.expertName} — {session.specialty}
        </p>
      </div>
      <span className="text-xs text-text-subtle flex-shrink-0">{session.duration}</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export function ExpertSessionsPage() {
  const { goBack } = useStore();
  const [sessions, setSessions] = useState<ExpertSession[]>([...EXPERT_SESSIONS]);
  const [selectedSession, setSelectedSession] = useState<ExpertSession | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Separate live, upcoming and past sessions
  const { liveSessions, upcomingSessions, pastSessions } = useMemo(() => {
    const now = new Date();
    const live = sessions.filter((s) => s.isLive);
    const upcoming = sessions.filter(
      (s) => !s.isLive && new Date(`${s.date}T${s.time}:00`).getTime() > now.getTime()
    );
    const past = sessions.filter(
      (s) => !s.isLive && new Date(`${s.date}T${s.time}:00`).getTime() <= now.getTime()
    );
    return { liveSessions: live, upcomingSessions: upcoming, pastSessions: past };
  }, [sessions]);

  const handleToggleRegister = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isRegistered: !s.isRegistered } : s))
    );
  };

  // Next upcoming countdown
  const nextSession = [...liveSessions, ...upcomingSessions][0];
  const [nextCountdown, setNextCountdown] = useState('');

  useEffect(() => {
    if (!nextSession) return;
    const update = () => {
      if (nextSession.isLive) {
        setNextCountdown('🔴 مباشر الآن!');
        return;
      }
      setNextCountdown(getTimeUntilSession(nextSession.date, nextSession.time));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [nextSession]);

  const displaySessions = activeTab === 'upcoming' ? [...liveSessions, ...upcomingSessions] : pastSessions;

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

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease }}
        className="relative rounded-3xl overflow-hidden mb-8"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Radio className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            جلسات مع الخبراء
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            جلسات مباشرة ومسجلة مع أفضل خبراء التجميل والعناية
          </p>

          {/* Countdown to next session */}
          {nextSession && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease }}
              className="mt-6 inline-flex items-center gap-3 glass rounded-2xl px-6 py-3 relative z-10"
            >
              {nextSession.isLive ? (
                <span className="flex items-center gap-2 text-sm font-bold text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  {nextCountdown}
                </span>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white/90">الجلسة القادمة في:</span>
                  <span className="text-lg font-heading font-bold text-accent">{nextCountdown}</span>
                </>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {(['upcoming', 'past'] as const).map((tab) => (
          <motion.button
            key={tab}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer',
              activeTab === tab
                ? 'btn-primary'
                : 'glass-subtle text-text-secondary hover:text-text-main'
            )}
          >
            {tab === 'upcoming' ? `الجلسات القادمة (${liveSessions.length + upcomingSessions.length})` : `مسجلة (${pastSessions.length})`}
          </motion.button>
        ))}
      </div>

      {/* Sessions list */}
      {displaySessions.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          key={activeTab}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {displaySessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onSelect={setSelectedSession}
              onToggleRegister={handleToggleRegister}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-10 text-center"
        >
          <Radio className="h-12 w-12 text-text-subtle mx-auto mb-3" />
          <p className="text-text-subtle text-sm">
            {activeTab === 'upcoming' ? 'لا توجد جلسات قادمة حالياً' : 'لا توجد جلسات مسجلة حالياً'}
          </p>
        </motion.div>
      )}

      {/* Past sessions (recorded) section */}
      {activeTab === 'upcoming' && pastSessions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-heading font-bold text-text-main mb-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            جلسات مسجلة سابقة
          </h3>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-3 max-h-72 overflow-y-auto"
          >
            {pastSessions.map((session) => (
              <PastSessionCard key={session.id} session={session} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onToggleRegister={handleToggleRegister}
        />
      )}
    </motion.div>
  );
}
