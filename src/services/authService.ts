/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { VillageUser } from '../types';
import { getAppBasePath } from '../utils/urlUtils';

const MOCK_AUTH_STORAGE_KEY = 'framedia_village_admin_session';

export interface AuthResponse {
  user: VillageUser | null;
  error: string | null;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (
          error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid credentials')
        ) {
          return { user: null, error: 'Email or password incorrect' };
        }
        return { user: null, error: error.message };
      }

      if (data.user) {
        const user: VillageUser = {
          id: data.user.id,
          email: data.user.email || email,
          role: 'admin',
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || email.split('@')[0] || 'Village Administrator',
        };
        localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(user));
        window.dispatchEvent(new Event('framedia_auth_changed'));
        return { user, error: null };
      }
    }

    // Fallback development authentication when Supabase credentials are pending in UI
    if (email.trim() === 'admin@framedia.creative' && password === 'village2026') {
      const mockUser: VillageUser = {
        id: 'usr_village_admin_demo',
        email: 'admin@framedia.creative',
        role: 'admin',
        name: 'Village Overseer',
      };
      localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      window.dispatchEvent(new Event('framedia_auth_changed'));
      return { user: mockUser, error: null };
    }

    // Generic development friendly credential matching for quick review
    if (email.includes('@') && password.length >= 6) {
      const mockUser: VillageUser = {
        id: 'usr_village_admin_' + Date.now(),
        email: email.trim(),
        role: 'admin',
        name: email.split('@')[0],
      };
      localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      window.dispatchEvent(new Event('framedia_auth_changed'));
      return { user: mockUser, error: null };
    }

    return {
      user: null,
      error: 'Email or password incorrect',
    };
  },

  /**
   * Google OAuth login via Supabase Auth (Deactivated)
   */
  async loginWithGoogle(_redirectTo?: string): Promise<{ error: string | null; url?: string | null }> {
    return {
      error: 'Google login is currently disabled.',
    };
  },

  /**
   * Asynchronously retrieves the active session, checking Supabase first,
   * then falling back to cached local storage.
   */
  async getSession(): Promise<VillageUser | null> {
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        const { data: { session }, error } = await client.auth.getSession();
        if (session?.user && !error) {
          const user: VillageUser = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Village Administrator',
          };
          localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(user));
          return user;
        }
      } catch (err) {
        console.warn('Error verifying Supabase session:', err);
      }
    }

    return this.getCurrentUser();
  },

  async logout(): Promise<void> {
    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event('framedia_auth_changed'));
  },

  getCurrentUser(): VillageUser | null {
    const stored = localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as VillageUser;
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return Boolean(this.getCurrentUser());
  },

  onAuthStateChange(callback: (user: VillageUser | null) => void): () => void {
    const handler = () => {
      callback(this.getCurrentUser());
    };

    window.addEventListener('framedia_auth_changed', handler);
    window.addEventListener('storage', handler);

    const client = getSupabaseClient();
    let supabaseUnsubscribe: (() => void) | null = null;

    if (isSupabaseConfigured() && client) {
      const { data } = client.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const user: VillageUser = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Village Administrator',
          };
          localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(user));
          callback(user);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
          callback(null);
        } else if (!this.getCurrentUser()) {
          callback(null);
        }
      });
      supabaseUnsubscribe = () => data.subscription.unsubscribe();
    }

    return () => {
      window.removeEventListener('framedia_auth_changed', handler);
      window.removeEventListener('storage', handler);
      if (supabaseUnsubscribe) supabaseUnsubscribe();
    };
  },
};
