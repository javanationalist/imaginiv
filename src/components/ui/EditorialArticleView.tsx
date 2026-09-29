/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  User, 
  Share2, 
  Check, 
  Sparkles, 
  ArrowDown, 
  Compass, 
  Feather, 
  Lightbulb, 
  Wrench,
  Bookmark,
  Printer
} from 'lucide-react';

export interface PrinciplePair {
  number: string;
  nafaTitle: string;
  nafaText: string;
  alfanTitle: string;
  alfanText: string;
}

export const PRINCIPLE_PAIRS: PrinciplePair[] = [
  {
    number: '01',
    nafaTitle: '1. Steal Like an Artist',
    nafaText: 'Creative ideas rarely come completely from scratch. Creators learn from other works, references, their surroundings, and other people, then transform them into something different. What matters is not copying, but understanding and developing those references.',
    alfanTitle: '1. Steal Like an Artist',
    alfanText: 'Deconstruct your favorite films: analyze camera movements, editing rhythm, and narrative structure. Adapt the core techniques into your own story rather than just copying the visuals.',
  },
  {
    number: '02',
    nafaTitle: '2. Don’t Wait Until You Know Who You Are',
    nafaText: 'We don’t have to know exactly what kind of creator we are before we start creating. Instead, through the process of creating, we can discover our own style and identity.',
    alfanTitle: "2. Don't Wait Until You Know Who You Are to Get Started",
    alfanText: "Don't wait for a signature style. Replicate scenes or color grading from creators you admire. The imperfections in your attempts are where your unique style actually begins.",
  },
  {
    number: '03',
    nafaTitle: '3. Make the Work You Want to See',
    nafaText: 'Don’t always follow what already exists. Create something that you personally want to see, hear, or use. This desire can lead to ideas that feel more personal and interesting.',
    alfanTitle: '3. Write the Book You Want to Read',
    alfanText: "Create content you actually want to watch but can't find online. Cover niche topics that mainstream media overlooks.",
  },
  {
    number: '04',
    nafaTitle: '4. Use Your Hands, Don’t Just Think',
    nafaText: 'Creativity is not only about thinking. Ideas can develop when we try them directly through activities such as drawing, writing, sketching, taking photos, or creating prototypes.',
    alfanTitle: '4. Use Your Hands',
    alfanText: 'Start manually. Sketch storyboards on paper and stick shot lists on the wall. Only switch to Premiere or DaVinci once you hit production and post-production.',
  },
  {
    number: '05',
    nafaTitle: '5. Side Projects and Hobbies Are Important',
    nafaText: 'Hobbies and side projects can be a place to experiment without pressure. They can lead to new skills, ideas, or career opportunities in the creative industry.',
    alfanTitle: '5. Side Projects and Hobbies Are Important',
    alfanText: 'Do fun side projects without worrying about grades—like street photography or sound design experiments. These casual pieces often become your best portfolio work.',
  },
  {
    number: '06',
    nafaTitle: '6. Do Good Work and Share It',
    nafaText: 'Creators should not only make good work but also show it to other people. By sharing the process and the results, we can build an audience, relationships, and work opportunities.',
    alfanTitle: '6. The Secret: Do Good Work and Share It with People',
    alfanText: 'Share the process, not just the final result. Post behind-the-scenes clips or research on social media to build an audience and get early feedback.',
  },
  {
    number: '07',
    nafaTitle: '7. Don’t Be Too Dependent on Location',
    nafaText: 'Creativity does not have to come from a specific city or place. The internet allows creators to connect with people from different places and build networks without having to be in the same location.',
    alfanTitle: '7. Geography Is No Longer Our Master',
    alfanText: 'Use the internet to collaborate across cities. Shoot in unusual locations occasionally to keep your visuals and storytelling fresh.',
  },
  {
    number: '08',
    nafaTitle: '8. Build Good Relationships',
    nafaText: 'In the creative industry, communication skills and maintaining good relationships are very important. The author emphasizes being kind, following people who can provide inspiration, and building a supportive environment.',
    alfanTitle: '8. Be Nice (The World Is a Small Town)',
    alfanText: 'The media industry is small. Build a solid reputation early through good professional etiquette, genuine appreciation for others, and a healthy attitude toward criticism.',
  },
  {
    number: '09',
    nafaTitle: '9. Discipline and Routine Are More Important Than Waiting for Inspiration',
    nafaText: 'Creativity does not mean always waiting for the right mood. Creating a schedule, working regularly, documenting the process, and staying consistent little by little can produce great work in the long run.',
    alfanTitle: "9. Be Boring (It's the Only Way to Get Work Done)",
    alfanText: 'Set a regular, disciplined production routine. Making steady daily progress is a lifesaver compared to frantic last-minute cramming.',
  },
  {
    number: '10',
    nafaTitle: '10. Creativity Also Means Knowing What to Remove',
    nafaText: 'Creativity is not only about adding many things to a work, but also about choosing what needs to be removed. Limitations can actually help us stay focused and find creative solutions.',
    alfanTitle: '10. Creativity Is Subtraction',
    alfanText: "Set deliberate limits (e.g., shoot a short film using only a smartphone and one location). Constraints force creative thinking. During editing, be brave enough to cut scenes that don't serve the story.",
  },
];

