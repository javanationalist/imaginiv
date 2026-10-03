/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { 
  ImaginersPageData, 
  ImaginersMember, 
  MemberSocialLink 
} from '../types';

export const MAX_MEMBER_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const imaginersService = {
  /**
   * Fetch the configured page information (Judul & Deskripsi)
   * Both are optional. If empty in DB or table doesn't exist, returns empty strings.
   */
  async getPageData(): Promise<ImaginersPageData> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return { title: '', description: '' };
    }

    try {
      const { data, error } = await client
        .from('the_imaginers_page')
        .select('title, description, updated_at')
        .eq('id', 'main')
        .maybeSingle();

      if (error) {
        console.warn('Could not read the_imaginers_page from Supabase:', error.message);
        return { title: '', description: '' };
      }

      if (data) {
        return {
          title: typeof data.title === 'string' ? data.title : '',
          description: typeof data.description === 'string' ? data.description : '',
          updated_at: data.updated_at,
        };
      }

      return { title: '', description: '' };
    } catch (err) {
      console.error('Error fetching the_imaginers_page:', err);
      return { title: '', description: '' };
    }
  },

  /**
   * Save the configured page information (Judul & Deskripsi)
   * Both fields are optional and can be saved as empty strings.
   */
  async updatePageData(title: string = '', description: string = ''): Promise<{ success: boolean; data?: ImaginersPageData; error?: string }> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return {
        success: false,
        error: 'Supabase client is not configured. Please check your Supabase environment variables.',
      };
    }

    try {
      const payload = {
        id: 'main',
        title: title.trim(),
        description: description.trim(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from('the_imaginers_page')
        .upsert(payload)
        .select('title, description, updated_at')
        .maybeSingle();

      if (error) {
        console.error('Failed to update the_imaginers_page in Supabase:', error.message);
        return {
          success: false,
          error: `Database save failed: ${error.message}. Ensure you have run supabase_imaginers_setup.sql in Supabase SQL editor.`,
        };
      }

      return {
        success: true,
        data: {
          title: data?.title ?? (payload.title as string) ?? '',
          description: data?.description ?? (payload.description as string) ?? '',
          updated_at: data?.updated_at || (payload.updated_at as string) || new Date().toISOString(),
        },
      };
    } catch (err) {
      console.error('Exception updating the_imaginers_page:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error while saving page information.',
      };
    }
  },

  /**
   * Fetch all members ordered strictly by display_order
   * IMPORTANT: Never returns fabricated/mock members if empty.
   */
  async getMembers(): Promise<ImaginersMember[]> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return [];
    }

    try {
      const { data, error } = await client
        .from('the_imaginers_members')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Could not read the_imaginers_members from Supabase:', error.message);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((row) => {
        const photoUrl = row.photo_url || row.picture_url || '';
        const photoPath = row.photo_path || row.picture_path || null;

        return {
          id: row.id,
          name: row.name || '',
          nim: row.nim || null,
          photo_url: photoUrl,
          picture_url: photoUrl,
          photo_path: photoPath,
          picture_path: photoPath,
          role: row.role || '',
          social_media: Array.isArray(row.social_media) ? row.social_media : [],
          display_order: typeof row.display_order === 'number' ? row.display_order : 0,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };
      });
    } catch (err) {
      console.error('Exception fetching the_imaginers_members:', err);
      return [];
    }
  },

  /**
   * Upload a member photo to Supabase Storage
   */
  async uploadMemberPhoto(
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<{ success: boolean; publicUrl?: string; storagePath?: string; error?: string }> {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file format. Please upload JPG, PNG, WEBP, GIF, or SVG.',
      };
    }

    if (file.size > MAX_MEMBER_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: 'File size exceeds 5MB limit. Please compress or choose a smaller image.',
      };
    }

    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return {
        success: false,
        error: 'Supabase is not configured. Real database and storage connection is required.',
      };
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = `member_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const storagePath = `members/${cleanFileName}`;

    // Target bucket candidates: 'the-imaginers', fallback to 'article-covers' or 'banners'
    const targetBuckets = ['the-imaginers', 'article-covers', 'banners'];

    try {
      if (onProgress) onProgress(20);

      let uploadedBucket: string | null = null;
      let lastErrorMessage = '';

      for (const bucketName of targetBuckets) {
        const { error: uploadError } = await client.storage
          .from(bucketName)
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!uploadError) {
          uploadedBucket = bucketName;
          break;
        } else {
          lastErrorMessage = uploadError.message;
          if (!uploadError.message.toLowerCase().includes('not found') && !uploadError.message.toLowerCase().includes('does not exist')) {
            break;
          }
        }
      }

      if (!uploadedBucket) {
        return {
          success: false,
          error: `Storage upload failed: ${lastErrorMessage}. Please ensure bucket 'the-imaginers' or 'article-covers' exists in Supabase Storage.`,
        };
      }

      if (onProgress) onProgress(80);

      const { data: publicUrlData } = client.storage
        .from(uploadedBucket)
        .getPublicUrl(storagePath);

      if (onProgress) onProgress(100);

      return {
        success: true,
        publicUrl: publicUrlData.publicUrl,
        storagePath: `${uploadedBucket}:${storagePath}`,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to upload photo.',
      };
    }
  },

  // Alias for backward compatibility
  async uploadMemberPicture(file: File, onProgress?: (progress: number) => void) {
    return this.uploadMemberPhoto(file, onProgress);
  },

  /**
   * Create a new member
   */
  async createMember(data: {
    name: string;
    nim?: string | null;
    role: string;
    photo_url: string;
    photo_path?: string | null;
    social_media: MemberSocialLink[];
    display_order?: number;
  }): Promise<{ success: boolean; member?: ImaginersMember; error?: string }> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return {
        success: false,
        error: 'Supabase client is not configured.',
      };
    }

    try {
      let nextOrder = data.display_order;
      if (typeof nextOrder !== 'number') {
        const currentMembers = await this.getMembers();
        nextOrder = currentMembers.reduce((max, m) => Math.max(max, m.display_order), -1) + 1;
      }

      const photoUrl = data.photo_url.trim();
      const photoPath = data.photo_path || null;

      const insertPayload: Record<string, any> = {
        name: data.name.trim(),
        nim: data.nim ? data.nim.trim() : null,
        role: data.role.trim(),
        photo_url: photoUrl,
        picture_url: photoUrl, // for backward compat with existing table schema
        photo_path: photoPath,
        picture_path: photoPath,
        social_media: data.social_media || [],
        display_order: nextOrder,
      };

      const { data: createdRows, error } = await client
        .from('the_imaginers_members')
        .insert(insertPayload)
        .select('*');

      if (error) {
        console.error('Failed to insert member into the_imaginers_members:', error.message);
        return {
          success: false,
          error: `Failed to create member: ${error.message}. Make sure the table exists via supabase_imaginers_setup.sql.`,
        };
      }

      const created = createdRows && createdRows.length > 0 ? createdRows[0] : null;
      const finalPhoto = created?.photo_url || created?.picture_url || photoUrl;
      const finalPath = created?.photo_path || created?.picture_path || photoPath;

      return {
        success: true,
        member: {
          id: created?.id || crypto.randomUUID(),
          name: created?.name || data.name.trim(),
          nim: created?.nim || (data.nim ? data.nim.trim() : null),
          photo_url: finalPhoto,
          picture_url: finalPhoto,
          photo_path: finalPath,
          picture_path: finalPath,
          role: created?.role || data.role.trim(),
          social_media: Array.isArray(created?.social_media) ? created.social_media : [],
          display_order: created?.display_order || nextOrder,
          created_at: created?.created_at || new Date().toISOString(),
          updated_at: created?.updated_at || new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error creating member.',
      };
    }
  },

  /**
   * Update an existing member
   */
  async updateMember(
    id: string,
    data: Partial<{
      name: string;
      nim: string | null;
      role: string;
      photo_url: string;
      photo_path: string | null;
      social_media: MemberSocialLink[];
      display_order: number;
    }>
  ): Promise<{ success: boolean; member?: ImaginersMember; error?: string }> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return {
        success: false,
        error: 'Supabase client is not configured.',
      };
    }

    try {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (data.name !== undefined) updatePayload.name = data.name.trim();
      if (data.nim !== undefined) updatePayload.nim = data.nim ? data.nim.trim() : null;
      if (data.role !== undefined) updatePayload.role = data.role.trim();
      if (data.photo_url !== undefined) {
        updatePayload.photo_url = data.photo_url.trim();
        updatePayload.picture_url = data.photo_url.trim();
      }
      if (data.photo_path !== undefined) {
        updatePayload.photo_path = data.photo_path;
        updatePayload.picture_path = data.photo_path;
      }
      if (data.social_media !== undefined) updatePayload.social_media = data.social_media;
      if (data.display_order !== undefined) updatePayload.display_order = data.display_order;

      const { data: updatedRows, error } = await client
        .from('the_imaginers_members')
        .update(updatePayload)
        .eq('id', id)
        .select('*');

      if (error) {
        console.error('Failed to update member in Supabase:', error.message);
        return {
          success: false,
          error: `Failed to update member: ${error.message}`,
        };
      }

      let updated = updatedRows && updatedRows.length > 0 ? updatedRows[0] : null;

      if (!updated) {
        const { data: fetchRows } = await client
          .from('the_imaginers_members')
          .select('*')
          .eq('id', id)
          .limit(1);

        if (fetchRows && fetchRows.length > 0) {
          updated = fetchRows[0];
        }
      }

      const finalPhoto = updated?.photo_url || updated?.picture_url || (data.photo_url as string) || '';
      const finalPath = updated?.photo_path || updated?.picture_path || null;

      return {
        success: true,
        member: {
          id: updated?.id || id,
          name: updated?.name || (data.name ? data.name.trim() : ''),
          nim: updated?.nim || (data.nim ? data.nim.trim() : null),
          photo_url: finalPhoto,
          picture_url: finalPhoto,
          photo_path: finalPath,
          picture_path: finalPath,
          role: updated?.role || (data.role ? data.role.trim() : ''),
          social_media: Array.isArray(updated?.social_media) ? updated.social_media : (data.social_media || []),
          display_order: updated?.display_order ?? (data.display_order || 0),
          created_at: updated?.created_at || new Date().toISOString(),
          updated_at: updated?.updated_at || new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error updating member.',
      };
    }
  },

  /**
   * Delete a member
   */
  async deleteMember(id: string, photo_path?: string | null): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return {
        success: false,
        error: 'Supabase client is not configured.',
      };
    }

    try {
      // 1. Delete DB record
      const { error: dbError } = await client
        .from('the_imaginers_members')
        .delete()
        .eq('id', id);

      if (dbError) {
        return {
          success: false,
          error: `Failed to delete member: ${dbError.message}`,
        };
      }

      // 2. Best-effort storage cleanup
      if (photo_path && photo_path.includes(':')) {
        const [bucket, ...pathParts] = photo_path.split(':');
        const relativePath = pathParts.join(':');
        if (bucket && relativePath) {
          try {
            await client.storage.from(bucket).remove([relativePath]);
          } catch (_) {
            // Ignore storage deletion errors
          }
        }
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete member.',
      };
    }
  },

  /**
   * Batch update member display orders after drag and drop
   */
  async reorderMembers(
    orderedMembers: { id: string; display_order: number }[]
  ): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient();
    if (!isSupabaseConfigured() || !client) {
      return {
        success: false,
        error: 'Supabase client is not configured.',
      };
    }

    try {
      const updates = orderedMembers.map((item) =>
        client
          .from('the_imaginers_members')
          .update({
            display_order: item.display_order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id)
      );

      const results = await Promise.all(updates);
      const firstError = results.find((r) => r.error)?.error;

      if (firstError) {
        console.error('Failed to persist some member reordering:', firstError.message);
        return {
          success: false,
          error: `Failed to save new order: ${firstError.message}`,
        };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save member reorder.',
      };
    }
  },
};
