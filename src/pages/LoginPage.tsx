/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { KeyRound, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { ForestBackdrop } from '../components/common/VillageArtwork';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  // Check for active session (handles post-OAuth redirect & persistent login)
  useEffect(() => {
    let isMounted = true;

    // Check for error parameters returned from OAuth provider
    const params = new URLSearchParams(location.search);
    const oauthError = params.get('error_description') || params.get('error');
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
    }

    // Verify current or freshly received session
    const checkSession = async () => {
      const user = await authService.getSession();
      if (isMounted && user) {
        navigate(from, { replace: true });
      }
    };

    checkSession();

    // Subscribe to auth state updates (e.g. Supabase parsing OAuth hash/code)
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (isMounted && user) {
        navigate(from, { replace: true });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigate, from, location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await authService.login(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      // Redirect back to login completion target (dashboard or referrer)
      const redirectUrl = `${window.location.origin}${from}`;
      const res = await authService.loginWithGoogle(redirectUrl);

      if (res.error) {
        setError(res.error);
        setGoogleLoading(false);
      }
      // If successful, Supabase initiates browser redirect to Google OAuth consent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Google OAuth.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden px-4 py-12">
      {/* Cartoon Forest Living Background */}
      <ForestBackdrop />

      {/* Return to Village Link */}
      <div className="mb-6 relative z-10">
        <Link
          to="/"
          className="game-btn-wood text-xs sm:text-sm !py-2 !px-4 inline-flex items-center justify-center"
        >
          <span>Return to Village Map</span>
        </Link>
      </div>

      {/* Main Login Card in Game Wood Frame */}
      <div className="w-full max-w-md game-wood-frame p-4 sm:p-6 relative z-10">
        <div className="absolute top-2.5 left-2.5 game-nail !w-3 !h-3" />
        <div className="absolute top-2.5 right-2.5 game-nail !w-3 !h-3" />
        <div className="absolute bottom-2.5 left-2.5 game-nail !w-3 !h-3" />
        <div className="absolute bottom-2.5 right-2.5 game-nail !w-3 !h-3" />

        {/* Top Plaque Header */}
        <div className="game-wood-plank -mt-7 sm:-mt-9 mx-auto max-w-xs py-2 px-4 text-center shadow-[0_4px_0_#2B1302]">
          <h1
            className="font-display text-xl sm:text-2xl uppercase tracking-wider text-white border-none outline-none"
            style={{
              WebkitTextStroke: '0px transparent',
              textShadow: 'none',
              outline: 'none',
              borderStyle: 'none',
            }}
          >
            Stop. Who R U?
          </h1>
        </div>

        {/* Parchment Body */}
        <div className="game-parchment p-6 sm:p-7 rounded-2xl mt-4">
          <div className="text-center mb-5">
            <h2 className="font-display text-2xl font-bold text-[#381E0A]">
              Login
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#381E0A] mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@imaginiv.site"
                  className="w-full bg-[#FFFDF7] text-[#381E0A] placeholder-[#8C6B4E] text-sm font-bold pl-9 pr-3 py-2 rounded-xl border-2 border-[#542E10] focus:outline-none focus:ring-2 focus:ring-[#2F8FE0]"
                  required
                />
                <Mail className="w-4 h-4 text-[#8C6B4E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#381E0A] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFFDF7] text-[#381E0A] placeholder-[#8C6B4E] text-sm font-bold pl-9 pr-3 py-2 rounded-xl border-2 border-[#542E10] focus:outline-none focus:ring-2 focus:ring-[#2F8FE0]"
                  required
                />
                <KeyRound className="w-4 h-4 text-[#8C6B4E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="game-btn-blue w-full !py-2.5 text-sm font-display justify-center mt-2 cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Divider: "or" */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#D6BC90]/70" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-[#F7EBD3] px-3 font-bold text-[#8C6B4E] tracking-wider rounded-full">
                or
              </span>
            </div>
          </div>

          {/* Continue with Google Button (Deactivated / Disabled) */}
          <button
            type="button"
            id="google-login-btn"
            disabled={true}
            aria-disabled="true"
            title="Google login is currently disabled"
            className="w-full py-2.5 px-4 rounded-xl font-display text-sm bg-[#EFE7D8] text-[#8C6B4E]/60 border-2 border-[#D6BC90]/70 opacity-60 cursor-not-allowed flex items-center justify-center gap-3 select-none shadow-none"
          >
            <svg className="w-5 h-5 shrink-0 grayscale opacity-50" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="font-sans font-bold text-sm text-[#8C6B4E]">
              Continue with Google (Disabled)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
