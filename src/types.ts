/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DirectoryItem {
  id: string;
  name: string;
  route: string;
  badge?: string;
  description: string;
  iconName: string;
  colorScheme: 'wood' | 'green' | 'blue' | 'parchment' | 'amber';
}

export interface NavLinkItem {
  name: string;
  route: string;
  badge?: string;
}

export interface VillageUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  name?: string;
}

export interface CMSProject {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface CMSPortfolioItem {
  id: string;
  title: string;
  mediaType: string;
  featured: boolean;
  createdAt: string;
}

export interface CMSTeamMember {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

export interface InfraMessage {
  id: string;
  sender: 'user' | 'infra';
  text: string;
  timestamp: string;
}

export interface PageVisibilityRecord {
  id: string;
  label: string;
  is_visible: boolean;
  updated_at?: string;
  route?: string;
}

export interface BannerItem {
  id: string;
  image_url: string;
  storage_path: string;
  caption?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  cover_image_path?: string | null;
  author?: string | null;
  is_published: boolean;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

