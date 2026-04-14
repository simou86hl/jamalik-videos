'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Shirt,
  Heart,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Scissors,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { QUIZZES } from '@/data/quizzes';
import { ShareButtons } from '@/components/shared/ShareButtons';
import { CATEGORIES } from '@/lib/constants';
import type { Quiz, CategorySlug } from '@/types';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ElementType> = {
  skincare: Sparkles,
  haircare: Scissors,
  fashion: Shirt,
  health: Heart,
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

function getCategoryLabel(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name || slug;
}

export function QuizPage() {
  const { selectedQuizId, selectQuiz, completeQuiz, goBack, completedQuizzes } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [animDirection, setAnimDirection] = useState(1);

  const quiz: Quiz | undefined = QUIZZES.find((q) => q.id === selectedQuizId);

  const handleSelectQuiz = useCallback(
    (quizId: string) => {
      selectQuiz(quizId);
      setCurrentQuestion(0);
      setAnswers([]);
      setShowResult(false);
      setSelectedAnswer(null);
      setAnimDirection(1);
    },
    [selectQuiz]
  );

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers, QUIZZES.find((q) => q.id === selectedQuizId)?.questions[currentQuestion]?.options[optionIndex]?.score || 0];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (quiz && currentQuestion < quiz.questions.length - 1) {
        setAnimDirection(1);
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        if (selectedQuizId) {
          completeQuiz(selectedQuizId);
        }
      }
    }, 400);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setAnimDirection(1);
  };

  const totalScore = answers.reduce((acc, val) => acc + val, 0);

  const getResult = () => {
    if (!quiz) return null;
    return quiz.results.find((r) => totalScore >= r.minScore && totalScore <= r.maxScore) || quiz.results[quiz.results.length - 1];
  };

  const progress = quiz ? ((currentQuestion + (showResult ? 1 : 0)) / quiz.questions.length) * 100 : 0;

  // Quiz Selection Grid
  if (!quiz) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="py-6"
      >
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
              <Brain className="h-10 w-10 text-white/80 mx-auto" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
              الاختبارات التفاعلية
            </h1>
            <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
              اكتشفي المزيد عن نفسك من خلال اختباراتنا الممتعة
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {QUIZZES.map((q) => {
            const Icon = categoryIcons[q.category] || Brain;
            const isCompleted = completedQuizzes.includes(q.id);
            return (
              <motion.button
                key={q.id}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectQuiz(q.id)}
                className="glass-strong rounded-2xl p-6 text-right card-hover-lift cursor-pointer relative overflow-hidden group"
              >
                {isCompleted && (
                  <div className="absolute top-3 left-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center mb-4',
                  'bg-gradient-primary/15 group-hover:bg-gradient-primary transition-all duration-300'
                )}>
                  <Icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-heading font-bold text-text-main mb-2">{q.title}</h3>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">{q.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs glass-subtle px-3 py-1 rounded-full text-primary font-medium">
                    {getCategoryLabel(q.category)}
                  </span>
                  <span className="text-xs text-text-subtle">{q.questions.length} أسئلة</span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>
    );
  }

  // Result Page
  if (showResult) {
    const result = getResult();
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="py-6"
      >
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => {
            if (selectedQuizId) {
              useStore.getState().clearSelection();
              useStore.getState().navigateTo('quiz');
            }
          }}
          className="flex items-center gap-2 text-sm text-text-subtle hover:text-primary transition-colors mb-6 cursor-pointer group"
        >
          <span className="glass-subtle rounded-full p-1.5 group-hover:bg-primary/10 transition-colors">
            <ArrowRight className="h-4 w-4" />
          </span>
          العودة للاختبارات
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="glass-strong gradient-border rounded-3xl p-8 text-center max-w-lg mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-primary/15 flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="h-12 w-12 text-primary" />
          </motion.div>

          <h2 className="text-2xl font-heading font-extrabold text-gradient mb-2">{result?.title}</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">{result?.description}</p>

          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xs text-text-subtle">مجموعك:</span>
            <span className="text-lg font-heading font-bold text-primary">{totalScore}</span>
            <span className="text-xs text-text-subtle">/ {quiz.questions.reduce((max, q) => max + Math.max(...q.options.map((o) => o.score)), 0)}</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <ShareButtons title={`نتيجة اختبار: ${quiz.title} - ${result?.title}`} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleRetake}
              className="btn-outline flex items-center gap-2 justify-center text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              إعادة الاختبار
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (selectedQuizId) {
                  useStore.getState().clearSelection();
                  useStore.getState().navigateTo('quiz');
                }
              }}
              className="btn-primary flex items-center gap-2 justify-center text-sm"
            >
              اختبارات أخرى
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Quiz Flow
  const question = quiz.questions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-6"
    >
      <motion.button
        whileHover={{ x: 4 }}
        onClick={() => {
          useStore.getState().clearSelection();
          useStore.getState().navigateTo('quiz');
        }}
        className="flex items-center gap-2 text-sm text-text-subtle hover:text-primary transition-colors mb-6 cursor-pointer group"
      >
        <span className="glass-subtle rounded-full p-1.5 group-hover:bg-primary/10 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </span>
        العودة للاختبارات
      </motion.button>

      {/* Header */}
      <div className="glass-strong rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-heading font-bold text-text-main">{quiz.title}</h2>
          <span className="text-xs glass-subtle px-3 py-1 rounded-full text-primary font-medium">
            {currentQuestion + 1} / {quiz.questions.length}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-glass-subtle overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-primary"
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: animDirection > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: animDirection > 0 ? -40 : 40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass-strong rounded-2xl p-6 mb-6">
            <h3 className="text-base sm:text-lg font-heading font-bold text-text-main text-center mb-6 leading-relaxed">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(index)}
                className={cn(
                  'w-full glass-subtle rounded-2xl p-5 text-right transition-all duration-200 cursor-pointer',
                  'hover:bg-gradient-primary/5 hover:border-primary/20 border border-transparent',
                  selectedAnswer === index && 'bg-gradient-primary/10 border-primary/30',
                  selectedAnswer !== null && selectedAnswer !== index && 'opacity-40'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 text-sm font-bold',
                    selectedAnswer === index
                      ? 'bg-gradient-primary text-white'
                      : 'bg-glass-subtle text-text-subtle'
                  )}>
                    {String.fromCharCode(1571 + index)}
                  </div>
                  <span className="text-sm text-text-main font-medium">{option.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
