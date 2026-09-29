/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility functions for generating dynamic, deployment-independent application and article URLs.
 */

/**
 * Returns the current application base path without a trailing slash.
 * Examples:
 * - On GitHub Pages (https://javanationalist.github.io/imaginiv/article/slug) -> "/imaginiv"
 * - On Custom Domain (https://imaginiv.site/article/slug) -> ""
 * - On Root / Preview (https://ais-dev-...run.app/article/slug) -> ""
 */
export const getAppBasePath = (): string => {
  if (typeof window === 'undefined') return '';

  const pathname = window.location.pathname;

  // 1. Check if current pathname starts with /imaginiv (subdirectory deployment)
  if (pathname.startsWith('/imaginiv')) {
    return '/imaginiv';
  }

  // 2. Check Vite's configured BASE_URL if present
  const rawBase = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';
  const viteBase = rawBase.replace(/\/$/, '');
  if (viteBase && viteBase !== '/' && pathname.startsWith(viteBase)) {
    return viteBase;
  }

  // 3. Fallback: inspect pathname segments before '/article' or other route paths
  const segments = pathname.split('/').filter(Boolean);
  const articleIndex = segments.indexOf('article');
  if (articleIndex > 0) {
    return '/' + segments.slice(0, articleIndex).join('/');
  }

  return '';
};

/**
 * Generates an absolute, deployment-independent share URL for an article.
 * Dynamically uses the current browser origin and application base path without hardcoding any domain or subdirectory.
 *
 * Examples:
 * - GitHub Pages: https://javanationalist.github.io/imaginiv/article/contoh-artikel
 * - Custom Domain: https://imaginiv.site/article/contoh-artikel
 *
 * @param slug The article slug (e.g. "contoh-artikel")
 * @returns Absolute URL string suitable for copying to clipboard or sharing
 */
export const getArticleShareUrl = (slug: string): string => {
  if (!slug) return typeof window !== 'undefined' ? window.location.href : '';

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const basePath = getAppBasePath();
  const cleanSlug = encodeURIComponent(slug.trim());

  // Join basePath and route ensuring clean single slashes
  const path = `${basePath}/article/${cleanSlug}`.replace(/\/+/g, '/');

  return `${origin}${path}`;
};
