'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Heart, Share2, Play, Clock, Calendar,
  Star, ChevronLeft, ChevronRight, Film, Users, Globe,
  MapPin, Mic2, X, PictureInPicture2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ALL_SERIES } from '@/data/seriesData';
import { CATEGORIES } from '@/lib/constants';
import { SeriesCard } from '@/components/shared/SeriesCard';
import { RatingStars } from '@/components/shared/RatingStars';
import { cn } from '@/lib/utils';
import type { Episode, Season } from '@/types';

export function SeriesDetailPage() {
  const {
    selectedSeries: series,
    goBack,
    toggleFavorite,
    isFavorite,
    updateWatchProgress,
    getWatchProgress,
    submitRating,
    getUserRating,
  } = useStore();

  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(0);
  const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null);
  const episodesRef = useRef<HTMLDivElement>(null);

  if (!series) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Film className="h-16 w-16 text-text-subtle/30 mb-4" />
        <p className="text-text-subtle">لم يتم اختيار مسلسل</p>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.slug === series.category);
  const favorited = isFavorite(series.id);
  const userRating = getUserRating(series.id);
  const seasons: Season[] = series.seasons;
  const currentSeason = seasons[selectedSeasonIdx] || seasons[0];

  const handlePlayEpisode = (episode: Episode) => {
    setPlayingEpisode(episode);
    updateWatchProgress({
      seriesId: series.id,
      seasonNumber: currentSeason.number,
      episodeNumber: episode.number,
      timestamp: 0,
      lastWatched: new Date().toISOString(),
    });
    setTimeout(() => {
      episodesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const navigateEpisode = (direction: 'prev' | 'next') => {
    if (!playingEpisode) return;
    const idx = currentSeason.episodes.findIndex((e) => e.id === playingEpisode.id);
    if (direction === 'prev' && idx > 0) {
      handlePlayEpisode(currentSeason.episodes[idx - 1]);
    } else if (direction === 'next' && idx < currentSeason.episodes.length - 1) {
      handlePlayEpisode(currentSeason.episodes[idx + 1]);
    }
  };

  const similarSeries = ALL_SERIES.filter(
    (s) => s.category === series.category && s.id !== series.id
  ).slice(0, 5);

  return (
    <div className="pb-8">
      {/* Backdrop */}
      <div className="relative h-[300px] sm:h-[400px] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${series.backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={goBack}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
        >
          <ArrowRight className="h-5 w-5 text-white" />
        </motion.button>
      </div>

      {/* Series Info - overlaps backdrop */}
      <div className="relative -mt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Title & Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-primary text-white text-[11px] font-bold">
                {cat?.name}
              </span>
              <span className={cn(
                'px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white',
                series.status === 'مستمر' ? 'bg-success' : 'bg-secondary'
              )}>
                {series.status}
              </span>
              <span className="text-[11px] text-text-subtle">{series.year}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-text-main mb-2">
              {series.title}
            </h1>

            {/* Rating + Stats */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="text-sm font-bold text-text-main">{series.rating.average}</span>
                <span className="text-[11px] text-text-subtle">({series.rating.count.toLocaleString('ar-EG')})</span>
              </div>
              <span className="text-text-subtle text-[11px]">|</span>
              <div className="flex items-center gap-1 text-[11px] text-text-subtle">
                <Film className="h-3.5 w-3.5" />
                <span>{series.seasons.length} مواسم</span>
              </div>
              <span className="text-text-subtle text-[11px]">|</span>
              <div className="flex items-center gap-1 text-[11px] text-text-subtle">
                <MapPin className="h-3.5 w-3.5" />
                <span>{series.country}</span>
              </div>
              <span className="text-text-subtle text-[11px]">|</span>
              <div className="flex items-center gap-1 text-[11px] text-text-subtle">
                <Globe className="h-3.5 w-3.5" />
                <span>{series.language}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-text-secondary leading-relaxed mb-4 max-w-2xl">
              {series.description}
            </p>

            {/* Director & Language */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-[11px] text-text-subtle">
              <div className="flex items-center gap-1">
                <Mic2 className="h-3.5 w-3.5" />
                <span>إخراج: {series.director}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => {
                  if (currentSeason.episodes.length > 0) {
                    handlePlayEpisode(currentSeason.episodes[0]);
                  }
                }}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Play className="h-4 w-4 fill-white" />
                شاهد الآن
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(series.id)}
                className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer border-2',
                  favorited
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'glass-subtle border-transparent text-text-subtle hover:text-primary'
                )}
              >
                <Heart className={cn('h-5 w-5', favorited && 'fill-primary')} />
              </motion.button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: series.title, url: window.location.href });
                  }
                }}
                className="w-11 h-11 rounded-full glass-subtle flex items-center justify-center text-text-subtle hover:text-primary transition-colors cursor-pointer"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* User Rating */}
            <div className="glass rounded-xl p-4 mb-6 max-w-xs">
              <p className="text-xs font-bold text-text-main mb-2">قيّم المسلسل</p>
              <div className="flex items-center gap-3">
                <RatingStars
                  rating={userRating || 0}
                  size="lg"
                  interactive
                  onChange={(r) => submitRating(series.id, r)}
                />
                {userRating > 0 && (
                  <span className="text-xs text-text-subtle">{userRating} من 5</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* ═══ Video Player ═══ */}
          <AnimatePresence>
            {playingEpisode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="relative glass rounded-2xl overflow-hidden">
                  {/* Video Placeholder */}
                  <div className="relative aspect-video bg-card-elevated">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30"
                      style={{ backgroundImage: `url(${playingEpisode.thumbnail})` }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg mb-3 animate-glow">
                        <Play className="h-7 w-7 text-white fill-white" />
                      </div>
                      <p className="text-sm font-bold text-text-main">{playingEpisode.title}</p>
                      <p className="text-xs text-text-subtle">{playingEpisode.duration}</p>
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text-main">
                        الموسم {currentSeason.number} - {playingEpisode.title}
                      </h3>
                      <p className="text-xs text-text-subtle">{playingEpisode.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (document.pictureInPictureEnabled) {
                            const video = document.createElement('video');
                            video.src = playingEpisode.videoUrl;
                            video.muted = true;
                            video.play().then(() => {
                              (video as HTMLVideoElement & { requestPictureInPicture?: () => Promise<void> }).requestPictureInPicture?.();
                            }).catch(() => {});
                          }
                        }}
                        title="صورة داخل صورة"
                        className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors"
                      >
                        <PictureInPicture2 className="h-4 w-4 text-text-subtle" />
                      </button>
                      <button
                        onClick={() => setPlayingEpisode(null)}
                        className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center cursor-pointer"
                      >
                        <X className="h-4 w-4 text-text-subtle" />
                      </button>
                    </div>
                  </div>

                  {/* Episode Navigation */}
                  <div className="px-4 pb-4 flex items-center gap-2">
                    <button
                      onClick={() => navigateEpisode('prev')}
                      className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <ChevronRight className="h-3 w-3" />
                      السابق
                    </button>
                    <button
                      onClick={() => navigateEpisode('next')}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      التالي
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ Season Tabs ═══ */}
          {seasons.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
              {seasons.map((season, idx) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeasonIdx(idx)}
                  className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer',
                    idx === selectedSeasonIdx
                      ? 'bg-gradient-primary text-white shadow-lg'
                      : 'glass-subtle text-text-subtle hover:text-primary'
                  )}
                >
                  الموسم {season.number}
                </button>
              ))}
            </div>
          )}

          {/* ═══ Episode List ═══ */}
          <div ref={episodesRef} className="mb-8">
            <h3 className="text-lg font-heading font-bold text-text-main mb-3">
              حلقات الموسم {currentSeason.number}
              <span className="text-sm text-text-subtle font-normal mr-2">
                ({currentSeason.episodes.length} حلقة)
              </span>
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
              {currentSeason.episodes.map((episode) => {
                const progress = getWatchProgress(series.id, currentSeason.number, episode.number);
                const isPlaying = playingEpisode?.id === episode.id;

                return (
                  <motion.button
                    key={episode.id}
                    onClick={() => handlePlayEpisode(episode)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-right',
                      isPlaying
                        ? 'glass-strong border-2 border-primary/30 shadow-[var(--shadow-glow)]'
                        : 'glass hover:bg-primary/5'
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${episode.thumbnail})` }}
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-3.5 w-3.5 text-white fill-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-text-main line-clamp-1">
                          {episode.title}
                        </p>
                        {isPlaying && (
                          <span className="px-1.5 py-0.5 rounded bg-primary text-white text-[9px] font-bold flex-shrink-0">
                            يعمل الآن
                          </span>
                        )}
                        {progress && !isPlaying && (
                          <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[9px] font-bold flex-shrink-0">
                            مشاهد
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <div className="flex items-center gap-1 text-[10px] text-text-subtle">
                          <Clock className="h-3 w-3" />
                          <span>{episode.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-text-subtle">
                          <Calendar className="h-3 w-3" />
                          <span>{episode.airDate}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ═══ Cast Section ═══ */}
          <div className="mb-8">
            <h3 className="text-lg font-heading font-bold text-text-main mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              طاقم التمثيل
            </h3>
            <div className="flex flex-wrap gap-2">
              {series.cast.map((actor) => (
                <span
                  key={actor}
                  className="px-3 py-1.5 rounded-full glass-subtle text-xs font-medium text-text-main"
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>

          {/* ═══ Similar Series ═══ */}
          {similarSeries.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-heading font-bold text-text-main mb-3 flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" />
                مسلسلات مشابهة
              </h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {similarSeries.map((s) => (
                  <div key={s.id} className="flex-shrink-0 w-[140px] sm:w-[160px]">
                    <SeriesCard series={s} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
