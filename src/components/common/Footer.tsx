/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, Mail, MessageCircle, Instagram } from 'lucide-react';
import { soundManager } from '../../services/soundService';
import { BRAND_ASSETS } from '../../utils/brand';

interface ContactItem {
  label: string;
  value: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    label: 'Email',
    value: 'imaginiv@tuta.io',
    action: 'mailto:imaginiv@tuta.io',
    icon: Mail,
    isExternal: false,
  },
  {
    label: 'WhatsApp',
    value: '+62 851 9629 3078',
    action: 'https://wa.me/6285196293078',
    icon: MessageCircle,
    isExternal: true,
  },
  {
    label: 'Instagram',
    value: '@imaginiv.id',
    action: 'https://instagram.com/imaginiv.id',
    icon: Instagram,
    isExternal: true,
  },
];

export const Footer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleInfo = () => {
    soundManager.playClick();
    setIsExpanded((prev) => !prev);
  };

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

      <div className="bg-gradient-to-b from-[#9C6538] via-[#7E4A20] to-[#522C10] border-t-[4px] border-[#2B1B12] py-10 sm:py-12 px-4 sm:px-6 lg:px-8 text-white relative shadow-[inset_0_4px_0_rgba(255,255,255,0.25)]">
        {/* Info Button in Top Right Corner */}
        <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-6 z-20">
          <button
            type="button"
            onClick={toggleInfo}
            aria-expanded={isExpanded}
            aria-controls="footer-contact-panel"
            aria-label={isExpanded ? 'Collapse contact information' : 'Expand contact information'}
            title={isExpanded ? 'Hide Contact Info' : 'Show Contact Info'}
            className={`
              w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center
              border transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFD54F] focus:ring-offset-2 focus:ring-offset-[#7E4A20]
              ${isExpanded
                ? 'bg-[#FFD54F] border-[#E5A800] text-[#3E1B02]'
                : 'bg-[#522C10]/80 border-[#FAF0D4]/30 text-[#FAF0D4] hover:text-white hover:bg-[#522C10] hover:border-[#FAF0D4]/70'}
            `}
          >
            <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.3} />
          </button>
        </div>

        <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center text-center">
          {/* Expandable Contact Information Panel */}
          <div
            id="footer-contact-panel"
            className={`w-full max-w-2xl overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-in-out ${
              isExpanded
                ? 'max-h-96 opacity-100 mb-8 pt-1'
                : 'max-h-0 opacity-0 mb-0 pt-0 pointer-events-none'
            }`}
            aria-hidden={!isExpanded}
          >
            <div className="rounded-2xl bg-[#3D1E08]/85 border border-[#FAF0D4]/20 p-4 sm:p-6 backdrop-blur-xs text-left shadow-lg">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#FAF0D4]/15">
                <h3 className="font-display text-sm sm:text-base text-[#FAF0D4] font-bold tracking-wide">
                  Contact
                </h3>
                <span className="text-[11px] font-sans text-[#FAF0D4]/60 font-medium">
                  Direct Inquiries
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CONTACT_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.action}
                      target={item.isExternal ? '_blank' : undefined}
                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                      onClick={() => soundManager.playClick()}
                      className="group flex flex-col p-3 rounded-xl bg-[#2E1404]/60 border border-[#FAF0D4]/10 hover:border-[#FFD54F]/50 hover:bg-[#2E1404] transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#FFD54F]"
                    >
                      <div className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-[#FAF0D4]/70 mb-1.5">
                        <Icon className="w-3.5 h-3.5 text-[#FFD54F] shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-sans font-semibold text-[#FAF0D4] group-hover:text-[#FFD54F] transition-colors duration-200 truncate">
                        {item.value}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Centered Brand Logo */}
          <Link
            to="/"
            onClick={() => soundManager.playClick()}
            className="inline-flex items-center justify-center min-h-[44px] transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FFD54F] focus:ring-offset-2 focus:ring-offset-[#7E4A20] rounded-xl"
            aria-label="Back to home"
          >
            <img
              src={BRAND_ASSETS.logoUrl}
              alt="Imaginiv"
              className="object-contain max-w-full w-auto h-24 sm:h-28 md:h-32 drop-shadow-md"
            />
          </Link>

          {/* Centered All Rights Reserved Notice */}
          <p className="mt-4 text-xs sm:text-sm font-sans text-[#FAF0D4]/80 tracking-wide text-center">
            &copy; {new Date().getFullYear()} Imaginiv. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

