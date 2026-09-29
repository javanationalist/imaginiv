/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { ArticleItem } from '../types';

export const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_COVER_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 'article-default-1',
    title: '10 Principles of Creativity',
    slug: '10-principles-of-creativity',
    excerpt: 'Ideas, practice, discipline, and the process of becoming a creative person.',
    content: `Creativity is rarely a sudden bolt of lightning striking an idle mind. In truth, it is an ongoing practice—a systematic way of seeing, digesting, and reshaping the world around us. At Imaginiv, we view creative output not as an unpredictable stroke of luck, but as the natural byproduct of cultivated curiosity, rigorous discipline, and a deep engagement with process.

Whether you are designing digital experiences, directing film, writing narrative fiction, or building physical artifacts, becoming a creative person requires moving beyond passive inspiration into intentional practice. Here are the ten foundational principles that guide our work at Imaginiv and define the journey of creative growth.

---

### 1. Creativity Is a System, Not a Miracle

Inspiration is real, but it is an unreliable partner if you wait for it in isolation. True creative momentum comes from building an observational engine: a daily habit of gathering raw material from unexpected sources. 

When you treat creativity as a continuous system of inputs and outputs—reading widely, cataloging visual textures, analyzing architectural forms, listening to acoustic nuances—you ensure that your mind is always stocked with fuel. You do not wait for the spark; you build the furnace.

> "You don't wait for inspiration; you create an environment where inspiration is forced to visit you."

---

### 2. Steal with Intent, Synthesize with Taste

Originality is not creation *ex nihilo*. Every groundbreaking idea is a collision of preexisting influences filtered through a unique personal perspective. 

The secret lies in the quality of your collection and the depth of your synthesis. Do not copy superficial surfaces; deconstruct the underlying mechanics of what moves you. Take the rhythm of an ancient poem, the color palette of a Renaissance painting, and the structural tension of modern architecture, then fuse them through your own hands. That synthesis is your voice.

---

### 3. Action Precedes Clarity

One of the most persistent traps in the creative process is the belief that you must fully understand what you are making before you begin. 

In reality, clarity is forged through the act of making itself. Prototype early. Write the messy first draft. Sketch the rough composition. Drag the clay onto the workbench. By giving an idea physical or digital form, you create an artifact you can interact with, interrogate, and refine. Motion creates understanding.

---

### 4. The Friction of Materiality Sharpens the Mind

In an era dominated by frictionless glass screens and instant digital generation, physical friction is a superpower. 

When you pick up a physical pen, cut paper by hand, work with analog film grain, or build miniature maquettes, you engage different cognitive pathways. The tactile constraints of real materials force you to slow down, make deliberate decisions, and embrace organic imperfections. Even in digital design, maintaining a connection to physical craft gives the final work a felt weight and resonance.

---

### 5. Protect Your Unsanctioned Playground

The work you do when no one is watching—the late-night sound experiment, the uncommissioned typographic sketch, the side project with no commercial objective—is often where your signature identity takes root.

Commercial briefs have client constraints and rigid deliverables. Your personal playground, however, allows for wild hypotheses and glorious failures. Protect your unstructured creative play from premature monetization or external judgment. It is the research lab for your future breakthroughs.

---

### 6. Separate the Generator from the Editor

Trying to edit while you generate is like driving with the emergency brake engaged. They require fundamentally different cognitive modes: generation demands open-ended play, vulnerability, and speed; editing requires cold, surgical judgment and structural rigor.

When drafting or brainstorming, turn off the internal critic. Allow the ideas to be sprawling, imperfect, and excessive. Once the raw material exists on the page, step back, switch roles, and edit with uncompromising discipline.

---

### 7. Constraint Is the Ultimate Generative Engine

Unbridled freedom sounds liberating, but a blank canvas with zero boundaries frequently leads to creative paralysis. Constraints are not obstacles; they are the scaffolding of ingenuity.

A strict three-color palette, a 60-second runtime limit, a single font family, or a fixed physical footprint forces you to solve problems cleverly rather than throwing endless resources at them. Embrace limitations as creative directives.

---

### 8. Cultivate Taste Beyond Your Domain

If you only consume design, your design will sound derivative. If you only watch contemporary film, your cinema will feel narrow. 

To develop a rich creative palette, look far outside your immediate discipline. Study botany, read 19th-century trade journals, listen to avant-garde field recordings, examine industrial machinery. The most compelling creative solutions happen when insights from one domain are transplanted into another.

---

### 9. Rhythm Trumps Intensity

Sporadic bursts of 18-hour intense work followed by weeks of exhaustion breed burnout, not mastery. Becoming a creative person is a lifelong marathon governed by steady, quiet rhythm.

Thirty minutes of focused, uninterrupted creative work every single day yields vastly greater compound results over a year than desperate deadline-driven sprints. Consistency builds neural pathways, sharpens intuition, and transforms creative execution from a dramatic event into a natural state of being.

---

### 10. The Work Belongs to the World Once Finished

Perfectionism is frequently fear wearing a sophisticated mask. It is the anxiety of being judged, leading creators to hide their work in endless loops of unnecessary polish.

At Imaginiv, we believe that an unfinished masterpiece locked on a hard drive helps no one. Have the courage to declare a piece finished, ship it into the world with humility, and listen to how it breathes. Then, take what you learned and turn immediately to the next blank canvas.

---

### Summary for the Practicing Creator

Becoming a creative person is an ongoing posture toward life. It requires the curiosity of a student, the rigor of a craftsperson, and the courage of an author. As you apply these ten principles, remember that your creative voice is not something you find—it is something you build, day by day, project by project.`,
    cover_image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: 'default/article-1.jpg',
    author: 'Imaginiv',
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'article-default-2',
    title: 'Tactile Aesthetics in Digital Narrative Cinema',
    slug: 'tactile-aesthetics-in-digital-narrative-cinema',
    excerpt: 'Why physical textures, acoustic imperfections, and organic film grain evoke emotional intimacy in modern audiovisual storytelling.',
    content: `## Reclaiming the Weight of Analog Craft

In an era saturated by immaculate, hyper-sterilized digital rendering, audiences are demonstrating an unmistakable hunger for tactile friction. 

### Texture as Emotional Resonance
When light bounces through dust motes in an old wood workshop, or when a microphone captures the subtle creak of a pine floorboard before a character speaks, viewers instinctively register authenticity.

### Intentional Imperfection
* **Grain & Halation**: Celluloid warmth that breathes with the frame rather than remaining mathematically flat.
* **Organic Acoustic Resonance**: Field recordings captured in actual wooden pavilions rather than synthetic impulse responses.
* **Handmade Typography**: Lettering drawn by calligraphers before being digitized for titles.

Crafting cinema at Imaginiv means treating every pixel and audio frequency with the same devotion as an artisan carving a joint in cedar wood.`,
    cover_image_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: 'default/article-2.jpg',
    author: 'Imaginiv Editorial',
    is_published: true,
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'article-default-3',
    title: 'Ethical Guidelines for Human-Centric AI Co-Creation',
    slug: 'ethical-guidelines-for-human-centric-ai-co-creation',
    excerpt: 'Imaginiv agency commitments on human authorship, IP protection, transparency, and neurodivergent-friendly digital media.',
    content: `## The Human Heartbeat at the Core

As synthetic generation tools proliferate across creative media, Imaginiv maintains a clear, unwavering charter: technology serves human imagination, never replacing it.

### Three Inviolable Commitments:
1. **Human Authorship Primacy**: Conceptual intent, emotional vulnerability, and final artistic decisions must originate from human directors and artisans.
2. **Copyright & Source Integrity**: Respecting living artists by refusing unconsented scraping and ensuring clear provenance for reference datasets.
3. **Sensory & Neurodivergent Accessibility**: Designing sensory-safe audiovisuals with balanced acoustics, accessible contrast ratios, and thoughtful pacing.`,
    cover_image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: 'default/article-3.jpg',
    author: 'Imaginiv Ethics Guild',
    is_published: true,
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const LOCAL_STORAGE_KEY = 'framedia_articles_list';
const EVENT_NAME = 'framedia_articles_changed';

