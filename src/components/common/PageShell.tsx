/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ForestBackdrop } from './VillageArtwork';
import { PageTitle } from './PageTitle';

export interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  parchmentClassName?: string;
  parchmentStyle?: React.CSSProperties;
  topBar?: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ 
  children, 
  className = '',
  parchmentClassName = '',
  parchmentStyle,
  topBar,
}) => {
  // If topBar is not explicitly provided, automatically check if the first child is PageTitle
  // so the breadcrumb navigasi is always placed ABOVE the content shape (game-wood-frame)
  let renderedTopBar = topBar;
  let mainChildren = children;

  if (!renderedTopBar) {
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length > 0 && React.isValidElement(childrenArray[0])) {
      const firstChild = childrenArray[0] as React.ReactElement;
      if (
        firstChild.type === PageTitle ||
        (firstChild.type as any)?.displayName === 'PageTitle' ||
        (firstChild.type as any)?.name === 'PageTitle'
      ) {
        renderedTopBar = firstChild;
        mainChildren = childrenArray.slice(1);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden pt-14 sm:pt-16">
      {/* 1. Living Cartoon Forest Environment */}
      <ForestBackdrop />

      {/* 2. Global Unified Wood Navbar */}
      <Header />

      {/* 3. Main Page Container: Full available viewport without restrictive outer wooden frame */}
      <main className={`flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10 ${className}`}>
        {/* Navigation / Breadcrumb Bar moved ABOVE the content */}
        {renderedTopBar && (
          <div className="mb-3 sm:mb-4 w-full">
            {renderedTopBar}
          </div>
        )}

        {/* Parchment Paper Container holding the page content without outer wooden frame */}
        <div 
          className={`game-parchment p-5 sm:p-8 lg:p-10 rounded-2xl relative shadow-md ${parchmentClassName}`}
          style={parchmentStyle}
        >
          {mainChildren}
        </div>
      </main>

      {/* 4. Global Unified Wood Footer */}
      <Footer />
    </div>
  );
};
