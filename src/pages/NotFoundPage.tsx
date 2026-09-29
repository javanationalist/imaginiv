/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, MapPinOff } from 'lucide-react';
import { ForestBackdrop } from '../components/common/VillageArtwork';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-x-hidden px-4 py-12">
      <ForestBackdrop />

      <div className="w-full max-w-lg game-wood-frame p-4 sm:p-6 relative z-10 text-center">
        <div className="absolute top-2.5 left-2.5 game-nail !w-3 !h-3" />
        <div className="absolute top-2.5 right-2.5 game-nail !w-3 !h-3" />
        <div className="absolute bottom-2.5 left-2.5 game-nail !w-3 !h-3" />
        <div className="absolute bottom-2.5 right-2.5 game-nail !w-3 !h-3" />

        {/* Top Plaque Header */}
        <div className="game-wood-plank -mt-7 sm:-mt-9 mx-auto max-w-xs py-2 px-4 text-center shadow-[0_4px_0_#2B1302]">
          <h1 className="game-text-title text-xl sm:text-2xl uppercase tracking-wider">
            Lost in Forest
          </h1>
        </div>

        {/* Parchment Body */}
        <div className="game-parchment p-8 sm:p-10 rounded-2xl mt-4">
          <div className="w-18 h-18 mx-auto rounded-2xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border-2 border-[#5D2B03] flex items-center justify-center text-[#8B5226] mb-4 shadow-[0_3px_0_#3E1B02]">
            <MapPinOff className="w-9 h-9" strokeWidth={2.3} />
          </div>

          <div className="game-text-stroke text-5xl sm:text-6xl font-bold mb-2">
            404
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-[#381E0A] mb-2">
            Off the Village Trail
          </h2>

          <p className="text-sm sm:text-base text-[#5C3210] font-semibold leading-relaxed max-w-sm mx-auto mb-6">
            The sector you are looking for does not exist or has been relocated to another path in our creative village.
          </p>

          <Link
            to="/"
            id="return-home-404-btn"
            className="game-btn-blue text-sm sm:text-base font-display inline-flex items-center gap-2 px-6 py-3 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span>Return to Village Map</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
