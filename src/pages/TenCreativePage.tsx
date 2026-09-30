/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Compass, 
  UserCheck, 
  Eye, 
  Hand, 
  Briefcase, 
  Share2, 
  Globe2, 
  Heart, 
  Clock, 
  Scissors,
  Table,
  Tag,
  Search,
  BookOpen,
  Film,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { PageShell } from '../components/common/PageShell';
import { PageTitle } from '../components/common/PageTitle';

export interface TenetPoint {
  id: number;
  number: string;
  title: string;
  icon: React.ReactNode;
  category: 'Mindset' | 'Process' | 'Network' | 'Craft';
  nafaConcept: string;
  alfanAction: string;
  summaryTag: string;
  accentColor: string;
}

export const CREATIVE_TENETS_DATA: TenetPoint[] = [
  {
    id: 1,
    number: '01',
    title: 'Steal Like an Artist',
    icon: <Compass className="w-6 h-6 text-[#E8863A]" />,
    category: 'Mindset',
    nafaConcept: 'Creative ideas rarely come completely from scratch. Creators learn from other works, references, their surroundings, and other people, then transform them into something different. What matters is not copying, but understanding and developing those references.',
    alfanAction: 'Deconstruct your favorite films: analyze camera movements, editing rhythm, and narrative structure. Adapt the core techniques into your own story rather than just copying the visuals.',
    summaryTag: 'Deconstruct & Adapt',
    accentColor: 'border-l-4 border-[#E8863A]'
  },
  {
    id: 2,
    number: '02',
    title: "Don't Wait Until You Know Who You Are",
    icon: <UserCheck className="w-6 h-6 text-[#3F6D9E]" />,
    category: 'Mindset',
    nafaConcept: "We don't have to know exactly what kind of creator we are before we start creating. Instead, through the process of creating, we can discover our own style and identity.",
    alfanAction: "Don't wait for a signature style. Replicate scenes or color grading from creators you admire. The imperfections in your attempts are where your unique style actually begins.",
    summaryTag: 'Identity Through Action',
    accentColor: 'border-l-4 border-[#3F6D9E]'
  },
  {
    id: 3,
    number: '03',
    title: 'Make the Work You Want to See',
    icon: <Eye className="w-6 h-6 text-[#4F7F5A]" />,
    category: 'Craft',
    nafaConcept: "Don't always follow what already exists. Create something that you personally want to see, hear, or use. This desire can lead to ideas that feel more personal and interesting.",
    alfanAction: 'Write the book you want to read, make the film you want to watch. Focus on projects that excite you personally rather than chasing temporary market trends.',
    summaryTag: 'Personal Obsession',
    accentColor: 'border-l-4 border-[#4F7F5A]'
  },
  {
    id: 4,
    number: '04',
    title: 'Use Your Hands, Don’t Just Think',
    icon: <Hand className="w-6 h-6 text-[#E8863A]" />,
    category: 'Craft',
    nafaConcept: 'Creativity is not only about thinking. Ideas can develop when we try them directly through activities such as drawing, writing, sketching, taking photos, or creating prototypes.',
    alfanAction: 'Move away from the screen. Sketch storyboards on paper, handle physical props, or experiment with tactile sound. Physical engagement sparks mental breakthroughs.',
    summaryTag: 'Tactile Prototyping',
    accentColor: 'border-l-4 border-[#E8863A]'
  },
  {
    id: 5,
    number: '05',
    title: 'Side Projects and Hobbies Are Important',
    icon: <Briefcase className="w-6 h-6 text-[#3F6D9E]" />,
    category: 'Process',
    nafaConcept: 'Hobbies and side projects can be a place to experiment without pressure. They can lead to new skills, ideas, or career opportunities in the creative industry.',
    alfanAction: 'Treat hobbies as play spaces without client expectations. Experimenting without fear of failure often generates your most innovative creative breakthroughs.',
    summaryTag: 'Pressure-Free Play',
    accentColor: 'border-l-4 border-[#3F6D9E]'
  },
  {
    id: 6,
    number: '06',
    title: 'Do Good Work and Share It',
    icon: <Share2 className="w-6 h-6 text-[#4F7F5A]" />,
    category: 'Network',
    nafaConcept: 'Creators should not only make good work but also show it to other people. By sharing the process and the results, we can build an audience, relationships, and work opportunities.',
    alfanAction: 'Post your raw behind-the-scenes, test footage, and finished cuts online. Building in public invites feedback, collaborators, and appreciation.',
    summaryTag: 'Share the Process',
    accentColor: 'border-l-4 border-[#4F7F5A]'
  },
  {
    id: 7,
    number: '07',
    title: 'Don’t Be Too Dependent on Location',
    icon: <Globe2 className="w-6 h-6 text-[#E8863A]" />,
    category: 'Network',
    nafaConcept: 'Creativity does not have to come from a specific city or place. The internet allows creators to connect with people from different places and build networks without having to be in the same location.',
    alfanAction: 'Leverage digital communities and remote collaboration. You don’t need to be in Hollywood or a creative capital to produce world-class work.',
    summaryTag: 'Global Connectivity',
    accentColor: 'border-l-4 border-[#E8863A]'
  },
  {
    id: 8,
    number: '08',
    title: 'Build Good Relationships',
    icon: <Heart className="w-6 h-6 text-[#3F6D9E]" />,
    category: 'Network',
    nafaConcept: 'In the creative industry, communication skills and maintaining good relationships are very important. The author emphasizes being kind, following people who can provide inspiration, and building a supportive environment.',
    alfanAction: 'Be a joy to work with. Treat collaborators, crew, and clients with genuine respect. Professional kindness builds lasting word-of-mouth networks.',
    summaryTag: 'Kindness & Kindness',
    accentColor: 'border-l-4 border-[#3F6D9E]'
  },
  {
    id: 9,
    number: '09',
    title: 'Discipline Beats Waiting for Inspiration',
    icon: <Clock className="w-6 h-6 text-[#4F7F5A]" />,
    category: 'Process',
    nafaConcept: 'Creativity does not mean always waiting for the right mood. Creating a schedule, working regularly, documenting the process, and staying consistent little by little can produce great work in the long run.',
    alfanAction: 'Establish daily creative habits regardless of mood. Consistency beats fleeting bursts of inspiration every single time.',
    summaryTag: 'Daily Discipline',
    accentColor: 'border-l-4 border-[#4F7F5A]'
  },
  {
    id: 10,
    number: '10',
    title: 'Creativity Means Knowing What to Remove',
    icon: <Scissors className="w-6 h-6 text-[#E8863A]" />,
    category: 'Craft',
    nafaConcept: 'Creativity is not only about adding many things to a work, but also about choosing what needs to be removed. Limitations can actually help us stay focused and find creative solutions.',
    alfanAction: 'Edit ruthlessly. Cut unnecessary scenes, simplify visual compositions, and omit fluff. Subtraction sharpens the emotional core of your message.',
    summaryTag: 'Ruthless Subtraction',
    accentColor: 'border-l-4 border-[#E8863A]'
  }
];

