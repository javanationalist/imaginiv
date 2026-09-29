/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { CMSProject, CMSPortfolioItem, CMSTeamMember } from '../types';

/**
 * CMS Service Architecture
 * Manages future CRUD operations between Framedia Creative UI and Supabase database tables.
 */
export const cmsService = {
  // Projects collection
  async getProjects(): Promise<CMSProject[]> {
    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      const { data, error } = await client
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as CMSProject[];
      }
    }
    // Returns clean empty state for initial production stage
    return [];
  },

  async createProject(project: Omit<CMSProject, 'id' | 'createdAt'>): Promise<CMSProject | null> {
    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      const { data, error } = await client
        .from('projects')
        .insert([project])
        .select()
        .single();
      if (!error && data) return data as CMSProject;
    }
    return {
      id: 'proj_' + Date.now(),
      ...project,
      createdAt: new Date().toISOString(),
    };
  },

  // Portfolio collection
  async getPortfolioItems(): Promise<CMSPortfolioItem[]> {
    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      const { data, error } = await client
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as CMSPortfolioItem[];
      }
    }
    return [];
  },

  // Team collection
  async getTeamMembers(): Promise<CMSTeamMember[]> {
    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      const { data, error } = await client.from('team').select('*');
      if (!error && data) return data as CMSTeamMember[];
    }
    return [];
  },

  // 10 Being Creative collection
  async getTenCreativeItems(): Promise<{ id: string; rule: string; description: string }[]> {
    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      const { data, error } = await client.from('ten_creative').select('*');
      if (!error && data) return data;
    }
    return [];
  },

  // AI Ethics collection
  async getAiEthicsPolicies(): Promise<{ id: string; title: string; summary: string }[]> {
    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      const { data, error } = await client.from('ai_ethics').select('*');
      if (!error && data) return data;
    }
    return [];
  },

  // Inclusivity collection
  async getInclusivityGuidelines(): Promise<{ id: string; title: string; detail: string }[]> {
    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      const { data, error } = await client.from('inclusivity').select('*');
      if (!error && data) return data;
    }
    return [];
  },
};
