/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { User } from '@supabase/supabase-js';
import { getSupabaseClient, getSupabaseProjectHost, isSupabaseConfigured } from './supabase';
import { VillageUser } from '../types';

const MOCK_AUTH_STORAGE_KEY = 'framedia_village_admin_session';

export interface AuthResponse {
  user: VillageUser | null;
  error: string | null;
}

export interface VerifiedSessionResult {
  ok: boolean;
  user: VillageUser | null;
  authRole: string;
  expiresAt: number | null;
  wasRefreshed: boolean;
  error: string | null;
}

interface SafeJwtClaims {
  role?: string;
  sub?: string;
  email?: string;
  exp?: number;
  iss?: string;
}

function parseSafeJwtClaims(accessToken: string | undefined | null): SafeJwtClaims | null {
  if (!accessToken) return null;
  try {
    const parts = accessToken.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const parsed = JSON.parse(atob(padded)) as Record<string, unknown>;
    return {
      role: typeof parsed.role === 'string' ? parsed.role : undefined,
      sub: typeof parsed.sub === 'string' ? parsed.sub : undefined,
      email: typeof parsed.email === 'string' ? parsed.email : undefined,
      exp: typeof parsed.exp === 'number' ? parsed.exp : undefined,
      iss: typeof parsed.iss === 'string' ? parsed.iss : undefined,
    };
  } catch {
    return null;
  }
}

function mapSupabaseUser(sbUser: User, fallbackEmail: string = ''): VillageUser {
  const resolvedEmail = sbUser.email || fallbackEmail;
  return {
    id: sbUser.id,
    email: resolvedEmail,
    role: 'admin',
    name:
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.name ||
      resolvedEmail.split('@')[0] ||
      'Village Administrator',
  };
}

function setCachedUser(user: VillageUser): void {
  try {
    localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors in restricted mobile browsing contexts
  }
}

