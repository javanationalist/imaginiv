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
  fillHeader?: boolean; // default true (extends behind header to fill header background)
}

/**
 * BannerSection:
 * Replicates the Quartisan-style full-width edge-to-edge layout:
 * - 16:9 aspect ratio container matching 1920x1080 desktop banners
 * - Complete 1920x1080 banner image is fully visible on desktop without cropping or distortion
 * - Uses object-contain on desktop so 100% of the image is preserved
 * - On mobile, image starts visually directly at the top with zero top gap or blank space
 * - Padded content container ensures title & description overlay cleanly over header
 */
export const BannerSection: React.FC<BannerSectionProps> = ({
  autoRotateInterval = 7000,
  className = '',
  fillHeader = true,
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
      className={`relative w-full overflow-hidden bg-[#1F1004] ${
        fillHeader ? '-mt-[66px] sm:-mt-[82px]' : ''
      } ${className}`}
    >
      {/* 1. LAYER: 16:9 RESPONSIVE BANNER CONTAINER */}
      <div className="relative w-full aspect-video min-h-[250px] sm:min-h-[340px] max-h-[85vh] mx-auto overflow-hidden bg-[#1F1004] flex items-center justify-center">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentBanner.id || currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full flex items-start md:items-center justify-center"
          >
            <img
              src={currentBanner.image_url}
              alt={currentBanner.caption || 'Framedia Creative Banner'}
              className="w-full h-full object-cover object-top md:object-contain md:object-center"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        {/* 2. LAYER: GRADIENT OVERLAYS */}
        <div className="absolute inset-x-0 top-0 h-24 sm:h-36 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-1" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-[#231206]/35 to-black/25 pointer-events-none z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none z-1" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-1" />

        {/* 3. LAYER: CONTENT CONTAINER WITH TEXT OVERLAY */}
        <div
          className={`absolute inset-0 w-full h-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start z-10 ${
            fillHeader ? 'pt-[66px] sm:pt-[82px]' : ''
          }`}
        >
          <div className="w-full sm:max-w-xl lg:max-w-2xl my-auto py-2 sm:py-4">
            {/* Big White Headline: Studio Name */}
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase leading-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)] mb-1 sm:mb-2">
              Imaginiv
            </h1>

            {/* Subtitle: Narrative Craft */}
            <h2 className="text-sm sm:text-xl lg:text-2xl text-[#FFDE9E] font-display leading-snug mb-1.5 sm:mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              Narrative Craft &amp; Tactile Visual Production
            </h2>

            {/* Description Paragraph in Warm Light Cream */}
            <p className="text-xs sm:text-base lg:text-lg text-[#FDF0DE] font-medium leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] max-w-xl line-clamp-3 sm:line-clamp-none">
              Welcome to our creative studio. Imaginiv is a multidisciplinary agency where narrative craft, tactile visual production, and forward-thinking media come together under one collaborative roof.
            </p>
          </div>
        </div>

        {/* 4. DISCREET CORNER DOTS INDICATOR (BOTTOM RIGHT) */}
        {displayBanners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-8 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/15 pointer-events-none">
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
      </div>
    </section>
  );
};
