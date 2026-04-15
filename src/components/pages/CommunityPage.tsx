'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  ImagePlus,
  Send,
  Hash,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { COMMUNITY_POSTS } from '@/data/featuresData';
import { cn } from '@/lib/utils';
import { getRelativeTime } from '@/lib/utils';
import type { CommunityPost, CategorySlug } from '@/types';

// ─── Easing ───────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Category config ──────────────────────────────────────────
const CATEGORIES: { slug: CategorySlug | 'all'; label: string }[] = [
  { slug: 'all', label: 'الكل' },
  { slug: 'skincare', label: 'بشرة' },
  { slug: 'haircare', label: 'شعر' },
  { slug: 'beauty', label: 'تجميل' },
  { slug: 'fashion', label: 'أزياء' },
  { slug: 'cooking', label: 'طبخ' },
  { slug: 'health', label: 'صحة' },
  { slug: 'natural', label: 'طبيعي' },
];

// ─── Trending hashtags ────────────────────────────────────────
const TRENDING_HASHTAGS = [
  { tag: '#ماسك_طبيعي', count: 2340 },
  { tag: '#وصفات_جمالك', count: 1890 },
  { tag: '#عناية_بالبشرة', count: 1650 },
  { tag: '#وصفة_ناجحة', count: 1420 },
  { tag: '#تطويل_الشعر', count: 1280 },
  { tag: '#روتين_يومي', count: 1100 },
  { tag: '#أزياء_محجبات', count: 980 },
  { tag: '#وصفات_صحية', count: 870 },
];

// ─── Animation variants ───────────────────────────────────────
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
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

