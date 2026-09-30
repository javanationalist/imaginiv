/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  Loader2,
  FileText
} from 'lucide-react';
import { PageShell } from '../components/common/PageShell';
import { PageTitle } from '../components/common/PageTitle';
import { ArticleItem } from '../types';
import { articlesService } from '../services/articlesService';

export const ArticleListPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Dynamic page title for SEO
    document.title = 'Articles & Publications - Imaginiv';

    let isMounted = true;
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articlesService.getPublishedArticles();
        if (isMounted) setArticles(data);
      } catch (err) {
        console.error('Failed to load published articles:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticles();

    const unsubscribe = articlesService.subscribeToArticlesChanges((all) => {
      if (isMounted) {
        setArticles(all.filter((a) => a.is_published));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const filteredArticles = articles.filter((art) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      art.title.toLowerCase().includes(q) ||
      (art.excerpt && art.excerpt.toLowerCase().includes(q)) ||
      (art.author && art.author.toLowerCase().includes(q)) ||
      art.content.toLowerCase().includes(q)
    );
  });

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Recent Editorial';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (_) {
      return 'Recent';
    }
  };

  return (
    <PageShell>
      {/* 1. Page Header Plaque (Plank hidden per user request) */}
      <PageTitle
        title="Article"
        hidePlank
      />

      {/* 2. Search & Filter Bar */}
      <div className="mb-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FFF8EC] to-[#FCEECC] border-2 border-[#D6BC90] shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[#8C5D35] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, tenets, or authors..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-[#D6BC90] bg-[#FFFBF2] text-[#381E0A] text-sm placeholder-[#9C7955] focus:outline-none focus:border-[#2F8FE0] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-bold text-[#7C471E]">
          <span>{filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'}</span>
        </div>
      </div>

      {/* 3. Articles Grid / Loading / Empty States */}
      {loading ? (
        <div className="py-16 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#2F8FE0] animate-spin mx-auto" />
          <div className="font-display text-base text-[#381E0A]">
            Gathering village publications...
          </div>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-[#FAF2DF] rounded-2xl border-2 border-dashed border-[#D6BC90] my-6">
          <FileText className="w-12 h-12 text-[#C0A87A] mx-auto mb-3" />
          <h3 className="font-display text-lg text-[#381E0A]">No Articles Found</h3>
          <p className="text-xs sm:text-sm text-[#7C471E] font-semibold mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No articles matched "${searchQuery}". Try searching for another keyword or clear the search filter.`
              : 'New editorial essays and lectures will be published soon from the atelier.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 game-btn-wood text-xs !py-1.5 !px-3.5 cursor-pointer"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const hasCover = Boolean(article.cover_image_url);

            return (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-2xl bg-white border-2 border-[#D6BC90] hover:border-[#8B5226] shadow-sm hover:shadow-[0_8px_0_#2B1302,0_16px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-200 overflow-hidden"
              >
                <div>
                  {/* Article Cover Image Container */}
                  <div className="relative w-full h-48 bg-[#2A1608] overflow-hidden">
                    {hasCover ? (
                      <img
                        src={article.cover_image_url!}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF5E0] to-[#EADBBD] text-[#8C6B4E]">
                        <BookOpen className="w-10 h-10 mb-1 opacity-70" />
                        <span className="text-xs font-bold">Imaginiv Publication</span>
                      </div>
                    )}

                    {/* Gradient Overlay for card badge contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Publication Date Badge */}
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">
                      <Calendar className="w-3 h-3 text-[#FFD452]" />
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    {/* Author tag */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C5226] mb-2">
                      <User className="w-3.5 h-3.5 text-[#2F8FE0]" />
                      <span className="truncate">{article.author || 'Imaginiv'}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg sm:text-xl text-[#381E0A] group-hover:text-[#146FBF] transition-colors leading-snug line-clamp-2 mb-2">
                      <Link to={`/article/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-[#5C3210] font-medium leading-relaxed line-clamp-3">
                      {article.excerpt || article.content.substring(0, 140) + '...'}
                    </p>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="p-5 pt-0">
                  <Link
                    to={`/article/${article.slug}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-[#146FBF] group-hover:text-[#093764] group-hover:translate-x-1 transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </PageShell>
  );
};
