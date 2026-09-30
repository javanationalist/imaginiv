/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Shield, 
  Compass, 
  Clapperboard, 
  Images, 
  Lightbulb, 
  Users, 
  Scale, 
  HeartHandshake, 
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { authService } from '../../services/authService';
import { usePageVisibility } from '../../context/PageVisibilityContext';
import { BRAND_ASSETS } from '../../utils/brand';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const { isPageVisible, loading } = usePageVisibility();

  // Close mobile menu automatically on route or hash changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Lock body scroll when mobile menu is open to prevent double scrollbars
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allNavLinks = [
    { id: 'directory', name: 'Directory', route: '/#directory', icon: Compass, alwaysVisible: true, subtitle: 'Village Map & Sectors' },
    { id: 'project', name: 'Project', route: '/project', icon: Clapperboard, subtitle: 'Active Film Pipeline' },
    { id: 'portfolio', name: 'Portfolio', route: '/portfolio', icon: Images, subtitle: 'Curated Works Gallery' },
    { id: 'being-creative', name: 'Being Creative', route: '/beingcreative', icon: Lightbulb, subtitle: '10 Studio Tenets' },
    { id: 'infra-team', name: 'inFra Team', route: '/infrateam', icon: Users, subtitle: 'Artisan Collective' },
    { id: 'ai-ethics', name: 'AI Ethics', route: '/aiethics', icon: Scale, subtitle: 'Human Authorship Charter' },
    { id: 'inclusivity', name: 'Inclusivity', route: '/inclusivity', icon: HeartHandshake, subtitle: 'Universal Access' },
    { id: 'about', name: 'About', route: '/about', icon: Compass, subtitle: 'Origins & Philosophy' },
    { id: 'article', name: 'Article', route: '/article', icon: BookOpen, subtitle: 'Editorial & Essays', isNew: true },
  ];

  const visibleNavLinks = allNavLinks.filter(link => link.alwaysVisible || isPageVisible(link.id));

  const handleNavClick = (route: string) => {
    setMobileMenuOpen(false);
    if (route.startsWith('/#')) {
      const hash = route.substring(2);
      if (location.pathname === '/') {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header
      id="header"
      className="fixed top-0 left-0 right-0 w-full z-50 game-wood-header-strip transition-all duration-200"
    >
      <div className="w-full max-w-[1240px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between relative">
        {/* Brand identity: Village Sign */}
        <Link
          to="/"
          id="header-logo"
          className="flex items-center group select-none min-h-[40px] sm:min-h-[44px] touch-target pl-1 sm:pl-2 shrink min-w-0"
        >
          <img
            src={BRAND_ASSETS.logoUrl}
            alt="Imaginiv"
            className="h-7 sm:h-8 md:h-9 w-auto max-w-[140px] sm:max-w-[170px] object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Tabs (Wooden Game UI Buttons) */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-1.5" aria-label="Main Navigation">
          {loading ? (
            <div className="flex items-center gap-2 py-1 px-2 animate-pulse">
              <div className="h-7 w-16 bg-[#5C3210]/50 rounded-xl" />
              <div className="h-7 w-16 bg-[#5C3210]/50 rounded-xl" />
              <div className="h-7 w-20 bg-[#5C3210]/50 rounded-xl" />
              <div className="h-7 w-16 bg-[#5C3210]/50 rounded-xl" />
            </div>
          ) : (
            visibleNavLinks.map((link) => {
              const isHash = link.route.startsWith('/#');
              const isActive = isHash
                ? (location.pathname === '/' && location.hash === '#directory')
                : (location.pathname === link.route || (link.route === '/beingcreative' && location.pathname === '/10beingcreative'));
              return (
                <Link
                  key={link.name}
                  to={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`
                    px-1.5 lg:px-2.5 xl:px-3 py-1.5 rounded-xl text-[11px] lg:text-xs xl:text-[13.5px] font-display transition-all select-none whitespace-nowrap min-h-[36px] lg:min-h-[38px] xl:min-h-[40px] inline-flex items-center gap-1
                    ${isActive
                      ? 'bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E1B02] border-2 border-[#5D2B03] shadow-[0_3px_0_#3E1B02,inset_0_1px_0_rgba(255,255,255,0.7)] font-bold'
                      : 'text-[#FFE8C2] hover:text-white hover:bg-[#5C3210]/60 border border-transparent'}
                  `}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })
          )}
        </nav>

        {/* Right side: Smurf Blue Admin Button & Mobile Menu Toggle (Hidden on PC device) */}
        <div className="flex md:hidden items-center gap-2 shrink-0 pr-1 sm:pr-2">
          {/* Admin Button - Game Blue 3D Button (Visible on mobile, hidden on PC) */}
          <Link
            to={currentUser ? "/admin" : "/login"}
            id="header-admin-btn"
            className="game-btn-blue text-xs sm:text-sm !py-1.5 sm:!py-2 !px-2.5 sm:!px-3.5 !min-h-[40px] sm:!min-h-[42px] gap-1.5 shadow-[0_3px_0_#093764] flex md:hidden items-center shrink-0"
            title={currentUser ? "Admin CMS Dashboard" : "Admin Portal Sign-In"}
          >
            <Shield className="w-4 h-4 text-amber-200 shrink-0" strokeWidth={2.5} />
            <span className="hidden sm:inline">{currentUser ? "Dashboard" : "Admin"}</span>
          </Link>

          {/* Mobile hamburger button: Hidden on desktop/PC, visible on mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden game-wood-circle-btn !w-10 !h-10 text-white shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={2.5} /> : <Menu className="w-5 h-5" strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Slide-out Mobile Navigation Drawer (Right edge, Wood-Panel & Parchment Style) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay with smooth fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/65 backdrop-blur-xs z-[60] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-Out Drawer Panel */}
            <motion.aside
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Village Navigation Menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 w-[310px] sm:w-[350px] max-w-[88vw] h-full z-[60] bg-[#291404] text-[#381E0A] flex flex-col border-l-4 border-[#5E3A1A] shadow-[-12px_0_36px_rgba(0,0,0,0.65)] overflow-hidden md:hidden"
            >
              {/* Drawer Top Wooden Header Plank */}
              <div className="relative game-wood-plank p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#1E0D03] shadow-[0_4px_10px_rgba(0,0,0,0.4)] shrink-0 z-10">
                {/* Plaque Corner Nails */}
                <div className="absolute top-2 left-2 game-nail" />
                <div className="absolute bottom-2 left-2 game-nail" />
                <div className="absolute top-2 right-12 game-nail" />
                <div className="absolute bottom-2 right-12 game-nail" />

                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <img
                    src={BRAND_ASSETS.logoUrl}
                    alt="Imaginiv"
                    className="h-7 w-auto object-contain"
                  />
                </div>

                {/* Tactile Wood Close Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="game-wood-circle-btn !w-9 !h-9 text-white shrink-0 shadow-[0_3px_0_#2B1302]"
                >
                  <X className="w-5 h-5 text-white" strokeWidth={2.5} />
                </button>
              </div>

              {/* Drawer Body: Parchment Scroll Area */}
              <div className="flex-1 overflow-y-auto px-3.5 py-4 game-parchment flex flex-col gap-2 relative">
                {loading ? (
                  <div className="py-4 space-y-2.5 animate-pulse">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div key={idx} className="h-12 bg-[#DEC9A3] rounded-xl" />
                    ))}
                  </div>
                ) : (
                  visibleNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isHash = link.route.startsWith('/#');
                    const isActive = isHash
                      ? (location.pathname === '/' && location.hash === '#directory')
                      : (location.pathname === link.route || (link.route === '/beingcreative' && location.pathname === '/10beingcreative'));
                    return (
                      <Link
                        key={link.name}
                        to={link.route}
                        onClick={() => handleNavClick(link.route)}
                        className={`
                          flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-display text-sm transition-all min-h-[48px] touch-target
                          ${isActive
                            ? 'bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E1B02] border-2 border-[#5D2B03] shadow-[0_2px_0_#3E1B02]'
                            : 'bg-[#FFF8EA] text-[#3E1B02] border border-[#D6BC90] hover:border-[#8B5226] hover:bg-white shadow-[0_1.5px_0_#DEC9A3] active:translate-y-0.5'}
                        `}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive 
                            ? 'bg-[#5D2B03]/15 text-[#3E1B02]' 
                            : 'bg-[#F2DFBD] text-[#8B5226] border border-[#DEC9A3]'
                        }`}>
                          <Icon className="w-4 h-4" strokeWidth={2.4} />
                        </div>

                        <div className="flex items-center min-w-0 flex-1">
                          <span className="truncate leading-snug">{link.name}</span>
                        </div>

                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? 'text-[#3E1B02] translate-x-0.5' : 'text-[#8B5226]/50'
                        }`} />
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer: Admin Access & Studio Badge */}
              <div className="p-3.5 bg-[#1F0E03] border-t-2 border-[#5E3A1A] shrink-0 flex flex-col gap-2.5">
                <Link
                  to={currentUser ? "/admin" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full game-btn-blue text-sm !py-2.5 flex items-center justify-center gap-2 min-h-[44px] shadow-[0_3px_0_#093764]"
                >
                  <Shield className="w-4 h-4 text-amber-200" strokeWidth={2.5} />
                  <span className="font-display tracking-wide">{currentUser ? "Admin CMS Dashboard" : "Admin Login Portal"}</span>
                </Link>

                <div className="text-[10px] font-bold text-[#D6BC90]/70 text-center tracking-wider uppercase font-sans">
                  Framedia Creative &bull; Atelier
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