// ─── Component ────────────────────────────────────────────────
export function CommunityPage() {
  const { goBack } = useStore();

  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<CategorySlug | 'all'>('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set(posts.filter((p) => p.isLiked).map((p) => p.id)));

  // ─── Filtered posts ─────────────────────────────────────────
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  // ─── Toggle like ────────────────────────────────────────────
  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  // ─── Create post ────────────────────────────────────────────
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `cp-${Date.now()}`,
      authorName: 'أنتِ',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
      content: newPostContent.trim(),
      images: [],
      category: newPostCategory === 'all' ? 'skincare' : newPostCategory,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: new Date().toISOString().split('T')[0],
      tags: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent('');
    setShowCreatePost(false);
  };

  // ─── Collect all tags from posts ────────────────────────────
  const allTags = useMemo(() => {
    const tagMap = new Map<string, number>();
    posts.forEach((p) => {
      p.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [posts]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-6"
    >
      {/* Back */}
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

      {/* ─── Hero ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease }}
        className="relative rounded-3xl overflow-hidden mb-10"
      >
        <div className="bg-gradient-primary p-8 sm:p-12 text-center text-white relative">
          <div className="pattern-dots absolute inset-0 opacity-[0.06]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Users className="h-10 w-10 text-white/80 mx-auto" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 relative z-10">
            مجتمع جمالكِ
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto relative z-10">
            شاركي تجاربكِ ونصائحكِ مع مجتمع من النساء اللواتي يهتممن بالجمال
          </p>
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-6 relative z-10">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {posts.reduce((s, p) => s + p.likes, 0).toLocaleString('ar-EG')}
              </div>
              <div className="text-xs text-white/70">تفاعل</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">{posts.length}</div>
              <div className="text-xs text-white/70">منشور</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">
                {allTags.length}
              </div>
              <div className="text-xs text-white/70">هاشتاج</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Trending Hashtags ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ease }}
        className="glass-strong rounded-2xl p-5 mb-6"
      >
        <h3 className="text-sm font-heading font-bold text-text-main mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          الهاشتاجات الرائجة
        </h3>
        <div className="flex flex-wrap gap-2">
          {(allTags.length > 0 ? allTags.map(([tag, count]) => ({ tag, count })) : TRENDING_HASHTAGS.map((h) => ({ tag: h.tag, count: h.count }))).map((item) => (
            <motion.button
              key={item.tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-subtle px-3 py-1.5 rounded-full text-xs text-text-secondary font-medium hover:text-primary hover:border-primary/30 transition-all flex items-center gap-1.5"
            >
              <Hash className="h-3 w-3 text-primary/60" />
              {item.tag}
              <span className="text-[10px] text-text-subtle">{item.count}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ─── Create Post ─────────────────────────────────────── */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 16, height: 0 }}
            transition={{ duration: 0.35, ease }}
            className="glass-strong gradient-border rounded-2xl overflow-hidden mb-6"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-text-main flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  منشور جديد
                </h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreatePost(false)}
                  className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-subtle"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Text area */}
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="شاركي تجربتك أو نصيحتك مع المجتمع..."
                rows={4}
                className="w-full text-sm bg-input-bg border border-border rounded-xl px-4 py-3 text-text-main placeholder:text-text-subtle focus:outline-none focus:border-primary resize-none mb-3"
              />

              {/* Image placeholder */}
              <div className="w-full h-32 rounded-xl border-2 border-dashed border-border-light flex flex-col items-center justify-center gap-2 mb-3 cursor-pointer hover:border-primary/40 transition-colors">
                <ImagePlus className="h-6 w-6 text-text-subtle" />
                <span className="text-xs text-text-subtle">إضافة صورة</span>
              </div>

              {/* Category selector */}
              <div className="mb-4">
                <p className="text-xs text-text-subtle font-medium mb-2">التصنيف</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => (
                    <motion.button
                      key={cat.slug}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewPostCategory(cat.slug)}
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                        newPostCategory === cat.slug
                          ? 'bg-gradient-primary text-white border-transparent'
                          : 'glass-subtle text-text-secondary border-transparent hover:border-primary/20'
                      )}
                    >
                      {cat.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={!newPostContent.trim()}
                onClick={handleCreatePost}
                className={cn(
                  'btn-primary w-full flex items-center justify-center gap-2 text-sm',
                  !newPostContent.trim() && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Send className="h-4 w-4" />
                نشر المنشور
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showCreatePost && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreatePost(true)}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm mb-6"
        >
          <Send className="h-4 w-4" />
          كتابة منشور جديد
        </motion.button>
      )}

      {/* ─── Category Filter Tabs ────────────────────────────── */}
      <div className="glass-strong rounded-2xl p-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.slug}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0',
                activeCategory === cat.slug
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'glass-subtle text-text-secondary hover:text-primary'
              )}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── Posts Feed ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-5"
        >
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-strong rounded-2xl p-10 text-center"
            >
              <Users className="h-10 w-10 text-text-subtle mx-auto mb-3" />
              <p className="text-sm text-text-subtle">لا توجد منشورات في هذا التصنيف بعد</p>
            </motion.div>
          ) : (
            filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={staggerItem}
                className="glass-strong rounded-2xl overflow-hidden card-hover"
              >
                {/* Post header */}
                <div className="p-5 pb-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20 relative">
                      <Image
                        src={post.authorAvatar}
                        alt={post.authorName}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-heading font-bold text-text-main truncate">
                          {post.authorName}
                        </h4>
                        <span className="text-[10px] glass px-2 py-0.5 rounded-full text-primary font-medium flex-shrink-0">
                          {CATEGORIES.find((c) => c.slug === post.category)?.label || post.category}
                        </span>
                      </div>
                      <span className="text-xs text-text-subtle">
                        {getRelativeTime(post.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-text-main leading-relaxed mb-3 whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-primary/70 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Image */}
                  {post.images.length > 0 && (
                    <div className="rounded-xl overflow-hidden mb-3 relative w-full aspect-[4/3]">
                      <Image
                        src={post.images[0]}
                        alt="صورة المنشور"
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 640px) 100vw, 600px"
                      />
                    </div>
                  )}
                </div>

                {/* Post actions */}
                <div className="border-t border-border-light px-5 py-3 flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1.5 text-text-subtle hover:text-primary transition-colors group"
                  >
                    <motion.div
                      whileTap={{ scale: 1.3 }}
                      className="transition-transform"
                    >
                      <Heart
                        className={cn(
                          'h-4.5 w-4.5 transition-colors',
                          likedPosts.has(post.id)
                            ? 'fill-red-500 text-red-500'
                            : 'group-hover:text-primary'
                        )}
                      />
                    </motion.div>
                    <span className={cn(
                      'text-xs font-medium transition-colors',
                      likedPosts.has(post.id) ? 'text-red-500' : ''
                    )}>
                      {post.likes.toLocaleString('ar-EG')}
                    </span>
                  </motion.button>

                  <div className="flex items-center gap-1.5 text-text-subtle">
                    <MessageCircle className="h-4.5 w-4.5" />
                    <span className="text-xs font-medium">{post.comments}</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-1.5 text-text-subtle hover:text-primary transition-colors"
                  >
                    <Share2 className="h-4.5 w-4.5" />
                    <span className="text-xs font-medium">مشاركة</span>
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
