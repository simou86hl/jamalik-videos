'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Send, X, Play, Smile, Copy, Check,
  Plus, LogIn, Tv, Share2, MessageCircle,
  ChevronDown, Sparkles, Clock, Crown, Eye,
  Volume2, VolumeX, Maximize, Pause,
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
}

interface RoomState {
  id: string;
  name: string;
  code: string;
  host: string;
  seriesTitle: string | null;
  seriesSlug: string | null;
  episodeTitle: string | null;
  videoUrl: string | null;
  isLive: boolean;
  isPlaying: boolean;
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
  'جودة البث ممتازة',
  'حد يقدر يفسر لي آخر مشهد؟',
  'هذا المسلسل من أفضل ما شفت 💯',
  'يا سلام! 😍',
];

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const formatTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

function getDailymotionEmbedUrl(url: string): string {
  // Convert regular Dailymotion URL to embed URL
  const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
  if (match) {
    return `https://www.dailymotion.com/embed/video/${match[1]}?autoplay=1&quality=720`;
  }
  return url;
}

export function WatchPartyPage() {
  const { goBack, selectedSeries } = useStore();
  const [phase, setPhase] = useState<'lobby' | 'room'>('lobby');
  const [isAdmin, setIsAdmin] = useState(true);
  const [joinMode, setJoinMode] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [room, setRoom] = useState<RoomState | null>(null);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const [showSeriesPicker, setShowSeriesPicker] = useState(false);
  const [selectedSerie, setSelectedSerie] = useState<{ id: string; title: string; slug: string; videoUrl: string } | null>(null);
  const [selectedEpIdx, setSelectedEpIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(1);

  // Restore room from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('watchparty-room');
      if (saved) {
        const parsed = JSON.parse(saved) as RoomState;
        setRoom(parsed);
        setIsAdmin(parsed.host === 'أنت');
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

  // Simulate users joining after room creation
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
        id: msgId.current++, user: randomUser.name, text: randomMsg,
        time: formatTime(), isMe: false,
      };
      setMessages(prev => [...prev.slice(-80), newMsg]);
    }, 5000 + Math.random() * 8000);
    return () => clearInterval(interval);
  }, [phase, room?.isLive]);

  // Auto scroll chat
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [messages.length]);

  const addSystemMessage = useCallback((text: string) => {
    setMessages(prev => [...prev.slice(-80), {
      id: msgId.current++, user: 'النظام', text, time: formatTime(), isMe: false,
    }]);
  }, []);

  const getEpisodeList = (seriesSlug: string) => {
    const serie = ALL_SERIES.find(s => s.slug === seriesSlug);
    if (!serie || serie.seasons.length === 0) return [];
    return serie.seasons[0].episodes.slice(0, 10).map(ep => ({
      number: ep.number,
      title: ep.title,
      videoUrl: ep.videoUrl,
      thumbnail: ep.thumbnail,
    }));
  };

  const createRoom = () => {
    const code = generateRoomCode();
    const videoUrl = selectedSerie?.videoUrl || null;
    const embedUrl = videoUrl ? getDailymotionEmbedUrl(videoUrl) : null;
    const newRoom: RoomState = {
      id: `room-${Date.now()}`,
      name: `غرفة ${code}`,
      code,
      host: 'أنت',
      seriesTitle: selectedSerie?.title || null,
      seriesSlug: selectedSerie?.slug || null,
      episodeTitle: selectedSerie ? `الحلقة ${selectedEpIdx + 1}` : null,
      videoUrl: embedUrl,
      isLive: true,
      isPlaying: !!embedUrl,
      createdAt: new Date().toISOString(),
    };
    setRoom(newRoom);
    setIsAdmin(true);
    setPhase('room');
    setOnlineCount(1);
    setMessages([{
      id: 0, user: 'النظام',
      text: `تم إنشاء الغرفة بنجاح! 🎬\nكود الغرفة: ${code}\n${isAdmin ? 'أنت المدير - تحكم بالفيديو واختر الحلقات' : 'انتظر المدير لتشغيل الفيديو'}`,
      time: formatTime(), isMe: false,
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
      seriesSlug: null,
      episodeTitle: null,
      videoUrl: 'https://www.dailymotion.com/embed/video/x9abw5k?autoplay=1&quality=720',
      isLive: true,
      isPlaying: true,
      createdAt: new Date().toISOString(),
    };
    setRoom(newRoom);
    setIsAdmin(false);
    setPhase('room');
    setOnlineCount(3 + Math.floor(Math.random() * 10));
    setMessages([{
      id: 0, user: 'النظام',
      text: `مرحباً بك في غرفة ${joinCode.toUpperCase()}!\nأنت مشاهد - المدير يتحكم بالفيديو\nاستمتع بالمشاهدة وتحدث في الشات! 💬`,
      time: formatTime(), isMe: false,
    }]);
    setTimeout(() => {
      const greeter = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      setMessages(prev => [...prev, {
        id: msgId.current++, user: greeter.name,
        text: 'أهلاً وسهلاً! 🎉', time: formatTime(), isMe: false,
      }]);
    }, 1500);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: msgId.current++, user: 'أنت', text: input, time: formatTime(), isMe: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responder = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const responses = ['صح! 💯', 'موافق معك', 'ههههه 😂', 'كلامك صحيح', 'أيوا بالضبط', 'فعلاً!'];
        setMessages(prev => [...prev.slice(-80), {
          id: msgId.current++, user: responder.name,
          text: responses[Math.floor(Math.random() * responses.length)],
          time: formatTime(), isMe: false,
        }]);
      }, 1500 + Math.random() * 3000);
    }
  };

  const copyRoomCode = async () => {
    if (!room) return;
    try {
      await navigator.clipboard.writeText(
        `شاهد معي على مسلسلات أونلاين! 🎬\nكود الغرفة: ${room.code}\nانضم الآن!`
      );
    } catch { /* fallback */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoom = async () => {
    if (!room) return;
    if (navigator.share) {
      try { await navigator.share({ title: 'غرفة مشاهدة جماعية', text: `شاهد معي! كود الغرفة: ${room.code}` }); } catch {}
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
    setIsAdmin(true);
  };

  const changeEpisode = (epIdx: number) => {
    if (!selectedSerie) return;
    setSelectedEpIdx(epIdx);
    const series = ALL_SERIES.find(s => s.slug === selectedSerie.slug);
    if (series && series.seasons[0]) {
      const ep = series.seasons[0].episodes[epIdx];
      const embedUrl = ep.videoUrl ? getDailymotionEmbedUrl(ep.videoUrl) : null;
      setRoom(prev => prev ? {
        ...prev,
        episodeTitle: ep.title,
        videoUrl: embedUrl,
        isPlaying: !!embedUrl,
      } : prev);
      addSystemMessage(`تم تغيير الحلقة إلى: ${ep.title}`);
    }
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
              { step: '٢', text: 'المدير فقط هو من يتحكم بالفيديو ويختار الحلقات', icon: Crown },
              { step: '٣', text: 'البقية يشاهدون ويتحدثون في الشات', icon: Eye },
              { step: '٤', text: 'شارك كود الغرفة مع أصدقائك!', icon: Share2 },
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
            <motion.div key="create" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {/* Admin badge */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10">
                <Crown className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-[11px] font-bold text-text-main">أنت ستكون مدير الغرفة</p>
                  <p className="text-[9px] text-text-subtle">تتحكم بالفيديو واختيار الحلقات، والبقية يشاهدون</p>
                </div>
              </div>

              {/* Series selection */}
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
                      {ALL_SERIES.slice(0, 15).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            const firstEp = s.seasons[0]?.episodes[0];
                            setSelectedSerie({
                              id: s.id, title: s.title, slug: s.slug,
                              videoUrl: firstEp?.videoUrl || '',
                            });
                            setSelectedEpIdx(0);
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

              {/* Episode selector */}
              {selectedSerie && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                    <Tv className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[11px] font-medium text-text-main flex-1 truncate">{selectedSerie.title}</span>
                    <button onClick={() => { setSelectedSerie(null); setSelectedEpIdx(0); }} className="cursor-pointer">
                      <X className="h-3.5 w-3.5 text-text-subtle" />
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {getEpisodeList(selectedSerie.slug).slice(0, 8).map((ep) => (
                      <button
                        key={ep.number}
                        onClick={() => setSelectedEpIdx(ep.number - 1)}
                        className={cn(
                          'flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer',
                          selectedEpIdx === ep.number - 1
                            ? 'bg-gradient-primary text-white'
                            : 'glass-subtle text-text-subtle'
                        )}
                      >
                        {ep.title}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <button
                onClick={createRoom}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3.5"
              >
                <Plus className="h-5 w-5" />
                إنشاء غرفة جديدة
              </button>
            </motion.div>
          ) : (
            <motion.div key="join" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {/* Viewer badge */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <Eye className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-[11px] font-bold text-text-main">ستكون مشاهد</p>
                  <p className="text-[9px] text-text-subtle">المدير يتحكم بالفيديو وأنت تشاهد وتتحدث في الشات</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-text-main mb-2">أدخل كود الغرفة</p>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="w-full glass-subtle rounded-xl p-3 text-center text-lg font-bold tracking-[0.3em] text-text-main placeholder-text-muted border border-border/30 focus:border-primary/50 outline-none"
                  placeholder="ABC123"
                  onKeyDown={(e) => e.key === 'Enter' && joinRoomByCode()}
                />
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
  const episodeList = room?.seriesSlug ? getEpisodeList(room.seriesSlug) : [];

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
              {/* Role badge */}
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-0.5',
                isAdmin ? 'bg-accent/15 text-accent' : 'bg-blue-500/15 text-blue-500'
              )}>
                {isAdmin ? <Crown className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
                {isAdmin ? 'مدير' : 'مشاهد'}
              </span>
            </div>
            {room?.seriesTitle && (
              <p className="text-[9px] text-text-subtle truncate max-w-[160px]">{room.seriesTitle} - {room.episodeTitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyRoomCode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass-subtle text-[10px] font-bold text-text-main cursor-pointer transition-all hover:bg-primary/5"
          >
            {copied ? (
              <><Check className="h-3 w-3 text-success" /><span className="text-success">تم!</span></>
            ) : (
              <><Copy className="h-3 w-3" /><span>{room?.code}</span></>
            )}
          </button>
          <button onClick={shareRoom} className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center cursor-pointer">
            <Share2 className="h-3 w-3 text-white" />
          </button>
          <div className="flex items-center gap-1 text-[10px] text-text-subtle">
            <Users className="h-3 w-3" />
            <span className="font-bold">{onlineCount}</span>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="relative rounded-2xl overflow-hidden glass mb-2">
        <div className="relative aspect-video">
          {room?.videoUrl ? (
            <>
              <iframe
                src={room.videoUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow={isAdmin ? 'autoplay; fullscreen; encrypted-media; picture-in-picture' : 'autoplay'}
                style={{ border: 'none', pointerEvents: isAdmin ? 'auto' : 'none' }}
                title={room.seriesTitle || 'Watch Party'}
              />
              {/* Viewer overlay - prevents interaction */}
              {!isAdmin && (
                <div className="absolute inset-0 flex items-start justify-end p-2 pointer-events-none">
                  <div className="px-2 py-1 rounded-full glass text-[9px] font-bold text-text-main flex items-center gap-1 pointer-events-none">
                    <Eye className="h-2.5 w-2.5 text-blue-400" />
                    وضع المشاهدة
                  </div>
                </div>
              )}
              {/* Admin control overlay */}
              {isAdmin && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6 pointer-events-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 pointer-events-auto">
                      <button
                        onClick={() => setRoom(prev => prev ? { ...prev, isPlaying: !prev.isPlaying } : prev)}
                        className="w-8 h-8 rounded-full glass flex items-center justify-center cursor-pointer"
                      >
                        {room.isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
                      </button>
                      <button onClick={() => setIsMuted(!isMuted)} className="w-8 h-8 rounded-full glass flex items-center justify-center cursor-pointer">
                        {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <span className="px-1.5 py-0.5 rounded-full bg-accent/80 text-[8px] font-bold text-white flex items-center gap-0.5">
                        <Crown className="h-2 w-2" /> مدير
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 to-purple-900/40 flex flex-col items-center justify-center">
              {isAdmin ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg animate-glow mb-2">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-white/80 text-[10px]">اختر مسلسلاً من القائمة أدناه</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-blue-500/50 flex items-center justify-center shadow-lg mb-2">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-white/80 text-[10px]">في انتظار المدير لتشغيل الفيديو...</p>
                </>
              )}
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className="text-[9px] text-white/80 glass px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              مباشر
            </span>
          </div>
        </div>
      </div>

      {/* Admin: Episode selector */}
      {isAdmin && episodeList.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2 px-1">
          {episodeList.slice(0, 10).map((ep) => (
            <button
              key={ep.number}
              onClick={() => changeEpisode(ep.number - 1)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer',
                room?.episodeTitle === ep.title
                  ? 'bg-gradient-primary text-white'
                  : 'glass-subtle text-text-subtle'
              )}
            >
              {ep.title}
            </button>
          ))}
        </div>
      )}

      {/* Chat Area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto no-scrollbar space-y-2 px-1 mb-2">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {msg.user === 'النظام' ? (
              <div className="flex justify-center my-2">
                <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                  <p className="text-[9px] text-primary font-medium text-center whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ) : (
              <div className={cn('max-w-[80%] flex gap-1.5', msg.isMe ? 'mr-auto flex-row-reverse' : 'ml-auto')}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-auto"
                  style={{ backgroundColor: getUserColor(msg.user) + '20' }}
                >
                  <span className="text-[8px] font-bold" style={{ color: getUserColor(msg.user) }}>{msg.user.charAt(0)}</span>
                </div>
                <div>
                  {!msg.isMe && (
                    <p className="text-[9px] font-bold mb-0.5 px-1" style={{ color: getUserColor(msg.user) }}>{msg.user}</p>
                  )}
                  <div className={cn(
                    'rounded-2xl px-3 py-2 text-[11px]',
                    msg.isMe ? 'bg-gradient-primary text-white rounded-br-md' : 'glass-subtle text-text-main rounded-bl-md'
                  )}>
                    <p>{msg.text}</p>
                  </div>
                  <p className={cn('text-[8px] text-text-muted mt-0.5 px-1', msg.isMe && 'text-left')}>{msg.time}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Chat Input */}
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
          <button onClick={sendMessage} disabled={!input.trim()} className="cursor-pointer disabled:opacity-30 mr-1">
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
