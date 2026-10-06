/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  Clapperboard, 
  Images, 
  Users, 
  Lightbulb, 
  Scale, 
  HeartHandshake, 
  Plus, 
  ExternalLink,
  Database,
  Layers,
  CheckCircle2,
  ToggleRight,
  AlertTriangle,
  Loader2,
  Compass,
  Check,
  Info,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabase';
import { usePageVisibility } from '../context/PageVisibilityContext';
import { Modal } from '../components/common/Modal';
import { ForestBackdrop } from '../components/common/VillageArtwork';
import { BannerManager } from '../components/admin/BannerManager';
import { ArticleManager } from '../components/admin/ArticleManager';
import { TheImaginersManager } from '../components/admin/TheImaginersManager';

type CMSTab = 'visibility' | 'banners' | 'articles' | 'projects' | 'portfolio' | 'team' | 'being_creative' | 'ethics' | 'inclusivity';

const PAGE_ICONS: Record<string, React.ElementType> = {
  'project': Clapperboard,
  'portfolio': Images,
  'being-creative': Lightbulb,
  'infra-team': Users,
  'ai-ethics': Scale,
  'inclusivity': HeartHandshake,
  'about': Compass,
  'article': BookOpen,
};

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CMSTab>('visibility');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Visibility Control States
  const { pages, updateVisibility, loading: pagesLoading } = usePageVisibility();
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'saving' | 'saved' } | null>(null);
  const [safetyWarningOpen, setSafetyWarningOpen] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle) return;
    setSaveNotice(`Entry "${newItemTitle}" staged in CMS architecture.`);
    setNewItemTitle('');
    setTimeout(() => {
      setIsCreateModalOpen(false);
      setSaveNotice(null);
    }, 1200);
  };

  const activePagesCount = pages.filter(p => p.is_visible).length;

  const handleToggleVisibility = async (pageId: string, currentVisible: boolean) => {
    // Safety check: Cannot disable all pages (at least 1 must remain visible)
    if (currentVisible && activePagesCount <= 1) {
      setPendingToggleId(pageId);
      setSafetyWarningOpen(true);
      return;
    }

    const nextState = !currentVisible;
    const pageLabel = pages.find(p => p.id === pageId)?.label || pageId;

    // Show saving toast
    setToastMessage({ text: `Saving visibility for "${pageLabel}"...`, type: 'saving' });

    const success = await updateVisibility(pageId, nextState);

    // Show saved toast
    setToastMessage({
      text: success
        ? `"${pageLabel}" is now ${nextState ? 'VISIBLE to all visitors' : 'HIDDEN from visitors'}.`
        : `Failed to update "${pageLabel}" in Supabase. Check network/env.`,
      type: 'saved',
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Grouped Menu Tabs as requested:
  // 1. Page visibility control (Top item)
  // 2. Manage: The Imaginers, Article, Project, Portfolio, Background Banners
  // 3. More: Being Creative, AI Ethics, Inclusivity, Supabase Dashboard ↗
  const manageTabs = [
    { id: 'team' as CMSTab, label: 'The Imaginers', icon: Users, isPrimary: true },
    { id: 'articles' as CMSTab, label: 'Article', icon: BookOpen, isPrimary: true },
    { id: 'projects' as CMSTab, label: 'Project', icon: Clapperboard },
    { id: 'portfolio' as CMSTab, label: 'Portfolio', icon: Images },
    { id: 'banners' as CMSTab, label: 'Background Banners', icon: Images, isPrimary: true },
  ];

  const moreTabs = [
    { id: 'being_creative' as CMSTab, label: 'Being Creative', icon: Lightbulb },
    { id: 'ethics' as CMSTab, label: 'AI Ethics', icon: Scale },
    { id: 'inclusivity' as CMSTab, label: 'Inclusivity', icon: HeartHandshake },
  ];

  const getTabDisplayName = (tab: CMSTab): string => {
    switch (tab) {
      case 'visibility': return 'Page Visibility Control';
      case 'team': return 'The Imaginers';
      case 'articles': return 'Article';
      case 'projects': return 'Project';
      case 'portfolio': return 'Portfolio';
      case 'banners': return 'Background Banners';
      case 'being_creative': return 'Being Creative';
      case 'ethics': return 'AI Ethics';
      case 'inclusivity': return 'Inclusivity';
      default: return 'Village CMS Portal';
    }
  };

  const getTabIcon = (tab: CMSTab): React.ElementType => {
    switch (tab) {
      case 'visibility': return ToggleRight;
      case 'team': return Users;
      case 'articles': return BookOpen;
      case 'projects': return Clapperboard;
      case 'portfolio': return Images;
      case 'banners': return Images;
      case 'being_creative': return Lightbulb;
      case 'ethics': return Scale;
      case 'inclusivity': return HeartHandshake;
      default: return Shield;
    }
  };

  const handleSelectTab = (tabId: CMSTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const renderSidebarContent = () => (
    <div className="game-parchment p-3 sm:p-4 rounded-xl space-y-3.5">
      {/* 1. Page visibility control */}
      <div>
        <button
          type="button"
          onClick={() => handleSelectTab('visibility')}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-display transition-all cursor-pointer text-left
            ${activeTab === 'visibility'
              ? 'bg-gradient-to-b from-[#67BDFF] to-[#146FBF] text-white border-2 border-[#093764] shadow-[0_2px_0_#062442]'
              : 'bg-[#FAF0D4] text-[#4A2408] border border-[#CBB38B] hover:bg-[#F3E2BD]'}
          `}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <ToggleRight className={`w-4 h-4 shrink-0 ${activeTab === 'visibility' ? 'text-white' : 'text-[#2F8FE0]'}`} />
            <span className="truncate">Page visibility control</span>
          </div>
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'visibility' ? 'bg-white/25 text-white' : 'bg-[#2F8FE0] text-white'}`}>
            HOT
          </span>
        </button>
      </div>

      {/* 2. Manage */}
      <div className="space-y-1">
        <div className="px-2 py-1 text-[11px] font-display uppercase tracking-wider text-[#7C471E] flex items-center gap-1.5 border-b border-[#D6BC90] mb-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>Manage</span>
        </div>

        {manageTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-display transition-all cursor-pointer text-left
                ${isActive
                  ? 'bg-gradient-to-b from-[#67BDFF] to-[#146FBF] text-white border-2 border-[#093764] shadow-[0_2px_0_#062442]'
                  : tab.isPrimary
                    ? 'bg-[#FAF0D4] text-[#4A2408] border border-[#CBB38B] hover:bg-[#F3E2BD]'
                    : 'text-[#5C3210] hover:bg-[#FAF2DF] border border-transparent'}
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : tab.isPrimary ? 'text-[#2F8FE0]' : 'text-[#8B5226]'}`} />
                <span className="truncate">{tab.label}</span>
              </div>
              {tab.isPrimary && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/25 text-white' : 'bg-[#2F8FE0] text-white'}`}>
                  HOT
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. More */}
      <div className="space-y-1">
        <div className="px-2 py-1 text-[11px] font-display uppercase tracking-wider text-[#7C471E] flex items-center gap-1.5 border-b border-[#D6BC90] mb-1.5">
          <Compass className="w-3.5 h-3.5" />
          <span>More</span>
        </div>

        {moreTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-display transition-all cursor-pointer text-left
                ${isActive
                  ? 'bg-gradient-to-b from-[#67BDFF] to-[#146FBF] text-white border-2 border-[#093764] shadow-[0_2px_0_#062442]'
                  : 'text-[#5C3210] hover:bg-[#FAF2DF] border border-transparent'}
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#8B5226]'}`} />
                <span className="truncate">{tab.label}</span>
              </div>
            </button>
          );
        })}

        {/* Supabase Dashboard ↗ */}
        <a
          href="https://supabase.com/dashboard/project/yjrdbggomigcotijziqf"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-display transition-all cursor-pointer text-left text-[#166E38] bg-[#E8F8F0] border border-[#B3E7CB] hover:bg-[#D5F2E3] hover:text-[#0C4F26]"
          title="Open Supabase Dashboard in new tab"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Database className="w-4 h-4 shrink-0 text-[#2A9755]" />
            <span className="truncate">Supabase Dashboard</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
        </a>
      </div>

      {/* 4. Footer: Supabase Engine */}
      <div className="pt-3 border-t-2 border-[#D6BC90] text-[11px] text-[#7C471E] font-bold px-2 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[#381E0A]">
          <Database className="w-3.5 h-3.5 text-[#2A7513]" />
          <span>Supabase Engine</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-[#2F6614] font-bold">
            {isSupabaseConfigured() ? 'Connected' : 'Local Fallback'}
          </span>
        </div>
        <div className="text-[10px] text-[#8C5226] font-normal leading-tight">
          {isSupabaseConfigured()
            ? 'Changes persist to PostgreSQL and broadcast live.'
            : 'Changes save to local store. Add VITE_SUPABASE_URL for live cloud sync.'}
        </div>
      </div>

      {/* 5. Account & Navigation Actions */}
      <div className="pt-3 border-t-2 border-[#D6BC90] space-y-2">
        <Link
          to="/"
          className="w-full game-btn-wood text-xs !py-2 !px-3 flex items-center justify-center gap-2 cursor-pointer shadow-[0_2px_0_#2B1302]"
          title="Visit Live Page (Village Map)"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Visit Page</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full game-btn-blue text-xs !py-2 !px-3 flex items-center justify-center gap-2 cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#FAF3E6] text-[#381E0A] relative">
      <ForestBackdrop />

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="game-parchment p-3 sm:p-4 rounded-xl border-2 border-[#542E10] shadow-[0_6px_0_#2B1302,0_12px_24px_rgba(0,0,0,0.35)] flex items-center gap-3 max-w-sm">
            {toastMessage.type === 'saving' ? (
              <Loader2 className="w-5 h-5 text-[#2F8FE0] animate-spin shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#52BE1A] text-white flex items-center justify-center shrink-0 border border-[#1F5407] shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
            <div className="text-xs sm:text-sm font-bold text-[#381E0A]">
              {toastMessage.text}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer (slides in from left) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-[310px] max-w-[85vw] bg-[#7E481D] border-r-4 border-[#452106] shadow-[10px_0_35px_rgba(0,0,0,0.6)] z-50 flex flex-col p-4 overflow-y-auto animate-in slide-in-from-left duration-250">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#542B0D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border border-[#4A2306] text-[#8B5226] flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="game-text-title text-sm text-white leading-none">CMS Navigation</div>
                  <div className="text-[10px] text-[#FFE8C2] mt-0.5 font-semibold">Admin Menu</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="game-wood-circle-btn !w-8 !h-8 text-white cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 pb-4">
              {renderSidebarContent()}
            </div>
          </div>
        </div>
      )}

      {/* Admin Top Header (Fixed at top of screen) */}
      <header className="fixed top-0 left-0 right-0 w-full z-30 h-14 sm:h-16 game-wood-header-strip px-4 sm:px-6 flex items-center justify-between shadow-[0_4px_0_#2B1302]">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border border-[#4A2306] text-[#8B5226] flex items-center justify-center font-bold shadow-xs shrink-0">
            {React.createElement(getTabIcon(activeTab), { className: 'w-5 h-5 text-[#8B5226]' })}
          </div>
          <div className="min-w-0">
            <div className="game-text-title text-sm sm:text-lg leading-tight truncate">
              {getTabDisplayName(activeTab)}
            </div>
            <div className="text-[11px] text-[#FFE8C2] font-semibold mt-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] truncate">
              Administrator: {currentUser?.email || 'admin@imaginiv.site'}
            </div>
          </div>
        </div>

        {/* Tombol Menu Mobile: Tersembunyi di PC (>= 1024px), hanya tampil di mobile (< 1024px) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="admin-mobile-menu-btn lg:!hidden game-btn-wood !w-9 !h-9 !p-0 items-center justify-center cursor-pointer shrink-0 shadow-[0_3px_0_#2A1202]"
          aria-label="Buka menu navigasi"
          title="Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Main Dashboard Layout (Full available viewport below fixed header) */}
      <div className="w-full flex-1 mt-14 sm:mt-16 flex overflow-hidden relative z-10">
        {/* Desktop Sidebar (full vertical height below header, independently scrollable) */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-full border-r-2 border-[#542B0D] bg-[#7E481D] overflow-y-auto p-3 sm:p-4 shadow-[4px_0_12px_rgba(0,0,0,0.15)] z-20">
          {renderSidebarContent()}
        </aside>

        {/* Main Admin Workspace (uses remaining width, full height, independently scrollable, no restrictive outer wooden frame) */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF3E6] min-w-0 flex flex-col justify-between">
          <div>
            {/* TAB 1: PAGE VISIBILITY CONTROL CENTER - COCKPIT STYLE */}
            {activeTab === 'visibility' && (
              <div className="my-4 sm:my-6 space-y-4">
                {/* Notice & Cockpit Status Banner */}
                <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#FFF8EC] to-[#FCEECC] rounded-xl border border-[#D6BC90] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8863A] shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[#5E3A1A] leading-relaxed font-semibold">
                      Toggling a switch immediately updates the database. Deactivated sectors disappear from the Navbar & Directory for <strong>ALL visitors</strong>.
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-xs font-mono font-bold text-[#381E0A] bg-[#FFFBF2] px-2.5 py-1 rounded-lg border border-[#D6BC90] shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#46B814] animate-pulse" />
                    <span>{activePagesCount} / {pages.length} ONLINE</span>
                  </div>
                </div>

                {/* Cockpit Control Grid */}
                {pagesLoading ? (
                  <div className="py-12 text-center space-y-3 animate-pulse">
                    <Loader2 className="w-8 h-8 text-[#2F8FE0] animate-spin mx-auto" />
                    <div className="text-sm font-bold text-[#7C471E]">Loading cockpit control modules...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {pages.map((page) => {
                      const IconComponent = PAGE_ICONS[page.id] || Compass;
                      const route = page.route || (page.id === 'infra-team' ? '/theimaginers' : page.id === 'being-creative' ? '/beingcreative' : `/${page.id.replace(/-/g, '')}`);

                      return (
                        <div
                          key={page.id}
                          className={`relative rounded-xl border-2 p-3 flex items-center justify-between gap-3 transition-all select-none ${
                            page.is_visible
                              ? 'bg-[#FFFDF7] border-[#4A2408] shadow-[0_2px_0_#4A2408]'
                              : 'bg-[#F3E7D3]/85 border-[#A88665] opacity-75 shadow-xs'
                          }`}
                        >
                          {/* Left: Small Icon + Page Name + Route */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                page.is_visible
                                  ? 'bg-[#FFF8EC] border-[#CBB38B] text-[#7A3F14] shadow-xs'
                                  : 'bg-[#E5D2AB] border-[#C0A87A] text-[#8C6B4E]'
                              }`}
                            >
                              <IconComponent className="w-4 h-4" strokeWidth={2.2} />
                            </div>

                            <div className="min-w-0">
                              <div className="font-display text-sm text-[#381E0A] truncate leading-tight">
                                {page.label}
                              </div>
                              <div className="text-[11px] font-mono font-semibold text-[#8B5226] truncate leading-tight mt-0.5">
                                {route}
                              </div>
                            </div>
                          </div>

                          {/* Right: Physical Cockpit Toggle Switch */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={page.is_visible}
                            aria-label={`Toggle visibility for ${page.label}`}
                            onClick={() => handleToggleVisibility(page.id, page.is_visible)}
                            className={`group relative inline-flex items-center h-7 w-14 rounded-lg p-0.5 cursor-pointer select-none transition-all duration-200 border-2 shrink-0 ${
                              page.is_visible
                                ? 'bg-[#2E7D17] border-[#184809] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.4)]'
                                : 'bg-[#5C3A21] border-[#381F0E] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]'
                            }`}
                          >
                            {/* Cockpit ON/OFF text label */}
                            <span
                              className={`text-[9px] font-mono font-black tracking-wider uppercase absolute transition-opacity duration-150 ${
                                page.is_visible ? 'left-1.5 text-[#E6FFCC]' : 'right-1.5 text-[#D4B598]'
                              }`}
                            >
                              {page.is_visible ? 'ON' : 'OFF'}
                            </span>

                            {/* Cockpit Toggle Rocker Knob */}
                            <span
                              className={`inline-block w-5 h-5 rounded-md bg-gradient-to-b from-[#FFFDF7] to-[#D9C4A1] border border-[#4A2408] shadow-[0_2px_0_#2B1302,0_2px_4px_rgba(0,0,0,0.25)] transform transition-transform duration-200 ease-out ${
                                page.is_visible ? 'translate-x-7' : 'translate-x-0'
                              }`}
                            >
                              {/* Tactile micro grip stripes */}
                              <span className="flex flex-col items-center justify-center h-full gap-0.5 pointer-events-none">
                                <span className="w-2.5 h-[1.5px] bg-[#8C5D35] rounded-full" />
                                <span className="w-2.5 h-[1.5px] bg-[#8C5D35] rounded-full" />
                              </span>
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

                  {/* TAB 2: HERO BANNER CAROUSEL MANAGEMENT */}
                  {activeTab === 'banners' && (
                    <div className="my-6">
                      <BannerManager />
                    </div>
                  )}

                  {/* TAB 3: ARTICLES & EDITORIAL ARCHIVE */}
                  {activeTab === 'articles' && (
                    <div className="my-6">
                      <ArticleManager />
                    </div>
                  )}

                  {/* TAB 4: THE IMAGINERS MANAGEMENT */}
                  {activeTab === 'team' && (
                    <div className="my-6">
                      <TheImaginersManager />
                    </div>
                  )}

                  {/* OTHER TABS: GENERAL CMS STANDBY */}
                  {activeTab !== 'visibility' && activeTab !== 'banners' && activeTab !== 'articles' && activeTab !== 'team' && (
                    <div className="my-8 p-6 sm:p-10 rounded-xl bg-[#FAF2DF] border-2 border-[#D6BC90] text-center">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border border-[#5D2B03] flex items-center justify-center text-[#8B5226] mb-3 shadow-xs">
                        <Database className="w-7 h-7" />
                      </div>
                      <h3 className="font-display text-lg text-[#381E0A] mb-1">
                        Ready for Village Content Staging
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5C3210] font-semibold max-w-md mx-auto mb-4">
                        Data records are synced to the central content system and ready for live updates across all village sectors.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="game-btn-wood text-xs !py-1.5 !px-3.5 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-white" />
                        <span>Create New Entry</span>
                      </button>
                    </div>
                  )}
          </div>

          <div className="mt-8 pt-4 border-t-2 border-[#D6BC90] flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-[#7C471E] gap-2">
            <span>Imaginiv Atelier CMS &bull; Page Visibility Engine</span>
            <div className="flex items-center gap-3">
              <span className="text-[#381E0A]">Active: {activePagesCount} / {pages.length}</span>
              <span className="text-[#A8642E]">&bull;</span>
              <span>Admin Gate Protected</span>
            </div>
          </div>
        </main>
      </div>

      {/* Safety Warning Modal (Prevents deactivating all pages) */}
      {safetyWarningOpen && (
        <Modal
          isOpen={true}
          onClose={() => setSafetyWarningOpen(false)}
          title="Safety Rule: Active Page Required"
        >
          <div className="p-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl text-[#381E0A]">
              At Least 1 Village Sector Must Remain Visible
            </h3>
            <p className="text-sm font-semibold text-[#5C3210] leading-relaxed max-w-sm mx-auto">
              You cannot deactivate all 7 sectors simultaneously. If every sector is hidden, village visitors will have no content to explore. Please leave at least one sector enabled.
            </p>
            <div className="pt-3 border-t-2 border-[#D6BC90] flex justify-center">
              <button
                type="button"
                onClick={() => setSafetyWarningOpen(false)}
                className="game-btn-blue text-xs sm:text-sm !py-2 !px-6 cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Creation Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          title={`Create ${getTabDisplayName(activeTab)} Entry`}
        >
          {saveNotice ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#2A7513] mx-auto animate-bounce" />
              <div className="font-display text-xl text-[#381E0A]">Entry Staged!</div>
              <p className="text-sm font-semibold text-[#5C3210]">{saveNotice}</p>
            </div>
          ) : (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#381E0A] mb-1">
                  Title or Name
                </label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="e.g. Echoes of the Atelier"
                  className="w-full bg-[#FFFDF7] text-[#381E0A] placeholder-[#8C6B4E] text-sm font-bold px-3 py-2 rounded-xl border-2 border-[#542E10] focus:outline-none focus:ring-2 focus:ring-[#2F8FE0]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t-2 border-[#D6BC90]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="game-btn-wood text-xs !py-2 !px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="game-btn-blue text-xs !py-2 !px-4 cursor-pointer"
                >
                  Stage Entry
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
