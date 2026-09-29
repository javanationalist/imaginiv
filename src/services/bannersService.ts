/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { BannerItem } from '../types';

export const MAX_BANNERS_LIMIT = 10;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'banner-default-1',
    image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    storage_path: 'default/banner-1.jpg',
    caption: 'Framedia Creative: Narrative Film & Cinema Pipeline Atelier',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'banner-default-2',
    image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80',
    storage_path: 'default/banner-2.jpg',
    caption: 'Curated Tactile Visual Showcase & Multidisciplinary Design',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'banner-default-3',
    image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1600&q=80',
    storage_path: 'default/banner-3.jpg',
    caption: 'Tactile Artistry & Ethical AI Human Authorship Guild',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'framedia_banners_list';
const EVENT_NAME = 'framedia_banners_changed';

const getLocalCache = (): BannerItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BannerItem[];
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => a.sort_order - b.sort_order);
      }
    }
  } catch (_) {}
  return [...DEFAULT_BANNERS];
};

const setLocalCache = (banners: BannerItem[]): void => {
  try {
    const sorted = [...banners].sort((a, b) => a.sort_order - b.sort_order);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sorted));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: sorted }));
  } catch (_) {}
};

export interface UploadProgressCallback {
  (progress: number): void;
}

export const bannersService = {
  /**
   * Get all banners that are currently active (is_active = true)
   * Sorted by sort_order ascending. Used for the public landing page carousel.
   */
  async getActiveBanners(): Promise<BannerItem[]> {
    const all = await this.getAllBanners();
    return all.filter(b => b.is_active);
  },

  /**
   * Get all banners for Admin panel management (both active and inactive).
   * Sorted by sort_order ascending.
   */
  async getAllBanners(): Promise<BannerItem[]> {
    const client = getSupabaseClient();

    if (isSupabaseConfigured() && client) {
      try {
        const { data, error } = await client
          .from('banners')
          .select('id, image_url, storage_path, caption, sort_order, is_active, created_at, updated_at')
          .order('sort_order', { ascending: true });

        if (!error && data) {
          const list: BannerItem[] = data.map((row: {
            id: string;
            image_url: string;
            storage_path: string;
            caption?: string | null;
            sort_order: number;
            is_active: boolean;
            created_at?: string;
            updated_at?: string;
          }) => ({
            id: row.id,
            image_url: row.image_url,
            storage_path: row.storage_path,
            caption: row.caption || '',
            sort_order: row.sort_order ?? 0,
            is_active: Boolean(row.is_active),
            created_at: row.created_at,
            updated_at: row.updated_at,
          }));

          setLocalCache(list);
          return list;
        } else if (error) {
          console.warn('Supabase banners query warning (falling back to cache):', error.message);
        }
      } catch (err) {
        console.warn('Error fetching banners from Supabase:', err);
      }
    }

    return getLocalCache();
  },

  /**
   * Upload a new banner image:
   * 1. Validates file size (<= 5MB) and mime type (jpg, png, webp).
   * 2. Checks database max 10 banner limit.
   * 3. Uploads file to Supabase Storage bucket 'banners'.
   * 4. Inserts row into 'banners' table with sort_order = max + 1.
   * 5. If DB insert fails, rolls back storage file.
   */
  async uploadBanner(
    file: File,
    caption: string = '',
    onProgress?: UploadProgressCallback
  ): Promise<{ success: boolean; banner?: BannerItem; error?: string }> {
    // 1. Client-side validations
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

    // Check count limit
    const currentBanners = await this.getAllBanners();
    if (currentBanners.length >= MAX_BANNERS_LIMIT) {
      return {
        success: false,
        error: `Maximum banner limit reached (${MAX_BANNERS_LIMIT} banners). Please remove an existing banner before uploading a new one.`,
      };
    }

    const nextSortOrder = currentBanners.reduce((max, b) => Math.max(max, b.sort_order), 0) + 1;
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const storagePath = `banners/${cleanFileName}`;

    const client = getSupabaseClient();

    // Mode A: Live Supabase Storage + PostgreSQL
    if (isSupabaseConfigured() && client) {
      try {
        if (onProgress) onProgress(20);

        // Upload to Storage
        const { error: uploadError } = await client.storage
          .from('banners')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.warn('Supabase storage upload error, falling back to local client storage:', uploadError.message);
          return this.fallbackLocalUpload(file, storagePath, caption, nextSortOrder, currentBanners, onProgress);
        }

        if (onProgress) onProgress(65);

        // Get public URL
        const { data: publicUrlData } = client.storage
          .from('banners')
          .getPublicUrl(storagePath);

        const publicUrl = publicUrlData.publicUrl;

        // Insert into database
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
          console.warn('Database insert failed (e.g. PGRST205 table missing). Rolling back storage and falling back to local client storage:', dbError.message);
          try {
            await client.storage.from('banners').remove([storagePath]);
          } catch (_) {}

          // Fallback to local Data URL storage so upload succeeds seamlessly
          return this.fallbackLocalUpload(file, storagePath, caption, nextSortOrder, currentBanners, onProgress);
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

        const updatedList = [...currentBanners, newBanner];
        setLocalCache(updatedList);

        return { success: true, banner: newBanner };
      } catch (err: unknown) {
        console.warn('Exception during Supabase banner upload, falling back to local client storage:', err);
        return this.fallbackLocalUpload(file, storagePath, caption, nextSortOrder, currentBanners, onProgress);
      }
    }

    // Mode B: Local fallback (Base64 data URL simulation with progress)
    return this.fallbackLocalUpload(file, storagePath, caption, nextSortOrder, currentBanners, onProgress);
  },

  /**
   * Helper method for local client-side FileReader storage fallback
   */
  fallbackLocalUpload(
    file: File,
    storagePath: string,
    caption: string,
    nextSortOrder: number,
    currentBanners: BannerItem[],
    onProgress?: UploadProgressCallback
  ): Promise<{ success: boolean; banner?: BannerItem; error?: string }> {
    if (onProgress) onProgress(30);

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (onProgress) onProgress(80);
        const dataUrl = reader.result as string;

        const newBanner: BannerItem = {
          id: `banner-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          image_url: dataUrl,
          storage_path: storagePath,
          caption: caption.trim() || 'Uploaded Atelier Banner',
          sort_order: nextSortOrder,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const updatedList = [...currentBanners, newBanner];
        setLocalCache(updatedList);

        if (onProgress) onProgress(100);
        resolve({ success: true, banner: newBanner });
      };

      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file on client side.' });
      };

      reader.readAsDataURL(file);
    });
  },

  /**
   * Toggle active state (show/hide) for a banner
   */
  async toggleBannerActive(id: string, isActive: boolean): Promise<boolean> {
    const list = getLocalCache();
    const updated = list.map(b =>
      b.id === id ? { ...b, is_active: isActive, updated_at: new Date().toISOString() } : b
    );
    setLocalCache(updated);

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        const { error } = await client
          .from('banners')
          .update({ is_active: isActive, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          console.warn('Supabase toggleBannerActive warning (persisted locally):', error.message);
        }
      } catch (err) {
        console.warn('Network error toggling banner (persisted locally):', err);
      }
    }

    return true;
  },

  /**
   * Update banner caption
   */
  async updateBannerCaption(id: string, caption: string): Promise<boolean> {
    const list = getLocalCache();
    const updated = list.map(b =>
      b.id === id ? { ...b, caption, updated_at: new Date().toISOString() } : b
    );
    setLocalCache(updated);

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        const { error } = await client
          .from('banners')
          .update({ caption: caption.trim() || null, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          console.warn('Supabase updateBannerCaption warning (persisted locally):', error.message);
        }
      } catch (err) {
        console.warn('Network error updating caption (persisted locally):', err);
      }
    }

    return true;
  },

  /**
   * Move banner position up or down in sort order
   */
  async moveBanner(id: string, direction: 'up' | 'down'): Promise<BannerItem[]> {
    const banners = [...getLocalCache()].sort((a, b) => a.sort_order - b.sort_order);
    const index = banners.findIndex(b => b.id === id);

    if (index === -1) return banners;
    if (direction === 'up' && index === 0) return banners;
    if (direction === 'down' && index === banners.length - 1) return banners;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const tempOrder = banners[index].sort_order;
    banners[index].sort_order = banners[swapIndex].sort_order;
    banners[swapIndex].sort_order = tempOrder;

    // Normalize sort order sequentially (1, 2, 3...)
    banners.sort((a, b) => a.sort_order - b.sort_order);
    const reordered = banners.map((b, i) => ({ ...b, sort_order: i + 1 }));

    setLocalCache(reordered);

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await Promise.all(
          reordered.map(b =>
            client
              .from('banners')
              .update({ sort_order: b.sort_order, updated_at: new Date().toISOString() })
              .eq('id', b.id)
          )
        );
      } catch (err) {
        console.error('Failed to sync new order with Supabase:', err);
      }
    }

    return reordered;
  },

  /**
   * Delete banner:
   * 1. Delete file from Supabase Storage bucket 'banners'.
   * 2. Delete row from 'banners' table.
   * 3. Sync local cache.
   */
  async deleteBanner(id: string, storagePath: string): Promise<boolean> {
    const list = getLocalCache().filter(b => b.id !== id);
    setLocalCache(list);

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        // Delete file from storage first
        if (storagePath && !storagePath.startsWith('default/')) {
          await client.storage.from('banners').remove([storagePath]);
        }

        // Delete row from table
        const { error } = await client
          .from('banners')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('Supabase delete banner warning (deleted locally):', error.message);
        }
      } catch (err) {
        console.warn('Error deleting banner from Supabase (deleted locally):', err);
      }
    }

    return true;
  },

  /**
   * Subscribe to real-time banner updates across browser tabs and Supabase
   */
  subscribeToBannersChanges(callback: (banners: BannerItem[]) => void): () => void {
    const localHandler = (e: Event) => {
      const custom = e as CustomEvent<BannerItem[]>;
      if (custom.detail) {
        callback(custom.detail);
      } else {
        callback(getLocalCache());
      }
    };

    window.addEventListener(EVENT_NAME, localHandler);
    window.addEventListener('storage', localHandler);

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
      window.removeEventListener(EVENT_NAME, localHandler);
      window.removeEventListener('storage', localHandler);
      if (supabaseChannel && client) {
        client.removeChannel(supabaseChannel);
      }
    };
  },
};
