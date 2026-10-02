import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { injectArticleMetadata } from './scripts/htmlMetaInjector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API endpoint for inFra Assistant (Gemini Flash proxy)
app.post('/api/infra', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && prompt) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return res.json({ reply: response.text });
      } catch (aiErr) {
        console.warn('Gemini API call failed, falling back:', aiErr);
      }
    }

    return res.json({
      reply: 'Hello from inFra! I am the Imaginiv village assistant architecture. Ready to assist your creative projects.',
    });
  } catch (error) {
    console.error('inFra route error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve production static assets from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Server-side dynamic OpenGraph & social preview injection for article URLs
app.get('/article/:slug', async (req, res, next) => {
  const { slug } = req.params;
  const indexPath = path.join(distPath, 'index.html');

  if (!fs.existsSync(indexPath)) {
    return next();
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && slug) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: article } = await supabase
        .from('articles')
        .select('title, slug, excerpt, content, cover_image_url, author')
        .eq('slug', slug.trim())
        .eq('is_published', true)
        .maybeSingle();

      if (article) {
        const rawHtml = fs.readFileSync(indexPath, 'utf-8');
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.headers['x-forwarded-host'] || req.get('host') || 'imaginiv.site';
        const canonicalUrl = `${protocol}://${host}/article/${encodeURIComponent(article.slug)}`;

        const renderedHtml = injectArticleMetadata(rawHtml, {
          title: `${article.title} – Imaginiv`,
          description: article.excerpt || article.title,
          imageUrl: article.cover_image_url,
          canonicalUrl,
          author: article.author || 'Imaginiv Editorial',
        });

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(renderedHtml);
      }
    }
  } catch (err) {
    console.warn('Server OG tag injection failed, falling back to static index.html:', err);
  }

  return res.sendFile(indexPath);
});

// SPA catch-all fallback to index.html for client-side routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running and listening on 0.0.0.0:${port}`);
});
