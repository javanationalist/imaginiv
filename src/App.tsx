/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { PageVisibilityProvider } from './context/PageVisibilityContext';
import { PageVisibilityGuard } from './components/common/PageVisibilityGuard';

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

export default function App() {
  // Purge any legacy demo banner or demo article caches from localStorage
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem('framedia_banners_list');
    localStorage.removeItem('framedia_articles_list');
  }

  // Dynamic basename resolution:
  // Derived from Vite's BASE_URL (configured via VITE_BASE_PATH in vite.config.ts).
  // For custom domain root (https://imaginiv.site/) and preview environments, BASE_URL is '/', so basename is undefined.
  const rawBase = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';
  const cleanBase = rawBase.replace(/\/$/, '');
  const basename = cleanBase && cleanBase !== '/' ? cleanBase : undefined;

  return (
    <ThemeProvider>
      <PageVisibilityProvider>
        <BrowserRouter basename={basename}>
          {/* Scroll position reset on every route transition */}
          <ScrollToTop />

          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            
            <Route
              path="/project"
              element={
                <PageVisibilityGuard pageId="project" pageLabel="Project">
                  <ProjectPage />
                </PageVisibilityGuard>
              }
            />
            <Route
              path="/portfolio"
              element={
                <PageVisibilityGuard pageId="portfolio" pageLabel="Portfolio">
                  <PortfolioPage />
                </PageVisibilityGuard>
              }
            />
            <Route
              path="/beingcreative"
              element={
                <PageVisibilityGuard pageId="being-creative" pageLabel="Being Creative">
                  <TenCreativePage />
                </PageVisibilityGuard>
              }
            />
            <Route
              path="/10beingcreative"
              element={
                <PageVisibilityGuard pageId="being-creative" pageLabel="Being Creative">
                  <TenCreativePage />
                </PageVisibilityGuard>
              }
            />
            <Route
              path="/infrateam"
              element={
                <PageVisibilityGuard pageId="infra-team" pageLabel="inFra Team">
                  <InfraTeamPage />
                </PageVisibilityGuard>
              }
            />
            <Route
              path="/aiethics"
              element={
                <PageVisibilityGuard pageId="ai-ethics" pageLabel="AI Ethics">
                  <AiEthicsPage />
                </PageVisibilityGuard>
              }
            />
            <Route
              path="/inclusivity"
              element={
                <PageVisibilityGuard pageId="inclusivity" pageLabel="Inclusivity">
                  <InclusivityPage />
                </PageVisibilityGuard>
              }
            />
            <Route
              path="/about"
              element={
                <PageVisibilityGuard pageId="about" pageLabel="About Framedia">
                  <AboutPage />
                </PageVisibilityGuard>
              }
            />
            <Route
              path="/article"
              element={
                <PageVisibilityGuard pageId="article" pageLabel="Article">
                  <ArticleListPage />
                </PageVisibilityGuard>
              }
            />
            <Route
              path="/article/:slug"
              element={
                <PageVisibilityGuard pageId="article" pageLabel="Article">
                  <ArticleDetailPage />
                </PageVisibilityGuard>
              }
            />

            {/* Authentication Gateway */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin CMS Dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 System Error Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </PageVisibilityProvider>
    </ThemeProvider>
  );
}
