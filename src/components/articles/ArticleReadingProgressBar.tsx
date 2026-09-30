/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface ArticleReadingProgressBarProps {
  /** Target element selector to track (e.g. '#article-manuscript' or 'article') */
  targetSelector?: string;
}

/**
 * ArticleReadingProgressBar
 * A prominent, stylized reading progress bar pinned directly beneath the wooden header.
 * Uses the theme's vibrant Smurf blue (#2F8FE0) and lush foliage green (#52BE1A)
 * with a high-contrast dark wood track and floating percentage indicator for crystal-clear
 * visibility across mobile, tablet, and desktop devices.
 */
export const ArticleReadingProgressBar: React.FC<ArticleReadingProgressBarProps> = ({
  targetSelector = '#article-manuscript',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const articleEl = document.querySelector(targetSelector) as HTMLElement | null;
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const windowHeight = window.innerHeight;

      if (articleEl) {
        const rect = articleEl.getBoundingClientRect();
        const articleDocTop = scrollTop + rect.top;
        const articleHeight = rect.height;

        // Start tracking when top of article is near header (offset ~70px)
        const startPoint = Math.max(0, articleDocTop - 80);
        // End tracking when the end of article is in view
        const endPoint = Math.max(startPoint + 1, articleDocTop + articleHeight - windowHeight * 0.6);
        const scrollDistance = endPoint - startPoint;

        if (scrollTop < startPoint) {
          setProgress(0);
        } else if (scrollTop >= endPoint) {
          setProgress(100);
        } else {
          const current = scrollTop - startPoint;
          const pct = Math.min(100, Math.max(0, (current / scrollDistance) * 100));
          setProgress(Math.round(pct));
        }
      } else {
        // Fallback: document scroll
        const docHeight = document.documentElement.scrollHeight - windowHeight;
        if (docHeight > 0) {
          const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
          setProgress(Math.round(pct));
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Immediate check
    updateProgress();

    // Check again after fonts & images load
    const timer = setTimeout(updateProgress, 350);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetSelector]);

  return (
    <div
      role="progressbar"
      aria-label="Article reading progress"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-14 sm:top-16 left-0 right-0 z-[60] w-full pointer-events-none select-none"
    >
      {/* Wooden Track Frame - High contrast, clearly visible on all backgrounds */}
      <div className="relative w-full h-2.5 sm:h-3 bg-[#1C0D03] border-b border-[#3D1E08] shadow-[0_3px_8px_rgba(0,0,0,0.6)]">
        {/* Animated Progress Fill Bar */}
        <div
          className="h-full bg-gradient-to-r from-[#2F8FE0] via-[#02C39A] to-[#52BE1A] transition-[width] duration-150 ease-out relative shadow-[0_0_10px_rgba(82,190,26,0.8),0_0_6px_rgba(47,143,224,0.8)]"
          style={{ width: `${progress}%` }}
        >
          {/* Glossy top shine highlight for tactile 3D look */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/35 rounded-t-full" />

          {/* Glowing cursor bead at head of progress */}
          {progress > 0 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-[#52BE1A] shadow-[0_0_10px_#52BE1A,0_0_4px_#2F8FE0]" />
          )}
        </div>
      </div>

      {/* Floating Reading Percentage Badge (Visible when user is actively reading) */}
      <div
        className={`absolute right-3 sm:right-6 top-4 sm:top-4.5 transition-all duration-200 pointer-events-none ${
          progress > 0
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-1 scale-95'
        }`}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2A1303]/95 border-2 border-[#8C5226] text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              progress >= 100 ? 'bg-[#52BE1A]' : 'bg-[#2F8FE0] animate-pulse'
            }`}
          />
          <span className="font-display text-[10px] sm:text-xs font-bold tracking-wide">
            {progress >= 100 ? 'Completed' : `${progress}% Read`}
          </span>
        </div>
      </div>
    </div>
  );
};
