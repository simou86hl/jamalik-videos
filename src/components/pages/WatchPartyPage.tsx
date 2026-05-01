'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Send, X, Play, Smile, Camera, Mic2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: number;
  user: string;
  text: string;
  time: string;
  isMe: boolean;
}

const MOCK_USERS = ['أحمد', 'سارة', 'محمد', 'نور'];
const MOCK_MESSAGES = [
  'هذه الحلقة رائعة! 🔥',
  'لم أتوقع هذا المنعطف!',
  'الممثل أداءه ممتاز',
  'اللحظة الحزينة أبكتني 😢',
  'ما شاء الله مشهد رائع',
  'من يحب هذا المسلسل؟ ❤️',
];

export function WatchPartyPage() {
  const { goBack } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, user: 'النظام', text: 'مرحباً بك في غرفة المشاهدة الجماعية! شارك رأيك مع الأصدقاء', time: 'الآن', isMe: false },
  ]);
  const [input, setInput] = useState('');
  const [isLive, setIsLive] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(1);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = { id: msgId.current++, user: 'أنت', text: input, time: 'الآن', isMe: true };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  // Simulate other users chatting
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      const newMsg: ChatMessage = { id: msgId.current++, user: randomUser, text: randomMsg, time: 'الآن', isMe: false };
      setMessages(prev => [...prev.slice(-50), newMsg]);
    }, 3000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [messages.length]);

  const onlineCount = 12 + Math.floor(Math.random() * 8);

  return (
    <div className="pt-2 pb-16 flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center cursor-pointer">
            <X className="h-4 w-4 text-text-main" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-text-main">مباشر</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-text-subtle">
          <Users className="h-3.5 w-3.5" />
          <span>{onlineCount} متصل</span>
        </div>
      </div>

      {/* Video Area (simplified) */}
      <div className="relative aspect-video rounded-2xl overflow-hidden glass mb-3">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 to-purple-900/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg animate-glow">
            <Play className="h-6 w-6 text-white fill-white mr-[-1px]" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-[10px] text-white/80 glass px-2 py-0.5 rounded-full flex items-center gap-1">
            <Camera className="h-2.5 w-2.5" /> جارٍ البث
          </span>
          <div className="flex gap-1">
            <button className="w-7 h-7 rounded-full glass flex items-center justify-center cursor-pointer"><Mic2 className="h-3 w-3 text-white" /></button>
            <button className="w-7 h-7 rounded-full glass flex items-center justify-center cursor-pointer" onClick={() => setIsLive(!isLive)}><Camera className="h-3 w-3 text-white" /></button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto no-scrollbar space-y-2 px-1 mb-2">
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className={cn('max-w-[80%]', msg.isMe ? 'mr-auto' : 'ml-auto')}>
            <div className={cn(
              'rounded-2xl px-3 py-2 text-xs',
              msg.isMe ? 'bg-gradient-primary text-white rounded-br-md' : 'glass-subtle text-text-main rounded-bl-md'
            )}>
              {!msg.isMe && <p className="text-[9px] font-bold text-primary mb-0.5">{msg.user}</p>}
              <p>{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-1">
        <button className="w-9 h-9 rounded-full glass-subtle flex items-center justify-center cursor-pointer flex-shrink-0">
          <Smile className="h-4 w-4 text-text-subtle" />
        </button>
        <div className="flex-1 glass-subtle rounded-full flex items-center px-3 border border-border/30">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-transparent text-xs text-text-main placeholder-text-muted outline-none py-2"
            placeholder="اكتب رسالتك..." />
          <button onClick={sendMessage} disabled={!input.trim()} className="cursor-pointer disabled:opacity-30">
            <Send className="h-3.5 w-3.5 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
