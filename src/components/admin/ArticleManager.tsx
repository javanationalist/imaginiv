/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  Upload, 
  Check, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  User, 
  FileText, 
  RefreshCw, 
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import { ArticleItem } from '../../types';
import { articlesService } from '../../services/articlesService';
import { Modal } from '../common/Modal';
import { MarkdownContent } from '../ui/MarkdownContent';

type EditorTab = 'write' | 'preview';

export const ArticleManager: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');

  // Active editing article (null = create new)
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Framedia Editorial');
  const [isPublished, setIsPublished] = useState(true);

  // Cover image states
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverStoragePath, setCoverStoragePath] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Editor tab (Write / Preview)
  const [editorTab, setEditorTab] = useState<EditorTab>('write');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delete modal state
  const [articleToDelete, setArticleToDelete] = useState<ArticleItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'saving' | 'saved' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articlesService.getAllArticlesForAdmin();
      setArticles(data);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();

    const unsubscribe = articlesService.subscribeToArticlesChanges((fresh) => {
      setArticles(fresh);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (text: string, type: 'saving' | 'saved' | 'error' = 'saved') => {
    setToastMessage({ text, type });
    if (type !== 'saving') {
      setTimeout(() => setToastMessage(null), 3200);
    }
  };

  // Real-time slug derivation from title when not manually overridden
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugManual) {
      setSlug(articlesService.generateSlug(newTitle));
    }
  };

  const handleManualSlugChange = (newSlug: string) => {
    setIsSlugManual(true);
    setSlug(articlesService.generateSlug(newSlug));
  };

  const handleResetSlug = () => {
    setIsSlugManual(false);
    setSlug(articlesService.generateSlug(title));
  };

  const handleStartCreate = () => {
    setEditingArticleId(null);
    setTitle('');
    setSlug('');
    setIsSlugManual(false);
    setExcerpt('');
    setContent('');
    setAuthor('Framedia Editorial');
    setIsPublished(true);
    setCoverFile(null);
    setCoverPreviewUrl(null);
    setCoverStoragePath(null);
    setErrorMessage(null);
    setEditorTab('write');
    setViewMode('editor');
  };

  const handleStartEdit = (art: ArticleItem) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setSlug(art.slug);
    setIsSlugManual(true);
    setExcerpt(art.excerpt || '');
    setContent(art.content);
    setAuthor(art.author || 'Framedia Editorial');
    setIsPublished(art.is_published);
    setCoverFile(null);
    setCoverPreviewUrl(art.cover_image_url || null);
    setCoverStoragePath(art.cover_image_path || null);
    setErrorMessage(null);
    setEditorTab('write');
    setViewMode('editor');
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreviewUrl(objectUrl);
  };

  const handleSave = async (publishNow?: boolean) => {
    if (!title.trim()) {
      setErrorMessage('Please enter an article title.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Article content cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    showToast('Saving article to database...', 'saving');

    const publishState = publishNow !== undefined ? publishNow : isPublished;

    // Handle cover upload if new file chosen
    let finalCoverUrl = coverPreviewUrl;
    let finalCoverPath = coverStoragePath;

    if (coverFile) {
      setUploadingCover(true);
      const uploadRes = await articlesService.uploadCoverImage(coverFile);
      setUploadingCover(false);

      if (uploadRes.success && uploadRes.publicUrl) {
        finalCoverUrl = uploadRes.publicUrl;
        finalCoverPath = uploadRes.storagePath || null;
      } else {
        setErrorMessage(uploadRes.error || 'Failed to upload cover image.');
        setSaving(false);
        showToast('Cover image upload failed.', 'error');
        return;
      }
    }

    if (editingArticleId) {
      // Update existing
      const result = await articlesService.updateArticle(editingArticleId, {
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        cover_image_url: finalCoverUrl,
        cover_image_path: finalCoverPath,
        author: author.trim() || 'Framedia Editorial',
        is_published: publishState,
      });

      setSaving(false);

      if (result.success) {
        showToast('Article updated successfully!', 'saved');
        setViewMode('list');
        fetchArticles();
      } else {
        setErrorMessage(result.error || 'Failed to update article.');
        showToast(result.error || 'Update failed', 'error');
      }
    } else {
      // Create new
      const result = await articlesService.createArticle({
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        content: content.trim(),
        cover_image_url: finalCoverUrl || undefined,
        cover_image_path: finalCoverPath || undefined,
        author: author.trim() || 'Framedia Editorial',
        is_published: publishState,
      });

      setSaving(false);

      if (result.success) {
        showToast('Article created and registered!', 'saved');
        setViewMode('list');
        fetchArticles();
      } else {
        setErrorMessage(result.error || 'Failed to create article.');
        showToast(result.error || 'Creation failed', 'error');
      }
    }
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    const { id, cover_image_path } = articleToDelete;
    setArticleToDelete(null);

    showToast('Deleting article...', 'saving');
    const success = await articlesService.deleteArticle(id, cover_image_path);

    if (success) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast('Article permanently deleted.', 'saved');
    } else {
      showToast('Failed to delete article.', 'error');
      fetchArticles();
    }
  };

  const insertMarkdownSnippet = (snippet: string) => {
    setContent((prev) => prev + snippet);
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Draft';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (_) {
      return 'Draft';
    }
  };

  return (
    <div className="space-y-6 text-[#381E0A]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="game-parchment p-3 sm:p-4 rounded-xl border-2 border-[#542E10] shadow-[0_6px_0_#2B1302,0_12px_24px_rgba(0,0,0,0.35)] flex items-center gap-3 max-w-sm">
            {toastMessage.type === 'saving' ? (
              <Loader2 className="w-5 h-5 text-[#2F8FE0] animate-spin shrink-0" />
            ) : toastMessage.type === 'error' ? (
              <div className="w-6 h-6 rounded-full bg-[#E53935] text-white flex items-center justify-center shrink-0 border border-[#8B0000]">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#52BE1A] text-white flex items-center justify-center shrink-0 border border-[#1F5407]">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
            <div className="text-xs sm:text-sm font-bold text-[#381E0A]">
              {toastMessage.text}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: ARTICLE LIST TABLE */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FFF8EC] to-[#FCEECC] border-2 border-[#D6BC90] shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="game-wood-pill text-[11px] font-bold px-2.5 py-0.5">
                  Editorial Studio
                </span>
                <span className="text-xs font-bold text-[#6B492B]">
                  {articles.length} Total Articles
                </span>
              </div>
              <h3 className="font-display text-xl text-[#381E0A]">
                Articles &amp; Editorial Manuscripts
              </h3>
              <p className="text-xs text-[#5C3210] font-semibold mt-0.5">
                Manage articles, write essays, and configure URL slugs for published public items.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={fetchArticles}
                className="game-btn-wood text-xs !py-2 !px-3 cursor-pointer"
                title="Refresh list"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleStartCreate}
                className="game-btn-blue text-xs sm:text-sm !py-2 !px-4 inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Write New Article</span>
              </button>
            </div>
          </div>

          {/* List Table / Cards */}
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#2F8FE0] animate-spin mx-auto" />
              <div className="text-sm font-bold text-[#7C471E]">Loading articles archive...</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-10 text-center bg-[#FAF2DF] rounded-2xl border-2 border-dashed border-[#D6BC90]">
              <FileText className="w-12 h-12 text-[#C0A87A] mx-auto mb-2" />
              <div className="font-display text-lg text-[#381E0A]">No Articles Yet</div>
              <p className="text-xs text-[#7C471E] font-semibold mt-1 max-w-sm mx-auto">
                Begin composing your first studio editorial essay or lecture synthesis.
              </p>
              <button
                type="button"
                onClick={handleStartCreate}
                className="mt-4 game-btn-blue text-xs !py-2 !px-4 cursor-pointer"
              >
                Write First Article
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    art.is_published
                      ? 'bg-white border-[#D6BC90] shadow-sm'
                      : 'bg-[#F2E5CE]/70 border-[#D1B78E] opacity-85'
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Cover Thumbnail */}
                    <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border-2 border-[#542E10] shadow-xs shrink-0 bg-[#2A1608]">
                      {art.cover_image_url ? (
                        <img
                          src={art.cover_image_url}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#B08A5E]">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Title, Slug & Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display text-base sm:text-lg text-[#381E0A] truncate">
                          {art.title}
                        </h4>

                        {art.is_published ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2A7513] bg-[#EAF7E2] px-2 py-0.5 rounded-full border border-[#BCE4AA]">
                            <Check className="w-3 h-3" />
                            <span>Published</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#A85D10] bg-[#FFF3E0] px-2 py-0.5 rounded-full border border-[#FFE0B2]">
                            <span>Draft</span>
                          </span>
                        )}
                      </div>

                      {/* Slug Display */}
                      <div className="flex items-center gap-1.5 mt-1 text-xs">
                        <LinkIcon className="w-3.5 h-3.5 text-[#8C5D35] shrink-0" />
                        <span className="font-mono text-[#8C5D35] bg-[#F2E5CE] px-2 py-0.5 rounded border border-[#DEC9A3] truncate max-w-xs sm:max-w-md">
                          /article/{art.slug}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#7C471E] font-medium mt-1.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#2F8FE0]" />
                          <span>{art.author || 'Framedia Editorial'}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#A05C25]" />
                          <span>{formatDate(art.published_at || art.created_at)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E8D8B8]">
                    {art.is_published && (
                      <a
                        href={`/article/${art.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="game-btn-wood text-xs !py-1.5 !px-3 inline-flex items-center gap-1"
                        title="View published article"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="hidden sm:inline">View</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleStartEdit(art)}
                      className="game-btn-blue text-xs !py-1.5 !px-3.5 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setArticleToDelete(art)}
                      className="w-8 h-8 rounded-xl bg-[#FFF2F0] hover:bg-[#FDE2DF] border border-[#F5C2BC] text-[#D32F2F] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ARTICLE EDITOR FORM */}
      {viewMode === 'editor' && (
        <div className="space-y-6">
          {/* Top Return Bar */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#D6BC90]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="game-btn-wood text-xs sm:text-sm !py-1.5 !px-3.5 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles List</span>
            </button>

            <div className="text-xs font-bold text-[#7C471E]">
              {editingArticleId ? 'Editing Article' : 'Creating New Article'}
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-xs sm:text-sm text-[#C62828] font-bold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Column (8 cols): Title, Slug, Content */}
            <div className="lg:col-span-8 space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-xs font-display uppercase tracking-wider text-[#7C471E] mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 10 Being Creative that The Lecturer Explains"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#D6BC90] bg-[#FFFBF2] text-[#381E0A] font-display text-xl sm:text-2xl placeholder-[#9C7955] focus:outline-none focus:border-[#2F8FE0] transition-colors"
                />
              </div>

              {/* Live URL Slug Preview & Manual Override */}
              <div className="p-3 sm:p-4 rounded-xl bg-[#FFF8EC] border-2 border-[#E5D2AB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display uppercase tracking-wider text-[#7C471E] flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-[#2F8FE0]" />
                    <span>Live URL Slug Preview</span>
                  </span>

                  {isSlugManual && (
                    <button
                      type="button"
                      onClick={handleResetSlug}
                      className="text-[11px] font-bold text-[#2F8FE0] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Automatic</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8C5D35] font-mono select-none">
                    framedia.creative/article/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleManualSlugChange(e.target.value)}
                    placeholder="article-slug"
                    className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-[#D6BC90] bg-white text-[#381E0A] focus:outline-none focus:border-[#2F8FE0]"
                  />
                </div>
                <p className="text-[10px] text-[#8C5D35] font-medium">
                  {isSlugManual
                    ? 'Custom slug locked. Click "Reset to Automatic" to re-derive from the title.'
                    : 'Auto-generating from title using clean hyphenated alphanumeric format.'}
                </p>
              </div>

              {/* Excerpt Textarea */}
              <div>
                <label className="block text-xs font-display uppercase tracking-wider text-[#7C471E] mb-1.5">
                  Lead Excerpt (Summary for Directory &amp; Cards)
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise synopsis of the article's core tenets or story..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#D6BC90] bg-[#FFFBF2] text-[#381E0A] text-sm placeholder-[#9C7955] focus:outline-none focus:border-[#2F8FE0] transition-colors resize-y"
                />
              </div>

              {/* Content Editor with Write / Preview Tabs */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-[#D6BC90] pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditorTab('write')}
                      className={`px-3 py-1 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                        editorTab === 'write'
                          ? 'bg-[#2F8FE0] text-white shadow-xs'
                          : 'text-[#7C471E] hover:bg-[#FAF0D4]'
                      }`}
                    >
                      Write (Markdown)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`px-3 py-1 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                        editorTab === 'preview'
                          ? 'bg-[#2F8FE0] text-white shadow-xs'
                          : 'text-[#7C471E] hover:bg-[#FAF0D4]'
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>

                  {/* Quick Markdown Inserts */}
                  {editorTab === 'write' && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#7C471E]">
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet('\n## Section Heading\n')}
                        className="px-2 py-0.5 rounded bg-[#FAF0D4] border border-[#D6BC90] hover:bg-[#F3E2BD]"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet(' **bold text** ')}
                        className="px-2 py-0.5 rounded bg-[#FAF0D4] border border-[#D6BC90] hover:bg-[#F3E2BD]"
                      >
                        Bold
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet('\n> "Quote text goes here"\n')}
                        className="px-2 py-0.5 rounded bg-[#FAF0D4] border border-[#D6BC90] hover:bg-[#F3E2BD]"
                      >
                        Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet('\n* Bullet item 1\n* Bullet item 2\n')}
                        className="px-2 py-0.5 rounded bg-[#FAF0D4] border border-[#D6BC90] hover:bg-[#F3E2BD]"
                      >
                        List
                      </button>
                    </div>
                  )}
                </div>

                {editorTab === 'write' ? (
                  <textarea
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write article content in Markdown format... Use ## for headings, **bold**, *italic*, > blockquotes, and * bullet lists."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#D6BC90] bg-[#FFFBF2] text-[#381E0A] font-sans text-sm sm:text-base placeholder-[#9C7955] focus:outline-none focus:border-[#2F8FE0] transition-colors leading-relaxed"
                  />
                ) : (
                  <div className="p-6 rounded-2xl bg-white border-2 border-[#D6BC90] min-h-[380px]">
                    <MarkdownContent content={content || '*No content entered yet.*'} />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Column (4 cols): Cover, Author, Publishing Status, Actions */}
            <div className="lg:col-span-4 space-y-5">
              {/* Publishing Control Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#D6BC90] shadow-sm space-y-4">
                <h4 className="font-display text-base text-[#381E0A] border-b border-[#D6BC90] pb-2">
                  Publication Status
                </h4>

                {/* Status Toggle Switch */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#381E0A]">
                      {isPublished ? 'Published to Public' : 'Saved as Draft'}
                    </div>
                    <div className="text-[10px] text-[#7C471E]">
                      {isPublished ? 'Visible at /article and in search' : 'Only authenticated admins can preview'}
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPublished}
                    onClick={() => setIsPublished((prev) => !prev)}
                    className={`
                      group relative inline-flex items-center w-16 h-7 rounded-full cursor-pointer select-none transition-colors border-2 border-[#4A2306] shadow-[0_2px_0_#2B1302]
                      ${isPublished ? 'bg-gradient-to-r from-[#62C922] to-[#45A311]' : 'bg-gradient-to-r from-[#8C5D35] to-[#633917]'}
                    `}
                  >
                    <span className={`text-[8px] font-black uppercase tracking-wider absolute transition-opacity ${isPublished ? 'left-1.5 text-white' : 'right-1.5 text-[#EAD0A8]'}`}>
                      {isPublished ? 'ON' : 'OFF'}
                    </span>
                    <span
                      className={`
                        pointer-events-none inline-block w-5 h-5 rounded-full bg-white border border-[#542E10] shadow-sm transform transition-transform duration-200
                        ${isPublished ? 'translate-x-9' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Author Input */}
                <div>
                  <label className="block text-xs font-display uppercase tracking-wider text-[#7C471E] mb-1">
                    Author Credit
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Framedia Editorial Atelier"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D6BC90] bg-[#FFFBF2] text-[#381E0A] focus:outline-none focus:border-[#2F8FE0]"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="game-btn-blue text-xs sm:text-sm !py-2.5 !px-4 w-full inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Save &amp; Publish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    className="game-btn-wood text-xs !py-2 !px-4 w-full inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Save as Draft</span>
                  </button>
                </div>
              </div>

              {/* Cover Image Upload Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#D6BC90] shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#D6BC90] pb-2">
                  <h4 className="font-display text-base text-[#381E0A]">
                    Cover Image
                  </h4>
                  {coverPreviewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreviewUrl(null);
                        setCoverStoragePath(null);
                      }}
                      className="text-[10px] font-bold text-[#D32F2F] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D6BC90] hover:border-[#2F8FE0] bg-[#FAF3E4] rounded-xl p-3 text-center cursor-pointer transition-all overflow-hidden min-h-[120px] flex flex-col items-center justify-center relative group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />

                  {coverPreviewUrl ? (
                    <div className="w-full h-32 rounded-lg overflow-hidden relative">
                      <img
                        src={coverPreviewUrl}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                        Change Image
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-[#2F8FE0] mb-1" />
                      <div className="text-xs font-bold text-[#381E0A]">Upload Cover Photo</div>
                      <div className="text-[10px] text-[#7C471E]">JPG, PNG, WEBP &bull; Max 5MB</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {articleToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setArticleToDelete(null)}
          title="Delete Article"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-[#B71C1C] font-semibold leading-relaxed">
                Are you sure you want to permanently delete <strong>&ldquo;{articleToDelete.title}&rdquo;</strong>? This will remove the article and its URL slug (/article/{articleToDelete.slug}) from the website and database.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BC90]">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="game-btn-wood text-xs !py-2 !px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-display font-bold text-white bg-gradient-to-b from-[#EF5350] to-[#C62828] border-2 border-[#8E0000] shadow-[0_3px_0_#5F0000] hover:brightness-105 active:translate-y-0.5 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
