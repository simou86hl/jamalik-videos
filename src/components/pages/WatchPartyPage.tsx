'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Send, X, Play, Smile, Copy, Check,
  Plus, LogIn, Tv, Share2, MessageCircle,
  ChevronDown, Sparkles, Clock,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { ALL_SERIES } from '@/data/seriesData';

interface ChatMessage {
  id: number;
  user: string;
  text: string;
  time: string;
  isMe: boolean;
  avatar?: string;
}

interface RoomState {
  id: string;
  name: string;
  code: string;
  host: string;
  seriesTitle: string | null;
  episodeTitle: string | null;
  isLive: boolean;
  createdAt: string;
}

const AVATAR_COLORS = ['#f06292', '#ce93d8', '#90caf9', '#80cbc4', '#fff176', '#ffab91'];
const MOCK_USERS = [
  { name: 'أحمد', color: AVATAR_COLORS[0] },
  { name: 'سارة', color: AVATAR_COLORS[1] },
  { name: 'محمد', color: AVATAR_COLORS[2] },
  { name: 'نور', color: AVATAR_COLORS[3] },
  { name: 'خالد', color: AVATAR_COLORS[4] },
  { name: 'ليلى', color: AVATAR_COLORS[5] },
];
const MOCK_MESSAGES = [
  'هذه الحلقة رائعة! 🔥',
  'لم أتوقع هذا المنعطف!',
  'الممثل أداءه ممتاز',
  'ما شاء الله مشهد رائع',
  'من يحب هذا المسلسل؟ ❤️',
  'الحلقة القادمة بتكون أقوى',
  'صوتي ما يسمع',
  'جودة البث ممتازة',
  'حد يقدر يفسر لي آخر مشهد؟',
  'هذا المسلسل من أفضل ما شفت 💯',
];

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function WatchPartyPage() {
  const { goBack, selectedSeries } = useStore();
  const [phase, setPhase] = useState<'lobby' | 'room'>('lobby');
  const [joinMode, setJoinMode] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [room, setRoom] = useState<RoomState | null>(null);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const [showSeriesPicker, setShowSeriesPicker] = useState(false);
  const [selectedSerie, setSelectedSerie] = useState<{ id: string; title: string } | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(1);

  // Restore room from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('watchparty-room');
      if (saved) {
        const parsed = JSON.parse(saved) as RoomState;
        setRoom(parsed);
        setPhase('room');
        setOnlineCount(3 + Math.floor(Math.random() * 10));
        setMessages([
          { id: 0, user: 'النظام', text: 'مرحباً بعودتك! الغرفة لا تزال مفتوحة', time: formatTime(), isMe: false },
        ]);
      }
    } catch {}
  }, []);

  // Save room to localStorage
  useEffect(() => {
    if (room && phase === 'room') {
      localStorage.setItem('watchparty-room', JSON.stringify(room));
    }
  }, [room, phase]);

  // Simulate other users joining after room creation
  useEffect(() => {
    if (phase !== 'room') return;
    const timer = setTimeout(() => {
      setOnlineCount(prev => prev + 1);
      const joinedUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      addSystemMessage(`${joinedUser.name} انضم إلى الغرفة`);
    }, 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Simulate more users joining over time
  useEffect(() => {
    if (phase !== 'room') return;
    const interval = setInterval(() => {
      if (onlineCount < 20) {
        const shouldJoin = Math.random() > 0.4;
        if (shouldJoin) {
          setOnlineCount(prev => prev + 1);
          const joinedUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
          addSystemMessage(`${joinedUser.name} انضم إلى الغرفة`);
        }
      }
    }, 8000 + Math.random() * 12000);
    return () => clearInterval(interval);
  }, [phase, onlineCount]);

  // Simulate other users chatting
  useEffect(() => {
    if (phase !== 'room' || !room?.isLive) return;
    const interval = setInterval(() => {
      const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      const newMsg: ChatMessage = {
        id: msgId.current++,
        user: randomUser.name,
        text: randomMsg,
        time: formatTime(),
        isMe: false,
      };
      setMessages(prev => [...prev.slice(-80), newMsg]);
    }, 4000 + Math.random() * 6000);
    return () => clearInterval(interval);
  }, [phase, room?.isLive]);

  // Auto scroll chat
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [messages.length]);

  const formatTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const addSystemMessage = useCallback((text: string) => {
    setMessages(prev => [...prev.slice(-80), {
      id: msgId.current++,
      user: 'النظام',
      text,
      time: formatTime(),
      isMe: false,
    }]);
  }, []);

  const createRoom = () => {
    const code = generateRoomCode();
    const newRoom: RoomState = {
      id: `room-${Date.now()}`,
      name: `غرفة ${code}`,
      code,
      host: 'أنت',
      seriesTitle: selectedSeries?.title || null,
      episodeTitle: selectedSeries ? `الحلقة 1` : null,
      isLive: true,
      createdAt: new Date().toISOString(),
    };
    setRoom(newRoom);
    setPhase('room');
    setOnlineCount(1);
    setMessages([{
      id: 0,
      user: 'النظام',
      text: `تم إنشاء الغرفة بنجاح! كود الغرفة: ${code}\nشارك الكود مع أصدقائك ليشاركوك المشاهدة`,
      time: formatTime(),
      isMe: false,
    }]);
  };

  const joinRoomByCode = () => {
    if (!joinCode.trim() || joinCode.length < 4) return;
    const newRoom: RoomState = {
      id: `room-${Date.now()}`,
      name: `غرفة ${joinCode.toUpperCase()}`,
      code: joinCode.toUpperCase(),
      host: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].name,
      seriesTitle: null,
      episodeTitle: null,
      isLive: true,
      createdAt: new Date().toISOString(),
    };
    setRoom(newRoom);
    setPhase('room');
    setOnlineCount(3 + Math.floor(Math.random() * 10));
    setMessages([{
      id: 0,
      user: 'النظام',
      text: `مرحباً بك في غرفة ${joinCode.toUpperCase()}!\nاستمتع بالمشاهدة الجماعية`,
      time: formatTime(),
      isMe: false,
    }]);
    // Simulate someone greeting
    setTimeout(() => {
      const greeter = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      setMessages(prev => [...prev, {
        id: msgId.current++,
        user: greeter.name,
        text: 'أهلاً وسهلاً! 🎉',
        time: formatTime(),
        isMe: false,
      }]);
    }, 1500);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: msgId.current++,
      user: 'أنت',
      text: input,
      time: formatTime(),
      isMe: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate response
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responder = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const responses = ['صح! 💯', 'موافق معك', 'ههههه 😂', 'كلامك صحيح', 'أيوا بالضبط', 'فعلاً!'];
        setMessages(prev => [...prev.slice(-80), {
          id: msgId.current++,
          user: responder.name,
          text: responses[Math.floor(Math.random() * responses.length)],
          time: formatTime(),
          isMe: false,
        }]);
      }, 1500 + Math.random() * 3000);
    }
  };

  const copyRoomCode = async () => {
    if (!room) return;
    try {
      await navigator.clipboard.writeText(
        `شاهد معي على مسلسلات أونلاين! 🎬\nكود الغرفة: ${room.code}\nانضم الآن وشاهد معنا جماعياً!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareRoom = async () => {
    if (!room) return;
    const shareText = `شاهد معي على مسلسلات أونلاين! 🎬\nكود الغرفة: ${room.code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'غرفة مشاهدة جماعية - مسلسلات أونلاين',
          text: shareText,
        });
      } catch {}
    } else {
      copyRoomCode();
    }
  };

  const leaveRoom = () => {
    localStorage.removeItem('watchparty-room');
    setRoom(null);
    setPhase('lobby');
    setMessages([]);
    setOnlineCount(1);
    setShowSeriesPicker(false);
  };

  const getUserColor = (userName: string) => {
    const user = MOCK_USERS.find(u => u.name === userName);
    return user?.color || AVATAR_COLORS[0];
  };

  // ═══════════════════════════════════════════════════
  // LOBBY SCREEN
  // ═══════════════════════════════════════════════════
  if (phase === 'lobby') {
    return (
      <div className="pt-2 pb-16 px-1" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full glass-subtle flex items-center justify-center cursor-pointer">
              <X className="h-4 w-4 text-text-main" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-main">المشاهدة الجماعية</h2>
                <p className="text-[10px] text-text-subtle">شاهد مع أصدقائك في نفس الوقت</p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl glass-subtle border border-primary/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-bold text-text-main">كيف تعمل غرفة المشاهدة؟</h3>
          </div>
          <div className="space-y-3">
            {[
              { step: '١', text: 'أنشئ غرفة جديدة أو انضم بكود صديقك', icon: Plus },
              { step: '٢', text: 'اختر المسلسل والحلقة التي تريدون مشاهدتها', icon: Tv },
              { step: '٣', text: 'شارك كود الغرفة مع أصدقائك', icon: Share2 },
              { step: '٤', text: 'تحدثوا مع بعضكم أثناء المشاهدة!', icon: MessageCircle },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-white">{item.step}</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Create / Join toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setJoinMode(false)}
            className={cn(
              'flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2',
              !joinMode ? 'bg-gradient-primary text-white shadow-[var(--shadow-glow)]' : 'glass-subtle text-text-subtle'
            )}
          >
            <Plus className="h-4 w-4" />
            إنشاء غرفة
          </button>
          <button
            onClick={() => setJoinMode(true)}
            className={cn(
              'flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2',
              joinMode ? 'bg-gradient-primary text-white shadow-[var(--shadow-glow)]' : 'glass-subtle text-text-subtle'
            )}
          >
            <LogIn className="h-4 w-4" />
            الانضمام
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!joinMode ? (
            /* ═══ CREATE ROOM ═══ */
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Optional series selection */}
              <button
                onClick={() => setShowSeriesPicker(!showSeriesPicker)}
                className="w-full p-3 rounded-xl glass-subtle text-right cursor-pointer flex items-center justify-between transition-all hover:bg-primary/5"
              >
                <div className="flex items-center gap-2">
                  <Tv className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-text-main">
                    {selectedSerie ? selectedSerie.title : 'اختر مسلسلاً (اختياري)'}
                  </span>
                </div>
                <ChevronDown className={cn('h-4 w-4 text-text-subtle transition-transform', showSeriesPicker && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {showSeriesPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-xl glass-subtle border border-border/30"
                  >
                    <div className="p-2 max-h-[200px] overflow-y-auto no-scrollbar">
                      <input
                        type="text"
                        placeholder="ابحث عن مسلسل..."
                        className="w-full glass-subtle rounded-lg p-2 text-[11px] text-text-main placeholder-text-muted border border-border/30 focus:border-primary/50 outline-none mb-2"
                        onChange={(e) => {
                          // Simple filter - the list will re-render
                        }}
                      />
                      {ALL_SERIES.slice(0, 15).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSelectedSerie({ id: s.id, title: s.title });
                            setShowSeriesPicker(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 p-2 rounded-lg text-[11px] text-text-main hover:bg-primary/5 transition-all cursor-pointer text-right',
                            selectedSerie?.id === s.id && 'bg-primary/10 text-primary font-bold'
                          )}
                        >
                          <div className="w-8 h-10 rounded-md overflow-hidden flex-shrink-0 bg-border">
                            <img src={s.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{s.title}</p>
                            <p className="text-[9px] text-text-subtle">{s.year} · {s.country}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected series chip */}
              {selectedSerie && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/10"
                >
                  <Tv className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[11px] font-medium text-text-main flex-1 truncate">{selectedSerie.title}</span>
                  <button onClick={() => setSelectedSerie(null)} className="cursor-pointer">
                    <X className="h-3.5 w-3.5 text-text-subtle" />
                  </button>
                </motion.div>
              )}

              {/* Create button */}
              <button
                onClick={createRoom}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3.5"
              >
                <Plus className="h-5 w-5" />
                إنشاء غرفة جديدة
              </button>
            </motion.div>
          ) : (
            /* ═══ JOIN ROOM ═══ */
            <motion.div
              key="join"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <p className="text-xs font-bold text-text-main mb-2">أدخل كود الغرفة</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="flex-1 glass-subtle rounded-xl p-3 text-center text-lg font-bold tracking-[0.3em] text-text-main placeholder-text-muted border border-border/30 focus:border-primary/50 outline-none"
                    placeholder="ABC123"
                    style={{ letterSpacing: '0.3em' }}
                    onKeyDown={(e) => e.key === 'Enter' && joinRoomByCode()}
                  />
                </div>
                <p className="text-[10px] text-text-subtle mt-2 text-center">
                  اطلب كود الغرفة من صديقك الذي أنشأها
                </p>
              </div>

              <button
                onClick={joinRoomByCode}
                disabled={joinCode.length < 4}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <LogIn className="h-5 w-5" />
                انضمام للغرفة
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // ROOM SCREEN
  // ═══════════════════════════════════════════════════
  return (
    <div className="pt-2 pb-16 flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <button onClick={leaveRoom} className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center cursor-pointer">
            <X className="h-4 w-4 text-text-main" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-bold text-text-main">غرفة {room?.code}</span>
            </div>
            {room?.seriesTitle && (
              <p className="text-[9px] text-text-subtle truncate max-w-[140px]">{room.seriesTitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Copy code button */}
          <button
            onClick={copyRoomCode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass-subtle text-[10px] font-bold text-text-main cursor-pointer transition-all hover:bg-primary/5"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-success" />
                <span className="text-success">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>{room?.code}</span>
              </>
            )}
          </button>

          {/* Share button */}
          <button
            onClick={shareRoom}
            className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center cursor-pointer shadow-[var(--shadow-glow)]"
          >
            <Share2 className="h-3.5 w-3.5 text-white" />
          </button>

          {/* Online count */}
          <div className="flex items-center gap-1 text-[10px] text-text-subtle">
            <Users className="h-3.5 w-3.5" />
            <span className="font-bold">{onlineCount}</span>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="relative aspect-video rounded-2xl overflow-hidden glass mb-2">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 to-purple-900/40" />
        {room?.seriesTitle ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg animate-glow mb-2">
              <Play className="h-6 w-6 text-white fill-white mr-[-1px]" />
            </div>
            <p className="text-white text-xs font-bold">{room.seriesTitle}</p>
            {room.episodeTitle && (
              <p className="text-white/70 text-[10px]">{room.episodeTitle}</p>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg animate-glow mb-2">
              <Play className="h-6 w-6 text-white fill-white mr-[-1px]" />
            </div>
            <p className="text-white/80 text-[10px]">في انتظار اختيار المسلسل...</p>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-[10px] text-white/80 glass px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            مباشر
          </span>
          <span className="text-[10px] text-white/60">
            <Clock className="h-2.5 w-2.5 inline mr-0.5" />
            {formatTime()}
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto no-scrollbar space-y-2 px-1 mb-2">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* System message */}
            {msg.user === 'النظام' ? (
              <div className="flex justify-center my-2">
                <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                  <p className="text-[9px] text-primary font-medium text-center">{msg.text}</p>
                </div>
              </div>
            ) : (
              /* User message */
              <div className={cn('max-w-[80%] flex gap-1.5', msg.isMe ? 'mr-auto flex-row-reverse' : 'ml-auto')}>
                {/* Avatar */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-auto"
                  style={{ backgroundColor: getUserColor(msg.user) + '20' }}
                >
                  <span className="text-[8px] font-bold" style={{ color: getUserColor(msg.user) }}>
                    {msg.user.charAt(0)}
                  </span>
                </div>
                <div>
                  {!msg.isMe && (
                    <p className="text-[9px] font-bold mb-0.5 px-1" style={{ color: getUserColor(msg.user) }}>
                      {msg.user}
                    </p>
                  )}
                  <div
                    className={cn(
                      'rounded-2xl px-3 py-2 text-[11px]',
                      msg.isMe
                        ? 'bg-gradient-primary text-white rounded-br-md'
                        : 'glass-subtle text-text-main rounded-bl-md'
                    )}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <p className={cn('text-[8px] text-text-muted mt-0.5 px-1', msg.isMe && 'text-left')}>
                    {msg.time}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-1 pb-1">
        <button className="w-9 h-9 rounded-full glass-subtle flex items-center justify-center cursor-pointer flex-shrink-0">
          <Smile className="h-4 w-4 text-text-subtle" />
        </button>
        <div className="flex-1 glass-subtle rounded-full flex items-center px-3 border border-border/30">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-transparent text-[11px] text-text-main placeholder-text-muted outline-none py-2.5"
            placeholder="اكتب رسالتك..."
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="cursor-pointer disabled:opacity-30 mr-1"
          >
            {input.trim() ? (
              <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                <Send className="h-3 w-3 text-white" />
              </div>
            ) : (
              <Send className="h-3.5 w-3.5 text-primary" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
