'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface CommentSectionProps {
  itemId: string;
  itemType: 'article' | 'recipe';
}

interface LocalComment {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
}

export function CommentSection({ itemId, itemType }: CommentSectionProps) {
  const { addComment } = useStore();
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: LocalComment = {
      id: `c-${Date.now()}`,
      userName: 'زائرة جمالكِ',
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [comment, ...prev]);
    addComment({ id: comment.id, userName: comment.userName, content: comment.content, itemId, itemType, likes: 0, parentId: null, replies: [], createdAt: comment.createdAt });
    setNewComment('');
  };

  const handleDelete = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-12"
    >
      <div className="glass-strong rounded-2xl p-6">
        <h3 className="text-lg font-heading font-bold text-text-main mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary/15 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-primary" />
          </div>
          التعليقات ({comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="اكتبي تعليقك هنا..."
              rows={2}
              className="flex-1 glass-subtle rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-subtle/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!newComment.trim()}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all',
                newComment.trim()
                  ? 'bg-gradient-primary text-white shadow-[var(--shadow-sm)]'
                  : 'glass-subtle text-text-subtle/40'
              )}
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-8 w-8 text-text-subtle/30 mx-auto mb-3" />
            <p className="text-sm text-text-subtle/60">لا توجد تعليقات بعد. كوني أول من يعلق!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-subtle rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-primary/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">
                        {comment.userName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-text-main">{comment.userName}</span>
                    <span className="text-[10px] text-text-subtle/50">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-text-subtle/30 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-sm text-text-main/80 leading-relaxed">{comment.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
