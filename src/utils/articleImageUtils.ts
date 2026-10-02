/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ArticleInlineImageData {
  id: string; // e.g. "image01", "image02"
  placeholder: string; // e.g. "[Gambar 01]", "[Gambar 02]"
  image_url: string; // e.g. "https://example.com/image.png"
  image_title?: string; // e.g. "Proses produksi karya kreatif"
  storage_path?: string; // e.g. "Steal Like an Artist/Gambar 01.png"
  url?: string; // backwards compatibility alias
  title?: string; // backwards compatibility alias
}

/**
 * Validates that an image URL is safe and has a valid protocol.
 * Prevents XSS like javascript: or arbitrary payload schemes.
 */
export function isSafeImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Must not contain javascript: or vbscript: or data: other than safe image mime types
  if (/^(javascript:|vbscript:|data:(?!image\/(png|jpe?g|gif|webp|svg\+xml);base64,))/i.test(trimmed)) {
    return false;
  }

  // Must start with http://, https://, /, or valid data:image/
  return /^(https?:\/\/|\/|data:image\/)/i.test(trimmed);
}

/**
 * Normalizes any placeholder variant (e.g. [image01], [gambar 1], [GAMBAR 01])
 * to the canonical format: [Gambar 01], [Gambar 02], etc.
 */
export function normalizePlaceholder(placeholderOrId: string): string {
  if (!placeholderOrId) return '[Gambar 01]';
  const match = placeholderOrId.match(/(?:gambar\s*|image\s*)(\d+)/i);
  if (match) {
    const num = parseInt(match[1], 10).toString().padStart(2, '0');
    return `[Gambar ${num}]`;
  }
  return placeholderOrId;
}

/**
 * Converts a placeholder or ID into a clean image ID (e.g. image01, image02).
 */
export function placeholderToId(placeholderOrId: string): string {
  if (!placeholderOrId) return 'image01';
  const match = placeholderOrId.match(/(?:gambar\s*|image\s*)(\d+)/i);
  if (match) {
    const num = parseInt(match[1], 10).toString().padStart(2, '0');
    return `image${num}`;
  }
  return placeholderOrId.toLowerCase().replace(/[^a-z0-9]/g, '') || 'image01';
}

/**
 * Sanitizes a path segment (article name or image inline title) so it is
 * safe for Supabase Storage while preserving natural, readable names and spaces.
 * Example: "Steal Like an Artist" -> "Steal Like an Artist"
 * Removes illegal characters: / \ : * ? " < > | and control characters.
 */
