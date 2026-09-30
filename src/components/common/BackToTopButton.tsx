/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTopButton
 * Global floating wooden back-to-top button with smooth scroll behavior,
 * visible on all pages when the user scrolls down past 350px.
 */
export const BackToTopButton: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };

    // Initial check on mount or route transition
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {showBackToTop && (
        <motion.button
          id="back_to_top_button"
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-6 right-6 z-50 game-wood-circle-btn !w-14 !h-14 text-white shadow-[0_6px_0_#2B1302,0_12px_24px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          <ArrowUp className="w-7 h-7 text-white drop-shadow-[0_2px_0_#2B1302]" strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