const getLocalCache = (): ArticleItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      let parsed = JSON.parse(raw) as ArticleItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure 10 Principles of Creativity by Imaginiv is always present
        const hasNewArticle = parsed.some(a => a.slug === '10-principles-of-creativity');
        if (!hasNewArticle) {
          parsed = [DEFAULT_ARTICLES[0], ...parsed.filter(a => a.slug !== '10-being-creative-that-the-lecturer-explains')];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      }
    }
  } catch (_) {}
  return [...DEFAULT_ARTICLES];
};

const setLocalCache = (articles: ArticleItem[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: articles }));
  } catch (_) {}
};

export const articlesService = {
  /**
   * Generates a URL slug from a title string following exact specs:
   * 1. Lowercase
   * 2. Replace whitespace with hyphens (-)
   * 3. Remove non-alphanumeric characters (except hyphens)
   * 4. Collapse consecutive hyphens
   * 5. Trim leading & trailing hyphens
   */
  generateSlug(title: string): string {
    if (!title) return '';
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Ensures that a slug is unique across all articles.
   * If slug is taken by another article, appends -2, -3, etc.
   */
  async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    const cleanBase = this.generateSlug(baseSlug) || 'article';
    const all = await this.getAllArticlesForAdmin();

    const existingSlugs = new Set(
      all.filter(a => a.id !== excludeId).map(a => a.slug.toLowerCase())
    );

    if (!existingSlugs.has(cleanBase)) {
      return cleanBase;
    }

    let counter = 2;
    while (existingSlugs.has(`${cleanBase}-${counter}`)) {
      counter++;
    }

    return `${cleanBase}-${counter}`;
  },

  /**
   * Fetch all published articles for public readers.
   * Sorted by published_at / created_at descending.
   */
  async getPublishedArticles(): Promise<ArticleItem[]> {
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        const { data, error } = await client
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const list: ArticleItem[] = data.map(row => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            excerpt: row.excerpt,
            content: row.content,
            cover_image_url: row.cover_image_url,
            cover_image_path: row.cover_image_path,
            author: row.author,
            is_published: Boolean(row.is_published),
            published_at: row.published_at,
            created_at: row.created_at,
            updated_at: row.updated_at,
          }));

          return list;
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to cached articles:', err);
      }
    }

    return getLocalCache().filter(a => a.is_published);
  },

  /**
   * Fetch an article by its unique slug.
   * If user is not authenticated and article is draft, returns null.
   */
  async getArticleBySlug(slug: string, isAuthoritativeAdmin: boolean = false): Promise<ArticleItem | null> {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        let query = client.from('articles').select('*').eq('slug', cleanSlug);
        if (!isAuthoritativeAdmin) {
          query = query.eq('is_published', true);
        }

        const { data, error } = await query.single();
        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            cover_image_url: data.cover_image_url,
            cover_image_path: data.cover_image_path,
            author: data.author,
            is_published: Boolean(data.is_published),
            published_at: data.published_at,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        }
      } catch (err) {
        console.warn('Error fetching article by slug from Supabase:', err);
      }
    }

    const cached = getLocalCache();
    const found = cached.find(a => a.slug === cleanSlug);
    if (!found) return null;
    if (!found.is_published && !isAuthoritativeAdmin) return null;
    return found;
  },

  /**
   * Fetch all articles (including drafts) for Admin management.
   */
  async getAllArticlesForAdmin(): Promise<ArticleItem[]> {
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        const { data, error } = await client
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const list: ArticleItem[] = data.map(row => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            excerpt: row.excerpt,
            content: row.content,
            cover_image_url: row.cover_image_url,
            cover_image_path: row.cover_image_path,
            author: row.author,
            is_published: Boolean(row.is_published),
            published_at: row.published_at,
            created_at: row.created_at,
            updated_at: row.updated_at,
          }));

          setLocalCache(list);
          return list;
        }
      } catch (err) {
        console.warn('Error fetching admin articles from Supabase:', err);
      }
    }

    return getLocalCache();
  },

  /**
   * Upload an article cover image to Supabase Storage bucket 'article-covers'
   */
  async uploadCoverImage(file: File): Promise<{ success: boolean; publicUrl?: string; storagePath?: string; error?: string }> {
    if (!ALLOWED_COVER_MIME_TYPES.includes(file.type)) {
      return { success: false, error: 'Invalid file format. Please upload JPG, PNG, or WEBP image.' };
    }

    if (file.size > MAX_COVER_SIZE_BYTES) {
      return { success: false, error: 'File size exceeds 5MB limit.' };
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const storagePath = `covers/cover_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        const { error: uploadError } = await client.storage
          .from('article-covers')
          .upload(storagePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) {
          return { success: false, error: uploadError.message };
        }

        const { data } = client.storage.from('article-covers').getPublicUrl(storagePath);
        return { success: true, publicUrl: data.publicUrl, storagePath };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        return { success: false, error: message };
      }
    }

    // Local fallback: convert to base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          success: true,
          publicUrl: reader.result as string,
          storagePath,
        });
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read image locally.' });
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Create a new article with auto unique slug check.
   */
  async createArticle(data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    cover_image_url?: string;
    cover_image_path?: string;
    author?: string;
    is_published: boolean;
  }): Promise<{ success: boolean; article?: ArticleItem; error?: string }> {
    if (!data.title.trim()) {
      return { success: false, error: 'Article title is required.' };
    }
    if (!data.content.trim()) {
      return { success: false, error: 'Article content cannot be empty.' };
    }

    const finalSlug = await this.ensureUniqueSlug(data.slug || data.title);
    const now = new Date().toISOString();

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        const { data: inserted, error } = await client
          .from('articles')
          .insert({
            title: data.title.trim(),
            slug: finalSlug,
            excerpt: data.excerpt?.trim() || null,
            content: data.content.trim(),
            cover_image_url: data.cover_image_url || null,
            cover_image_path: data.cover_image_path || null,
            author: data.author?.trim() || 'Framedia Editorial',
            is_published: data.is_published,
            published_at: data.is_published ? now : null,
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase createArticle warning (falling back to local cache):', error.message);
        } else if (inserted) {
          const newArticle: ArticleItem = {
            id: inserted.id,
            title: inserted.title,
            slug: inserted.slug,
            excerpt: inserted.excerpt,
            content: inserted.content,
            cover_image_url: inserted.cover_image_url,
            cover_image_path: inserted.cover_image_path,
            author: inserted.author,
            is_published: Boolean(inserted.is_published),
            published_at: inserted.published_at,
            created_at: inserted.created_at,
            updated_at: inserted.updated_at,
          };

          const current = getLocalCache();
          setLocalCache([newArticle, ...current]);
          return { success: true, article: newArticle };
        }
      } catch (err: unknown) {
        console.warn('Exception in Supabase createArticle, falling back to local cache:', err);
      }
    }

    // Local fallback
    const newArticle: ArticleItem = {
      id: `article-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title.trim(),
      slug: finalSlug,
      excerpt: data.excerpt?.trim() || null,
      content: data.content.trim(),
      cover_image_url: data.cover_image_url || null,
      cover_image_path: data.cover_image_path || null,
      author: data.author?.trim() || 'Framedia Editorial',
      is_published: data.is_published,
      published_at: data.is_published ? now : null,
      created_at: now,
      updated_at: now,
    };

    const current = getLocalCache();
    setLocalCache([newArticle, ...current]);
    return { success: true, article: newArticle };
  },

  /**
   * Update an existing article.
   */
  async updateArticle(id: string, data: Partial<ArticleItem>): Promise<{ success: boolean; article?: ArticleItem; error?: string }> {
    const current = getLocalCache();
    const existing = current.find(a => a.id === id);
    if (!existing) {
      return { success: false, error: 'Article not found.' };
    }

    let finalSlug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      finalSlug = await this.ensureUniqueSlug(data.slug, id);
    } else if (data.title && !data.slug && data.title !== existing.title) {
      // Keep existing slug unless explicitly altered to maintain stable URLs
      finalSlug = existing.slug;
    }

    const now = new Date().toISOString();
    const publishedAt = data.is_published !== undefined
      ? (data.is_published ? (existing.published_at || now) : null)
      : existing.published_at;

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        const { data: updated, error } = await client
          .from('articles')
          .update({
            ...(data.title ? { title: data.title.trim() } : {}),
            slug: finalSlug,
            ...(data.excerpt !== undefined ? { excerpt: data.excerpt?.trim() || null } : {}),
            ...(data.content ? { content: data.content.trim() } : {}),
            ...(data.cover_image_url !== undefined ? { cover_image_url: data.cover_image_url } : {}),
            ...(data.cover_image_path !== undefined ? { cover_image_path: data.cover_image_path } : {}),
            ...(data.author !== undefined ? { author: data.author?.trim() || null } : {}),
            ...(data.is_published !== undefined ? { is_published: data.is_published } : {}),
            published_at: publishedAt,
            updated_at: now,
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.warn('Supabase updateArticle warning (falling back to local cache):', error.message);
        } else if (updated) {
          const fresh: ArticleItem = {
            id: updated.id,
            title: updated.title,
            slug: updated.slug,
            excerpt: updated.excerpt,
            content: updated.content,
            cover_image_url: updated.cover_image_url,
            cover_image_path: updated.cover_image_path,
            author: updated.author,
            is_published: Boolean(updated.is_published),
            published_at: updated.published_at,
            created_at: updated.created_at,
            updated_at: updated.updated_at,
          };

          setLocalCache(current.map(a => a.id === id ? fresh : a));
          return { success: true, article: fresh };
        }
      } catch (err: unknown) {
        console.warn('Exception in Supabase updateArticle, falling back to local cache:', err);
      }
    }

    // Local fallback update
    const fresh: ArticleItem = {
      ...existing,
      ...data,
      slug: finalSlug,
      published_at: publishedAt,
      updated_at: now,
    };

    setLocalCache(current.map(a => a.id === id ? fresh : a));
    return { success: true, article: fresh };
  },

  /**
   * Delete an article and its cover file from storage.
   */
  async deleteArticle(id: string, coverImagePath?: string | null): Promise<boolean> {
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        if (coverImagePath && !coverImagePath.startsWith('default/')) {
          await client.storage.from('article-covers').remove([coverImagePath]);
        }

        const { error } = await client.from('articles').delete().eq('id', id);
        if (error) {
          console.error('Failed to delete article in Supabase:', error.message);
          return false;
        }
      } catch (err) {
        console.error('Error deleting article:', err);
        return false;
      }
    }

    const current = getLocalCache();
    setLocalCache(current.filter(a => a.id !== id));
    return true;
  },

  /**
   * Subscribe to real-time changes
   */
  subscribeToArticlesChanges(callback: (articles: ArticleItem[]) => void): () => void {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<ArticleItem[]>;
      if (custom.detail) {
        callback(custom.detail);
      } else {
        callback(getLocalCache());
      }
    };

    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);

    let supabaseChannel: ReturnType<NonNullable<ReturnType<typeof getSupabaseClient>>['channel']> | null = null;
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        supabaseChannel = client
          .channel('public:articles')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'articles' },
            async () => {
              const fresh = await this.getAllArticlesForAdmin();
              callback(fresh);
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime articles subscription unavailable:', err);
      }
    }

    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
      if (supabaseChannel && client) {
        client.removeChannel(supabaseChannel);
      }
    };
  },
};
