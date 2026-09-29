/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';

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
  subtitle,
  icon,
  categoryTag = 'Village Sector',
  hidePlank = false,
}) => {
  return (
    <div className={`w-full ${hidePlank ? 'mb-4' : 'mb-8 sm:mb-10'}`}>
      {/* Breadcrumb & Back to Village Map Action */}
      <div className={`flex flex-wrap items-center justify-between gap-3 ${hidePlank ? 'mb-0' : 'mb-4'}`}>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-bold text-[#381E0A]">
          <Link
            to="/"
            className="hover:text-[#2F8FE0] transition-colors inline-flex items-center gap-1.5 touch-target font-display"
          >
            <Compass className="w-4 h-4 text-[#8B5226]" />
            <span>Creative Village</span>
          </Link>
          <span className="text-[#381E0A]/40 font-bold">/</span>
          <span className="font-display text-[#381E0A] text-base">{title}</span>
        </nav>

        <Link
          to="/"
          className="game-btn-wood !py-1.5 !px-3.5 !min-h-[38px] text-xs sm:text-sm inline-flex items-center gap-2 shadow-[0_3px_0_#2A1202]"
        >
          <ArrowLeft className="w-4 h-4 text-white" strokeWidth={2.5} />
          <span>Back to Village Map</span>
        </Link>
      </div>

      {/* Uniform Page Header Wooden Plank Banner */}
      {!hidePlank && (
        <div className="game-wood-plank p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
          {/* Corner Nails */}
          <div className="absolute top-2 left-2 game-nail" />
          <div className="absolute top-2 right-2 game-nail" />
          <div className="absolute bottom-2 left-2 game-nail" />
          <div className="absolute bottom-2 right-2 game-nail" />

          <div className="flex items-start sm:items-center gap-4 sm:gap-5 relative z-10">
            {icon && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border-3 border-[#4A2306] flex items-center justify-center shrink-0 shadow-[0_4px_0_#321503,inset_0_2px_0_rgba(255,255,255,0.8)]">
                {icon}
              </div>
            )}
            <div>
              <div className="game-ribbon-gold mb-2">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#8A5205]" />
                <span>{categoryTag}</span>
              </div>
              <h1 className="game-text-title text-3xl sm:text-4xl md:text-5xl tracking-wide leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm sm:text-base font-semibold text-[#FFF3D6] max-w-3xl leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
