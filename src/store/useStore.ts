import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SitePage,
  CategorySlug,
  Article,
  Recipe,
  FavoriteItem,
  Comment,
  Notification,
  UserRating,
  TimerState,
} from "@/types";

interface JamaliStore {
  // Navigation
  currentPage: SitePage;
  previousPage: SitePage | null;

  // Selections
  selectedCategory: CategorySlug | null;
  selectedSubcategory: string | null;
  selectedArticle: Article | null;
  selectedRecipe: Recipe | null;
  selectedQuizId: string | null;

  // Search
  searchQuery: string;
  isSearchOpen: boolean;

  // UI
  isMobileMenuOpen: boolean;
  isDarkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  isReadingMode: boolean;

  // Favorites
  favorites: FavoriteItem[];

  // Comments
  comments: Comment[];
  commentsText: string;

  // Notifications
  notifications: Notification[];

  // Ratings
  userRatings: UserRating[];

  // Timer
  timerState: TimerState;

  // Referral
  referralCode: string | null;
  newsletterSubscribed: boolean;

  // Tracking
  viewedArticles: string[];
  completedQuizzes: string[];

  // Actions
  navigateTo: (page: SitePage) => void;
  goBack: () => void;
  selectCategory: (slug: CategorySlug) => void;
  selectSubcategory: (name: string) => void;
  selectArticle: (article: Article) => void;
  selectRecipe: (recipe: Recipe) => void;
  selectQuiz: (quizId: string) => void;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleDarkMode: () => void;
  toggleFavorite: (itemId: string, type: "article" | "recipe") => void;
  isFavorite: (itemId: string) => boolean;
  clearSelection: () => void;

  // Comment actions
  addComment: (comment: Comment) => void;
  deleteComment: (commentId: string) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Font size
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleReadingMode: () => void;

  // Timer actions
  startTimer: (totalSeconds: number, label?: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;

  // Rating actions
  submitRating: (itemId: string, rating: number) => void;

  // Tracking actions
  trackView: (articleId: string) => void;
  completeQuiz: (quizId: string) => void;

  // Newsletter
  subscribeNewsletter: () => void;

  // Referral
  generateReferralCode: () => void;
}

export const useStore = create<JamaliStore>()(
  persist(
    (set, get) => ({
      // Navigation
      currentPage: "home",
      previousPage: null,

      // Selections
      selectedCategory: null,
      selectedSubcategory: null,
      selectedArticle: null,
      selectedRecipe: null,
      selectedQuizId: null,

      // Search
      searchQuery: "",
      isSearchOpen: false,

      // UI
      isMobileMenuOpen: false,
      isDarkMode: false,
      fontSize: 'medium',
      isReadingMode: false,

      // Favorites
      favorites: [],

      // Comments
      comments: [],
      commentsText: "",

      // Notifications
      notifications: [],

      // Ratings
      userRatings: [],

      // Timer
      timerState: {
        totalSeconds: 0,
        remainingSeconds: 0,
        isRunning: false,
        label: 'وقت الطبخ',
      },

      // Referral
      referralCode: null,
      newsletterSubscribed: false,

      // Tracking
      viewedArticles: [],
      completedQuizzes: [],

      // Actions
      navigateTo: (page) =>
        set((state) => ({
          previousPage: state.currentPage,
          currentPage: page,
          isMobileMenuOpen: false,
          isSearchOpen: false,
        })),

      goBack: () =>
        set((state) => ({
          currentPage: state.previousPage || "home",
          previousPage: null,
          selectedArticle: null,
          selectedRecipe: null,
          selectedCategory: null,
          selectedQuizId: null,
        })),

      selectCategory: (slug) =>
        set({
          selectedCategory: slug,
          selectedSubcategory: null,
          selectedArticle: null,
          selectedRecipe: null,
        }),

      selectSubcategory: (name) =>
        set({ selectedSubcategory: name }),

      selectArticle: (article) =>
        set({ selectedArticle: article, currentPage: "article" }),

      selectRecipe: (recipe) =>
        set({ selectedRecipe: recipe, currentPage: "recipe" }),

      selectQuiz: (quizId) =>
        set({ selectedQuizId: quizId, currentPage: "quiz" }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleSearch: () =>
        set((state) => ({ isSearchOpen: !state.isSearchOpen })),

      closeSearch: () => set({ isSearchOpen: false, searchQuery: "" }),

      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

      toggleFavorite: (itemId, type) =>
        set((state) => {
          const exists = state.favorites.some((f) => f.itemId === itemId);
          return {
            favorites: exists
              ? state.favorites.filter((f) => f.itemId !== itemId)
              : [...state.favorites, { itemId, type }],
          };
        }),

      isFavorite: (itemId) =>
        get().favorites.some((f) => f.itemId === itemId),

      clearSelection: () =>
        set({
          selectedCategory: null,
          selectedSubcategory: null,
          selectedArticle: null,
          selectedRecipe: null,
          selectedQuizId: null,
        }),

      // Comment actions
      addComment: (comment) =>
        set((state) => ({
          comments: [...state.comments, comment],
        })),

      deleteComment: (commentId) =>
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
        })),

      // Notification actions
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Font size
      setFontSize: (size) => set({ fontSize: size }),

      toggleReadingMode: () =>
        set((state) => ({ isReadingMode: !state.isReadingMode })),

      // Timer actions
      startTimer: (totalSeconds, label = 'وقت الطبخ') =>
        set({
          timerState: {
            totalSeconds,
            remainingSeconds: totalSeconds,
            isRunning: true,
            label,
          },
        }),

      pauseTimer: () =>
        set((state) => ({
          timerState: { ...state.timerState, isRunning: false },
        })),

      resetTimer: () =>
        set((state) => ({
          timerState: {
            ...state.timerState,
            remainingSeconds: state.timerState.totalSeconds,
            isRunning: false,
          },
        })),

      tickTimer: () =>
        set((state) => {
          if (state.timerState.remainingSeconds <= 0) {
            return {
              timerState: { ...state.timerState, isRunning: false },
            };
          }
          return {
            timerState: {
              ...state.timerState,
              remainingSeconds: state.timerState.remainingSeconds - 1,
            },
          };
        }),

      // Rating actions
      submitRating: (itemId, rating) =>
        set((state) => ({
          userRatings: [
            ...state.userRatings.filter((r) => r.itemId !== itemId),
            { itemId, rating, comment: '', createdAt: new Date().toISOString() },
          ],
        })),

      // Tracking actions
      trackView: (articleId) =>
        set((state) => ({
          viewedArticles: state.viewedArticles.includes(articleId)
            ? state.viewedArticles
            : [...state.viewedArticles, articleId],
        })),

      completeQuiz: (quizId) =>
        set((state) => ({
          completedQuizzes: state.completedQuizzes.includes(quizId)
            ? state.completedQuizzes
            : [...state.completedQuizzes, quizId],
        })),

      // Newsletter
      subscribeNewsletter: () => set({ newsletterSubscribed: true }),

      // Referral
      generateReferralCode: () =>
        set({
          referralCode:
            'JLK-' +
            Math.random().toString(36).substring(2, 8).toUpperCase(),
        }),
    }),
    {
      name: "jamalik-storage",
      partialize: (state) => ({
        favorites: state.favorites,
        isDarkMode: state.isDarkMode,
        fontSize: state.fontSize,
        userRatings: state.userRatings,
        referralCode: state.referralCode,
        newsletterSubscribed: state.newsletterSubscribed,
        viewedArticles: state.viewedArticles,
        completedQuizzes: state.completedQuizzes,
      }),
    }
  )
);
