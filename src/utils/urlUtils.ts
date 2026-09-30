/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility functions for generating dynamic, deployment-independent application and article URLs.
 */

/**
 * Returns the current application base path without a trailing slash.
 * Derived dynamically from Vite's BASE_URL configuration.
 * For root deployments (such as custom domains and root preview environments), returns empty string "".
 * For subdirectory deployments configured via VITE_BASE_PATH, returns the configured path without trailing slash.
 */
export const getAppBasePath = (): string => {
  const rawBase = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';
  const cleanBase = rawBase.replace(/\/$/, '');
  if (cleanBase && cleanBase !== '/') {
    return cleanBase;
  }
  return '';
};

/**
 * Generates an absolute, deployment-independent share URL for an article.
 * Dynamically uses the current browser origin and application base path without hardcoding any domain or subdirectory.
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
