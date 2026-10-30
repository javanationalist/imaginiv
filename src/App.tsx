/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MotionConfig, AnimatePresence } from 'motion/react';
import { ScrollToTop } from './components/common/ScrollToTop';
import { BackToTopButton } from './components/common/BackToTopButton';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { PageVisibilityProvider } from './context/PageVisibilityContext';
import { PageVisibilityGuard } from './components/common/PageVisibilityGuard';
import { PageTransition } from './components/common/PageTransition';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ProjectPage } from './pages/ProjectPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TenCreativePage } from './pages/TenCreativePage';
import { InfraTeamPage } from './pages/InfraTeamPage';
import { AiEthicsPage } from './pages/AiEthicsPage';
import { InclusivityPage } from './pages/InclusivityPage';
import { AboutPage } from './pages/AboutPage';
import { ArticleListPage } from './pages/ArticleListPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Animated route hierarchy wrapped with AnimatePresence in mode="wait".
 * Routes key on location.pathname to ensure consistent exit/enter sequencing.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Pages */}
        <Route
          path="/"
          element={
            <PageTransition key={location.pathname}>
              <LandingPage />
            </PageTransition>
          }
        />

        <Route
          path="/project"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="project" pageLabel="Project">
                <ProjectPage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />
        <Route
          path="/portfolio"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="portfolio" pageLabel="Portfolio">
                <PortfolioPage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />
        <Route
          path="/beingcreative"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="being-creative" pageLabel="Being Creative">
                <TenCreativePage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />
        <Route
          path="/10beingcreative"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="being-creative" pageLabel="Being Creative">
                <TenCreativePage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />
        <Route
          path="/theimaginers"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="infra-team" pageLabel="The Imaginers">
                <InfraTeamPage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />
        {/* Backward compatibility redirects */}
        <Route path="/infrateam" element={<Navigate to="/theimaginers" replace />} />
        <Route path="/infra" element={<Navigate to="/theimaginers" replace />} />
        <Route
          path="/aiethics"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="ai-ethics" pageLabel="AI Ethics">
                <AiEthicsPage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />
        <Route
          path="/inclusivity"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="inclusivity" pageLabel="Inclusivity">
                <InclusivityPage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="about" pageLabel="About Imaginiv">
                <AboutPage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />
        <Route
          path="/article"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="article" pageLabel="Article">
                <ArticleListPage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />
        <Route
          path="/article/:slug"
          element={
            <PageTransition key={location.pathname}>
              <PageVisibilityGuard pageId="article" pageLabel="Article">
                <ArticleDetailPage />
              </PageVisibilityGuard>
            </PageTransition>
          }
        />

        {/* Authentication Gateway */}
        <Route
          path="/login"
          element={
            <PageTransition key={location.pathname}>
              <LoginPage />
            </PageTransition>
          }
        />

        {/* Protected Admin CMS Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <PageTransition key={location.pathname}>
                <AdminDashboardPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* 404 System Error Page */}
        <Route
          path="*"
          element={
            <PageTransition key={location.pathname}>
              <NotFoundPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  // Purge any legacy demo banner or demo article caches from localStorage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('framedia_banners_list');
      window.localStorage.removeItem('framedia_articles_list');
    }
  } catch {
    // Ignore storage access restrictions in strict mobile browsing modes
  }

  // Dynamic basename resolution:
  // Derived from Vite's BASE_URL (configured via VITE_BASE_PATH in vite.config.ts).
  // For custom domain root (https://imaginiv.site/) and preview environments, BASE_URL is '/', so basename is undefined.
  const rawBase = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';
  const cleanBase = rawBase.replace(/\/$/, '');
  const basename = cleanBase && cleanBase !== '/' ? cleanBase : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <PageVisibilityProvider>
          <BrowserRouter basename={basename}>
            {/* Scroll position reset on every route transition */}
            <ScrollToTop />

            <AnimatedRoutes />

            {/* Global Back-To-Top Button rendered on all pages */}
            <BackToTopButton />
          </BrowserRouter>
        </PageVisibilityProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
