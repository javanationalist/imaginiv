/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Moon, ArrowLeft } from 'lucide-react';
import { PageShell } from '../components/common/PageShell';

export interface PageUnavailablePageProps {
  pageTitle?: string;
}

export const PageUnavailablePage: React.FC<PageUnavailablePageProps> = ({
  pageTitle = 'Village Sector Resting'
}) => {
  return (
    <PageShell>
      <div className="max-w-xl mx-auto py-8 sm:py-14 text-center">
        {/* Animated Village Resting Emblem */}
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-[#FFE082] via-[#FFA000] to-[#E65100] border-3 border-[#5D2B03] shadow-[0_6px_0_#3E1B02,inset_0_2px_0_rgba(255,255,255,0.7)] flex items-center justify-center mx-auto">
            <Moon className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-[0_2px_0_#7F2A00]" />
          </div>
          <div className="absolute -top-1 -right-1 p-1.5 bg-[#4A2408] text-amber-300 rounded-full border-2 border-white shadow-sm">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
        </div>

        {/* Title */}
        <div className="game-wood-pill inline-block px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3">
          Notice &bull; Village Gate
        </div>

        <h1 className="font-display text-2xl sm:text-4xl text-[#381E0A] mb-3">
          {pageTitle} is Currently Resting
        </h1>

        <p className="text-sm sm:text-base text-[#5C3210] font-semibold leading-relaxed mb-8 max-w-md mx-auto">
          This creative sector has been temporarily paused for maintenance and curation by studio administrators. All other active sectors remain open and welcoming.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/#directory"
            className="game-btn-blue text-sm sm:text-base font-display !py-3 !px-6 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Compass className="w-5 h-5 text-white" />
            <span>Return to Village Directory</span>
          </Link>
          <Link
            to="/"
            className="game-btn-wood text-sm sm:text-base font-display !py-3 !px-6 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span>Village Homepage</span>
          </Link>
        </div>
      </div>
    </PageShell>
  );
};
