/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  BookOpen, 
  Share2, 
  Check, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { PageShell } from '../components/common/PageShell';
import { ArticleItem } from '../types';
import { articlesService } from '../services/articlesService';
import { authService } from '../services/authService';
import { MarkdownContent } from '../components/ui/MarkdownContent';
import { getArticleShareUrl } from '../utils/urlUtils';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const currentUser = authService.getCurrentUser();
  const isAdmin = Boolean(currentUser);

  useEffect(() => {
    let isMounted = true;

    const fetchArticle = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await articlesService.getArticleBySlug(slug, isAdmin);
        if (isMounted) {
          setArticle(data);
          if (data) {
            // SEO updates
            document.title = `${data.title} - Imaginiv`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && data.excerpt) {
              metaDesc.setAttribute('content', data.excerpt);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load article detail:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [slug, isAdmin]);

  const handleCopyLink = async () => {
    const targetSlug = article?.slug || slug || '';
    const shareUrl = getArticleShareUrl(targetSlug);

    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title || 'Imaginiv Article',
          text: article?.excerpt || article?.title || 'Read this article on Imaginiv',
          url: shareUrl,
        });
        return;
      } catch (_) {
        // Fallback to clipboard copy if share dialog was dismissed
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Recently Published';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (_) {
      return 'Recent';
    }
  };

  // 1. LOADING STATE
  if (loading) {
    return (
      <PageShell>
        <div className="py-24 text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F8FE0] animate-spin mx-auto" />
          <div className="font-display text-lg text-[#381E0A]">
            Opening article manuscript...
          </div>
        </div>
      </PageShell>
    );
  }

  // 2. NOT FOUND BEHAVIOR (Friendly Stylized Wood Panel)
  if (!article) {
    return (
      <PageShell>
        <div className="py-12 sm:py-16 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#FFF5E0] to-[#EADBBD] border-2 border-[#542E10] flex items-center justify-center text-[#8B5226] mx-auto shadow-md">
            <AlertCircle className="w-8 h-8 text-[#C62828]" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-[#381E0A]">
            Article Not Found
          </h2>

          <p className="text-sm sm:text-base text-[#5C3210] font-semibold leading-relaxed">
            The article manuscript with slug <code className="px-2 py-0.5 rounded bg-[#F2E5CE] text-[#8C5226] font-mono">{slug}</code> could not be located in our editorial archives, or it may currently be resting as an unpublished draft.
          </p>

          <div className="pt-4">
            <Link
              to="/article"
              className="game-btn-blue text-sm font-display tracking-wide inline-flex items-center justify-center px-6 py-3 cursor-pointer"
            >
              <span>Back to All Articles</span>
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // 3. ARTICLE DETAIL DISPLAY
  return (
    <PageShell>
      {/* Top Back Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b-2 border-[#D6BC90] mb-8">
        <Link
          to="/article"
          className="game-btn-wood text-xs sm:text-sm !py-2 !px-4 inline-flex items-center justify-center cursor-pointer shadow-sm"
        >
          <span>Back to Articles</span>
        </Link>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {!article.is_published && (
            <span className="text-xs font-bold text-[#C62828] bg-[#FFEBEE] px-3 py-1 rounded-full border border-[#FFCDD2]">
              Draft Mode (Admin Preview Only)
            </span>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="game-btn-wood text-xs !py-1.5 !px-3 inline-flex items-center gap-1.5 cursor-pointer"
            title="Copy article URL"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#52BE1A]" />
                <span className="text-[#2A7513] font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Article Document */}
      <article className="max-w-4xl mx-auto">
        <div className="space-y-3 mb-6">
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-[#381E0A] leading-tight">
            {article.title}
          </h1>

          {/* Author & Date Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#7C471E] font-bold pt-2 border-t border-[#D6BC90]/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2F8FE0] text-white flex items-center justify-center font-black text-xs shadow-xs">
                <User className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-[#381E0A]">{article.author || 'Imaginiv'}</span>
            </div>

            <span className="text-[#D6BC90]">&bull;</span>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#A05C25]" />
              <span>{formatDate(article.published_at || article.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Lead Excerpt Banner (if present) */}
        {article.excerpt && (
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FFF8EC] to-[#FCEECC] border-2 border-[#D6BC90] shadow-inner mb-8">
            <p className="text-base sm:text-lg font-display text-[#5C3210] italic leading-relaxed">
              &ldquo;{article.excerpt}&rdquo;
            </p>
          </div>
        )}

        {/* Hero Cover Image */}
        {article.cover_image_url && (
          <div className="mb-10 rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-[#542E10] shadow-[0_8px_0_#2B1302,0_16px_32px_rgba(0,0,0,0.25)] relative">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full max-h-[500px] object-cover object-center"
            />
          </div>
        )}

        {/* Rendered Article Markdown Content */}
        <div className="p-4 sm:p-8 rounded-2xl bg-white/70 border border-[#D6BC90] shadow-xs">
          <MarkdownContent content={article.content} />
        </div>

        {/* Article Footer & Return CTA */}
        <div className="mt-12 pt-6 border-t-2 border-[#D6BC90] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#7C471E] font-bold">
            Imaginiv Editorial &bull; {article.slug}
          </div>

          <Link
            to="/article"
            className="game-btn-blue text-sm font-display tracking-wide inline-flex items-center justify-center px-6 py-2.5 cursor-pointer shadow-md"
          >
            <span>Back to All Articles</span>
          </Link>
        </div>
      </article>
    </PageShell>
  );
};