export function sanitizeStorageSegment(segment: string, fallback: string = 'Untitled'): string {
  if (!segment || typeof segment !== 'string') return fallback;

  let clean = segment
    // Replace illegal path characters with dash
    .replace(/[\/\\:\*\?"<>\|]/g, '-')
    // Strip control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Collapse consecutive whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Strip leading and trailing periods or dashes that can corrupt folder names
  clean = clean.replace(/^[\.\-]+|[\.\-]+$/g, '').trim();

  return clean || fallback;
}

/**
 * Automatically builds the Supabase Storage filename and path following the exact specification:
 * [Article Name]/[Image Inline Title].[Original Image Extension]
 *
 * Example:
 * article_name: "Steal Like an Artist"
 * image_inline_title: "Gambar 01"
 * original_extension: "png"
 * result_filename: "Steal Like an Artist/Gambar 01.png"
 *
 * Requirements enforced:
 * - Uses the actual article title as the first part.
 * - Uses the inline image title entered by the admin as the second part.
 * - Preserves the original image file extension (e.g. .jpg, .jpeg, .png, .webp).
 * - Sanitizes Article Name and Image Inline Title for storage safety.
 * - Does NOT use the user's original uploaded filename.
 * - Applies a safe unique suffix (e.g. " (2)") only if an image with the same path already exists.
 */
export function buildInlineImageStoragePath(
  articleName: string,
  imageInlineTitle: string,
  originalExtension: string,
  existingStoragePaths: (string | undefined | null)[] = []
): string {
  const cleanArticle = sanitizeStorageSegment(articleName, 'Article');
  const cleanTitle = sanitizeStorageSegment(imageInlineTitle, 'Gambar 01');
  const cleanExt = (originalExtension || 'png').replace(/^\./, '').toLowerCase().trim() || 'png';

  const basePath = `${cleanArticle}/${cleanTitle}.${cleanExt}`;

  // Filter existing paths to non-empty lowercased set
  const existingSet = new Set(
    existingStoragePaths
      .filter((p): p is string => Boolean(p && typeof p === 'string'))
      .map((p) => p.toLowerCase().trim())
  );

  if (!existingSet.has(basePath.toLowerCase())) {
    return basePath;
  }

  // If path already exists, append safe unique suffix: [Article Name]/[Image Inline Title] (2).[Original Image Extension]
  let counter = 2;
  while (existingSet.has(`${cleanArticle}/${cleanTitle} (${counter}).${cleanExt}`.toLowerCase())) {
    counter++;
  }

  return `${cleanArticle}/${cleanTitle} (${counter}).${cleanExt}`;
}

/**
 * Calculates the next sequential placeholder: [Gambar 01], [Gambar 02], etc.
 * Always uses two digits (01, 02, ...).
 */
export function getNextPlaceholder(
  content: string = '',
  existingImages: ArticleInlineImageData[] = []
): { id: string; placeholder: string; num: number } {
  const usedNumbers = new Set<number>();

  // Extract from existingImages
  existingImages.forEach((img) => {
    const match = (img.id || '').match(/(?:gambar\s*|image\s*)(\d+)/i) ||
                  (img.placeholder || '').match(/(?:gambar\s*|image\s*)(\d+)/i);
    if (match) {
      usedNumbers.add(parseInt(match[1], 10));
    }
  });

  // Extract from content text
  const regex = /\[(?:gambar\s*|image\s*)(\d+)\]/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content)) !== null) {
    usedNumbers.add(parseInt(m[1], 10));
  }

  // Find lowest available sequential number starting from 1
  let nextNum = 1;
  while (usedNumbers.has(nextNum)) {
    nextNum++;
  }

  const padded = nextNum.toString().padStart(2, '0');
  const id = `image${padded}`;
  const placeholder = `[Gambar ${padded}]`;

  return { id, placeholder, num: nextNum };
}

/**
 * Parses article content, extracting:
 * 1. Clean bodyText (containing [Gambar 01], [Gambar 02], etc. directly in text flow)
 * 2. Associated images metadata array [{ id, placeholder, image_url, image_title, storage_path }, ...]
 *
 * Supports robust migration of previous formats:
 * - Incorrect markdown link: [Gambar 01](https://...) -> cleanly converted to [Gambar 01] in-place
 * - Old placeholder: [image01] -> converted to [Gambar 01] in-place
 * - Legacy inline link: "{photo_link}" -> converted to [Gambar 01] in-place
 * - Metadata comment: <!-- framedia:images [...] -->
 */
