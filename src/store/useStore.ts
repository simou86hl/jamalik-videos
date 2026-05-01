import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SitePage,
  SeriesCategorySlug,
  Series,
  WatchProgress,
  WatchlistItem,
  AchievementBadge,
} from '@/types';

interface MusalsalatStore {
  // Navigation
  currentPage: SitePage;
  previousPage: SitePage | null;

  // Selections
  selectedCategory: SeriesCategorySlug | null;
  selectedSeries: Series | null;

  // Search
  searchQuery: string;
  isSearchOpen: boolean;

  // UI
  isMobileMenuOpen: boolean;
  isDarkMode: boolean;
  isKidsMode: boolean;

  // Favorites
  favorites: string[];

  // Watch progress
  watchProgress: WatchProgress[];

  // User ratings
  userRatings: Record<string, number>;

  // Category views (Smart Categories)
  categoryViews: Record<string, number>;

  // Broadcast reminders
  broadcastReminders: string[];

  // Watchlist
  watchlist: WatchlistItem[];

  // Achievements
  achievements: AchievementBadge[];

  // Actions
  navigateTo: (page: SitePage) => void;
  goBack: () => void;
  selectCategory: (slug: SeriesCategorySlug) => void;
  selectSeries: (series: Series) => void;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  toggleMobileMenu: () => void;
  toggleDarkMode: () => void;
  toggleKidsMode: () => void;
  toggleFavorite: (seriesId: string) => void;
  isFavorite: (seriesId: string) => boolean;
  updateWatchProgress: (progress: WatchProgress) => void;
  getWatchProgress: (seriesId: string, seasonNum: number, epNum: number) => WatchProgress | undefined;
  getContinueWatching: () => WatchProgress[];
  submitRating: (seriesId: string, rating: number) => void;
  getUserRating: (seriesId: string) => number;

  // Smart Categories
  incrementCategoryView: (category: string) => void;

  // Broadcast Reminders
  toggleBroadcastReminder: (seriesId: string) => void;
  isBroadcastReminder: (seriesId: string) => boolean;

  // Watchlist
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (seriesId: string, seasonNum: number, epNum: number) => void;
  isInWatchlist: (seriesId: string, seasonNum: number, epNum: number) => boolean;

  // Achievements
  unlockAchievement: (id: string) => void;
  getAchievements: () => AchievementBadge[];
}