function clearCachedUser(notify: boolean = false): void {
  let hadValue = false;
  try {
    hadValue = localStorage.getItem(MOCK_AUTH_STORAGE_KEY) !== null;
    localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
  if (notify && hadValue && typeof window !== 'undefined') {
    window.dispatchEvent(new Event('framedia_auth_changed'));
  }
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const normalizedEmail = email.trim().toLowerCase();
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      const { data, error } = await client.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        console.warn('[SupabaseDiag:AuthLogin] Login rejected:', {
          projectHost: getSupabaseProjectHost(),
          email: normalizedEmail,
          status: error.status ?? null,
          message: error.message,
        });
        if (
          error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid credentials')
        ) {
          return { user: null, error: 'Email or password incorrect' };
        }
        return { user: null, error: error.message };
      }

      if (data.user && data.session?.access_token) {
        const user = mapSupabaseUser(data.user, normalizedEmail);
        const claims = parseSafeJwtClaims(data.session.access_token);
        console.info('[SupabaseDiag:AuthLogin] Authenticated session established:', {
          projectHost: getSupabaseProjectHost(),
          userId: user.id,
          userEmail: user.email,
          jwtRole: claims?.role ?? data.user.role ?? 'authenticated',
          expiresAt: data.session.expires_at ?? null,
        });
        setCachedUser(user);
        window.dispatchEvent(new Event('framedia_auth_changed'));
        return { user, error: null };
      }

      clearCachedUser(true);
      return {
        user: null,
        error: 'Authentication did not return an active Supabase session. Please try logging in again.',
      };
    }

    // Fallback development authentication ONLY when Supabase is NOT configured
    if ((normalizedEmail === 'admin@imaginiv.site' || normalizedEmail === 'admin@framedia.creative') && password === 'village2026') {
      const mockUser: VillageUser = {
        id: 'usr_village_admin_demo',
        email: 'admin@imaginiv.site',
        role: 'admin',
        name: 'Village Overseer',
      };
      setCachedUser(mockUser);
      window.dispatchEvent(new Event('framedia_auth_changed'));
      return { user: mockUser, error: null };
    }

    if (normalizedEmail.includes('@') && password.length >= 6) {
      const mockUser: VillageUser = {
        id: 'usr_village_admin_' + Date.now(),
        email: normalizedEmail,
        role: 'admin',
        name: normalizedEmail.split('@')[0],
      };
      setCachedUser(mockUser);
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
   * Verifies that an active, non-expired Supabase JWT session is initialized and ready
   * before executing RLS-protected database or storage writes.
   * Automatically refreshes tokens that are expired or expiring within 60 seconds.
   */
  async ensureAuthenticatedSession(context: string = 'admin_operation'): Promise<VerifiedSessionResult> {
    const client = getSupabaseClient();
    const projectHost = getSupabaseProjectHost();

    if (!isSupabaseConfigured() || !client) {
      return {
        ok: false,
        user: null,
        authRole: 'unconfigured',
        expiresAt: null,
        wasRefreshed: false,
        error: 'Supabase client is not configured. Please check your Supabase environment variables.',
      };
    }

    let wasRefreshed = false;
    let refreshErrorMsg: string | null = null;

    try {
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      let activeSession = sessionData?.session ?? null;

      const nowSec = Math.floor(Date.now() / 1000);
      const isExpiringOrExpired =
        Boolean(activeSession) &&
        typeof activeSession?.expires_at === 'number' &&
        activeSession.expires_at <= nowSec + 60;

      if (activeSession && (!activeSession.access_token || isExpiringOrExpired)) {
        const { data: refreshed, error: refreshError } = await client.auth.refreshSession();
        wasRefreshed = true;
        if (refreshError) {
          refreshErrorMsg = refreshError.message;
          activeSession = null;
        } else {
          activeSession = refreshed.session ?? null;
        }
      }

      const claims = parseSafeJwtClaims(activeSession?.access_token);
      const resolvedRole = claims?.role || activeSession?.user?.role || 'anon';

      console.info('[SupabaseDiag:AuthCheck]', {
        context,
        projectHost,
        isMobileViewport: typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
        visibilityState: typeof document !== 'undefined' ? document.visibilityState : 'unknown',
        online: typeof navigator !== 'undefined' ? navigator.onLine : true,
        hasSession: Boolean(activeSession?.access_token && activeSession?.user),
        jwtRole: resolvedRole,
        jwtIssuer: claims?.iss ?? null,
        userId: activeSession?.user?.id ?? null,
        userEmail: activeSession?.user?.email ?? null,
        expiresInSec:
          typeof activeSession?.expires_at === 'number' ? activeSession.expires_at - nowSec : null,
        wasRefreshed,
        sessionError: sessionError?.message ?? refreshErrorMsg ?? null,
      });

      if (!activeSession?.user || !activeSession?.access_token || resolvedRole !== 'authenticated') {
        clearCachedUser(true);
        return {
          ok: false,
          user: null,
          authRole: resolvedRole,
          expiresAt: null,
          wasRefreshed,
          error:
            'Sesi login admin di perangkat ini telah berakhir atau belum terautentikasi ke Supabase. Silakan login kembali lalu simpan ulang.',
        };
      }

      const verifiedUser = mapSupabaseUser(activeSession.user);
      setCachedUser(verifiedUser);

      return {
        ok: true,
        user: verifiedUser,
        authRole: resolvedRole,
        expiresAt: activeSession.expires_at ?? null,
        wasRefreshed,
        error: null,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to verify Supabase session';
      console.error('[SupabaseDiag:AuthCheck] Exception verifying session:', {
        context,
        projectHost,
        message: msg,
      });
      return {
        ok: false,
        user: null,
        authRole: 'error',
        expiresAt: null,
        wasRefreshed,
        error: `Gagal memverifikasi sesi autentikasi: ${msg}`,
      };
    }
  },

  /**
   * Asynchronously retrieves the active session.
   * When Supabase is configured, Supabase Auth is the sole source of truth
   * (never falls back to stale localStorage mock cache when Supabase session is null).
   */
  async getSession(): Promise<VillageUser | null> {
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        const { data: { session }, error } = await client.auth.getSession();
        let activeSession = session;

        const nowSec = Math.floor(Date.now() / 1000);
        if (
          activeSession &&
          typeof activeSession.expires_at === 'number' &&
          activeSession.expires_at <= nowSec + 60
        ) {
          const { data: refreshed, error: refreshErr } = await client.auth.refreshSession();
          activeSession = refreshErr ? null : refreshed.session;
        }

        if (activeSession?.user && activeSession.access_token && !error) {
          const user = mapSupabaseUser(activeSession.user);
          setCachedUser(user);
          return user;
        }

        // Purge any stale local cache so mobile/desktop never renders a zombie admin state
        clearCachedUser(true);
        return null;
      } catch (err) {
        console.warn('Error verifying Supabase session:', err);
        clearCachedUser(true);
        return null;
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
    clearCachedUser(false);
    window.dispatchEvent(new Event('framedia_auth_changed'));
  },

  getCurrentUser(): VillageUser | null {
    try {
      const stored = localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as VillageUser;
      }
    } catch {
      return null;
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
        if (session?.user && session.access_token) {
          const user = mapSupabaseUser(session.user);
          setCachedUser(user);
          callback(user);
        } else if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION' || !session) {
          clearCachedUser(false);
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