export function parseArticleContent(rawContent: string): {
  bodyText: string;
  images: ArticleInlineImageData[];
} {
  if (!rawContent) {
    return { bodyText: '', images: [] };
  }

  let body = rawContent;
  let images: ArticleInlineImageData[] = [];

  // 1. Extract from framedia:images HTML comment block if present
  const commentMatch = body.match(/<!--\s*framedia:images\s*([\s\S]*?)\s*-->/i);
  if (commentMatch) {
    try {
      const parsed = JSON.parse(commentMatch[1]);
      if (Array.isArray(parsed)) {
        images = parsed.map((item: any) => {
          const id = placeholderToId(item.id || item.placeholder || 'image01');
          const placeholder = normalizePlaceholder(item.placeholder || id);
          const image_url = String(item.image_url || item.url || '');
          const image_title = item.image_title !== undefined ? String(item.image_title) : (item.title ? String(item.title) : '');
          const storage_path = item.storage_path ? String(item.storage_path) : undefined;
          return {
            id,
            placeholder,
            image_url,
            image_title,
            storage_path,
            url: image_url,
            title: image_title,
          };
        });
      }
    } catch (e) {
      console.warn('Failed to parse inline images JSON from comment:', e);
    }
    // Remove comment block completely from body
    body = body.replace(/<!--\s*framedia:images\s*[\s\S]*?\s*-->/gi, '').trimEnd();
  }

  // 2. Migration: Detect and convert incorrect markdown links [Gambar 01](https://...) or [image01](https://...)
  const mdLinkRegex = /\[(?:gambar\s*|image\s*)(\d+)\]\((https?:\/\/[^\s\)\"]+)(?:\s+"([^"]*)")?\)/gi;
  body = body.replace(mdLinkRegex, (_, digits, url, quotedTitle) => {
    const num = parseInt(digits, 10).toString().padStart(2, '0');
    const placeholder = `[Gambar ${num}]`;
    const id = `image${num}`;
    const image_url = url;
    const image_title = quotedTitle || '';

    // Save or update metadata
    const existing = images.find((img) => img.placeholder.toLowerCase() === placeholder.toLowerCase());
    if (existing) {
      existing.image_url = image_url;
      existing.url = image_url;
      if (image_title) {
        existing.image_title = image_title;
        existing.title = image_title;
      }
    } else {
      images.push({
        id,
        placeholder,
        image_url,
        image_title,
        url: image_url,
        title: image_title,
      });
    }
    return placeholder;
  });

  // 3. Migration: Convert any remaining [image01], [image02] placeholders to [Gambar 01]
  body = body.replace(/\[image(\d+)\]/gi, (_, digits) => {
    const num = parseInt(digits, 10).toString().padStart(2, '0');
    return `[Gambar ${num}]`;
  });
  images = images.map((img) => ({
    ...img,
    id: placeholderToId(img.id),
    placeholder: normalizePlaceholder(img.placeholder),
  }));

  // 4. Migration: Convert legacy standalone "{photo_link}" in-place safely without regex exec mutation
  const legacyRegex = /"((?:https?:\/\/|\/|data:image\/)[^"\s\n|]+(?:\.(?:png|jpe?g|webp|gif|svg)|[^\s\n"|]*))(?:\s*\|\s*([^"\n]*))?"(?:\s*"([^"\n]*)")?/gi;
  body = body.replace(legacyRegex, (raw, url, pipeTitle, quotedTitle) => {
    if (!isSafeImageUrl(url)) return raw;
    const isLikelyImage = /\.(?:jpe?g|png|webp|gif|svg)(?:\?.*)?$/i.test(url) || 
                          url.includes('/image') || 
                          url.includes('/photo') || 
                          url.includes('/covers/') ||
                          url.startsWith('data:image/');
    if (!isLikelyImage && !pipeTitle && !quotedTitle) {
      return raw;
    }

    const title = (quotedTitle !== undefined ? quotedTitle : (pipeTitle !== undefined ? pipeTitle : '')).trim();
    const { id, placeholder } = getNextPlaceholder(body, images);
    images.push({
      id,
      placeholder,
      image_url: url,
      image_title: title,
      url,
      title,
    });
    return placeholder;
  });

  return { bodyText: body, images };
}

/**
 * Serializes the article content and associated image metadata together.
 * Preserves the exact position of [Gambar XX] in bodyText, and appends the
 * metadata block to persist url, title, and storage_path.
 *
 * Guaranteed: bodyText is never lost, wiped out, or replaced by metadata.
 */
export function serializeArticleContent(
  bodyText: string,
  images: ArticleInlineImageData[] = []
): string {
  if (!bodyText) return '';

  // Strip any old comment block
  const cleanBody = bodyText
    .replace(/\n*<!--\s*framedia:images[\s\S]*?-->/gi, '')
    .trimEnd();

  if (!cleanBody) return '';

  if (!images || images.length === 0) {
    return cleanBody;
  }

  // Only store images that are actively referenced in cleanBody
  const activeImages = images
    .filter((img) => cleanBody.toLowerCase().includes(img.placeholder.toLowerCase()))
    .map((img) => {
      const entry: ArticleInlineImageData = {
        id: img.id,
        placeholder: img.placeholder,
        image_url: img.image_url || img.url || '',
        image_title: img.image_title !== undefined ? img.image_title : (img.title || ''),
      };
      if (img.storage_path) {
        entry.storage_path = img.storage_path;
      }
      return entry;
    });

  if (activeImages.length === 0) {
    return cleanBody;
  }

  return `${cleanBody}\n\n<!-- framedia:images\n${JSON.stringify(activeImages, null, 2)}\n-->`;
}
