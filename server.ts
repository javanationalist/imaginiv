import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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
      reply: 'Hello from inFra! I am the Framedia Creative village assistant architecture. Ready to assist your creative projects.',
    });
  } catch (error) {
    console.error('inFra route error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve production static assets from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA catch-all fallback to index.html for client-side routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running and listening on 0.0.0.0:${port}`);
});
