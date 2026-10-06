/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ArrowDown, 
  Search, 
  Compass, 
  X
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { BentoDirectoryCard, BentoCardData } from '../components/ui/BentoDirectoryCard';
import { ForestBackdrop } from '../components/common/VillageArtwork';
import { BannerSection } from '../components/ui/BannerSection';
import { usePageVisibility } from '../context/PageVisibilityContext';
import { scheduleCartoonPop } from '../utils/soundEffects';

export const LandingPage: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { isPageVisible, loading } = usePageVisibility();

  // Animation states: 'hidden' -> 'animating' -> 'done'
  const [animatedItems, setAnimatedItems] = useState<
    Record<string, { state: 'hidden' | 'animating' | 'done'; delay: number }>
  >({});
  const directorySectionRef = useRef<HTMLElement | null>(null);
  const heroAreaRef = useRef<HTMLDivElement | null>(null);
  const cardElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Persistent flag: true while #directory is the active navigation target
  // and layout stabilization is completing.
  const pendingDirectoryScrollRef = useRef<boolean>(false);

  const scrollToDirectory = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = directorySectionRef.current || document.getElementById('directory');
    if (!el) return false;

    const headerEl = document.getElementById('header');
    const headerHeight = headerEl ? headerEl.offsetHeight : 64;
    const targetY = Math.max(0, window.pageYOffset + el.getBoundingClientRect().top - headerHeight - 16);
    
    window.scrollTo({
      top: targetY,
      behavior,
    });
    return true;
  }, []);

  const isDirectoryTarget = location.hash === '#directory';

  // 1. Initial mount and route change handler for #directory
  useEffect(() => {
    if (isDirectoryTarget) {
      pendingDirectoryScrollRef.current = true;
      let cancelled = false;
      let frameId: number;
      let attempts = 0;
      const maxAttempts = 60; // Up to ~1s across 60fps frames

      const tryScroll = () => {
        if (cancelled) return;
        const success = scrollToDirectory('smooth');
        if (!success && attempts < maxAttempts) {
          attempts++;
          frameId = requestAnimationFrame(tryScroll);
        }
      };

      frameId = requestAnimationFrame(tryScroll);

      return () => {
        cancelled = true;
        cancelAnimationFrame(frameId);
      };
    } else {
      pendingDirectoryScrollRef.current = false;
    }
  }, [location.pathname, isDirectoryTarget, scrollToDirectory]);

  // 2. Callback when banner data or image finishes loading
  const handleBannerLoaded = useCallback(() => {
    if (isDirectoryTarget && pendingDirectoryScrollRef.current) {
      requestAnimationFrame(() => {
        scrollToDirectory('smooth');
      });
    }
  }, [isDirectoryTarget, scrollToDirectory]);

  // 3. Re-align when page visibility loading finishes
  useEffect(() => {
    if (!loading && isDirectoryTarget && pendingDirectoryScrollRef.current) {
      requestAnimationFrame(() => {
        scrollToDirectory('smooth');
      });
    }
  }, [loading, isDirectoryTarget, scrollToDirectory]);

  // 4. ResizeObserver: Recalculate #directory position if banner/hero height shifts
  useEffect(() => {
    if (!isDirectoryTarget) return;

    const heroEl = heroAreaRef.current;
    if (!heroEl || typeof ResizeObserver === 'undefined') return;

    let lastHeight = heroEl.offsetHeight;

    const ro = new ResizeObserver((entries) => {
      if (!pendingDirectoryScrollRef.current) return;
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        if (Math.abs(newHeight - lastHeight) > 8) {
          lastHeight = newHeight;
          requestAnimationFrame(() => {
            scrollToDirectory('smooth');
          });
        }
      }
    });

    ro.observe(heroEl);

    return () => {
      ro.disconnect();
    };
  }, [isDirectoryTarget, scrollToDirectory]);

  // The 7 official directory items matching exact site map & naming rule
  const directoryItems: BentoCardData[] = [
    {
      id: 'project',
      name: 'Project',
      route: '/project',
      description: 'Active production pipeline, narrative films, and ongoing multidisciplinary commissions.',
      iconName: 'project',
      colorScheme: 'wood',
      category: 'Productions',
      villageRole: 'Cinema Atelier & Pipeline',
      accentColor: 'orange',
      isFeatured: true,
      tags: ['Narrative Cinema', 'Sound Architecture', 'Docuseries'],
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      route: '/portfolio',
      description: 'Curated visual gallery with category filters, brand systems, and tactile exhibition design.',
      iconName: 'portfolio',
      colorScheme: 'blue',
      category: 'Showcase',
      villageRole: 'Curated Gallery Pavilion',
      accentColor: 'blue',
      isFeatured: true,
      tags: ['Visual Identity', 'Spatial Pavilions', 'Publications'],
    },
    {
      id: 'beingcreative',
      name: 'Being Creative',
      route: '/beingcreative',
      description: 'Ten foundational creative tenets governing curiosity, tactile craft, and human narrative depth.',
      iconName: 'creative',
      colorScheme: 'amber',
      category: 'Manifesto',
      villageRole: 'Philosophical Tenet Shrine',
      accentColor: 'orange',
      isFeatured: false,
      tags: ['10 Core Tenets', 'Studio Philosophy'],
    },
    {
      id: 'infrateam',
      name: 'The Imaginers',
      route: '/theimaginers',
      description: 'Our collaborative collective: directors, narrative architects, sound artists, and technologists.',
      iconName: 'team',
      colorScheme: 'green',
      category: 'Collective',
      villageRole: 'Artisan & Tech Guild',
      accentColor: 'green',
      isFeatured: false,
      tags: ['Directors', 'Craftspeople', 'Technologists'],
    },
    {
      id: 'aiethics',
      name: 'AI Ethics',
      route: '/aiethics',
      description: 'Our charter for responsible AI: protecting human authorship, copyright integrity, and transparency.',
      iconName: 'ethics',
      colorScheme: 'wood',
      category: 'Charter',
      villageRole: 'Responsible Wisdom Tower',
      accentColor: 'primary',
      isFeatured: false,
      tags: ['Human Authorship', 'IP Protection'],
    },
    {
      id: 'inclusivity',
      name: 'Inclusivity',
      route: '/inclusivity',
      description: 'Commitments to universal accessibility, diverse representation, and neurodivergent-friendly design.',
      iconName: 'inclusivity',
      colorScheme: 'amber',
      category: 'Belonging',
      villageRole: 'Universal Gathering Square',
      accentColor: 'green',
      isFeatured: false,
      tags: ['WCAG Accessibility', 'Universal Design'],
    },
    {
      id: 'about',
      name: 'About Imaginiv',
      route: '/about',
      description: 'The story, vision, mission, and village tenets behind our multidisciplinary creative studio.',
      iconName: 'about',
      colorScheme: 'blue',
      category: 'Origins',
      villageRole: 'Village Hall & Studio Atelier',
      accentColor: 'blue',
      isFeatured: true,
      tags: ['Origins', 'Village Philosophy', 'Studio Atelier'],
    },
    {
      id: 'article',
      name: 'Article',
      route: '/article',
      description: 'Editorial essays, creative methodology, deep-dive articles, and studio publications.',
      iconName: 'article',
      colorScheme: 'amber',
      category: 'Publications',
      villageRole: 'Village Scribe & Editorial Archive',
      accentColor: 'orange',
      isFeatured: false,
      tags: ['Essays', 'Design Thoughts', 'Lectures'],
    },
  ];

  // Filter active directory items by admin visibility settings
  const visibleDirectoryItems = directoryItems.filter(item => isPageVisible(item.id));

  // Real-time filter
  const filteredItems = visibleDirectoryItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.villageRole && item.villageRole.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    // If reduced motion is requested or user is actively searching, immediately mark items as 'done'
    if (isReducedMotion || isSearching) {
      setAnimatedItems((prev) => {
        const next = { ...prev };
        filteredItems.forEach((item) => {
          next[item.id] = { state: 'done', delay: 0 };
        });
        return next;
      });
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setAnimatedItems((prev) => {
        const next = { ...prev };
        filteredItems.forEach((item) => {
          next[item.id] = { state: 'done', delay: 0 };
        });
        return next;
      });
      return;
    }

    // Unified Scroll-triggered Animation for both PC and Mobile:
    // Animate Directory buttons as they enter the viewport (threshold 0.2)
    // If multiple buttons become visible at approximately the same time, animate sequentially with 0.12s stagger delay
    // Buttons further down wait until they actually enter the viewport
    const cardObserver = new IntersectionObserver(
      (entries) => {
        const newlyIntersecting: string[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
            const id = entry.target.getAttribute('data-directory-id');
            if (id) {
              newlyIntersecting.push(id);
              cardObserver.unobserve(entry.target);
            }
          }
        });

        if (newlyIntersecting.length > 0) {
          const orderedBatch = filteredItems
            .map((it) => it.id)
            .filter((id) => newlyIntersecting.includes(id));

          setAnimatedItems((prev) => {
            const next = { ...prev };
            let batchIndex = 0;
            orderedBatch.forEach((id) => {
              if (!prev[id] || prev[id].state === 'hidden') {
                const delay = Number((batchIndex * 0.12).toFixed(2));
                next[id] = {
                  state: 'animating',
                  delay,
                };
                scheduleCartoonPop(delay, batchIndex);
                batchIndex++;
              }
            });
            return next;
          });
        }
      },
      { threshold: 0.2 }
    );

    // Register cards in observer
    cardElementsRef.current.forEach((el) => {
      cardObserver.observe(el);
    });

    return () => {
      cardObserver.disconnect();
    };
  }, [filteredItems, isSearching, isReducedMotion]);

  const handleAnimationEnd = (itemId: string) => {
    setAnimatedItems((prev) => {
      if (prev[itemId]?.state === 'done') return prev;
      return {
        ...prev,
        [itemId]: { state: 'done', delay: 0 },
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#F6EAD2] pt-14 sm:pt-16" style={{ backgroundColor: '#F6EAD2' }}>
      {/* Cartoon Forest Living Environment Backdrop */}
      <ForestBackdrop bgColor="#F6EAD2" />

      {/* 1. HEADER (id="header") */}
      <Header />

      {/* 2. DEDICATED TOP BANNER SECTION (FULL-WIDTH EDGE-TO-EDGE, QUARTISAN STYLE) */}
      <div ref={heroAreaRef}>
        <BannerSection onBannerLoaded={handleBannerLoaded} />

        {/* STANDALONE EXPLORE DIRECTORY CTA BUTTON (Placed below banner, outside the image) */}
        <div className="w-full flex flex-col items-center justify-center pt-8 pb-3 px-4 relative z-10">
          <button
            type="button"
            id="explore-directory-btn"
            onClick={() => scrollToDirectory('smooth')}
            className="game-btn-blue text-base sm:text-lg font-display tracking-wide inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 cursor-pointer justify-center shadow-[0_6px_0_#14436E,0_12px_24px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-transform"
          >
            <span>Explore</span>
            <ArrowDown className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">

        {/* 3. DIRECTORY (id="directory")
            Clean full-viewport Directory without restrictive outer wooden frame:
            - Header wooden plank "DIRECTORY"
            - Real-time search bar
            - 7 Destination Bento Cards
        */}
        <section id="directory" ref={directorySectionRef} className="pt-4 pb-20 scroll-mt-20">
          <div className="w-full relative">
            {/* Top Plank Banner */}
            <div className="game-wood-plank mx-auto max-w-sm sm:max-w-md py-2.5 px-6 text-center relative z-20 shadow-[0_5px_0_#2B1302] mb-6">
              <h2
                className="font-display text-xl sm:text-2xl uppercase tracking-wider text-white"
                style={{
                  WebkitTextStroke: '0px transparent',
                  textShadow: '0 3px 6px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.4)',
                }}
              >
                Directory
              </h2>
            </div>

            {/* Header & Search on Parchment */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-end gap-4">
              {/* Real-time Search Input on Parchment */}
              <div className="w-full md:w-80 relative">
                <label htmlFor="directory-search-input" className="sr-only">
                  Search directory
                </label>
                <input
                  id="directory-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search directory..."
                  className="w-full bg-[#FFFDF7] text-[#381E0A] placeholder-[#8C6B4E] text-sm font-bold pl-10 pr-10 py-2.5 rounded-xl border-2 border-[#542E10] shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_2px_0_#381E0A] focus:outline-none focus:ring-2 focus:ring-[#2F8FE0] min-h-[44px]"
                />
                <Search className="w-4 h-4 text-[#8C6B4E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.5} />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8C6B4E] hover:text-[#381E0A] p-1 touch-target"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Directory Bento Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="game-parchment p-6 rounded-2xl animate-pulse space-y-4">
                    <div className="w-12 h-12 bg-[#DEC9A3] rounded-xl" />
                    <div className="h-6 w-32 bg-[#DEC9A3] rounded-lg" />
                    <div className="h-14 bg-[#DEC9A3]/60 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="game-parchment p-10 text-center rounded-2xl text-[#6B492B]">
                <Compass className="w-12 h-12 mx-auto text-[#A8642E] mb-3 opacity-60" />
                <h3 className="font-display text-2xl text-[#381E0A] mb-2">
                  No village destinations found for "{searchQuery}"
                </h3>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="game-btn-blue text-xs font-display py-2 px-5 mt-3"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredItems.map((item) => {
                  const anim = isSearching || isReducedMotion
                    ? { state: 'done' as const, delay: 0 }
                    : (animatedItems[item.id] || { state: 'hidden' as const, delay: 0 });

                  return (
                    <BentoDirectoryCard
                      key={item.id}
                      item={item}
                      animationState={anim.state}
                      animationDelay={anim.delay}
                      onAnimationEnd={() => handleAnimationEnd(item.id)}
                      innerRef={(el) => {
                        if (el) {
                          cardElementsRef.current.set(item.id, el);
                        } else {
                          cardElementsRef.current.delete(item.id);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 4. FOOTER (id="footer") */}
      <Footer />
    </div>
  );
};
