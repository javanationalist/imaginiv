/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Hammer, Clock } from 'lucide-react';

export interface EmptyContentPlaceholderProps {
  pageName: string;
  description?: string;
}

export const EmptyContentPlaceholder: React.FC<EmptyContentPlaceholderProps> = ({
  pageName,
  description = 'This village sector is reserved for future production stages. Architecture and database connections are primed.',
}) => {
  return (
    <div className="parchment-surface p-8 sm:p-16 rounded-3xl text-center flex flex-col items-center justify-center my-6">
      {/* Tactile Workshop Plank Symbol */}
      <div className="w-20 h-20 rounded-2xl bg-[#593016] border-3 border-[#E9C39B] shadow-inner flex items-center justify-center text-[#FEEBD0] mb-5">
        <Hammer className="w-9 h-9" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DBC6] border border-[#BFA586] text-xs font-semibold text-[#543019] mb-3">
        <Clock className="w-3.5 h-3.5 text-[#91542A]" />
        <span>Foundation Phase Ready</span>
      </div>

      <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2011] mb-2">
        {pageName} Space
      </h3>

      <p className="max-w-md text-sm sm:text-base text-[#6E4F38] leading-relaxed mb-6">
        {description}
      </p>

      {/* Subtle empty content slot container */}
      <div className="w-full max-w-lg p-6 rounded-2xl bg-[#EDE1CD] border-2 border-dashed border-[#C5AF93] text-xs text-[#8A6A52] font-mono">
        [ Content area reserved for Supabase CMS integration & production release ]
      </div>
    </div>
  );
};
