// ============================================================
// مسلسلات أونلاين - Musalsalat Online Type Definitions
// ============================================================

/** Site page types for SPA navigation */
export type SitePage =
  | 'home' | 'series-detail' | 'category' | 'search'
  | 'favorites' | 'continue-watching';

/** Series categories */
export type SeriesCategorySlug =
  | 'drama'
  | 'comedy'
  | 'action'
  | 'romantic'
  | 'turkish'
  | 'indian'
  | 'korean'
  | 'cartoon'
  | 'documentary';

export interface SeriesCategory {
  id: string;
  name: string;
  slug: SeriesCategorySlug;
  icon: string;
  description: string;
  image: string;
  order: number;
}

export type SeriesStatus = 'مستمر' | 'مكتمل';

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  airDate: string;
}

export interface Season {
  id: string;
  number: number;
  title: string;
  episodes: Episode[];
  year: string;
  description: string;
}

export interface SeriesRating {
  average: number;
  count: number;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  poster: string;
  backdrop: string;
  category: SeriesCategorySlug;
  year: string;
  status: SeriesStatus;
  country: string;
  language: string;
  director: string;
  cast: string[];
  seasons: Season[];
  rating: SeriesRating;
  views: number;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  seriesId: string;
  category: SeriesCategorySlug;
}

export interface WatchProgress {
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
  timestamp: number;
  lastWatched: string;
}

export interface FavoriteItem {
  seriesId: string;
}

export interface NavLink {
  label: string;
  slug: SeriesCategorySlug | 'home' | 'search' | 'favorites' | 'continue-watching';
  icon?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: SeriesCategorySlug;
  year: string;
  rating: number;
}
