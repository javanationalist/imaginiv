/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArticleItem } from '../types';
import { parseArticleContent } from './articleImageUtils';

/**
 * Strips inline image placeholders, serialized image HTML comments, and Markdown
 * formatting so article cards always render clean, human-readable editorial summaries.
 */
function stripEditorialMarkup(raw: string): string {
  if (!raw) return '';

  // 1. Parse out <!-- imaginiv:images ... --> metadata blocks and normalize placeholders
  const { bodyText } = parseArticleContent(raw);

  return bodyText
    // Remove [Gambar 01] / [image01] inline image placeholders
    .replace(/\[\s*(?:gambar|image)\s*\d+\s*\]/gi, ' ')
    // Remove markdown image tags ![alt](url)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // Convert markdown links [label](url) -> label
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Strip markdown headings, blockquotes, horizontal rules, and list bullets
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*_]{3,}\s*$/gm, ' ')
    .replace(/^\s*[-*+]\s+/gm, '')
    // Strip inline emphasis and code backticks
    .replace(/(\*\*|__|~~|`)/g, '')
    .replace(/(^|\s)[*_]([^*_]+)[*_](?=\s|$|[.,!?;:])/g, '$1$2')
    // Collapse all line breaks and consecutive spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncates text cleanly on a word boundary without cutting words mid-syllable.
 */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  const cutoff = lastSpace > Math.floor(maxLength * 0.65) ? sliced.slice(0, lastSpace) : sliced;
  return `${cutoff.replace(/[.,;:!?\-—–]+$/, '').trim()}…`;
}

/**
 * Returns a clean plain-text excerpt for an article, preferring `article.excerpt`
 * when populated and falling back to sanitized `article.content`.
 */
export function extractArticlePlainExcerpt(
  article: Pick<ArticleItem, 'excerpt' | 'content'>,
  maxLength: number = 185
): string {
  const explicitExcerpt = article.excerpt ? stripEditorialMarkup(article.excerpt) : '';
  if (explicitExcerpt) {
    return truncateAtWordBoundary(explicitExcerpt, maxLength);
  }

  const derivedFromContent = stripEditorialMarkup(article.content || '');
  if (!derivedFromContent) {
    return '';
  }

  return truncateAtWordBoundary(derivedFromContent, maxLength);
}

/**
 * Formats an ISO publication timestamp into a crisp editorial date (e.g., "Oct 25, 2026").
 * Returns null if no valid date is available so callers never display "Invalid Date".
 */
export function formatArticleDate(isoString?: string | null): string | null {
  if (!isoString) return null;
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) return null;

  try {
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}
