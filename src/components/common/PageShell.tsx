/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ForestBackdrop } from './VillageArtwork';

export interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export const PageShell: React.FC<PageShellProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden pt-14 sm:pt-16">
      {/* 1. Living Cartoon Forest Environment */}
      <ForestBackdrop />

      {/* 2. Global Unified Wood Navbar */}
      <Header />

      {/* 3. Main Page Container: Grand Wood Pop-Up Frame with Parchment Paper */}
      <main className={`flex-1 w-full max-w-[1240px] mx-auto px-3 sm:px-6 py-6 sm:py-10 relative z-10 ${className}`}>
        <div className="game-wood-frame p-3 sm:p-5 lg:p-6 relative">
          {/* Corner Nails on Main Board */}
          <div className="absolute top-3 left-3 game-nail !w-3.5 !h-3.5" />
          <div className="absolute top-3 right-3 game-nail !w-3.5 !h-3.5" />
          <div className="absolute bottom-3 left-3 game-nail !w-3.5 !h-3.5" />
          <div className="absolute bottom-3 right-3 game-nail !w-3.5 !h-3.5" />

          {/* Parchment Paper Container holding the page content */}
          <div className="game-parchment p-5 sm:p-8 lg:p-10 rounded-2xl relative">
            {children}
          </div>
        </div>
      </main>

      {/* 4. Global Unified Wood Footer */}
      <Footer />
    </div>
  );
};
