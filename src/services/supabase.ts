/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('your-project')
  );
};

/**
 * Returns only the non-sensitive Supabase project hostname (e.g., "xyz.supabase.co")
 * for safe diagnostic logging across desktop and mobile.
 */
export const getSupabaseProjectHost = (): string => {
  if (!supabaseUrl) return 'unconfigured';
  try {
    return new URL(supabaseUrl).host;
  } catch {
    return 'invalid-url';
  }
};

let useMemoryFallback = false;
const memoryStorage = new Map<string, string>();

const safeAuthStorage = {
  getItem(key: string): string | null {
    if (!useMemoryFallback) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      } catch {
        useMemoryFallback = true;
      }
    }
    return memoryStorage.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    memoryStorage.set(key, value);
    if (!useMemoryFallback) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
        useMemoryFallback = true;
      } catch {
        useMemoryFallback = true;
      }
    }
  },
  removeItem(key: string): void {
    memoryStorage.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      useMemoryFallback = true;
    }
  },
};

let clientInstance: SupabaseClient | null = null;
let visibilityListenerRegistered = false;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: safeAuthStorage,
      },
    });

    // Mobile browsers suspend background timers; restart auto-refresh when tab becomes visible
    if (typeof document !== 'undefined' && !visibilityListenerRegistered) {
      visibilityListenerRegistered = true;
      document.addEventListener('visibilitychange', () => {
        if (!clientInstance) return;
        if (document.visibilityState === 'visible') {
          clientInstance.auth.startAutoRefresh();
        } else {
          clientInstance.auth.stopAutoRefresh();
        }
      });
    }
  }

  return clientInstance;
};

export const supabase = getSupabaseClient();
