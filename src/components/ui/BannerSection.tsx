/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BannerItem } from '../../types';
import { bannersService, DEFAULT_BANNERS } from '../../services/bannersService';

export interface BannerSectionProps {
  autoRotateInterval?: number; // default 7000ms (7s)
  className?: string;
}

/**
 * BannerSection:
 * Replicates the Quartisan-style full-width edge-to-edge layout:
 * - Edge-to-edge image banner (no wood-frame border, no outer padding, directly below navbar)
 * - Normal document flow (scrolls up naturally with the page, NOT fixed)
 * - Height ~420-480px on desktop, ~340px on mobile
 * - Subtle warm-dark tint over entire image for brand consistency
 * - Semi-transparent solid dark-brown overlay box on the LEFT side containing title & description
 * - NO buttons inside the overlay box (CTA is placed separately below the banner)
 */
export const BannerSection: React.FC<BannerSectionProps> = ({
  autoRotateInterval = 7000,
  className = '',
}) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const nextPreloadRef = useRef<HTMLImageElement | null>(null);

  // Load active banners and subscribe to real-time updates
  useEffect(() => {
    let isMounted = true;

    const fetchBanners = async () => {
      try {
        const data = await bannersService.getActiveBanners();
        if (isMounted) {
          setBanners(data);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load active banners:', err);
        if (isMounted) setIsLoaded(true);
      }
    };

    fetchBanners();

    const unsubscribe = bannersService.subscribeToBannersChanges((all) => {
      if (isMounted) {
        setBanners(all.filter((b) => b.is_active));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const displayBanners = banners.length > 0 ? banners : DEFAULT_BANNERS.filter((b) => b.is_active);

  // Safe index bounds
  useEffect(() => {
    if (displayBanners.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= displayBanners.length) {
      setCurrentIndex(0);
    }
  }, [displayBanners.length, currentIndex]);

  // Preload next image to eliminate flicker during crossfade
  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const nextIdx = (currentIndex + 1) % displayBanners.length;
    const nextUrl = displayBanners[nextIdx]?.image_url;
    if (nextUrl) {
      const img = new Image();
      img.src = nextUrl;
      nextPreloadRef.current = img;
    }
  }, [currentIndex, displayBanners]);

  // Auto-rotate crossfade
  useEffect(() => {
    if (displayBanners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [displayBanners.length, autoRotateInterval]);

  if (!isLoaded && displayBanners.length === 0) {
    return null;
  }

  const currentBanner = displayBanners[currentIndex] || displayBanners[0];
  if (!currentBanner) return null;

  return (
    <section
      id="hero_banner_section"
      aria-label="Framedia Creative Visual Showcase"
      className={`relative w-full overflow-hidden h-[340px] sm:h-[420px] md:h-[460px] lg:h-[490px] bg-[#1F1004] ${className}`}
    >
      {/* 1. LAYER: EDGE-TO-EDGE FULL-WIDTH CAROUSEL IMAGE (Crossfade) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentBanner.id || currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentBanner.image_url}
              alt={currentBanner.caption || 'Framedia Creative Banner'}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. LAYER: WARM-DARK DIM OVERLAY ACROSS ENTIRE IMAGE
          Ensures image stays branded with warm Framedia palette and text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-[#231206]/40 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

      {/* 3. LAYER: CONTENT CONTAINER WITH TEXT OVERLAY BOX ON LEFT SIDE */}
      <div className="relative w-full h-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start z-10">
        {/* Content Container (no enclosing box shape, text directly over banner with high legibility) */}
        <div
          className="w-full sm:max-w-xl lg:max-w-2xl my-auto py-4"
        >
          {/* Big White Headline: Studio Name */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase leading-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)] mb-2">
            Imaginiv
          </h1>

          {/* Subtitle: Narrative Craft */}
          <h2 className="text-lg sm:text-xl lg:text-2xl text-[#FFDE9E] font-display leading-snug mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
            Narrative Craft &amp; Tactile Visual Production
          </h2>

          {/* Description Paragraph in Warm Light Cream */}
          <p className="text-sm sm:text-base lg:text-lg text-[#FDF0DE] font-medium leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] max-w-xl">
            Welcome to our creative studio. Imaginiv is a multidisciplinary agency where narrative craft, tactile visual production, and forward-thinking media come together under one collaborative roof.
          </p>
        </div>
      </div>

      {/* 4. DISCREET CORNER DOTS INDICATOR (BOTTOM RIGHT) */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-4 right-4 sm:right-8 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/15 pointer-events-none">
          {displayBanners.map((_, dotIdx) => (
            <span
              key={dotIdx}
              className={`transition-all duration-300 rounded-full ${
                dotIdx === currentIndex
                  ? 'w-5 h-1.5 bg-[#2F8FE0]'
                  : 'w-1.5 h-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
