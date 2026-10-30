/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, RefreshCw, Newspaper } from 'lucide-react';
import { ArticleItem } from '../../types';
import { articlesService } from '../../services/articlesService';
import { isSafeImageUrl } from '../../utils/articleImageUtils';
import { extractArticlePlainExcerpt, formatArticleDate } from '../../utils/articleExcerpt';

export interface LatestArticlesSectionProps {
  onLayoutChange?: () => void;
}

interface ArticleCoverProps {
  imageUrl?: string | null;
  title: string;
  priority?: boolean;
  className?: string;
}

const ArticleCover: React.FC<ArticleCoverProps> = ({
  imageUrl,
  title,
  priority = false,
  className = '',
}) => {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const trimmedUrl = imageUrl?.trim() || '';
  const canRenderImage = Boolean(
    trimmedUrl && isSafeImageUrl(trimmedUrl) && failedUrl !== trimmedUrl
  );

  return (
    <div className={`relative w-full overflow-hidden bg-[#2A1608] ${className}`}>
      {canRenderImage ? (
        <img
          src={trimmedUrl}
          alt={title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailedUrl(trimmedUrl)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="w-full h-full flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-[#FBF0D9] via-[#EFE0BC] to-[#DFC496] text-[#6B421B] select-none"
        >
          <div className="w-12 h-12 rounded-full border-2 border-[#C49E65] bg-[#FFF9ED]/80 flex items-center justify-center mb-2.5 shadow-xs">
            <BookOpen className="w-5 h-5 text-[#7C471E]" strokeWidth={2.2} />
          </div>
          <span className="font-display text-xs tracking-wider uppercase text-[#5C3210]">
            Imaginiv Editorial
          </span>
        </div>
      )}
    </div>
  );
};

interface EditorialMetaLineProps {
  article: ArticleItem;
  defaultKicker?: string;
}

/**
 * Unboxed inline editorial metadata line (Category/Kicker · Date · Author).
 */
const EditorialMetaLine: React.FC<EditorialMetaLineProps> = ({ article, defaultKicker }) => {
  const kicker = article.category?.trim() || defaultKicker || null;
  const rawDate = article.published_at || article.created_at || null;
  const formattedDate = formatArticleDate(rawDate);
  const author = article.author?.trim() || null;

  if (!kicker && !formattedDate && !author) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[#7C471E] mb-2 min-w-0">
      {kicker && (
        <span className="uppercase tracking-wider text-[11px] font-extrabold text-[#9E4312] shrink-0">
          {kicker}
        </span>
      )}

      {kicker && (formattedDate || author) && (
        <span aria-hidden="true" className="text-[#B89364] select-none">
          ·
        </span>
      )}

      {formattedDate && (
        <time dateTime={rawDate || undefined} className="text-[#6B492B] shrink-0">
          {formattedDate}
        </time>
      )}

      {formattedDate && author && (
        <span aria-hidden="true" className="text-[#B89364] select-none">
          ·
        </span>
      )}

      {author && (
        <span className="text-[#8C5226] truncate max-w-[200px] sm:max-w-[260px]" title={author}>
          {author}
        </span>
      )}
    </div>
  );
};

function getCanonicalArticleHref(slug: string): string {
  return `/article/${encodeURIComponent(slug.trim())}`;
}

interface FeaturedStoryCardProps {
  article: ArticleItem;
  solo?: boolean;
}

const FeaturedStoryCard: React.FC<FeaturedStoryCardProps> = ({ article, solo = false }) => {
  const excerpt = extractArticlePlainExcerpt(article, solo ? 250 : 215);
  const articleHref = getCanonicalArticleHref(article.slug);

  if (solo) {
    return (
      <article className="article-card group rounded-2xl bg-[#FFFDF8] border-2 border-[#D6BC90] hover:border-[#8B5226] shadow-[0_4px_14px_rgba(56,30,10,0.08)] overflow-hidden">
        <Link
          to={articleHref}
          className="grid grid-cols-1 lg:grid-cols-12 h-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#2F8FE0] focus-visible:ring-inset rounded-2xl"
        >
          <div className="lg:col-span-7">
            <ArticleCover
              imageUrl={article.cover_image_url}
              title={article.title}
              priority
              className="aspect-[16/9] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[340px]"
            />
          </div>

          <div className="lg:col-span-5 p-5 sm:p-7 lg:p-9 flex flex-col justify-center">
            <EditorialMetaLine article={article} defaultKicker="Featured Story" />

            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-[#381E0A] group-hover:text-[#146FBF] transition-colors leading-[1.2] text-balance mb-3">
              {article.title}
            </h3>

            {excerpt && (
              <p className="text-sm sm:text-base text-[#5C3210] font-medium leading-relaxed line-clamp-4 mb-5">
                {excerpt}
              </p>
            )}

            <div className="mt-auto pt-1 inline-flex items-center gap-2 text-sm font-display text-[#146FBF] group-hover:text-[#093764] transition-colors">
              <span>Read Full Story</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="article-card group w-full h-full rounded-2xl bg-[#FFFDF8] border-2 border-[#D6BC90] hover:border-[#8B5226] shadow-[0_4px_14px_rgba(56,30,10,0.08)] overflow-hidden flex flex-col">
      <Link
        to={articleHref}
        className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#2F8FE0] focus-visible:ring-inset rounded-2xl"
      >
        <ArticleCover
          imageUrl={article.cover_image_url}
          title={article.title}
          priority
          className="aspect-[16/9] sm:aspect-[16/10] shrink-0"
        />

        <div className="p-5 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between">
          <div>
            <EditorialMetaLine article={article} defaultKicker="Featured Story" />

            <h3 className="font-display text-xl sm:text-2xl lg:text-[1.85rem] text-[#381E0A] group-hover:text-[#146FBF] transition-colors leading-[1.2] text-balance line-clamp-3 mb-2.5">
              {article.title}
            </h3>

            {excerpt && (
              <p className="text-sm sm:text-[15px] text-[#5C3210] font-medium leading-relaxed line-clamp-3 mb-4">
                {excerpt}
              </p>
            )}
          </div>

          <div className="pt-1 inline-flex items-center gap-2 text-sm font-display text-[#146FBF] group-hover:text-[#093764] transition-colors">
            <span>Read Full Story</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
};

interface SecondaryStoryCardProps {
  article: ArticleItem;
  variant?: 'stacked' | 'tall' | 'grid' | 'wide';
  className?: string;
  coverClassName?: string;
}

const SecondaryStoryCard: React.FC<SecondaryStoryCardProps> = ({
  article,
  variant = 'grid',
  className = '',
  coverClassName = '',
}) => {
  const maxChars = variant === 'wide' || variant === 'tall' ? 190 : 145;
  const excerpt = extractArticlePlainExcerpt(article, maxChars);
  const articleHref = getCanonicalArticleHref(article.slug);

  if (variant === 'wide') {
    return (
      <article
        className={`article-card group rounded-2xl bg-[#FFFDF8] border-2 border-[#D6BC90] hover:border-[#8B5226] shadow-[0_4px_14px_rgba(56,30,10,0.08)] overflow-hidden ${className}`}
      >
        <Link
          to={articleHref}
          className="grid grid-cols-1 md:grid-cols-12 h-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#2F8FE0] focus-visible:ring-inset rounded-2xl"
        >
          <div className="md:col-span-5">
            <ArticleCover
              imageUrl={article.cover_image_url}
              title={article.title}
              className="aspect-[16/9] md:aspect-auto md:h-full md:min-h-[210px]"
            />
          </div>

          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-center">
            <EditorialMetaLine article={article} />

            <h3 className="font-display text-lg sm:text-xl lg:text-2xl text-[#381E0A] group-hover:text-[#146FBF] transition-colors leading-snug line-clamp-2 mb-2">
              {article.title}
            </h3>

            {excerpt && (
              <p className="text-xs sm:text-sm text-[#5C3210] font-medium leading-relaxed line-clamp-3 mb-4">
                {excerpt}
              </p>
            )}

            <div className="mt-auto inline-flex items-center gap-1.5 text-xs sm:text-sm font-display text-[#146FBF] group-hover:text-[#093764] transition-colors">
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  const coverSizingClass =
    variant === 'tall'
      ? 'aspect-[16/9] sm:aspect-[16/10]'
      : variant === 'stacked'
        ? 'aspect-[16/9] lg:aspect-auto lg:h-40 xl:h-48 2xl:h-52'
        : 'aspect-[16/9]';

  return (
    <article
      className={`article-card group w-full h-full rounded-2xl bg-[#FFFDF8] border-2 border-[#D6BC90] hover:border-[#8B5226] shadow-[0_4px_14px_rgba(56,30,10,0.08)] overflow-hidden flex flex-col ${className}`}
    >
      <Link
        to={articleHref}
        className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#2F8FE0] focus-visible:ring-inset rounded-2xl"
      >
        <ArticleCover
          imageUrl={article.cover_image_url}
          title={article.title}
          className={`${coverSizingClass} ${coverClassName} shrink-0`}
        />

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <EditorialMetaLine article={article} />

            <h3
              className={`font-display text-[#381E0A] group-hover:text-[#146FBF] transition-colors leading-snug line-clamp-2 mb-1.5 ${
                variant === 'tall' ? 'text-xl sm:text-2xl mb-2.5' : 'text-lg sm:text-[1.2rem]'
              }`}
            >
              {article.title}
            </h3>

            {excerpt && (
              <p
                className={`text-xs sm:text-sm text-[#5C3210] font-medium leading-relaxed mb-3 ${
                  variant === 'tall' ? 'line-clamp-3 mb-4' : 'line-clamp-2'
                }`}
              >
                {excerpt}
              </p>
            )}
          </div>

          <div className="pt-0.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-display text-[#146FBF] group-hover:text-[#093764] transition-colors">
            <span>Read Article</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
};

const LatestArticlesSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Loading latest articles"
      className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch animate-pulse"
    >
      {/* Featured skeleton */}
      <div className="lg:col-span-7 rounded-2xl bg-[#FFFDF8] border-2 border-[#DEC9A3] overflow-hidden flex flex-col">
        <div className="w-full aspect-[16/9] sm:aspect-[16/10] bg-[#E8D5B3]" />
        <div className="p-5 sm:p-6 lg:p-7 space-y-3 flex-1">
          <div className="h-3.5 w-44 rounded bg-[#E4CEAA]" />
          <div className="h-7 w-11/12 rounded-lg bg-[#DEC398]" />
          <div className="h-7 w-3/4 rounded-lg bg-[#DEC398]" />
          <div className="pt-1 space-y-2">
            <div className="h-3.5 w-full rounded bg-[#EADAC0]" />
            <div className="h-3.5 w-5/6 rounded bg-[#EADAC0]" />
          </div>
          <div className="pt-2 h-4 w-32 rounded bg-[#D7B98A]" />
        </div>
      </div>

      {/* Secondary skeletons */}
      <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-5 sm:gap-6">
        {[0, 1].map((idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#FFFDF8] border-2 border-[#DEC9A3] overflow-hidden flex flex-col"
          >
            <div className="w-full aspect-[16/9] lg:aspect-auto lg:h-40 xl:h-44 bg-[#E8D5B3]" />
            <div className="p-4 sm:p-5 space-y-2.5 flex-1">
              <div className="h-3 w-36 rounded bg-[#E4CEAA]" />
              <div className="h-5 w-11/12 rounded bg-[#DEC398]" />
              <div className="h-3.5 w-4/5 rounded bg-[#EADAC0]" />
              <div className="pt-1 h-3.5 w-24 rounded bg-[#D7B98A]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LatestArticlesSection: React.FC<LatestArticlesSectionProps> = ({
  onLayoutChange,
}) => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadArticles = useCallback(
    async (forceRefresh: boolean = false) => {
      setLoading(true);
      setErrorMessage(null);

      const { articles: latest, error } = await articlesService.getLatestPublishedArticles(6, {
        forceRefresh,
      });

      setArticles(latest);
      setErrorMessage(error);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { articles: latest, error } = await articlesService.getLatestPublishedArticles(6);
      if (!isMounted) return;
      setArticles(latest);
      setErrorMessage(error);
      setLoading(false);
    })();

    const unsubscribe = articlesService.subscribeToPublishedArticlesChanges((freshPublished) => {
      if (!isMounted) return;
      setArticles(freshPublished.slice(0, 6));
      setErrorMessage(null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      onLayoutChange?.();
    }
  }, [loading, articles.length, onLayoutChange]);

  const featuredArticle = articles[0] || null;
  const topRightArticles = articles.slice(1, 3);
  const bottomRowArticles = articles.slice(3, 6);

  return (
    <section
      id="latest-articles"
      aria-labelledby="latest-articles-heading"
      className="pt-6 sm:pt-8 pb-8 sm:pb-12"
    >
      {/* Editorial Section Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 sm:pb-5 mb-6 border-b-2 border-[#D6BC90]">
        <div>
          <h2
            id="latest-articles-heading"
            className="font-display text-2xl sm:text-3xl lg:text-[2.1rem] text-[#381E0A] tracking-wide leading-tight"
          >
            Latest Articles
          </h2>
          <p className="text-sm sm:text-base text-[#6B492B] font-semibold mt-1">
            Stories, ideas, and perspectives from Imaginiv.
          </p>
        </div>

        <Link
          to="/article"
          className="game-btn-wood text-xs sm:text-sm !min-h-[42px] !py-2 !px-4 sm:!px-5 inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <span>View All Articles</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>

      {/* Content Area: Loading / Error / Empty / Editorial News Grid */}
      {loading ? (
        <LatestArticlesSkeleton />
      ) : errorMessage ? (
        <div
          role="alert"
          className="rounded-2xl bg-[#FFFDF8] border-2 border-[#D6BC90] p-6 sm:p-8 text-center max-w-2xl mx-auto"
        >
          <Newspaper className="w-9 h-9 text-[#9E5F2A] mx-auto mb-2.5 opacity-80" />
          <h3 className="font-display text-lg sm:text-xl text-[#381E0A] mb-1">
            Unable to Load Latest Articles
          </h3>
          <p className="text-xs sm:text-sm text-[#6B492B] font-semibold mb-4">
            We couldn&apos;t reach the editorial archive right now. You can retry or browse the full publications page.
          </p>
          <button
            type="button"
            onClick={() => loadArticles(true)}
            className="game-btn-wood text-xs sm:text-sm !min-h-[40px] !py-2 !px-5 inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      ) : !featuredArticle ? (
        <div className="rounded-2xl bg-[#FFFDF8]/90 border-2 border-[#D6BC90] p-6 sm:p-8 text-center">
          <BookOpen className="w-9 h-9 text-[#9E5F2A] mx-auto mb-2 opacity-75" />
          <h3 className="font-display text-lg sm:text-xl text-[#381E0A] mb-1">
            No Published Articles Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#6B492B] font-semibold max-w-lg mx-auto">
            New editorial stories, creative essays, and studio dispatches will appear here as soon as they are published.
          </p>
        </div>
      ) : articles.length === 1 ? (
        <FeaturedStoryCard article={featuredArticle} solo />
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {/* Top Lead Newsroom Row: Featured Story + up to 2 Secondary Stories */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            <div className="lg:col-span-7 flex">
              <FeaturedStoryCard article={featuredArticle} />
            </div>

            {topRightArticles.length === 1 ? (
              <div className="lg:col-span-5 flex">
                <SecondaryStoryCard article={topRightArticles[0]} variant="tall" />
              </div>
            ) : (
              <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-5 sm:gap-6">
                {topRightArticles.map((article) => (
                  <SecondaryStoryCard
                    key={article.id}
                    article={article}
                    variant="stacked"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Optional Second Editorial Row when 4, 5, or 6 Published Articles Exist */}
          {bottomRowArticles.length === 1 && (
            <SecondaryStoryCard article={bottomRowArticles[0]} variant="wide" />
          )}

          {bottomRowArticles.length === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {bottomRowArticles.map((article) => (
                <SecondaryStoryCard key={article.id} article={article} variant="grid" />
              ))}
            </div>
          )}

          {bottomRowArticles.length === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {bottomRowArticles.map((article, index) => (
                <SecondaryStoryCard
                  key={article.id}
                  article={article}
                  variant="grid"
                  className={index === 2 ? 'md:col-span-2 lg:col-span-1' : ''}
                  coverClassName={index === 2 ? 'md:aspect-[21/9] lg:aspect-[16/9]' : ''}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
