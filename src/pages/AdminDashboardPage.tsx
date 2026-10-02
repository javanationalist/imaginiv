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
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  Compass,
  Check,
  Info,
  BookOpen
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

const PAGE_DESCRIPTIONS: Record<string, string> = {
  'project': 'Cinema pipeline, active narrative film productions & sound archives',
  'portfolio': 'Curated tactile visual showcase, publications & spatial pavilions',
  'being-creative': '10 foundational creative tenets & dual-perspective analysis',
  'infra-team': 'Collaborative collective of directors, artisans & creative technologists',
  'ai-ethics': 'Human authorship charter, copyright integrity & ethical AI commitments',
  'inclusivity': 'Universal sensory accessibility, diverse voices & neurodivergent design',
  'about': 'Origins story, studio vision & multidisciplinary atelier philosophy',
  'article': 'Editorial essays, studio methodology & published workshop lectures',
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

  const tabs = [
    { id: 'visibility' as CMSTab, label: 'Page Visibility Control', icon: ToggleRight, isPrimary: true },
    { id: 'banners' as CMSTab, label: 'Background Banners', icon: Images, isPrimary: true },
    { id: 'articles' as CMSTab, label: 'Articles & Stories', icon: BookOpen, isPrimary: true },
    { id: 'projects' as CMSTab, label: 'Project', icon: Clapperboard },
    { id: 'portfolio' as CMSTab, label: 'Portfolio', icon: Images },
    { id: 'being_creative' as CMSTab, label: 'Being Creative', icon: Lightbulb },
    { id: 'team' as CMSTab, label: 'The Imaginers', icon: Users, isPrimary: true },
    { id: 'ethics' as CMSTab, label: 'AI Ethics', icon: Scale },
    { id: 'inclusivity' as CMSTab, label: 'Inclusivity', icon: HeartHandshake },
  ];

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'visibility': return 'Page Visibility Control Center';
      case 'banners': return 'Background Banners Management';
      case 'articles': return 'Articles & Editorial Archive';
      case 'projects': return 'Project Management';
      case 'portfolio': return 'Portfolio Management';
      case 'team': return 'The Imaginers Management';
      case 'being_creative': return 'Being Creative Tenets';
      case 'ethics': return 'AI Ethics Charter Management';
      case 'inclusivity': return 'Inclusivity Framework';
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden text-[#381E0A]">
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

      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 w-full px-3 sm:px-6 pt-3">
        <div className="max-w-[1240px] mx-auto game-wood-plank px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_4px_0_#2B1302]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border border-[#4A2306] text-[#8B5226] flex items-center justify-center font-bold shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="game-text-title text-base sm:text-lg leading-none">
                Village CMS Portal
              </div>
              <div className="text-[11px] text-[#FFE8C2] font-semibold mt-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                Administrator: {currentUser?.email || 'admin@imaginiv.site'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="game-btn-wood text-xs !py-1.5 !px-3 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Village Map</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="game-btn-blue text-xs !py-1.5 !px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-3 sm:px-6 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <aside className="lg:col-span-1">
            <div className="game-wood-frame p-3 sm:p-4 relative">
              <div className="game-parchment p-3 sm:p-4 rounded-xl space-y-1.5">
                <div className="px-2 py-1.5 text-xs font-display uppercase tracking-wider text-[#7C471E] flex items-center gap-2 border-b-2 border-[#D6BC90] mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Village Controls</span>
                </div>

                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
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

                <div className="pt-3 mt-2 border-t-2 border-[#D6BC90] text-[11px] text-[#7C471E] font-bold px-2 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#381E0A]">
                    <Database className="w-3.5 h-3.5 text-[#2A7513]" />
                    <span>Supabase Engine</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span>{isSupabaseConfigured() ? 'Supabase Connected' : 'Local Fallback Mode'}</span>
                  </div>
                  <div className="text-[10px] text-[#8C5226] font-normal leading-tight">
                    {isSupabaseConfigured()
                      ? 'Changes persist to PostgreSQL and broadcast live.'
                      : 'Changes save to local store. Add VITE_SUPABASE_URL for live cloud sync.'}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* CMS Sector Workspace */}
          <section className="lg:col-span-3">
            <div className="game-wood-frame p-4 sm:p-6 relative min-h-[460px] flex flex-col justify-between">
              <div className="game-parchment p-5 sm:p-7 rounded-xl flex-1 flex flex-col justify-between">
                <div>
                  {/* Sector Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#D6BC90]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="game-wood-pill text-[11px] font-bold px-2.5 py-0.5">
                          Admin Management
                        </span>
                        <span className="text-xs font-bold text-[#6B492B]">
                          {activePagesCount} of {pages.length} Sectors Active
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl text-[#381E0A]">
                        {getActiveTabTitle()}
                      </h2>
                    </div>

                    {activeTab !== 'visibility' && activeTab !== 'banners' && activeTab !== 'articles' && activeTab !== 'team' && (
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="game-btn-blue text-xs sm:text-sm !py-2 !px-4 inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-white" />
                        <span>Add Entry</span>
                      </button>
                    )}
                  </div>

                  {/* TAB 1: PAGE VISIBILITY CONTROL CENTER */}
                  {activeTab === 'visibility' && (
                    <div className="my-6 space-y-4">
                      {/* Notice Banner */}
                      <div className="p-4 bg-gradient-to-r from-[#FFF8EC] to-[#FCEECC] rounded-xl border border-[#D6BC90] flex items-start gap-3">
                        <Info className="w-5 h-5 text-[#E8863A] shrink-0 mt-0.5" />
                        <div className="text-xs sm:text-sm text-[#5E3A1A] leading-relaxed font-semibold">
                          Toggling a page switch immediately updates the database. Deactivated pages disappear from the Navbar and Directory for <strong>ALL visitors</strong>, and direct URLs display a stylized "Page Unavailable" notice instead of a 404 error.
                        </div>
                      </div>

                      {/* Pages List */}
                      {pagesLoading ? (
                        <div className="py-12 text-center space-y-3 animate-pulse">
                          <Loader2 className="w-8 h-8 text-[#2F8FE0] animate-spin mx-auto" />
                          <div className="text-sm font-bold text-[#7C471E]">Loading page visibility records...</div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {pages.map((page) => {
                            const IconComponent = PAGE_ICONS[page.id] || Compass;
                            const description = PAGE_DESCRIPTIONS[page.id] || 'Village sector destination';

                            return (
                              <div
                                key={page.id}
                                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                  page.is_visible
                                    ? 'bg-white border-[#D6BC90] shadow-sm'
                                    : 'bg-[#F2E5CE]/70 border-[#D1B78E] opacity-85'
                                }`}
                              >
                                {/* Left Info */}
                                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                                  {/* Icon */}
                                  <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
                                      page.is_visible
                                        ? 'bg-gradient-to-b from-[#FFF8EC] to-[#F5E2B8] border-[#CBB38B] text-[#8B5226]'
                                        : 'bg-[#E5D2AB] border-[#C0A87A] text-[#8C6B4E]'
                                    }`}
                                  >
                                    <IconComponent className="w-6 h-6" strokeWidth={2.2} />
                                  </div>

                                  {/* Text */}
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h3 className="font-display text-lg text-[#381E0A]">
                                        {page.label}
                                      </h3>
                                      <span className="text-[11px] font-mono font-bold text-[#8B5226] bg-[#F2E4C8] px-2 py-0.5 rounded-md border border-[#DEC9A3]">
                                        {page.route || `/${page.id}`}
                                      </span>
                                      {page.is_visible ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2A7513] bg-[#EAF7E2] px-2 py-0.5 rounded-full border border-[#BCE4AA]">
                                          <Eye className="w-3 h-3" />
                                          <span>Visible to Visitors</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9C3811] bg-[#FDF0E9] px-2 py-0.5 rounded-full border border-[#F5C7B0]">
                                          <EyeOff className="w-3 h-3" />
                                          <span>Resting (Hidden)</span>
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-[#5C3210] font-semibold mt-1">
                                      {description}
                                    </p>
                                  </div>
                                </div>

                                {/* Right: Game 3D Toggle Switch */}
                                <div className="flex items-center justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8D8B8]">
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={page.is_visible}
                                    aria-label={`Toggle visibility for ${page.label}`}
                                    onClick={() => handleToggleVisibility(page.id, page.is_visible)}
                                    className={`
                                      group relative inline-flex items-center w-20 sm:w-24 h-9 sm:h-10 rounded-full cursor-pointer select-none transition-colors duration-200 ease-in-out border-3 border-[#4A2306] shadow-[0_4px_0_#2B1302,inset_0_2px_4px_rgba(0,0,0,0.4)]
                                      ${page.is_visible
                                        ? 'bg-gradient-to-r from-[#62C922] to-[#45A311]'
                                        : 'bg-gradient-to-r from-[#8C5D35] to-[#633917]'}
                                    `}
                                  >
                                    {/* Background text indicator */}
                                    <span className={`text-[10px] font-black uppercase tracking-wider absolute transition-opacity duration-150 ${page.is_visible ? 'left-2.5 text-white opacity-95' : 'right-2.5 text-[#EAD0A8] opacity-80'}`}>
                                      {page.is_visible ? 'ON' : 'OFF'}
                                    </span>

                                    {/* 3D Sliding Glossy Knob */}
                                    <span
                                      className={`
                                        pointer-events-none inline-block w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#FDF5E6] to-[#E2CEAB] border-2 border-[#542E10] shadow-[0_3px_0_#2E1303,0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.9)] transform transition-transform duration-200 ease-out
                                        ${page.is_visible ? 'translate-x-11 sm:translate-x-14' : 'translate-x-1'}
                                      `}
                                    >
                                      {/* Mini center gold rivet */}
                                      <span className="block w-2 h-2 rounded-full bg-[#D4A346] border border-[#754E15] mx-auto mt-2" />
                                    </span>
                                  </button>
                                </div>
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

                <div className="pt-4 border-t-2 border-[#D6BC90] flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-[#7C471E] gap-2">
                  <span>Imaginiv Atelier CMS &bull; Page Visibility Engine</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#381E0A]">Active: {activePagesCount} / {pages.length}</span>
                    <span className="text-[#A8642E]">&bull;</span>
                    <span>Admin Gate Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

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
          title={`Create ${tabs.find(t => t.id === activeTab)?.label} Entry`}
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