export const META_DESCRIPTION = "Explore 10 essential creative tenets by Nafa Nafisah and ALFAN. Master film analysis, tactile craft, discipline, and ruthless editing for impactful media.";
export const PAGE_TAGS = ["#CreativeProcess", "#FilmCraft", "#StealLikeAnArtist", "#TactileDesign", "#DisciplineOverInspiration"];

/**
 * Data-fetching stub ready to connect to the database later.
 */
export const useFetchTenets = () => {
  return { tenets: CREATIVE_TENETS_DATA, loading: false };
};

export const TenCreativePage: React.FC = () => {
  const { tenets } = useFetchTenets();
  const [activeTab, setActiveTab] = useState<'all' | 'table' | 'nafa' | 'alfan'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    // Update Document Head SEO
    document.title = "10 Creative Tenets – Nafa Nafisah & ALFAN | Framedia Creative";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', META_DESCRIPTION);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', META_DESCRIPTION);
      document.head.appendChild(metaDesc);
    }
  }, []);

  const categories = ['All', 'Mindset', 'Craft', 'Process', 'Network'];

  const filteredTenets = tenets.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nafaConcept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alfanAction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summaryTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageShell>
      {/* 1. Page Header */}
      <PageTitle
        title="Being Creative: 10 Main Points"
        subtitle="A dual perspective manifesto combining foundational creative philosophy with practical film and production deconstruction."
        icon={<Lightbulb className="w-8 h-8 text-[#FFC107]" strokeWidth={2.3} />}
        categoryTag="Village Creative Shrine"
        accentColor="orange"
      />

      {/* 2. Overview Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-[#FFF8EC] via-[#FCEECC] to-[#F5E2B8] rounded-2xl border-2 border-[#D6BC90] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="game-wood-pill text-xs font-bold px-3 py-1 uppercase tracking-wider">Dual Perspective Analysis</span>
            <span className="text-xs text-[#6B492B] font-bold">Nafa Nafisah B.t & ALFAN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#381E0A]">
            Transforming Reference into Original Masterpieces
          </h2>
          <p className="text-sm text-[#5E3A1A] mt-1 max-w-2xl">
            Creativity is not about waiting for raw magic; it is an active discipline of deconstructing great work, engaging tactile tools, building in public, and subtracting until only the essence remains.
          </p>
        </div>
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        {/* Navigation Tabs */}
        <div className="inline-flex p-1.5 bg-[#E8D8B8] rounded-xl border border-[#C5B088] shadow-inner gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-[#5E3A1A] text-white shadow-md'
                : 'text-[#5E3A1A] hover:bg-[#DAC8A2]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Cards View
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'table'
                ? 'bg-[#5E3A1A] text-white shadow-md'
                : 'text-[#5E3A1A] hover:bg-[#DAC8A2]'
            }`}
          >
            <Table className="w-4 h-4" />
            Comparison Matrix
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Pills */}
          <div className="flex items-center gap-1 bg-[#F2E4C8] p-1 rounded-xl border border-[#D8C49D]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#2F8FE0] text-white'
                    : 'text-[#5E3A1A] hover:bg-[#E5D2AB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]" />
            <input
              type="text"
              placeholder="Search tenets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white rounded-xl border border-[#D1B88F] text-xs font-semibold text-[#381E0A] focus:outline-none focus:ring-2 focus:ring-[#2F8FE0]"
            />
          </div>
        </div>
      </div>

      {/* 4. Tab Content 1: Cards View */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredTenets.map((item) => (
            <div
              key={item.id}
              className={`village-card p-5 sm:p-6 flex flex-col justify-between ${item.accentColor} transition-transform hover:-translate-y-1`}
            >
              <div>
                {/* Point Top Bar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="game-text-gold text-2xl font-black">
                      #{item.number}
                    </span>
                    <div className="p-2 bg-[#FAF5E8] rounded-xl border border-[#E2D2B2] shadow-xs">
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-[#F0E4CA] text-[#5E3A1A] rounded-full border border-[#D5C29D]">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-[#381E0A] mb-4 flex items-center gap-2">
                  {item.title}
                </h3>

                {/* Perspective 1: Nafa Nafisah */}
                <div className="mb-4 p-3.5 bg-[#FAF5E8] rounded-xl border border-[#E2D2B2]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] uppercase tracking-wider mb-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Nafa Nafisah B.t – Core Concept</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#381E0A] leading-relaxed">
                    {item.nafaConcept}
                  </p>
                </div>

                {/* Perspective 2: ALFAN */}
                <div className="p-3.5 bg-[#EBF5FF] rounded-xl border border-[#B3D7FF]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#146FBF] uppercase tracking-wider mb-1.5">
                    <Film className="w-3.5 h-3.5" />
                    <span>ALFAN – Film & Media Action</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#0C4880] leading-relaxed font-medium">
                    {item.alfanAction}
                  </p>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="mt-4 pt-3 border-t border-[#E8D8B8] flex items-center justify-between">
                <span className="text-xs font-bold text-[#5E3A1A] italic">
                  Key Takeaway:
                </span>
                <span className="game-wood-pill text-[11px] font-extrabold px-3 py-0.5">
                  {item.summaryTag}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Responsive Comparison Table (Horizontal Scroll on Mobile) */}
      {(activeTab === 'table' || activeTab === 'all') && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#381E0A] flex items-center gap-2">
              <Table className="w-5 h-5 text-[#2F8FE0]" />
              Tenets Comparative Matrix
            </h3>
            <span className="text-xs text-[#6B492B] font-semibold bg-[#F0E4CA] px-3 py-1 rounded-full border border-[#D5C29D]">
              Scroll horizontally on mobile
            </span>
          </div>

          {/* Table Container with Horizontal Scroll Enforcement */}
          <div className="w-full overflow-x-auto rounded-2xl border-2 border-[#D1B88F] shadow-sm bg-white">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-[#5E3A1A] to-[#8A5225] text-white">
                  <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider w-16 text-center border-r border-[#4A280D]">
                    #
                  </th>
                  <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider w-48 border-r border-[#4A280D]">
                    Tenet Principle
                  </th>
                  <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#4A280D]">
                    Nafa Nafisah B.t (Core Concept)
                  </th>
                  <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#4A280D]">
                    ALFAN (Film/Practical Action)
                  </th>
                  <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider w-36 text-center">
                    Action Takeaway
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADBBF] text-xs sm:text-sm">
                {filteredTenets.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 0 ? 'bg-[#FFFDF8] hover:bg-[#F9F0DF]' : 'bg-[#FAF5E8] hover:bg-[#F9F0DF]'}
                  >
                    <td className="py-3 px-4 font-black text-[#E8863A] text-center border-r border-[#EADBBF] align-top">
                      {item.number}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#381E0A] border-r border-[#EADBBF] align-top">
                      <div className="flex items-center gap-2">
                        <span>{item.title}</span>
                      </div>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold text-[#8B5A2B] bg-[#EEDCB8] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#381E0A] border-r border-[#EADBBF] leading-relaxed align-top">
                      {item.nafaConcept}
                    </td>
                    <td className="py-3 px-4 text-[#0C4880] font-medium border-r border-[#EADBBF] leading-relaxed align-top bg-blue-50/40">
                      {item.alfanAction}
                    </td>
                    <td className="py-3 px-4 text-center align-top">
                      <span className="inline-block font-bold text-[11px] text-white bg-[#5E3A1A] px-2.5 py-1 rounded-full shadow-xs">
                        {item.summaryTag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Meta Description & Tags Section at the End */}
      <div className="mt-12 p-6 bg-[#FAF5E8] rounded-2xl border-2 border-[#D1B88F] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Meta Description Display */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#8B5A2B] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#52BE1A]" />
              <span>SEO Meta Description (152 characters)</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E2D2B2] text-xs font-mono text-[#381E0A] leading-relaxed">
              "{META_DESCRIPTION}"
            </div>
          </div>

          {/* Tags */}
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#8B5A2B] uppercase tracking-wider">
              <Tag className="w-4 h-4 text-[#2F8FE0]" />
              <span>Article Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PAGE_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#2F8FE0] text-white font-bold text-xs rounded-full shadow-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
