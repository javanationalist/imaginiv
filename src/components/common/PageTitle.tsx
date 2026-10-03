/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';

export interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  categoryTag?: string;
  accentColor?: 'orange' | 'green' | 'blue' | 'primary';
  hidePlank?: boolean;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
}) => {
  return (
    <div className="w-full">
      {/* Breadcrumb & Back to Village Map Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-bold text-[#381E0A] bg-[#FFF8EC]/90 backdrop-blur-xs px-3 sm:px-4 py-1.5 rounded-xl border-2 border-[#D6BC90] shadow-xs">
          <Link
            to="/"
            className="hover:text-[#2F8FE0] transition-colors inline-flex items-center gap-1.5 touch-target font-display"
          >
            <span>Creative Village</span>
          </Link>
          <span className="text-[#381E0A]/40 font-bold">/</span>
          <span className="font-display text-[#381E0A] text-base">{title}</span>
        </nav>

        <Link
          to="/"
          className="game-btn-wood !py-1.5 !px-3.5 !min-h-[38px] text-xs sm:text-sm inline-flex items-center justify-center shadow-[0_3px_0_#2A1202]"
        >
          <span>Back to Village Map</span>
        </Link>
      </div>
    </div>
  );
};

PageTitle.displayName = 'PageTitle';
