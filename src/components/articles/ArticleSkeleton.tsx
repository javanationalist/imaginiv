/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * ArticleDetailSkeleton
 * Comprehensive responsive skeleton for the single article reading page.
 * Includes title, metadata, author, date, featured hero image, paragraphs,
 * section headings, and content blocks with smooth pulse/shimmer animation.
 */
export const ArticleDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto w-full animate-pulse" aria-busy="true" aria-label="Loading article manuscript">
      {/* Top Back Navigation Bar Skeleton */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 pb-4 sm:pb-6 border-b-2 border-[#D6BC90] mb-6 sm:mb-8 w-full">
        <div className="h-8 w-28 sm:w-32 bg-[#DFC79F]/80 rounded-xl" />
        <div className="h-8 w-20 sm:w-24 bg-[#DFC79F]/80 rounded-xl" />
      </div>

      {/* Main Manuscript */}
      <article className="space-y-8">
        {/* Title & Metadata Area */}
        <div className="space-y-4 mb-6">
          {/* Article Title */}
          <div className="space-y-2.5">
            <div className="h-8 sm:h-12 w-11/12 bg-[#DFC79F] rounded-xl" />
            <div className="h-8 sm:h-12 w-3/5 bg-[#DFC79F] rounded-xl" />
          </div>

          {/* Author & Date Metadata Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#D6BC90]/60">
            {/* Author Avatar + Name */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#DFC79F]/90" />
              <div className="h-4 w-28 bg-[#DFC79F]/80 rounded-md" />
            </div>

            <div className="w-1.5 h-1.5 rounded-full bg-[#D6BC90]" />

            {/* Date */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#DFC79F]/70" />
              <div className="h-4 w-32 bg-[#DFC79F]/80 rounded-md" />
            </div>
          </div>
        </div>

        {/* Lead Excerpt Banner Skeleton */}
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FFF8EC] to-[#FCEECC] border-2 border-[#D6BC90] space-y-2.5 shadow-inner">
          <div className="h-4 sm:h-5 w-full bg-[#DEC9A3]/80 rounded-md" />
          <div className="h-4 sm:h-5 w-4/5 bg-[#DEC9A3]/80 rounded-md" />
        </div>

        {/* Hero Featured Image Skeleton */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-[#542E10] shadow-[0_8px_0_#2B1302,0_16px_32px_rgba(0,0,0,0.15)] bg-gradient-to-r from-[#DEC9A3] via-[#EADBBD] to-[#DEC9A3] h-56 sm:h-80 md:h-[420px] w-full flex items-center justify-center relative">
          <div className="w-16 h-16 rounded-2xl bg-[#CBB084]/40 border-2 border-[#CBB084]/60 flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#CBB084]/60" />
          </div>
        </div>

        {/* Rendered Markdown Content Blocks */}
        <div className="p-4 sm:p-8 rounded-2xl bg-white/70 border border-[#D6BC90] space-y-8">
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="h-6 sm:h-7 w-64 bg-[#DFC79F] rounded-lg mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-[#E2CBA3]/70 rounded-md" />
              <div className="h-4 w-full bg-[#E2CBA3]/70 rounded-md" />
              <div className="h-4 w-11/12 bg-[#E2CBA3]/70 rounded-md" />
              <div className="h-4 w-4/5 bg-[#E2CBA3]/70 rounded-md" />
            </div>
          </div>

          {/* Callout Quote Box Skeleton */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#F7EBD3] border-l-4 border-[#A8642E] space-y-2">
            <div className="h-4 w-11/12 bg-[#DEC9A3]/80 rounded-md" />
            <div className="h-4 w-3/4 bg-[#DEC9A3]/80 rounded-md" />
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="h-6 sm:h-7 w-52 bg-[#DFC79F] rounded-lg mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-[#E2CBA3]/70 rounded-md" />
              <div className="h-4 w-11/12 bg-[#E2CBA3]/70 rounded-md" />
              <div className="h-4 w-5/6 bg-[#E2CBA3]/70 rounded-md" />
            </div>
          </div>

          {/* Section 3 Paragraphs */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#E2CBA3]/70 rounded-md" />
            <div className="h-4 w-full bg-[#E2CBA3]/70 rounded-md" />
            <div className="h-4 w-2/3 bg-[#E2CBA3]/70 rounded-md" />
          </div>
        </div>

        {/* Footer Return CTA Skeleton */}
        <div className="mt-12 pt-6 border-t-2 border-[#D6BC90] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-4 w-44 bg-[#DFC79F]/70 rounded-md" />
          <div className="h-10 w-44 bg-[#2F8FE0]/40 rounded-xl" />
        </div>
      </article>
    </div>
  );
};

/**
 * ArticleListSkeleton
 * Responsive skeleton grid for the main articles directory page.
 */
export const ArticleListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      aria-busy="true"
      aria-label="Loading articles list"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-[#FAF2DF] rounded-2xl border-2 border-[#D6BC90] overflow-hidden shadow-xs flex flex-col h-full animate-pulse"
        >
          {/* Featured Image Placeholder */}
          <div className="h-44 w-full bg-gradient-to-r from-[#DEC9A3] via-[#EADBBD] to-[#DEC9A3] border-b-2 border-[#D6BC90] relative" />

          {/* Card Content Skeleton */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Date & Author Metadata */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-[#DFC79F]/80 rounded-md" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#D6BC90]" />
                <div className="h-4 w-16 bg-[#DFC79F]/60 rounded-md" />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <div className="h-5 w-4/5 bg-[#DFC79F] rounded-md" />
                <div className="h-5 w-3/5 bg-[#DFC79F] rounded-md" />
              </div>

              {/* Paragraph / Excerpt */}
              <div className="space-y-1.5 pt-1">
                <div className="h-3.5 w-full bg-[#E2CBA3]/70 rounded-md" />
                <div className="h-3.5 w-11/12 bg-[#E2CBA3]/70 rounded-md" />
                <div className="h-3.5 w-3/4 bg-[#E2CBA3]/70 rounded-md" />
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="pt-3 border-t border-[#D6BC90]/50 flex items-center justify-between">
              <div className="h-4 w-20 bg-[#DFC79F]/70 rounded-md" />
              <div className="h-8 w-24 bg-[#D2B687]/80 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * ArticleAdminRowSkeleton
 * Responsive skeleton for the admin article manager list.
 */
export const ArticleAdminRowSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="space-y-3 w-full animate-pulse" aria-busy="true" aria-label="Loading articles archive">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-[#FFFBF2] border-2 border-[#D6BC90] flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-[#DEC9A3] shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-4 w-2/5 bg-[#DFC79F] rounded-md" />
              <div className="h-3 w-1/3 bg-[#E2CBA3]/70 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-6 w-16 bg-[#DFC79F]/60 rounded-full" />
            <div className="h-8 w-16 bg-[#DFC79F]/80 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