export const useStore = create<MusalsalatStore>()(
  persist(
    (set, get) => ({
      // Navigation
      currentPage: 'home',
      previousPage: null,

      // Selections
      selectedCategory: null,
      selectedSeries: null,

      // Search
      searchQuery: '',
      isSearchOpen: false,

      // UI
      isMobileMenuOpen: false,
      isDarkMode: false,
      isKidsMode: false,

      // Favorites
      favorites: [],

      // Watch progress
      watchProgress: [],

      // User ratings
      userRatings: {},

      // Category views (Smart Categories)
      categoryViews: {},

      // Broadcast reminders
      broadcastReminders: [],

      // Watchlist
      watchlist: [],

      // Achievements
      achievements: [
        { id: 'first-watch', title: 'المشاهدة الأولى', description: 'شاهد أول حلقة', icon: 'Eye', unlockedAt: null, condition: 'first-watch' },
        { id: 'binge-5', title: 'ماري ماراثون', description: 'شاهد 5 حلقات في يوم', icon: 'Zap', unlockedAt: null, condition: 'binge-5' },
        { id: 'ten-series', title: 'مستكشف', description: 'شاهد 10 مسلسلات مختلفة', icon: 'Compass', unlockedAt: null, condition: 'ten-series' },
        { id: 'first-rating', title: 'ناقد', description: 'قيّم أول مسلسل', icon: 'Star', unlockedAt: null, condition: 'first-rating' },
        { id: 'five-favorites', title: 'محب المسلسلات', description: 'أضف 5 مسلسلات للمفضلة', icon: 'Heart', unlockedAt: null, condition: 'five-favorites' },
        { id: 'night-owl', title: 'بومة الليل', description: 'شاهد بعد منتصف الليل', icon: 'Moon', unlockedAt: null, condition: 'night-owl' },
        { id: 'explorer', title: 'مغامر', description: 'تصفح جميع التصنيفات', icon: 'Map', unlockedAt: null, condition: 'explorer' },
        { id: 'loyal', title: 'مخلص', description: 'أكمل 20 حلقة من مسلسل واحد', icon: 'Award', unlockedAt: null, condition: 'loyal' },
      ],

      // Actions
      navigateTo: (page) => {
        set((state) => ({
          previousPage: state.currentPage,
          currentPage: page,
          isMobileMenuOpen: false,
          isSearchOpen: false,
        }));
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      goBack: () => {
        set((state) => ({
          currentPage: state.previousPage || 'home',
          previousPage: null,
          selectedSeries: null,
          selectedCategory: null,
        }));
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      selectCategory: (slug) =>
        set({ selectedCategory: slug, selectedSeries: null }),

      selectSeries: (series) => {
        set({ selectedSeries: series, currentPage: 'series-detail' });
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleSearch: () =>
        set((state) => ({ isSearchOpen: !state.isSearchOpen })),

      closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),

      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

      toggleKidsMode: () =>
        set((state) => ({ isKidsMode: !state.isKidsMode })),

      toggleFavorite: (seriesId) =>
        set((state) => ({
          favorites: state.favorites.includes(seriesId)
            ? state.favorites.filter((id) => id !== seriesId)
            : [...state.favorites, seriesId],
        })),

      isFavorite: (seriesId) =>
        get().favorites.includes(seriesId),

      updateWatchProgress: (progress) =>
        set((state) => {
          const filtered = state.watchProgress.filter(
            (p) => !(p.seriesId === progress.seriesId && p.seasonNumber === progress.seasonNumber && p.episodeNumber === progress.episodeNumber)
          );
          return { watchProgress: [...filtered, progress] };
        }),

      getWatchProgress: (seriesId, seasonNum, epNum) =>
        get().watchProgress.find(
          (p) => p.seriesId === seriesId && p.seasonNumber === seasonNum && p.episodeNumber === epNum
        ),

      getContinueWatching: () =>
        get().watchProgress.sort(
          (a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime()
        ),

      submitRating: (seriesId, rating) =>
        set((state) => ({
          userRatings: { ...state.userRatings, [seriesId]: rating },
        })),

      getUserRating: (seriesId) =>
        get().userRatings[seriesId] || 0,

      // Smart Categories
      incrementCategoryView: (category) =>
        set((state) => ({
          categoryViews: {
            ...state.categoryViews,
            [category]: (state.categoryViews[category] || 0) + 1,
          },
        })),

      // Broadcast Reminders
      toggleBroadcastReminder: (seriesId) =>
        set((state) => ({
          broadcastReminders: state.broadcastReminders.includes(seriesId)
            ? state.broadcastReminders.filter((id) => id !== seriesId)
            : [...state.broadcastReminders, seriesId],
        })),

      isBroadcastReminder: (seriesId) =>
        get().broadcastReminders.includes(seriesId),

      // Watchlist
      addToWatchlist: (item) =>
        set((state) => ({ watchlist: [...state.watchlist, item] })),

      removeFromWatchlist: (seriesId, seasonNum, epNum) =>
        set((state) => ({
          watchlist: state.watchlist.filter(
            (w) => !(w.seriesId === seriesId && w.seasonNumber === seasonNum && w.episodeNumber === epNum)
          ),
        })),

      isInWatchlist: (seriesId, seasonNum, epNum) =>
        get().watchlist.some(
          (w) => w.seriesId === seriesId && w.seasonNumber === seasonNum && w.episodeNumber === epNum
        ),

      // Achievements
      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a
          ),
        })),

      getAchievements: () => get().achievements,
    }),
    {
      name: 'musalsalat-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        watchProgress: state.watchProgress,
        userRatings: state.userRatings,
        isDarkMode: state.isDarkMode,
        isKidsMode: state.isKidsMode,
        categoryViews: state.categoryViews,
        broadcastReminders: state.broadcastReminders,
        watchlist: state.watchlist,
        achievements: state.achievements,
      }),
    }
  )
);
