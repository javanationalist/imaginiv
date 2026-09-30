/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { BannerItem } from '../types';

export const MAX_BANNERS_LIMIT = 10;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadProgressCallback {
  (progress: number): void;
}

export const bannersService = {
  /**
   * Get all active banners from Supabase database.
   * Never falls back to demo or mock banners or localStorage.
   */
  async getActiveBanners(): Promise<BannerItem[]> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      console.warn('Supabase client not configured for active banners.');
      return [];
    }

    try {
      const { data, error } = await client
        .from('banners')
        .select('id, image_url, storage_path, caption, sort_order, is_active, created_at, updated_at')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Failed to fetch active banners from Supabase:', error.message);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        image_url: row.image_url,
        storage_path: row.storage_path,
        caption: row.caption || '',
        sort_order: row.sort_order ?? 0,
        is_active: Boolean(row.is_active),
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    } catch (err) {
      console.error('Exception fetching active banners from Supabase:', err);
      return [];
    }
  },

  /**
   * Get all banners for Admin panel management (both active and inactive).
   * Sorted by sort_order ascending.
   */
  async getAllBanners(): Promise<BannerItem[]> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      console.warn('Supabase client not configured for banners.');
      return [];
    }

    try {
      const { data, error } = await client
        .from('banners')
        .select('id, image_url, storage_path, caption, sort_order, is_active, created_at, updated_at')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Failed to fetch all banners from Supabase:', error.message);
        return [];
      }

      if (!data) return [];

      return data.map((row) => ({
        id: row.id,
        image_url: row.image_url,
        storage_path: row.storage_path,
        caption: row.caption || '',
        sort_order: row.sort_order ?? 0,
        is_active: Boolean(row.is_active),
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    } catch (err) {
      console.error('Exception fetching all banners from Supabase:', err);
      return [];
    }
  },

  /**
   * Upload a new banner image to Supabase Storage and insert row into PostgreSQL table.
   * Rejects and rolls back cleanly on any failure. Never uses demo or localStorage fallbacks.
   */
  async uploadBanner(
    file: File,
    caption: string = '',
    onProgress?: UploadProgressCallback
  ): Promise<{ success: boolean; banner?: BannerItem; error?: string }> {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file format. Only JPG, PNG, and WEBP images are permitted.',
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: 'File size exceeds 5MB limit. Please compress or choose a smaller image.',
      };
    }

    const currentBanners = await this.getAllBanners();
    if (currentBanners.length >= MAX_BANNERS_LIMIT) {
      return {
        success: false,
        error: `Maximum banner limit reached (${MAX_BANNERS_LIMIT} banners). Please remove an existing banner before uploading a new one.`,
      };
    }

    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return {
        success: false,
        error: 'Supabase is not configured. Real database connection is required.',
      };
    }

    const nextSortOrder = currentBanners.reduce((max, b) => Math.max(max, b.sort_order), 0) + 1;
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const storagePath = `banners/${cleanFileName}`;

    try {
      if (onProgress) onProgress(20);

      // Upload file to Supabase Storage bucket 'banners'
      const { error: uploadError } = await client.storage
        .from('banners')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase storage banner upload failed:', uploadError.message);
        return {
          success: false,
          error: `Storage upload failed: ${uploadError.message}`,
        };
      }

      if (onProgress) onProgress(65);

      // Get public URL
      const { data: publicUrlData } = client.storage
        .from('banners')
        .getPublicUrl(storagePath);

      const publicUrl = publicUrlData.publicUrl;

      // Insert record into Supabase PostgreSQL 'banners' table
      const { data: insertData, error: dbError } = await client
        .from('banners')
        .insert({
          image_url: publicUrl,
          storage_path: storagePath,
          caption: caption.trim() || null,
          sort_order: nextSortOrder,
          is_active: true,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert failed for banner, rolling back storage object:', dbError.message);
        try {
          await client.storage.from('banners').remove([storagePath]);
        } catch (_) {}

        return {
          success: false,
          error: `Database insert failed: ${dbError.message}`,
        };
      }

      if (onProgress) onProgress(100);

      const newBanner: BannerItem = {
        id: insertData.id,
        image_url: insertData.image_url,
        storage_path: insertData.storage_path,
        caption: insertData.caption || '',
        sort_order: insertData.sort_order,
        is_active: Boolean(insertData.is_active),
        created_at: insertData.created_at,
        updated_at: insertData.updated_at,
      };

      return { success: true, banner: newBanner };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown upload error';
      console.error('Exception during Supabase banner upload:', message);
      return { success: false, error: message };
    }
  },

  /**
   * Toggle active state (show/hide) for a banner directly in Supabase.
   */
  async toggleBannerActive(id: string, isActive: boolean): Promise<boolean> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) return false;

    try {
      const { error } = await client
        .from('banners')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Failed to update banner status in Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Exception toggling banner in Supabase:', err);
      return false;
    }
  },

  /**
   * Update banner caption in Supabase.
   */
  async updateBannerCaption(id: string, caption: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) return false;

    try {
      const { error } = await client
        .from('banners')
        .update({ caption: caption.trim() || null, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Failed to update banner caption in Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Exception updating banner caption in Supabase:', err);
      return false;
    }
  },

  /**
   * Move banner position up or down in sort order in Supabase.
   */
  async moveBanner(id: string, direction: 'up' | 'down'): Promise<BannerItem[]> {
    const banners = await this.getAllBanners();
    const index = banners.findIndex((b) => b.id === id);

    if (index === -1) return banners;
    if (direction === 'up' && index === 0) return banners;
    if (direction === 'down' && index === banners.length - 1) return banners;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const tempOrder = banners[index].sort_order;
    banners[index].sort_order = banners[swapIndex].sort_order;
    banners[swapIndex].sort_order = tempOrder;

    banners.sort((a, b) => a.sort_order - b.sort_order);
    const reordered = banners.map((b, i) => ({ ...b, sort_order: i + 1 }));

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await Promise.all(
          reordered.map((b) =>
            client
              .from('banners')
              .update({ sort_order: b.sort_order, updated_at: new Date().toISOString() })
              .eq('id', b.id)
          )
        );
      } catch (err) {
        console.error('Failed to sync banner sequence with Supabase:', err);
      }
    }

    return reordered;
  },

  /**
   * Delete banner permanently from Supabase Storage and database table.
   */
  async deleteBanner(id: string, storagePath: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) return false;

    try {
      if (storagePath) {
        await client.storage.from('banners').remove([storagePath]);
      }

      const { error } = await client.from('banners').delete().eq('id', id);
      if (error) {
        console.error('Failed to delete banner row in Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Exception deleting banner from Supabase:', err);
      return false;
    }
  },

  /**
   * Subscribe to real-time banner updates via Supabase realtime channel.
   */
  subscribeToBannersChanges(callback: (banners: BannerItem[]) => void): () => void {
    let supabaseChannel: ReturnType<NonNullable<ReturnType<typeof getSupabaseClient>>['channel']> | null = null;
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        supabaseChannel = client
          .channel('public:banners')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'banners' },
            async () => {
              const fresh = await this.getAllBanners();
              callback(fresh);
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime banners subscription unavailable:', err);
      }
    }

    return () => {
      if (supabaseChannel && client) {
        client.removeChannel(supabaseChannel);
      }
    };
  },
};
