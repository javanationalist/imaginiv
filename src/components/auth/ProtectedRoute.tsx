/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { isSupabaseConfigured } from '../../services/supabase';
import { LoadingState } from '../common/LoadingState';

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    // When Supabase is configured, always verify and initialize the real Supabase JWT session
    // before rendering admin screens to avoid stale localStorage cache or uninitialized token races.
    if (!isSupabaseConfigured() && authService.isAuthenticated()) {
      setIsAuthenticated(true);
    } else {
      authService.getSession().then((user) => {
        if (isMounted) {
          setIsAuthenticated(Boolean(user));
        }
      });
    }

    // Subscribe to ongoing auth state updates
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (isMounted) {
        setIsAuthenticated(Boolean(user));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EDE3CE]">
        <LoadingState message="Verifying village credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
