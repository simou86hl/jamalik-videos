'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Camera,
  Users,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { STATIC_PAGES } from '@/data/staticPages';
import { cn } from '@/lib/utils';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const faqItems = [
  {
    id: 'cf-1',
    question: 'كم يستغرق الرد على رسائلي؟',
    answer: 'نرد على جميع الرسائل خلال 24 ساعة عمل. في حالات الطوارئ أو الاستفسارات العاجلة نحاول الرد في أقل من 4 ساعات.',
  },
  {
    id: 'cf-2',
    question: 'هل يمكنني المساهمة في كتابة المحتوى؟',
    answer: 'بالتأكيد! نرحب دائماً بمساهمات الكاتبات المتخصصات. أرسلي لنا رسالة مع نبذة عنك وعن خبرتك في المجال الذي ترغبين بالكتابة فيه.',
  },
  {
    id: 'cf-3',
    question: 'كيف أبلغ عن خطأ في المقالات أو الوصفات؟',
    answer: 'يمكنك التواصل معنا عبر هذه الصفحة مع تحديد المقال أو الوصفة ووصف الخطأ. سنقوم بمراجعته وتصحيحه في أقرب وقت ممكن.',
  },
  {
    id: 'cf-4',
    question: 'هل يمكنني طلب مقال أو وصفة محددة؟',
    answer: 'نعم! يسعدنا تلقي طلباتكم. أرسلي لنا الموضوع الذي ترغبين في قراءته وسنعمل على إعداده في أقرب فرصة.',
  },
];

const socials = [
  { name: 'انستغرام', icon: Camera, color: 'hover:text-pink-500 hover:bg-pink-500/10' },
  { name: 'تويتر', icon: MessageCircle, color: 'hover:text-sky-500 hover:bg-sky-500/10' },
  { name: 'فيسبوك', icon: Users, color: 'hover:text-blue-600 hover:bg-blue-600/10' },
];

export function ContactPage() {
  const { goBack } = useStore();
  const page = STATIC_PAGES.contact;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative rounded-3xl overflow-hidden mb-10"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Mail className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            {page.title}
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            {page.subtitle}
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
      >
        {/* Contact Form */}
        <motion.div variants={staggerItem} className="lg:col-span-2 glass-strong rounded-2xl p-6 gradient-border">
          <h2 className="text-xl font-heading font-bold text-gradient mb-6">أرسلي لنا رسالة</h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-primary/15 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-bold text-text-main mb-2">
                تم إرسال رسالتك بنجاح!
              </h3>
              <p className="text-sm text-text-secondary">
                شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">الاسم</label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="أدخلي اسمك"
                      className="w-full px-4 py-3 rounded-xl glass-subtle bg-transparent border border-border/30 text-text-main placeholder:text-text-subtle/50 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                    />
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">البريد الإلكتروني</label>
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 rounded-xl glass-subtle bg-transparent border border-border/30 text-text-main placeholder:text-text-subtle/50 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">الموضوع</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  placeholder="موضوع الرسالة"
                  className="w-full px-4 py-3 rounded-xl glass-subtle bg-transparent border border-border/30 text-text-main placeholder:text-text-subtle/50 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">الرسالة</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="اكتبي رسالتك هنا..."
                  className="w-full px-4 py-3 rounded-xl glass-subtle bg-transparent border border-border/30 text-text-main placeholder:text-text-subtle/50 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm resize-none"
                />
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Send className="h-4 w-4" />
                إرسال الرسالة
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Sidebar Info */}
        <motion.div variants={staggerItem} className="space-y-5">
          {/* Contact Info Card */}
          <div className="glass-strong rounded-2xl p-5">
            <h3 className="text-base font-heading font-bold text-gradient mb-4">معلومات التواصل</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary/15 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-subtle mb-0.5">البريد الإلكتروني</p>
                  <p className="text-sm font-medium text-text-main" dir="ltr">{page.info.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-rose-purple/15 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-text-subtle mb-0.5">الهاتف</p>
                  <p className="text-sm font-medium text-text-main" dir="ltr">{page.info.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-warm/15 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-text-subtle mb-0.5">العنوان</p>
                  <p className="text-sm font-medium text-text-main">{page.info.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-strong rounded-2xl p-5">
            <h3 className="text-base font-heading font-bold text-gradient mb-4">تابعينا</h3>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <motion.button
                  key={social.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'w-11 h-11 rounded-xl glass-subtle flex items-center justify-center text-text-subtle transition-all duration-200 cursor-pointer',
                    social.color
                  )}
                  aria-label={social.name}
                  type="button"
                >
                  <social.icon className="h-5 w-5" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary/40 mx-auto mb-2" />
                <p className="text-xs text-text-subtle">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* FAQ Section */}
      <div className="mb-10">
        <h3 className="text-xl font-heading font-bold text-text-main mb-5 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-gradient-primary" />
          الأسئلة الشائعة
        </h3>
        <div className="space-y-3">
          {faqItems.map((faq) => (
            <motion.div
              key={faq.id}
              layout
              className="glass-strong rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-right cursor-pointer"
              >
                <span className="font-bold text-text-main text-sm">{faq.question}</span>
                {openFaq === faq.id ? (
                  <ChevronUp className="h-4 w-4 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-text-subtle flex-shrink-0" />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === faq.id ? 'auto' : 0, opacity: openFaq === faq.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
