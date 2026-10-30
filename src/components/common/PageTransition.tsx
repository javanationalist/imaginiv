/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Page Transition Tuning Parameters:
 * - ENTER_DURATION: Duration of entrance animation in seconds (default: 0.28s)
 * - ENTER_Y: Initial vertical translation offset in pixels (default: 12px)
 * - EXIT_DURATION: Duration of exit animation in seconds (default: 0.18s)
 * - EXIT_Y: Exit vertical translation offset in pixels (default: -8px)
 * - ENTER_EASE: Custom cubic-bezier easing curve (default: [0.22, 1, 0.36, 1])
 * - EXIT_EASE: Easing curve for exit animation (default: 'easeIn')
 */
export const ENTER_DURATION = 0.28;
export const ENTER_Y = 12;
export const EXIT_DURATION = 0.18;
export const EXIT_Y = -8;
export const ENTER_EASE = [0.22, 1, 0.36, 1] as const;
export const EXIT_EASE = 'easeIn' as const;

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : ENTER_Y,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ENTER_DURATION,
        ease: ENTER_EASE,
      },
      transitionEnd: {
        // Clear transform when animation completes so fixed headers and full-height layouts retain viewport containing block
        transform: 'none',
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : EXIT_Y,
      transition: {
        duration: EXIT_DURATION,
        ease: EXIT_EASE,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full flex-1 flex flex-col min-h-0 overflow-x-clip ${className}`}
    >
      {children}
    </motion.div>
  );
};
