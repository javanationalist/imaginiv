/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { ArticleItem } from '../types';

export const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_COVER_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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
   * Ensures that a slug is unique across all articles in Supabase.
   * If slug is taken by another article, appends -2, -3, etc.
   */
  async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    const cleanBase = this.generateSlug(baseSlug) || 'article';
    const all = await this.getAllArticlesForAdmin();

    const existingSlugs = new Set(
      all.filter((a) => a.id !== excludeId).map((a) => a.slug.toLowerCase())
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
   * Fetch all published articles for public readers exclusively from Supabase.
   * Never falls back to demo or mock articles or localStorage.
   */
  async getPublishedArticles(): Promise<ArticleItem[]> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      console.warn('Supabase is not configured for published articles.');
      return [];
    }

    try {
      const { data, error } = await client
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch published articles from Supabase:', error.message);
        return [];
      }

      if (!data) return [];

      return data.map((row) => ({
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
    } catch (err) {
      console.error('Exception fetching published articles from Supabase:', err);
      return [];
    }
  },

  /**
   * Fetch an article by its unique slug from Supabase.
   * Never falls back to demo articles. Returns null if not found or on error.
   */
  async getArticleBySlug(slug: string, isAuthoritativeAdmin: boolean = false): Promise<ArticleItem | null> {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();

    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      console.warn('Supabase is not configured for article lookup.');
      return null;
    }

    try {
      let query = client.from('articles').select('*').eq('slug', cleanSlug);
      if (!isAuthoritativeAdmin) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query.single();
      if (error || !data) {
        if (error && error.code !== 'PGRST116') {
          console.error('Failed to fetch article by slug from Supabase:', error.message);
        }
        return null;
      }

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
    } catch (err) {
      console.error('Exception fetching article by slug from Supabase:', err);
      return null;
    }
  },

  /**
   * Fetch all articles (including drafts) for Admin management from Supabase.
   */
  async getAllArticlesForAdmin(): Promise<ArticleItem[]> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      console.warn('Supabase is not configured for admin articles.');
      return [];
    }

    try {
      const { data, error } = await client
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch admin articles from Supabase:', error.message);
        return [];
      }

      if (!data) return [];

      return data.map((row) => ({
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
    } catch (err) {
      console.error('Exception fetching admin articles from Supabase:', err);
      return [];
    }
  },

  /**
   * Upload an article cover image to Supabase Storage bucket 'article-covers'.
   * Never uses demo or localStorage fallbacks.
   */
  async uploadCoverImage(
    file: File
  ): Promise<{ success: boolean; publicUrl?: string; storagePath?: string; error?: string }> {
    if (!ALLOWED_COVER_MIME_TYPES.includes(file.type)) {
      return { success: false, error: 'Invalid file format. Please upload JPG, PNG, or WEBP image.' };
    }

    if (file.size > MAX_COVER_SIZE_BYTES) {
      return { success: false, error: 'File size exceeds 5MB limit.' };
    }

    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return { success: false, error: 'Supabase storage is not configured.' };
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const storagePath = `covers/cover_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    try {
      const { error: uploadError } = await client.storage
        .from('article-covers')
        .upload(storagePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Supabase cover image upload error:', uploadError.message);
        return { success: false, error: uploadError.message };
      }

      const { data } = client.storage.from('article-covers').getPublicUrl(storagePath);
      return { success: true, publicUrl: data.publicUrl, storagePath };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      console.error('Exception during cover image upload:', message);
      return { success: false, error: message };
    }
  },

  /**
   * Create a new article directly in Supabase.
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

    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return { success: false, error: 'Supabase connection is not available.' };
    }

    const finalSlug = await this.ensureUniqueSlug(data.slug || data.title);
    const now = new Date().toISOString();

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
          author: data.author?.trim() || 'Imaginiv Editorial',
          is_published: data.is_published,
          published_at: data.is_published ? now : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create article in Supabase:', error.message);
        return { success: false, error: error.message };
      }

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

      return { success: true, article: newArticle };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create article';
      console.error('Exception creating article in Supabase:', message);
      return { success: false, error: message };
    }
  },

  /**
   * Update an existing article directly in Supabase.
   */
  async updateArticle(
    id: string,
    data: Partial<ArticleItem>
  ): Promise<{ success: boolean; article?: ArticleItem; error?: string }> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return { success: false, error: 'Supabase connection is not available.' };
    }

    let finalSlug: string | undefined = undefined;
    if (data.slug) {
      finalSlug = await this.ensureUniqueSlug(data.slug, id);
    }

    const now = new Date().toISOString();

    try {
      const updatePayload: Record<string, unknown> = {
        updated_at: now,
      };

      if (data.title !== undefined) updatePayload.title = data.title.trim();
      if (finalSlug !== undefined) updatePayload.slug = finalSlug;
      if (data.excerpt !== undefined) updatePayload.excerpt = data.excerpt?.trim() || null;
      if (data.content !== undefined) {
        const trimmedContent = data.content.trim();
        if (!trimmedContent) {
          console.error('[articlesService.updateArticle] ABORTED: Attempted to update article with empty content! Article ID:', id);
          return { success: false, error: 'Article content cannot be empty. Update was aborted to prevent data loss.' };
        }
        console.log(`[articlesService.updateArticle] Updating article ID ${id} with content length ${trimmedContent.length}`);
        updatePayload.content = trimmedContent;
      }
      if (data.cover_image_url !== undefined) updatePayload.cover_image_url = data.cover_image_url;
      if (data.cover_image_path !== undefined) updatePayload.cover_image_path = data.cover_image_path;
      if (data.author !== undefined) updatePayload.author = data.author?.trim() || null;
      if (data.is_published !== undefined) {
        updatePayload.is_published = data.is_published;
        if (data.is_published) {
          updatePayload.published_at = data.published_at || now;
        } else {
          updatePayload.published_at = null;
        }
      }

      const { data: updated, error } = await client
        .from('articles')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update article in Supabase:', error.message);
        return { success: false, error: error.message };
      }

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

      return { success: true, article: fresh };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update article';
      console.error('Exception updating article in Supabase:', message);
      return { success: false, error: message };
    }
  },

  /**
   * Delete an article and its cover file from Supabase Storage and database table.
   */
  async deleteArticle(id: string, coverImagePath?: string | null): Promise<boolean> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) return false;

    try {
      if (coverImagePath && !coverImagePath.startsWith('default/')) {
        await client.storage.from('article-covers').remove([coverImagePath]);
      }

      const { error } = await client.from('articles').delete().eq('id', id);
      if (error) {
        console.error('Failed to delete article in Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Exception deleting article in Supabase:', err);
      return false;
    }
  },

  /**
   * Subscribe to real-time changes directly from Supabase postgres_changes channel.
   */
  subscribeToArticlesChanges(callback: (articles: ArticleItem[]) => void): () => void {
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
      if (supabaseChannel && client) {
        client.removeChannel(supabaseChannel);
      }
    };
  },
};
