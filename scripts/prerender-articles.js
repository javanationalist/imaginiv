/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { injectArticleMetadata } from './htmlMetaInjector.js';

// Load .env variables if present
dotenv.config();

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

async function main() {
  if (!fs.existsSync(indexPath)) {
    console.error('✗ dist/index.html not found. Please run vite build first.');
    process.exit(1);
  }

  // 1. Ensure 404.html is created for GitHub Pages SPA client-side routing fallback
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('✓ Successfully created dist/404.html for GitHub Pages fallback');

  // 2. Read template HTML
  const rawHtml = fs.readFileSync(indexPath, 'utf-8');

  // 3. Connect to Supabase to fetch published articles
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
    console.log('ℹ Supabase not configured in build environment. Skipping static article OpenGraph prerendering.');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: articles, error } = await supabase
      .from('articles')
      .select('title, slug, excerpt, content, cover_image_url, author, published_at')
      .eq('is_published', true);

    if (error) {
      console.warn('⚠ Could not fetch articles from Supabase during build:', error.message);
      return;
    }

    if (!articles || articles.length === 0) {
      console.log('ℹ No published articles found to prerender.');
      return;
    }

    console.log(`ℹ Prerendering rich OpenGraph social preview files for ${articles.length} article(s)...`);

    // Determine base domain from environment or default custom domain
    const siteDomain = (process.env.VITE_SITE_URL || 'https://imaginiv.site').replace(/\/$/, '');
    const basePath = (process.env.VITE_BASE_PATH || '').replace(/\/$/, '');

    for (const article of articles) {
      if (!article.slug) continue;

      const cleanSlug = article.slug.trim();
      const canonicalUrl = `${siteDomain}${basePath}/article/${encodeURIComponent(cleanSlug)}`;

      const articleHtml = injectArticleMetadata(rawHtml, {
        title: `${article.title} – Imaginiv`,
        description: article.excerpt || article.title,
        imageUrl: article.cover_image_url,
        canonicalUrl,
        author: article.author || 'Imaginiv Editorial',
      });

      // Write to dist/article/<slug>/index.html
      const articleDir = path.join(distDir, 'article', cleanSlug);
      fs.mkdirSync(articleDir, { recursive: true });
      fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml, 'utf-8');

      // Also write to dist/article/<slug>.html
      fs.writeFileSync(path.join(distDir, 'article', `${cleanSlug}.html`), articleHtml, 'utf-8');

      console.log(`  ✓ Generated static social preview for /article/${cleanSlug}`);
    }

    console.log('✓ All published articles prerendered successfully for static hosting.');
  } catch (err) {
    console.warn('⚠ Error during article prerendering:', err.message);
  }
}

main();
