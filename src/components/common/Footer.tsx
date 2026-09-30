/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { soundManager } from '../../services/soundService';
import { BRAND_ASSETS } from '../../utils/brand';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="w-full mt-20 relative select-none">
      {/* Cartoon Grass Tufts at Footer Top */}
      <div className="w-full h-4 overflow-hidden flex items-end -mb-0.5 pointer-events-none">
        <div className="w-full flex justify-between">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="w-6 h-3.5 bg-[#8FD14F] rounded-t-full border-t-2 border-l-2 border-[#2B1B12]" />
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#9C6538] via-[#7E4A20] to-[#522C10] border-t-[4px] border-[#2B1B12] py-12 px-4 sm:px-6 lg:px-8 text-white relative shadow-[inset_0_4px_0_rgba(255,255,255,0.25)]">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center text-center">
          {/* Centered Brand Logo */}
          <Link
            to="/"
            onClick={() => soundManager.playClick()}
            className="inline-flex items-center justify-center group min-h-[44px] transition-transform hover:scale-105"
          >
            <img
              src={BRAND_ASSETS.logoUrl}
              alt="Imaginiv"
              className="object-contain max-w-full"
              style={{ width: '498.725px', height: '80px' }}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};
