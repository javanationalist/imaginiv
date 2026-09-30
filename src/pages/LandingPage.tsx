/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isPageVisible, loading } = usePageVisibility();

  const scrollToDirectory = () => {
    const el = document.getElementById('directory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      name: 'inFra Team',
      route: '/infrateam',
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
      name: 'About Framedia',
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

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#F6EAD2] pt-14 sm:pt-16" style={{ backgroundColor: '#F6EAD2' }}>
      {/* Cartoon Forest Living Environment Backdrop */}
      <ForestBackdrop bgColor="#F6EAD2" />

      {/* 1. HEADER (id="header") */}
      <Header />

      {/* 2. DEDICATED TOP BANNER SECTION (FULL-WIDTH EDGE-TO-EDGE, QUARTISAN STYLE) */}
      <BannerSection />

      {/* STANDALONE EXPLORE DIRECTORY CTA BUTTON (Placed below banner, outside the image) */}
      <div className="w-full flex flex-col items-center justify-center pt-8 pb-3 px-4 relative z-10">
        <button
          type="button"
          id="explore-directory-btn"
          onClick={scrollToDirectory}
          className="game-btn-blue text-base sm:text-lg font-display tracking-wide inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 cursor-pointer justify-center shadow-[0_6px_0_#14436E,0_12px_24px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-transform"
        >
          <span>Explore</span>
          <ArrowDown className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      <main className="flex-1 w-full max-w-[1240px] mx-auto px-3 sm:px-6 relative z-10">

        {/* 3. DIRECTORY (id="directory")
            Styled as the Village Map Board:
            - Grand wood board
            - Header wooden plank "DIRECTORY"
            - Real-time search bar
            - 7 Destination Cards
        */}
        <section id="directory" className="pt-6 pb-20 scroll-mt-20">
          <div className="game-wood-frame p-4 sm:p-7 relative">
            {/* Corner Nails on Board */}
            <div className="absolute top-3 left-3 game-nail !w-3.5 !h-3.5" />
            <div className="absolute top-3 right-3 game-nail !w-3.5 !h-3.5" />

            {/* Top Plank Banner */}
            <div className="game-wood-plank -mt-8 sm:-mt-11 mx-auto max-w-sm sm:max-w-md py-2 px-6 text-center relative z-20 shadow-[0_5px_0_#2B1302]">
              <div className="absolute top-2 left-3 game-nail" />
              <div className="absolute top-2 right-3 game-nail" />
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
            <div className="mt-4 mb-6 flex flex-col md:flex-row md:items-center justify-end gap-4">
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
                {filteredItems.map((item) => (
                  <BentoDirectoryCard key={item.id} item={item} />
                ))}
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
