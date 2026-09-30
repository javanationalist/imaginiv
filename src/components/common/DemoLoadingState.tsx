/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const DemoLoadingState: React.FC = () => {
  return (
    <div className="w-full space-y-6 select-none py-2">
      {/* Central Status Indicator */}
      <div className="game-parchment-inner p-6 sm:p-8 rounded-2xl border-2 border-[#D1B88F] shadow-[0_4px_12px_rgba(50,20,5,0.08)] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Decorative corner nails */}
        <div className="absolute top-2.5 left-2.5 game-nail !w-2.5 !h-2.5" />
        <div className="absolute top-2.5 right-2.5 game-nail !w-2.5 !h-2.5" />
        <div className="absolute bottom-2.5 left-2.5 game-nail !w-2.5 !h-2.5" />
        <div className="absolute bottom-2.5 right-2.5 game-nail !w-2.5 !h-2.5" />

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C471E] to-[#4A2408] border-2 border-[#381E0A] shadow-[0_4px_0_#2B1302] flex items-center justify-center mb-3">
          <Loader2 className="w-6 h-6 text-[#FFD54F] animate-spin" strokeWidth={2.5} />
        </div>

        <h3 className="font-display text-lg sm:text-xl text-[#381E0A] font-bold tracking-wide mb-1">
          Curating Atelier Content...
        </h3>
        <p className="text-xs sm:text-sm text-[#7C471E] font-medium max-w-md">
          This sector is being prepared for upcoming publication by Imaginiv.
        </p>
      </div>

      {/* Skeleton Cards Loader Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="game-parchment-inner p-5 sm:p-6 rounded-2xl border-2 border-[#D1B88F] shadow-[0_4px_12px_rgba(50,20,5,0.06)] animate-pulse space-y-4 relative"
          >
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 bg-[#E2CBA3]/70 rounded-lg" />
              <div className="h-4 w-12 bg-[#E2CBA3]/50 rounded-md" />
            </div>

            {/* Banner skeleton */}
            <div className="w-full h-36 sm:h-40 rounded-xl bg-gradient-to-r from-[#DFC79F]/60 via-[#E8D4B1]/80 to-[#DFC79F]/60 border-2 border-[#CBB084]" />

            {/* Text line skeletons */}
            <div className="space-y-2 pt-1">
              <div className="h-4 w-3/4 bg-[#E2CBA3]/70 rounded-md" />
              <div className="h-3.5 w-full bg-[#E2CBA3]/50 rounded-md" />
              <div className="h-3.5 w-5/6 bg-[#E2CBA3]/50 rounded-md" />
            </div>

            {/* Footer skeleton */}
            <div className="pt-4 border-t border-[#DFCCAA] flex items-center justify-between">
              <div className="h-4 w-20 bg-[#E2CBA3]/60 rounded-md" />
              <div className="h-8 w-24 bg-[#D2B687]/80 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
