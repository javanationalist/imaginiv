/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePageVisibility } from '../../context/PageVisibilityContext';
import { PageUnavailablePage } from '../../pages/PageUnavailablePage';
import { PageShell } from './PageShell';

export interface PageVisibilityGuardProps {
  pageId: string;
  pageLabel: string;
  children: React.ReactNode;
}

export const PageVisibilityGuard: React.FC<PageVisibilityGuardProps> = ({
  pageId,
  pageLabel,
  children,
}) => {
  const { isPageVisible, loading } = usePageVisibility();

  // If loading initial database state, render lightweight parchment skeleton
  if (loading) {
    return (
      <PageShell>
        <div className="py-16 text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 bg-[#DEC9A3] rounded-2xl mx-auto" />
          <div className="h-6 w-48 bg-[#DEC9A3] rounded-lg mx-auto" />
          <div className="h-4 w-72 bg-[#DEC9A3] rounded-lg mx-auto" />
        </div>
      </PageShell>
    );
  }

  // If disabled by administrator, render the friendly Page Unavailable screen
  if (!isPageVisible(pageId)) {
    return <PageUnavailablePage pageTitle={pageLabel} />;
  }

  return <>{children}</>;
};
