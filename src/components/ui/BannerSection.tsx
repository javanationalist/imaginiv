/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BannerItem } from '../../types';
import { bannersService } from '../../services/bannersService';

export interface BannerSectionProps {
  autoRotateInterval?: number; // default 7000ms (7s)
  className?: string;
}

/**
 * BannerSection:
 * - Only renders real active banners from Supabase.
 * - If Supabase contains zero active banners, request fails, or offline: renders nothing (null).
 * - Full-bleed edge-to-edge layout when active banners exist.
 */
export const BannerSection: React.FC<BannerSectionProps> = ({
  autoRotateInterval = 7000,
  className = '',
}) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const nextPreloadRef = useRef<HTMLImageElement | null>(null);

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
        console.error('Failed to load active banners from Supabase:', err);
        if (isMounted) {
          setBanners([]);
          setIsLoaded(true);
        }
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

  // Safe index bounds
  useEffect(() => {
    if (banners.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  // Preload next image to eliminate flicker during crossfade
  useEffect(() => {
    if (banners.length <= 1) return;
    const nextIdx = (currentIndex + 1) % banners.length;
    const nextUrl = banners[nextIdx]?.image_url;
    if (nextUrl) {
      const img = new Image();
      img.src = nextUrl;
      nextPreloadRef.current = img;
    }
  }, [currentIndex, banners]);

  // Auto-rotate crossfade
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoRotateInterval]);

  // If not yet loaded or no active banners exist in Supabase, render nothing at all
  if (!isLoaded || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex] || banners[0];
  if (!currentBanner) return null;

  return (
    <section
      id="hero_banner_section"
      aria-label="Framedia Creative Visual Showcase"
      className={`relative w-full w-screen max-w-none left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-[#1F1004] p-0 m-0 ${className}`}
    >
      {/* 1. LAYER: FULL-BLEED 16:9 BANNER CONTAINER */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#1F1004] p-0 m-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentBanner.id || currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full p-0 m-0"
          >
            <img
              src={currentBanner.image_url}
              alt={currentBanner.caption || 'Framedia Creative Banner'}
              className="w-full h-full object-cover object-top p-0 m-0"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        {/* 2. LAYER: GRADIENT OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-[#231206]/35 to-black/20 pointer-events-none z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none z-1" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1F1004] to-transparent pointer-events-none z-1" />

        {/* 3. LAYER: CONTENT CONTAINER WITH TEXT OVERLAY */}
        <div className="absolute inset-0 w-full h-full max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-start z-10 pointer-events-none">
          <div className="w-full sm:max-w-xl lg:max-w-2xl py-3 sm:py-6 pointer-events-auto">
            {/* Headline: Studio Name */}
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase leading-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] mb-1 sm:mb-2">
              Imaginiv
            </h1>

            {/* Subtitle: Narrative Craft */}
            <h2 className="text-xs sm:text-lg lg:text-2xl text-[#FFDE9E] font-display leading-snug mb-1.5 sm:mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Narrative Craft &amp; Tactile Visual Production
            </h2>

            {/* Description Paragraph in Warm Light Cream */}
            <p className="text-xs sm:text-sm lg:text-base text-[#FDF0DE] font-medium leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] max-w-xl line-clamp-2 sm:line-clamp-none">
              Welcome to our creative studio. Imaginiv is a multidisciplinary agency where narrative craft, tactile visual production, and forward-thinking media come together under one collaborative roof.
            </p>
          </div>
        </div>

        {/* 4. DISCREET CORNER DOTS INDICATOR (BOTTOM RIGHT) */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-6 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/15 pointer-events-none">
            {banners.map((_, dotIdx) => (
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
