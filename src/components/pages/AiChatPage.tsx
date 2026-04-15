'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, ArrowRight, Sparkles, Bot, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AI_CHAT_SUGGESTIONS } from '@/data/featuresData';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const AI_RESPONSES: Record<string, string> = {
  'بشرة': 'للحصول على بشرة نضرة وصحية، أنصحك بروتين يومي بسيط: ١) تنظيف الوجه بغسول مناسب لنوع بشرتك صباحاً ومساءً ٢) وضع تونر لترطيب البشرة ٣) سيروم فيتامين سي لمكافحة التصبغات ٤) مرطب مناسب ٥) واقي شمس SPF 50 صباحاً. لا تنسي شرب ٨ أكواب ماء يومياً! 💧',
  'شعر': 'نصائح ذهبية للعناية بالشعر: ١) زيت الأرغان للتغذية العميقة — ضعيه قبل الاستحمام بساعة ٢) تجنبي غسل الشعر يومياً (مرتين أسبوعياً كافية) ٣) البلسم من منتصف الشعر حتى الأطراف ٤) تجنبي مجفف الشعر الحراري واستخدمي المنشفة بدلاً منه ٥) ماسك البيض والعسل مرة أسبوعياً لتقوية الشعر ✨',
  'مكياج': 'لإطلالة طبيعية يومية: ١) كريم أساس خفيف أو BB كريم ٢) كونسيلر لإخفاء الهالات ٣) بودرة خفيفة للتثبيت ٤) ماسكارا لجعل الرموش أكثر كثافة ٥) بلسم شفاه بلون وردي طبيعي. للسهرة أضيفي آيلاينر وأحمر شفاه قوي! 💄',
  'تغذية': 'نظام غذائي صحي للمرأة: ١) البروتين: صدور الدجاج، السمك، البيض، البقوليات ٢) الخضروات: السلطة الخضراء يومياً مع ألوان مختلفة ٣) الفواكه: ٣ حصص يومياً على الأقل ٤) الكالسيوم: حليب،زبادي، جبنة ٥) الحديد: سبانخ، لحم أحمر، عدس. تجنبي الأطعمة المصنعة والسكريات! 🥗',
  'رياضة': 'تمارين منزلية فعالة: ١) القفز بالحبل ١٥ دقيقة لحرق الدهون ٢) تمارين البطن (بلانك) ٣٠ ثانية × ٣ مجموعات ٣) القرفصاء ١٥ مرة × ٣ مجموعات ٤) اليوغا للمرونة والاسترخاء ١٥ دقيقة ٥) المشي السريع ٣٠ دقيقة يومياً. ابدئي تدريجياً وزودي الشدة تدريجياً! 💪',
  'وصفة': 'وصفة ماسك طبيعي سحرية: ماسك العسل والكركم للتفتيح ✨ المكونات: ٢ ملاعق عسل + نصف ملعقة كركم + ١ ملعقة زبادي + ١ ملعقة عصير ليمون. اخلطي المكونات وضعيها ١٥-٢٠ دقيقة ثم اغسلي بماء دافئ. كرريها مرتين أسبوعياً للنتيجة الأفضل!',
  'حامل': 'نصائح التغذية للحامل: ١) تناولي حمض الفوليك يومياً ٢) البروتين من مصادر متنوعة ٣) الكالسيوم من الحليب والأجبان ٤) الحديد من اللحوم والسبانخ ٥) أوميغا ٣ من السمك مرتين أسبوعياً ٦) تجنبي الكافيين الزائد والأسماك عالية الزئبق. استشيري طبيبك دائماً! 🤰',
  'واقي': 'اختيار واقي الشمس المناسب: ١) SPF ٣٠ كحد أدنى، SPF ٥٠ للأطفال والحساسة ٢) للحماية من الأشعة: broad spectrum ٣) للبشرة الدهنية: واقي جل (خالي من الزيوت) ٤) للبشرة الجافة: واقي كريمي ٥) أعيدي وضعه كل ساعتين. لا تنسي رقبتك ويديك! ☀️',
  'عشاء': 'أفكار عشاء صحي وسريع: ١) صدر دجاج مشوي مع سلطة خضراء ٢) سمك سلمون مشوي مع خضار سوتيه ٣) شوربة عدس مع خبز محمص ٤) أومليت بالخضار مع زبادي ٥) كاساديا بالدجاج والخضار. الوجبة المثالية: نصف خضار + ربع بروتين + ربع كربوهيدرات 🍽️',
};

function getAIResponse(message: string): string {
  const lowerMsg = message.toLowerCase();
  for (const [keyword, response] of Object.entries(AI_RESPONSES)) {
    if (lowerMsg.includes(keyword)) return response;
  }
  return 'شكراً لسؤالك! 😊 أنا مساعدكِ الذكي في جمالكِ. يمكنني مساعدتك في: العناية بالبشرة، العناية بالشعر، المكياج، التغذية الصحية، التمارين الرياضية، الوصفات الطبيعية، ونصائح الحمل. جربي سؤالي عن أي من هذه المواضيع!';
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="glass-subtle rounded-2xl rounded-tr-sm px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-primary/50"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AiChatPage() {
  const { goBack } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'مرحباً بكِ في مساعد جمالكِ الذكي! ✨ أنا هنا لمساعدتكِ في كل ما يخص الجمال، الصحة، والعناية الشخصية. اسأليني أي سؤال أو اختري من الاقتراحات أدناه.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(
    (text?: string) => {
      const messageText = text || input.trim();
      if (!messageText) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      setTimeout(() => {
        const response = getAIResponse(messageText);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    },
    [input]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text: string) => {
    handleSend(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="py-6 flex flex-col min-h-[calc(100vh-180px)]"
    >
      {/* Back Button */}
      <motion.button
        whileHover={{ x: 4 }}
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-text-subtle hover:text-primary transition-colors mb-4 cursor-pointer group"
      >
        <span className="glass-subtle rounded-full p-1.5 group-hover:bg-primary/10 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </span>
        العودة
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
        className="glass-strong gradient-border rounded-2xl p-5 mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-heading font-bold text-text-main">مساعد جمالكِ الذكي</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-text-subtle">متصل الآن</span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-5 w-5 text-accent" />
          </motion.div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto max-h-[50vh] lg:max-h-[55vh] space-y-3 px-1 mb-4 no-scrollbar">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease }}
              className={cn('flex items-start gap-2.5', msg.role === 'user' && 'flex-row-reverse')}
            >
              {msg.role === 'assistant' ? (
                <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-warm flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-gradient-primary text-white rounded-tl-sm'
                    : 'glass-subtle text-text-main rounded-tr-sm'
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TypingIndicator />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {AI_CHAT_SUGGESTIONS.slice(0, 4).map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestion(suggestion)}
              className="flex-shrink-0 glass-subtle rounded-full px-4 py-2 text-xs text-text-secondary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer whitespace-nowrap border border-transparent hover:border-primary/20"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="glass-strong rounded-2xl p-2 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتبي سؤالك هنا..."
          className="flex-1 bg-transparent outline-none text-sm text-text-main placeholder:text-text-subtle px-3 py-2"
          disabled={isTyping}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer',
            input.trim() && !isTyping
              ? 'bg-gradient-primary text-white shadow-[0_4px_12px_rgba(194,24,91,0.3)]'
              : 'bg-border/50 text-text-subtle cursor-not-allowed'
          )}
        >
          <Send className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
