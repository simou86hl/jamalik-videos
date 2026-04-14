'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Scissors, Heart } from 'lucide-react';
import { QUIZZES } from '@/data/quizzes';
import { useStore } from '@/store/useStore';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] },
  },
};

const QUIZ_ICONS: Record<string, React.ReactNode> = {
  skincare: <Sparkles className="h-7 w-7" />,
  haircare: <Scissors className="h-7 w-7" />,
  fashion: <Brain className="h-7 w-7" />,
  health: <Heart className="h-7 w-7" />,
};

const QUIZ_GRADIENTS: Record<string, string> = {
  skincare: 'from-purple-500 to-violet-400',
  haircare: 'from-amber-500 to-yellow-400',
  fashion: 'from-pink-500 to-rose-400',
  health: 'from-red-500 to-rose-400',
};

export function QuizSection() {
  const { selectQuiz, navigateTo, completedQuizzes } = useStore();

  const handleStartQuiz = (quizId: string) => {
    selectQuiz(quizId);
    navigateTo('quiz');
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="py-8"
    >
      {/* Section header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center shadow-md shadow-purple-500/20">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main">
              اختبارات <span className="text-gradient">ذكية</span>
            </h2>
            <p className="text-text-subtle text-xs">اكتشفي المزيد عن نفسك</p>
          </div>
        </div>
      </motion.div>

      {/* Quiz cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {QUIZZES.map((quiz) => {
          const isCompleted = completedQuizzes.includes(quiz.id);
          return (
            <motion.div
              key={quiz.id}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="glass-strong rounded-2xl p-5 h-full flex flex-col card-hover gradient-border relative overflow-hidden group">
                {/* Decorative blob */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg ${QUIZ_GRADIENTS[quiz.category] || 'from-pink-500 to-rose-400'}`}
                  >
                    {QUIZ_ICONS[quiz.category] || <Brain className="h-7 w-7" />}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-text-main text-sm sm:text-base mb-2 leading-relaxed">
                    {quiz.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-subtle text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                    {quiz.description}
                  </p>

                  {/* Question count */}
                  <div className="glass-subtle rounded-lg px-3 py-1.5 mb-3 w-fit">
                    <span className="text-[11px] text-text-subtle font-medium">
                      {quiz.questions.length} أسئلة
                    </span>
                  </div>

                  {/* CTA button */}
                  <button
                    onClick={() => handleStartQuiz(quiz.id)}
                    disabled={isCompleted}
                    className={`btn-primary text-xs px-4 py-2.5 w-full ${
                      isCompleted ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {isCompleted ? 'تم الإكمال ✓' : 'ابدئي الاختبار'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
