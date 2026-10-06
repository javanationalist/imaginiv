/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export interface ArticleShellProps {
  children: React.ReactNode;
  className?: string;
}

export const ArticleShell: React.FC<ArticleShellProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#FAF5EC] text-[#381E0A] relative">
      {/* 1. Global Unified Wood Navbar (Fixed at top of screen) */}
      <Header />

      {/* 2. Full-Screen Article Content Area (occupies all available space below fixed header, scrolls vertically) */}
      <main className="flex-1 w-full mt-14 sm:mt-16 overflow-y-auto overflow-x-hidden min-w-0 flex flex-col justify-between">
        <div className={`w-full flex-1 ${className}`}>
          {children}
        </div>

        {/* 3. Global Unified Wood Footer attached to bottom of scrollable article content */}
        <Footer />
      </main>
    </div>
  );
};
