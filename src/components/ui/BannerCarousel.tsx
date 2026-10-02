/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Loader2,
  ArrowDown
} from 'lucide-react';
import { BannerItem } from '../../types';
import { bannersService } from '../../services/bannersService';
import { VillageAtelierIllustration } from '../common/VillageArtwork';

export interface BannerCarouselProps {
  banners?: BannerItem[];
  autoPlayInterval?: number; // default 5000ms
  showControls?: boolean; // default true
  showCaption?: boolean; // default true
  showOverlayCta?: boolean; // default false
  onCtaClick?: () => void;
  className?: string;
  isMiniPreview?: boolean;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners: propBanners,
  autoPlayInterval = 5000,
  showControls = true,
  showCaption = true,
  showOverlayCta = false,
  onCtaClick,
  className = '',
  isMiniPreview = false,
}) => {
  const [internalBanners, setInternalBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(!propBanners);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Touch swipe support for mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Active banners list (from props or fetched from service)
  const activeBanners = propBanners ?? internalBanners;

  // Load banners if not provided via props
  useEffect(() => {
    if (propBanners) {
      setInternalBanners(propBanners);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await bannersService.getActiveBanners();
        if (isMounted) {
          setInternalBanners(data);
        }
      } catch (err) {
        console.error('Failed to load active banners for carousel:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Subscribe to live banner changes
    const unsubscribe = bannersService.subscribeToBannersChanges((all) => {
      if (isMounted) {
        setInternalBanners(all.filter((b) => b.is_active));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [propBanners]);

  // Ensure currentIndex stays within bounds when list length changes
  useEffect(() => {
    if (activeBanners.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= activeBanners.length) {
      setCurrentIndex(0);
    }
  }, [activeBanners.length, currentIndex]);

  const handleNext = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const handlePrev = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  // Auto-play interval timer (5s)
  useEffect(() => {
    if (!isPlaying || isHovered || activeBanners.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, activeBanners.length, autoPlayInterval, handleNext]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  // 1. LOADING SKELETON STATE
  if (loading) {
    return (
      <div 
        className={`w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFF5E6] to-[#EADBBD] border-3 border-[#D6BC90] shadow-inner ${
          isMiniPreview ? 'h-48' : 'h-64 sm:h-80 md:h-[400px]'
        } flex flex-col items-center justify-center relative p-6 animate-pulse ${className}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#E8D4B4] flex items-center justify-center text-[#B08A5E] mb-3">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="h-4 w-48 bg-[#DDC39C] rounded-full mb-2" />
        <div className="h-3 w-32 bg-[#EAD5B7] rounded-full" />
        <span className="sr-only">Loading carousel banners...</span>
      </div>
    );
  }

  // 2. EMPTY STATE: No active banners
  if (activeBanners.length === 0) {
    return (
      <div 
        className={`w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFF0D4] to-[#EADBBD] border-3 border-[#D6BC90] shadow-inner p-6 sm:p-8 flex flex-col items-center justify-center text-center relative ${className}`}
      >
        <VillageAtelierIllustration />
        <div className="mt-4 max-w-sm">
          <div className="font-display text-base sm:text-lg text-[#381E0A]">
            Imaginiv Atelier
          </div>
          <div className="text-xs font-bold text-[#7C471E] mt-0.5">
            Headquarters &bull; Collaborative Creative Village
          </div>
          <p className="text-xs text-[#8C5D35] font-semibold mt-2 leading-relaxed">
            Welcome to the creative showcase. Active showcase banners will appear here once published from the Village CMS Portal.
          </p>
        </div>
      </div>
    );
  }

  const currentBanner = activeBanners[currentIndex];
  const altText = currentBanner.caption?.trim() 
    ? `${currentBanner.caption} - Imaginiv`
    : 'Imaginiv banner showcase';

  // Slide animation variants
  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.4 },
      },
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -80 : 80,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Imaginiv Banner Showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden select-none group border-3 sm:border-4 border-[#542E10] shadow-[0_8px_0_#2B1302,0_16px_32px_rgba(0,0,0,0.35)] bg-[#1F1004] focus:outline-none focus:ring-4 focus:ring-[#2F8FE0]/60 ${className}`}
    >
      {/* Wooden Corner Rivets for Game Aesthetic */}
      <div className="absolute top-2.5 left-2.5 z-30 game-nail !w-3 !h-3 opacity-90 pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 z-30 game-nail !w-3 !h-3 opacity-90 pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 z-30 game-nail !w-3 !h-3 opacity-90 pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 z-30 game-nail !w-3 !h-3 opacity-90 pointer-events-none" />

      {/* Image Slides with AnimatePresence */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentBanner.id || currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentBanner.image_url}
              alt={altText}
              className="w-full h-full object-cover object-top md:object-contain md:object-center"
              loading="lazy"
            />
            {/* Subtle dark gradient overlay to ensure text and buttons above are crisp & readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1004]/85 via-[#1F1004]/35 to-black/25 pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top Banner Tag / Slide Counter */}
      <div className="absolute top-3 sm:top-4 left-4 z-20 flex items-center gap-2">
        <div className="game-wood-pill text-[10px] sm:text-xs font-bold px-2.5 py-0.5 flex items-center gap-1.5 shadow-md">
          <span>Atelier Showcase</span>
        </div>
        <div className="bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-white/20">
          {currentIndex + 1} / {activeBanners.length}
        </div>
      </div>

      {/* Accessibility Pause / Play Button (WCAG 2.2.2 compliance) */}
      {showControls && activeBanners.length > 1 && (
        <div className="absolute top-3 sm:top-4 right-4 z-20">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? 'Pause banner slideshow' : 'Play banner slideshow'}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs border border-white/25 flex items-center justify-center transition-all cursor-pointer shadow-md focus:ring-2 focus:ring-[#2F8FE0]"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            )}
          </button>
        </div>
      )}

      {/* Left Navigation Arrow */}
      {showControls && activeBanners.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous banner"
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#67BDFF] to-[#146FBF] border-2 border-[#093764] text-white flex items-center justify-center shadow-[0_3px_0_#062442,0_6px_12px_rgba(0,0,0,0.4)] opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-105 active:translate-y-[-46%] cursor-pointer focus:opacity-100 focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8]" />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {showControls && activeBanners.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next banner"
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#67BDFF] to-[#146FBF] border-2 border-[#093764] text-white flex items-center justify-center shadow-[0_3px_0_#062442,0_6px_12px_rgba(0,0,0,0.4)] opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-105 active:translate-y-[-46%] cursor-pointer focus:opacity-100 focus:outline-none"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8]" />
        </button>
      )}

      {/* Bottom Content: Caption & Optional CTA */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 flex flex-col items-center text-center">
        {showCaption && currentBanner.caption && (
          <motion.div
            key={`caption-${currentBanner.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3 max-w-xl"
          >
            <div className="inline-block game-parchment !px-3.5 !py-1.5 rounded-xl border border-[#542E10] shadow-[0_3px_0_#2B1302]">
              <p className="text-xs sm:text-sm font-bold text-[#381E0A] drop-shadow-xs line-clamp-2">
                {currentBanner.caption}
              </p>
            </div>
          </motion.div>
        )}

        {/* Optional Explore CTA Button rendered directly on banner */}
        {showOverlayCta && onCtaClick && (
          <div className="mb-3">
            <button
              type="button"
              onClick={onCtaClick}
              className="game-btn-blue text-xs sm:text-sm !py-2.5 !px-6 inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Explore</span>
              <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Navigation Indicator Dots */}
        {activeBanners.length > 1 && (
          <div
            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-xs border border-white/15"
            role="tablist"
            aria-label="Banner slides indicator"
          >
            {activeBanners.map((banner, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={banner.id || index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => handleDotClick(index)}
                  className={`
                    transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F8FE0]
                    ${
                      isActive
                        ? 'w-7 sm:w-8 h-2.5 bg-gradient-to-r from-[#67BDFF] to-[#2F8FE0] border border-white shadow-[0_0_8px_rgba(47,143,224,0.8)]'
                        : 'w-2.5 h-2.5 bg-white/60 hover:bg-white/90 border border-black/30'
                    }
                  `}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
