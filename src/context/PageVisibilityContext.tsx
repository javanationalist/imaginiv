/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PageVisibilityRecord } from '../types';
import { pagesService, DEFAULT_PAGES_VISIBILITY } from '../services/pagesService';

interface PageVisibilityContextType {
  pages: PageVisibilityRecord[];
  loading: boolean;
  isPageVisible: (pageIdOrRoute: string) => boolean;
  updateVisibility: (pageId: string, isVisible: boolean) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const PageVisibilityContext = createContext<PageVisibilityContextType | undefined>(undefined);

export const PageVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<PageVisibilityRecord[]>(DEFAULT_PAGES_VISIBILITY);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVisibility = useCallback(async () => {
    try {
      const data = await pagesService.getPagesVisibility();
      setPages(data);
    } catch (err) {
      console.error('Failed to load page visibility state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchVisibility();

    // Realtime subscription (Supabase Postgres Changes + window storage events)
    const unsubscribe = pagesService.subscribeToPagesChanges((updatedPages) => {
      setPages(updatedPages);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [fetchVisibility]);

  const isPageVisible = useCallback((pageIdOrRoute: string): boolean => {
    const clean = pageIdOrRoute.toLowerCase().trim().replace(/^\//, '');

    // Normalize route aliases
    let targetId = clean;
    if (clean === 'beingcreative' || clean === '10beingcreative' || clean === 'being-creative') {
      targetId = 'being-creative';
    } else if (clean === 'infrateam' || clean === 'infra-team') {
      targetId = 'infra-team';
    } else if (clean === 'aiethics' || clean === 'ai-ethics') {
      targetId = 'ai-ethics';
    }

    const found = pages.find(p => p.id === targetId || p.route?.replace(/^\//, '') === clean);
    return found ? found.is_visible : true;
  }, [pages]);

  const updateVisibility = useCallback(async (pageId: string, isVisible: boolean): Promise<boolean> => {
    // Optimistic state update in context
    setPages(prev => prev.map(p => (p.id === pageId ? { ...p, is_visible: isVisible } : p)));
    return await pagesService.updatePageVisibility(pageId, isVisible);
  }, []);

  return (
    <PageVisibilityContext.Provider
      value={{
        pages,
        loading,
        isPageVisible,
        updateVisibility,
        refresh: fetchVisibility,
      }}
    >
      {children}
    </PageVisibilityContext.Provider>
  );
};

export const usePageVisibility = (): PageVisibilityContextType => {
  const context = useContext(PageVisibilityContext);
  if (!context) {
    throw new Error('usePageVisibility must be used within a PageVisibilityProvider');
  }
  return context;
};