export const EditorialArticleView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <article className="w-full space-y-10 sm:space-y-14">
      {/* 1. HERO BANNER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2B1506] via-[#3D1E0B] to-[#251004] border-4 border-[#D6BC90] shadow-[0_12px_32px_rgba(43,21,6,0.35)] p-6 sm:p-10 lg:p-12 text-[#FFFDF5]">
        {/* Ambient Wood Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#D6BC90_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
          {/* Metadata Row (Clean unboxed text separators per anti-slop guidelines) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#E5C99F]">
            <span className="text-[#FFD580] tracking-wider uppercase font-bold">Creative Thinking</span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span>Editorial Masterclass</span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FFC107]" />
              8 min read
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#FFF8EB] tracking-tight leading-tight drop-shadow-md">
            10 Principles of Creativity
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#F2D6B3] font-serif italic max-w-2xl mx-auto leading-relaxed">
            Ideas, practice, discipline, and the process of becoming a creative person.
          </p>

          {/* Author & Publication Attribution Block */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-[#D8B48B] border-t border-[#D6BC90]/20 max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#8C5226] border border-[#FFD580] flex items-center justify-center text-[#FFFDF5] font-display text-xs">
                NN
              </div>
              <span className="font-bold text-[#FFF8EB]">Nafa Nafisah</span>
              <span className="text-[#B8906A] text-[11px]">(10 Principles)</span>
            </div>

            <span aria-hidden="true" className="opacity-40">&</span>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2F8FE0] border border-[#90CAF9] flex items-center justify-center text-[#FFFDF5] font-display text-xs">
                AL
              </div>
              <span className="font-bold text-[#FFF8EB]">Alfan</span>
              <span className="text-[#B8906A] text-[11px]">(Practical Applications)</span>
            </div>
          </div>

          {/* Article Action Toolbar */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="game-btn-wood text-xs !py-1.5 !px-3.5 inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Copy Article Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="game-btn-wood text-xs !py-1.5 !px-3.5 inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Print / Save Manuscript"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Manuscript</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CENTERED EDITORIAL READING COLUMN */}
      <div className="max-w-3xl sm:max-w-4xl mx-auto space-y-12 sm:space-y-16">
        {/* EDITORIAL OPENING INTRODUCTION */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFBF2] to-[#F7EED9] border-2 border-[#D6BC90] shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A05C25]">
            <Feather className="w-4 h-4 text-[#C08332]" />
            <span>Editorial Introduction</span>
          </div>

          <p className="text-base sm:text-lg text-[#381E0A] font-serif leading-relaxed first-letter:float-left first-letter:text-4xl first-letter:font-display first-letter:mr-2.5 first-letter:text-[#A05C25] first-letter:leading-none">
            Entering the creative industry is rarely about waiting for a sudden bolt of divine inspiration. For students, emerging film directors, visual storytellers, and media artisans, creative mastery is a living discipline—one cultivated day by day through acute observation, physical experimentation, active making, generous sharing, honest human relationships, and relentless iteration. In this editorial symposium, we unpack ten foundational pillars of modern creative methodology. Grounded in the core principles articulated by Nafa Nafisah and paired with practical, field-tested applications from filmmaker Alfan, this guide bridges the gap between abstract creative philosophy and the daily realities of production.
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-[#8C5D35] font-semibold border-t border-[#E3D1B1]">
            <span>Framedia Creative Atelier Publication</span>
            <span className="italic">10 Principles & Field Applications</span>
          </div>
        </motion.section>

        {/* 3. MAIN CONTENT: 10 PRINCIPLES & APPLICATIONS */}
        <div className="space-y-14 sm:space-y-20">
          {PRINCIPLE_PAIRS.map((pair, idx) => {
            const isTransitionAfter3 = idx === 3;
            const isTransitionAfter6 = idx === 6;
            const isTransitionAfter8 = idx === 8;

            return (
              <React.Fragment key={pair.number}>
                {/* Optional Subtle Editorial Transition Sentences between major sections */}
                {isTransitionAfter3 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EED9]/80 border border-[#D6BC90] text-center my-6">
                    <p className="text-sm sm:text-base font-serif italic text-[#7C471E] leading-relaxed">
                      Moving from conceptual philosophy into tactile execution requires engaging both mind and physical medium.
                    </p>
                  </div>
                )}

                {isTransitionAfter6 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EED9]/80 border border-[#D6BC90] text-center my-6">
                    <p className="text-sm sm:text-base font-serif italic text-[#7C471E] leading-relaxed">
                      Beyond individual studio practice, sustainable creative careers thrive through global connection and professional community.
                    </p>
                  </div>
                )}

                {isTransitionAfter8 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EED9]/80 border border-[#D6BC90] text-center my-6">
                    <p className="text-sm sm:text-base font-serif italic text-[#7C471E] leading-relaxed">
                      Long-term artistic growth depends on structured routines and knowing how to refine by cutting away the noise.
                    </p>
                  </div>
                )}

                {/* Principle Card Container */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4 }}
                  className="relative group rounded-3xl bg-white border-2 border-[#D6BC90] shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 space-y-6"
                >
                  {/* Large Visual Watermark Number for Editorial Hierarchy */}
                  <div className="absolute top-4 right-6 pointer-events-none select-none">
                    <span className="font-display text-5xl sm:text-6xl text-[#EEDFB8] opacity-70 group-hover:text-[#D6BC90] transition-colors">
                      {pair.number}
                    </span>
                  </div>

                  {/* SECTION 1: NAFA NAFISAH'S PRINCIPLE */}
                  <div className="space-y-3 relative z-10 pr-12">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A05C25] uppercase">
                      <Lightbulb className="w-4 h-4 text-[#C08332]" />
                      <span>Principle #{pair.number} · Nafa Nafisah</span>
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl text-[#2B1506] leading-snug">
                      {pair.nafaTitle}
                    </h2>

                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFBF2] border-l-4 border-[#A05C25] text-[#381E0A] text-sm sm:text-base leading-relaxed font-sans shadow-2xs">
                      {pair.nafaText}
                    </div>
                  </div>

                  {/* VISUAL CONNECTION CONNECTOR */}
                  <div className="flex items-center gap-2 py-1 pl-2 text-xs font-bold text-[#8C5226]">
                    <ArrowDown className="w-4 h-4 text-[#2F8FE0] animate-bounce" />
                    <span className="uppercase tracking-wider text-[11px] font-mono text-[#5C3210]">
                      Practical Application in Practice
                    </span>
                  </div>

                  {/* SECTION 2: ALFAN'S PRACTICAL APPLICATION */}
                  <div className="space-y-3 relative z-10 pl-2 sm:pl-4">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#1B5E20] uppercase">
                      <Wrench className="w-4 h-4 text-[#2F8FE0]" />
                      <span>Practical Application · Alfan</span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl text-[#1B365D] leading-snug">
                      {pair.alfanTitle}
                    </h3>

                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF3E6] to-[#F5E6CC] border border-[#D6BC90] text-[#2B1D0C] text-sm sm:text-base leading-relaxed font-sans shadow-2xs">
                      {pair.alfanText}
                    </div>
                  </div>
                </motion.section>
              </React.Fragment>
            );
          })}
        </div>

        {/* 4. EDITORIAL CLOSING CONCLUSION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#2B1506] to-[#1A0B03] border-4 border-[#D6BC90] shadow-lg text-[#FFFDF5] space-y-5 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#8C5226] border border-[#FFD580] flex items-center justify-center text-[#FFFDF5] mx-auto shadow-sm">
            <Compass className="w-6 h-6 text-[#FFD580]" />
          </div>

          <h3 className="font-display text-2xl sm:text-3xl text-[#FFF8EB]">
            Concluding Editorial Reflections
          </h3>

          <p className="text-base sm:text-lg text-[#F2D6B3] font-serif leading-relaxed max-w-2xl mx-auto">
            Ultimately, these ten principles remind us that creativity is neither a mysterious gift reserved for a select few nor a chaotic burst of unguided energy. It is a deliberate, tactile practice built on genuine curiosity, disciplined daily habits, hands-on experimentation, and the courage to strip away the non-essential. As you navigate your own projects at the studio or in the field, remember that every masterwork begins with a single step: using your hands, sharing your honest journey, and staying committed to the craft.
          </p>

          <div className="pt-4 text-xs font-semibold text-[#D8B48B] tracking-wider uppercase">
            Framedia Creative Atelier · Editorial Charter
          </div>
        </motion.section>
      </div>
    </article>
  );
};
