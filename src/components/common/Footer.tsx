/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, Check, Info } from 'lucide-react';
import { authService } from '../../services/authService';
import { soundManager } from '../../services/soundService';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const currentUser = authService.getCurrentUser();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    soundManager.playChime();
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const navLinks = [
    { name: 'Project', route: '/project' },
    { name: 'Portfolio', route: '/portfolio' },
    { name: 'Being Creative', route: '/beingcreative' },
    { name: 'inFra Team', route: '/infrateam' },
    { name: 'AI Ethics', route: '/aiethics' },
    { name: 'Inclusivity', route: '/inclusivity' },
    { name: 'About Framedia', route: '/about' },
  ];

  return (
    <footer id="footer" className="w-full mt-20 relative select-none">
      {/* Cartoon Grass Tufts at Footer Top */}
      <div className="w-full h-4 overflow-hidden flex items-end -mb-0.5 pointer-events-none">
        <div className="w-full flex justify-between">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="w-6 h-3.5 bg-[#8FD14F] rounded-t-full border-t-2 border-l-2 border-[#2B1B12]" />
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#9C6538] via-[#7E4A20] to-[#522C10] border-t-[4px] border-[#2B1B12] pt-10 pb-12 px-4 sm:px-6 lg:px-8 text-white relative shadow-[inset_0_4px_0_rgba(255,255,255,0.25)]">
        {/* Top-Right Wooden Circle Action (Info button) on all devices */}
        <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-6 z-20">
          <button
            type="button"
            className="game-wood-circle-btn text-[#FFE599] cursor-pointer inline-flex items-center justify-center"
            title="Framedia Village Atelier Info"
            onClick={() => soundManager.playClick()}
          >
            <Info className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-w-[1200px] mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b-2 border-[#2B1B12]/40">
            {/* Col 1: Brand & Village Lore (5 cols) */}
            <div className="lg:col-span-5 space-y-3.5">
              <Link
                to="/"
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center gap-3 group min-h-[44px]"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#FFDE59] to-[#FF9900] border-[2.5px] border-[#2B1B12] shadow-[inset_0_2px_0_rgba(255,255,255,0.6),0_3px_0_#1A1009] flex items-center justify-center font-cartoon text-2xl text-[#2B1B12]">
                  I
                </div>
                <div className="flex flex-col">
                  <span
                    className="font-cartoon text-2xl text-white cartoon-title-sm tracking-wide leading-tight font-bold"
                    style={{ fontWeight: 'bold' }}
                  >
                    Imaginiv
                  </span>
                </div>
              </Link>

              <p className="text-[14px] sm:text-[15px] text-[#F3E2CE] max-w-md leading-relaxed font-medium">
                A multidisciplinary creative media agency where narrative craft, tactile visual production, and forward-thinking media come together under one collaborative roof.
              </p>
            </div>

            {/* Col 2: Navigation Map (3 cols) */}
            <div className="lg:col-span-3">
              <h4 className="font-cartoon text-base sm:text-lg text-[#FFDE59] uppercase tracking-wider mb-3 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                Village Hub
              </h4>
              <ul className="space-y-1.5 text-[15px]">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.route}
                      onClick={() => soundManager.playClick()}
                      className="text-[#F3E2CE] hover:text-[#FFDE59] font-bold transition-colors inline-block py-1 min-h-[30px]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Newsletter & Contact on Parchment (4 cols) */}
            <div className="lg:col-span-4 parchment-canvas p-5 sm:p-6 rounded-2xl text-[#2B1B12]">
              <div className="flex items-center gap-2 mb-2">
                <h4
                  className="font-cartoon text-base uppercase tracking-wider text-[#fff8f8]"
                  style={{ color: '#fff8f8' }}
                >
                  Village Dispatches
                </h4>
              </div>
              <p
                className="text-xs sm:text-sm leading-relaxed mb-3 text-[#fffefd]"
                style={{ color: '#fffefd' }}
              >
                Quarterly field notes on visual craft, human narrative, and sustainable creative tools.
              </p>

              <form onSubmit={handleSubscribe} className="relative mb-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  aria-label="Email address for village newsletter"
                  className="w-full bg-[#FFFFFF] text-[#2B1B12] placeholder-[#8A6749] text-sm pl-3.5 pr-24 py-2.5 rounded-xl border-2 border-[#2B1B12] focus:outline-none focus:ring-2 focus:ring-[#2F8FE0] min-h-[44px]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 btn-blue-glossy !py-1.5 !px-3.5 !min-h-[36px] text-xs font-cartoon"
                >
                  Join
                </button>
              </form>

              {subscribed && (
                <p className="text-xs font-bold text-[#2A7513] flex items-center gap-1.5 mb-2">
                  <Check className="w-4 h-4" />
                  <span>Thank you! You are now on the village mailing dispatch.</span>
                </p>
              )}

              <div
                className="pt-2 text-xs space-y-1.5 border-t border-[#2B1B12]/20 text-white"
                style={{ color: '#ffffff' }}
              >
                <div className="flex items-center gap-2" style={{ color: '#ffffff' }}>
                  <Mail className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0" />
                  <span className="font-bold">hello@framedia.creative</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#ffffff' }}>
                  <Globe className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0" />
                  <span className="font-medium" style={{ color: '#ffffff' }}>Worldwide Collaborative Atelier</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-center text-center gap-3 text-xs sm:text-sm text-[#F3E2CE]">
            <div>
              &copy; {new Date().getFullYear()} Imaginiv &bull; Creative Agency Studios
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
