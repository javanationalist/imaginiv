/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures clean scroll restoration:
 * - When navigating to a page without a hash, resets scroll to (0, 0).
 * - When navigating to an anchor hash (like #directory) from any page or on refresh,
 *   waits deterministically for the target element to mount before scrolling with header offset.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Prevent browser native jump from fighting with smooth app navigation
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // EXPLICIT EXCLUSION:
    // When navigating to /#directory, LandingPage has full deterministic control
    // over banner image loading, layout stabilization, and scroll placement.
    // Do NOT execute any generic scroll-to-top or competing scrollTo calls here.
    if (hash === '#directory' || hash === 'directory') {
      return;
    }

    if (!hash) {
      // Normal route transition without hash: reset to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
      return;
    }

    // Anchor hash is present (e.g. #directory)
    const targetId = hash.replace('#', '');
    let cancelled = false;
    let frameId: number;
    let attempts = 0;
    const maxAttempts = 60; // Up to ~1s across 60fps frames

    const scrollToTarget = () => {
      if (cancelled) return;
      const element = document.getElementById(targetId);
      if (element) {
        const headerEl = document.getElementById('header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 64;
        const targetY = Math.max(0, window.pageYOffset + element.getBoundingClientRect().top - headerHeight - 16);

        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });
        return;
      }

      if (attempts < maxAttempts) {
        attempts++;
        frameId = requestAnimationFrame(scrollToTarget);
      }
    };

    frameId = requestAnimationFrame(scrollToTarget);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [pathname, hash]);

  return null;
}
