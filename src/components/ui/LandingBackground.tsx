/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BannerItem } from '../../types';
import { bannersService } from '../../services/bannersService';
import { ForestBackdrop } from '../common/VillageArtwork';

export interface LandingBackgroundProps {
  autoRotateInterval?: number; // default 7000ms (7 seconds)
  className?: string;
}

export const LandingBackground: React.FC<LandingBackgroundProps> = ({
  autoRotateInterval = 7000,
  className = '',
}) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const nextPreloadRef = useRef<HTMLImageElement | null>(null);

  // Load active banners from service & subscribe to live updates
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
        console.error('Failed to load active backgrounds:', err);
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

  // Ensure index stays in range
  useEffect(() => {
    if (banners.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  // Preload next image to eliminate transition flicker
  useEffect(() => {
    if (banners.length <= 1) return;
    const nextIndex = (currentIndex + 1) % banners.length;
    const nextUrl = banners[nextIndex]?.image_url;
    if (nextUrl) {
      const img = new Image();
      img.src = nextUrl;
      nextPreloadRef.current = img;
    }
  }, [currentIndex, banners]);

  // Auto-rotate background slideshow with smooth crossfade
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoRotateInterval]);

  // 1. FALLBACK STATE: If no active backgrounds exist, render original Forest Backdrop SVG
  if (isLoaded && banners.length === 0) {
    return <ForestBackdrop />;
  }

  // Current active background banner
  const currentBanner = banners[currentIndex];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none bg-[#1A0E04] ${className}`}
    >
      {/* Background Slideshow with Smooth Crossfade */}
      <AnimatePresence mode="sync">
        {currentBanner && (
          <motion.div
            key={currentBanner.id || currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentBanner.image_url}
              alt=""
              className="w-full h-full object-cover object-center scale-[1.02] filter transition-transform duration-10000"
              style={{
                // Prevent layout shift and ensure full coverage
                minWidth: '100%',
                minHeight: '100%',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 2: Protective Overlay Gradient & Warm Tint
          Ensures that front wood panels, parchment, typography, buttons, and navbar 
          have superior contrast, vibrancy, and readability regardless of the photo uploaded. */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-[#231206]/40 to-black/65 pointer-events-none" 
      />

      {/* Subtle vignette border around edges */}
      <div 
        className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.65)] pointer-events-none" 
      />
    </div>
  );
};
