/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { PageVisibilityRecord } from '../types';

export const DEFAULT_PAGES_VISIBILITY: PageVisibilityRecord[] = [
  {
    id: 'project',
    label: 'Project',
    is_visible: true,
    route: '/project',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    is_visible: true,
    route: '/portfolio',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'being-creative',
    label: 'Being Creative',
    is_visible: true,
    route: '/beingcreative',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'infra-team',
    label: 'The Imaginers',
    is_visible: true,
    route: '/infrateam',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ai-ethics',
    label: 'AI Ethics',
    is_visible: true,
    route: '/aiethics',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inclusivity',
    label: 'Inclusivity',
    is_visible: true,
    route: '/inclusivity',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'about',
    label: 'About Imaginiv',
    is_visible: true,
    route: '/about',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'article',
    label: 'Article',
    is_visible: true,
    route: '/article',
    updated_at: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'framedia_pages_visibility';
const EVENT_NAME = 'framedia_pages_visibility_changed';

const ROUTE_MAP: Record<string, string> = {
  'project': '/project',
  'portfolio': '/portfolio',
  'being-creative': '/beingcreative',
  'beingcreative': '/beingcreative',
  'infra-team': '/infrateam',
  'infrateam': '/infrateam',
  'ai-ethics': '/aiethics',
  'aiethics': '/aiethics',
  'inclusivity': '/inclusivity',
  'about': '/about',
  'article': '/article',
};

const getLocalCache = (): PageVisibilityRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PageVisibilityRecord[];
      // Merge with defaults to ensure all 7 keys exist
      return DEFAULT_PAGES_VISIBILITY.map(def => {
        const found = parsed.find(p => p.id === def.id);
        return found ? { ...def, ...found, route: def.route } : def;
      });
    }
  } catch (_) {}
  return DEFAULT_PAGES_VISIBILITY;
};

const setLocalCache = (pages: PageVisibilityRecord[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pages));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: pages }));
  } catch (_) {}
};

export const pagesService = {
  /**
   * Fetch visibility state for all 7 main pages.
   * Pulls from Supabase PostgreSQL if configured, otherwise uses local cache.
   */
  async getPagesVisibility(): Promise<PageVisibilityRecord[]> {
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        const { data, error } = await client
          .from('pages')
          .select('id, label, is_visible, updated_at')
          .order('id');

        if (!error && data && data.length > 0) {
          const merged: PageVisibilityRecord[] = DEFAULT_PAGES_VISIBILITY.map(def => {
            const row = data.find((r: { id: string }) => r.id === def.id);
            if (row) {
              return {
                id: row.id,
                label: row.label || def.label,
                is_visible: Boolean(row.is_visible),
                updated_at: row.updated_at,
                route: ROUTE_MAP[row.id] || def.route,
              };
            }
            return def;
          });

          setLocalCache(merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to cached state:', err);
      }
    }

    return getLocalCache();
  },

  /**
   * Update visibility for a specific page.
   * Saves to Supabase and broadcasts optimistic update.
   */
  async updatePageVisibility(pageId: string, isVisible: boolean): Promise<boolean> {
    const current = getLocalCache();
    const updated = current.map(p =>
      p.id === pageId
        ? { ...p, is_visible: isVisible, updated_at: new Date().toISOString() }
        : p
    );

    // Optimistic cache update immediately
    setLocalCache(updated);

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        const { error } = await client
          .from('pages')
          .update({
            is_visible: isVisible,
            updated_at: new Date().toISOString(),
          })
          .eq('id', pageId);

        if (error) {
          console.error('Failed to update page visibility in Supabase:', error.message);
          return false;
        }
        return true;
      } catch (err) {
        console.error('Error contacting Supabase:', err);
        return false;
      }
    }

    return true;
  },

  /**
   * Subscribe to real-time changes across browser tabs or other active users.
   */
  subscribeToPagesChanges(callback: (pages: PageVisibilityRecord[]) => void): () => void {
    // 1. Listen to local custom event & localStorage storage events
    const localHandler = (e: Event) => {
      const custom = e as CustomEvent<PageVisibilityRecord[]>;
      if (custom.detail) {
        callback(custom.detail);
      } else {
        callback(getLocalCache());
      }
    };

    window.addEventListener(EVENT_NAME, localHandler);
    window.addEventListener('storage', localHandler);

    // 2. Listen to Supabase Realtime channel if active
    let supabaseChannel: ReturnType<NonNullable<ReturnType<typeof getSupabaseClient>>['channel']> | null = null;
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        supabaseChannel = client
          .channel('public:pages')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'pages' },
            async () => {
              const fresh = await this.getPagesVisibility();
              callback(fresh);
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime subscription unavailable:', err);
      }
    }

    return () => {
      window.removeEventListener(EVENT_NAME, localHandler);
      window.removeEventListener('storage', localHandler);
      if (supabaseChannel && client) {
        client.removeChannel(supabaseChannel);
      }
    };
  },
};
