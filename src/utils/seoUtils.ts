/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArticleItem } from '../types';

export const DEFAULT_SITE_TITLE = 'Imaginiv';
export const DEFAULT_SITE_DESCRIPTION =
  'Imaginiv is a creative media agency with tactile, handcrafted UI, interactive directory hub, and modular CMS architecture.';
export const DEFAULT_FALLBACK_IMAGE =
  'https://yjrdbggomigcotijziqf.supabase.co/storage/v1/object/public/assets/icon.png';

/**
 * Extracts a clean plain-text snippet from Markdown content for description fallbacks.
 */
export const extractPlainSnippet = (markdown: string, maxLength: number = 155): string => {
  if (!markdown) return '';

  const clean = markdown
    // Remove HTML comments (like inline images metadata)
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove markdown images and inline figures
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[Gambar\s*\d+\]/gi, '')
    // Remove markdown links but keep text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Remove headings, bold, italic, blockquotes, code
    .replace(/[#*_`>~]/g, '')
    // Collapse multi-whitespace
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length <= maxLength) {
    return clean;
  }
  return clean.substring(0, maxLength).trimEnd() + '...';
};

/**
 * Sets or updates a <meta> tag in document.head
 */
export const setMetaTag = (
  attribute: 'name' | 'property',
  attrValue: string,
  content: string
): void => {
  if (typeof document === 'undefined') return;

  let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

/**
 * Removes a <meta> tag from document.head if present
 */
export const removeMetaTag = (attribute: 'name' | 'property', attrValue: string): void => {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
  if (el) {
    el.remove();
  }
};

/**
 * Sets or updates a <link> tag in document.head
 */
export const setLinkTag = (rel: string, href: string): void => {
  if (typeof document === 'undefined') return;

  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

/**
 * Injects or updates JSON-LD structured data in document.head
 */
export const setJsonLd = (id: string, data: Record<string, any>): void => {
  if (typeof document === 'undefined') return;

  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

/**
 * Removes JSON-LD structured data script from document.head
 */
export const removeJsonLd = (id: string): void => {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) {
    el.remove();
  }
};

/**
 * Dynamically updates all page metadata, Open Graph tags, Twitter Card tags,
 * canonical link, and Schema.org JSON-LD for an individual article.
 *
 * @param article The article item with title, excerpt, content, cover_image_url, author, etc.
 * @param canonicalUrl The full absolute URL of the article
 */
export const updateArticleSeoMetadata = (
  article: ArticleItem,
  canonicalUrl: string
): void => {
  if (typeof document === 'undefined') return;

  const title = article.title?.trim()
    ? `${article.title.trim()} – ${DEFAULT_SITE_TITLE}`
    : DEFAULT_SITE_TITLE;

  const rawDescription =
    article.excerpt?.trim() ||
    extractPlainSnippet(article.content || '') ||
    DEFAULT_SITE_DESCRIPTION;

  const description = rawDescription.replace(/\s+/g, ' ').trim();
  const imageUrl = article.cover_image_url?.trim() || DEFAULT_FALLBACK_IMAGE;
  const authorName = article.author?.trim() || 'Imaginiv Editorial';
  const publishedDate = article.published_at || article.created_at;
  const modifiedDate = article.updated_at || publishedDate;

  // 1. Standard HTML metadata
  document.title = title;
  setMetaTag('name', 'description', description);

  // 2. OpenGraph / Facebook / LinkedIn / WhatsApp Rich Link Preview
  setMetaTag('property', 'og:site_name', DEFAULT_SITE_TITLE);
  setMetaTag('property', 'og:type', 'article');
  setMetaTag('property', 'og:title', article.title.trim());
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:image:secure_url', imageUrl);
  setMetaTag('property', 'og:image:alt', article.title.trim());
  setMetaTag('property', 'og:url', canonicalUrl);

  if (publishedDate) {
    setMetaTag('property', 'article:published_time', new Date(publishedDate).toISOString());
  }
  if (modifiedDate) {
    setMetaTag('property', 'article:modified_time', new Date(modifiedDate).toISOString());
  }
  setMetaTag('property', 'article:author', authorName);

  // 3. Twitter / X Rich Card (Large Image when cover is present)
  setMetaTag('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
  setMetaTag('name', 'twitter:title', article.title.trim());
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', imageUrl);
  setMetaTag('name', 'twitter:image:alt', article.title.trim());

  // 4. Canonical URL
  setLinkTag('canonical', canonicalUrl);

  // 5. Schema.org Article / BlogPosting Structured Data
  const jsonLdData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: article.title.trim(),
    description: description,
    image: [imageUrl],
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_SITE_TITLE,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_FALLBACK_IMAGE,
      },
    },
  };

  if (publishedDate) {
    jsonLdData.datePublished = new Date(publishedDate).toISOString();
  }
  if (modifiedDate) {
    jsonLdData.dateModified = new Date(modifiedDate).toISOString();
  }

  setJsonLd('article-jsonld', jsonLdData);
};

/**
 * Resets document metadata back to the default site state.
 * Call this when unmounting the article detail page or navigating away.
 */
export const resetDefaultSeoMetadata = (): void => {
  if (typeof document === 'undefined') return;

  document.title = DEFAULT_SITE_TITLE;
  setMetaTag('name', 'description', DEFAULT_SITE_DESCRIPTION);

  setMetaTag('property', 'og:site_name', DEFAULT_SITE_TITLE);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:title', DEFAULT_SITE_TITLE);
  setMetaTag('property', 'og:description', DEFAULT_SITE_DESCRIPTION);
  setMetaTag('property', 'og:image', DEFAULT_FALLBACK_IMAGE);
  setMetaTag('property', 'og:image:secure_url', DEFAULT_FALLBACK_IMAGE);
  setMetaTag('property', 'og:image:alt', DEFAULT_SITE_TITLE);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  setMetaTag('property', 'og:url', origin || 'https://imaginiv.site');

  removeMetaTag('property', 'article:published_time');
  removeMetaTag('property', 'article:modified_time');
  removeMetaTag('property', 'article:author');

  setMetaTag('name', 'twitter:card', 'summary');
  setMetaTag('name', 'twitter:title', DEFAULT_SITE_TITLE);
  setMetaTag('name', 'twitter:description', DEFAULT_SITE_DESCRIPTION);
  setMetaTag('name', 'twitter:image', DEFAULT_FALLBACK_IMAGE);
  setMetaTag('name', 'twitter:image:alt', DEFAULT_SITE_TITLE);

  if (origin) {
    setLinkTag('canonical', origin);
  }

  removeJsonLd('article-jsonld');
};
