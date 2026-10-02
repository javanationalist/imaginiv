/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Replaces or injects Open Graph, Twitter card, and canonical meta tags
 * into an HTML template string.
 */
export function injectArticleMetadata(html, { title, description, imageUrl, canonicalUrl, author }) {
  if (!html) return '';

  const safeTitle = (title || 'Imaginiv').replace(/"/g, '&quot;');
  const safeDesc = (description || '').replace(/"/g, '&quot;');
  const safeImg = (imageUrl || 'https://yjrdbggomigcotijziqf.supabase.co/storage/v1/object/public/assets/icon.png').replace(/"/g, '&quot;');
  const safeUrl = (canonicalUrl || '').replace(/"/g, '&quot;');
  const safeAuthor = (author || 'Imaginiv Editorial').replace(/"/g, '&quot;');

  let result = html;

  // 1. Title
  result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

  // 2. Meta description
  result = result.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${safeDesc}" />`
  );

  // 3. OpenGraph tags
  result = result.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${safeTitle}" />`
  );

  result = result.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${safeDesc}" />`
  );

  result = result.replace(
    /<meta\s+property=["']og:type["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:type" content="article" />`
  );

  result = result.replace(
    /<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:image" content="${safeImg}" />`
  );

  result = result.replace(
    /<meta\s+property=["']og:image:secure_url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:image:secure_url" content="${safeImg}" />`
  );

  result = result.replace(
    /<meta\s+property=["']og:image:alt["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:image:alt" content="${safeTitle}" />`
  );

  // If og:url exists, update it, otherwise add it before </head>
  if (/<meta\s+property=["']og:url["']/i.test(result)) {
    result = result.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:url" content="${safeUrl}" />`
    );
  } else {
    result = result.replace(
      /<\/head>/i,
      `    <meta property="og:url" content="${safeUrl}" />\n  </head>`
    );
  }

  // 4. Twitter / X card tags
  result = result.replace(
    /<meta\s+name=["']twitter:card["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:card" content="summary_large_image" />`
  );

  result = result.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );

  result = result.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );

  result = result.replace(
    /<meta\s+name=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:image" content="${safeImg}" />`
  );

  result = result.replace(
    /<meta\s+name=["']twitter:image:alt["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:image:alt" content="${safeTitle}" />`
  );

  // 5. Canonical link & Article author meta
  const extraTags = `    <link rel="canonical" href="${safeUrl}" />\n    <meta property="article:author" content="${safeAuthor}" />\n  </head>`;
  result = result.replace(/<\/head>/i, extraTags);

  return result;
}
