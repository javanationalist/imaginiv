/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { ImaginersMember } from '../../types';
import { formatSocialHref } from './SocialIcon';
import { soundManager } from '../../services/soundService';

interface MemberDetailModalProps {
  member: ImaginersMember | null;
  onClose: () => void;
}

interface ProfileField {
  key: string;
  label: string;
  prefix: string;
  value: string;
  isLink?: boolean;
  href?: string;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  // Extract Instagram data cleanly
  const instagramData = useMemo(() => {
    if (!member) return { display: '-', url: '' };

    const igItem = member.social_media?.find(
      (s) => s.platform.toLowerCase() === 'instagram'
    );

    if (!igItem || !igItem.value_or_url.trim()) {
      return { display: '-', url: '' };
    }

    const raw = igItem.value_or_url.trim();
    let display = raw;
    let url = raw;

    if (raw.includes('instagram.com/')) {
      const parts = raw.split('instagram.com/');
      const userPart = parts[1]?.split(/[?/#]/)[0] || '';
      if (userPart) {
        display = `@${userPart}`;
      }
    } else if (!raw.startsWith('@') && !raw.startsWith('http')) {
      display = `@${raw}`;
    }

    url = formatSocialHref('Instagram', raw);

    return { display, url };
  }, [member]);

  // Define the 4 fields in exact required order: Nama, NIM, Role, Instagram
  const fields: ProfileField[] = useMemo(() => {
    if (!member) return [];

    return [
      {
        key: 'Nama',
        label: 'Nama',
        prefix: 'Nama: ',
        value: member.name || '-',
      },
      {
        key: 'NIM',
        label: 'NIM',
        prefix: 'NIM: ',
        value: member.nim?.trim() ? member.nim.trim() : '-',
      },
      {
        key: 'Role',
        label: 'Role',
        prefix: 'Role: ',
        value: member.role || '-',
      },
      {
        key: 'Instagram',
        label: 'Instagram',
        prefix: 'Instagram: ',
        value: instagramData.display,
        isLink: Boolean(instagramData.url && instagramData.display !== '-'),
        href: instagramData.url,
      },
    ];
  }, [member, instagramData]);

  // Typewriter animation state:
  // currentLineIndex indicates which line is actively typing (0 to fields.length)
  // currentCharIndex indicates how many characters of (prefix + value) have appeared
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);

  // Check user preference for reduced motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Reset animation whenever a new member is selected or opened
  useEffect(() => {
    if (!member) return;

    if (prefersReducedMotion) {
      // Instantly reveal all text without typewriter effect
      setCurrentLineIndex(fields.length);
      setCurrentCharIndex(9999);
      return;
    }

    // Start fresh from line 0, char 0
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
  }, [member, fields.length, prefersReducedMotion]);

  // Typewriter effect ticker: 35ms per character
  useEffect(() => {
    if (!member || prefersReducedMotion) return;

    if (currentLineIndex >= fields.length) {
      return; // All 4 lines completed
    }

    const activeField = fields[currentLineIndex];
    if (!activeField) return;

    const fullLineLength = activeField.prefix.length + activeField.value.length;

    const timer = setTimeout(() => {
      if (currentCharIndex < fullLineLength) {
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        // Line finished, proceed to next line
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }
    }, 35); // 35ms per character (within 30-50ms requirement)

    return () => {
      clearTimeout(timer);
    };
  }, [member, currentLineIndex, currentCharIndex, fields, prefersReducedMotion]);

  // Trap keyboard and Escape key
  useEffect(() => {
    if (!member) return;

    // Focus close button on mount
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        soundManager.playClick();
        onClose();
      }

      // Basic tab trapping inside modal
      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusable = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [member, onClose]);

  if (!member) return null;

  const photoUrl = member.photo_url || member.picture_url || '';

  // Allow clicking text area to instantly complete the typewriter animation
  const handleSkipTyping = () => {
    setCurrentLineIndex(fields.length);
    setCurrentCharIndex(9999);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      aria-hidden="false"
    >
      {/* Content-driven responsive modal container: 3:4 portrait photo reference on mobile, 16:9 landscape on desktop */}
      <div
        ref={modalContainerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Profile: ${member.name}`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[900px] h-auto max-h-[85vh] sm:max-h-[90vh] md:aspect-[16/9] md:min-h-[360px] md:max-h-[520px] bg-[#FFFDF7] border-[4px] sm:border-[5px] border-[#452106] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7),0_6px_0_#2B1302] overflow-hidden flex flex-row items-stretch select-text animate-in fade-in zoom-in-95 duration-300 ease-out"
      >
        {/* Close (X) Button positioned at the top right of the modal */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          aria-label="Tutup modal profil"
          title="Tutup (Esc)"
          className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-30 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#522C10]/85 hover:bg-[#3D1E08] text-[#FAF0D4] hover:text-white border-2 border-[#FAF0D4]/40 hover:border-[#FAF0D4] flex items-center justify-center cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD54F]"
        >
          <X className="w-3.5 h-3.5 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>

        {/* LEFT HALF: Member Photo (3:4 portrait aspect ratio on mobile, full-height landscape on desktop) */}
        <div className="w-[42%] sm:w-1/2 aspect-[3/4] md:aspect-auto md:h-full relative bg-[#1F1004] overflow-hidden shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={member.name || member.role}
              className="w-full h-full object-cover object-center pointer-events-none"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#D6BC90] bg-[#3B1F08] p-3 text-center">
              <span className="font-display text-xs sm:text-base">Foto Profil</span>
            </div>
          )}

          {/* Subtle vertical divider line */}
          <div className="absolute inset-y-0 right-0 w-[2px] bg-[#452106]/50 pointer-events-none" />
        </div>

        {/* RIGHT HALF: Text Content (top-aligned to photo on mobile, centered on desktop) */}
        <div 
          onClick={handleSkipTyping}
          className="w-[58%] sm:w-1/2 h-auto flex flex-col justify-start md:justify-center p-3 sm:p-5 md:p-8 lg:p-10 pr-8 sm:pr-10 md:pr-8 lg:pr-10 bg-[#FFFDF7] relative overflow-y-auto cursor-pointer"
          title="Klik teks untuk mempercepat pengetikan"
        >
          {/* Subtle Sector Header Badge */}
          <div className="flex items-center gap-1 text-[9px] sm:text-xs font-display uppercase tracking-widest text-[#8C5D35] mb-1.5 sm:mb-3 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8863A] shrink-0" />
            <span className="truncate">The Imaginers Guild</span>
          </div>

          {/* Profile Fields in Exact Order: Nama, NIM, Role, Instagram */}
          <div className="space-y-1.5 sm:space-y-3 md:space-y-4 font-sans text-xs sm:text-sm md:text-base lg:text-lg">
            {fields.map((field, fieldIndex) => {
              // Calculate how many characters are rendered for this field
              let renderedCharsCount = 0;
              let isCurrentlyTypingThisLine = false;

              if (fieldIndex < currentLineIndex) {
                // Entire line finished
                renderedCharsCount = field.prefix.length + field.value.length;
              } else if (fieldIndex === currentLineIndex) {
                // Currently typing this line
                renderedCharsCount = currentCharIndex;
                isCurrentlyTypingThisLine = true;
              } else {
                // Has not started typing yet
                renderedCharsCount = 0;
              }

              // Determine label slice vs value slice
              let visibleLabel = '';
              let visibleValue = '';

              if (renderedCharsCount <= field.prefix.length) {
                visibleLabel = field.prefix.slice(0, renderedCharsCount);
                visibleValue = '';
              } else {
                visibleLabel = field.prefix;
                visibleValue = field.value.slice(0, renderedCharsCount - field.prefix.length);
              }

              return (
                <div 
                  key={field.key} 
                  className="flex items-baseline flex-wrap leading-snug sm:leading-relaxed"
                >
                  {/* Muted Label */}
                  {visibleLabel && (
                    <span className="font-display text-[#8C5D35] font-bold text-[11px] sm:text-sm md:text-base mr-1 sm:mr-2 shrink-0">
                      {visibleLabel}
                    </span>
                  )}

                  {/* Emphasized Value */}
                  {visibleValue && (
                    field.isLink && field.href ? (
                      <a
                        href={field.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playClick();
                        }}
                        className="font-sans font-extrabold text-[#146FBF] hover:text-[#093764] hover:underline transition-colors duration-200 inline-flex items-center gap-1 text-[11px] sm:text-sm md:text-base break-all"
                        title={`Buka Instagram ${visibleValue}`}
                      >
                        <span>{visibleValue}</span>
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline-block shrink-0 opacity-80" />
                      </a>
                    ) : (
                      <span className="font-sans font-extrabold text-[#2A1202] text-[11px] sm:text-sm md:text-base break-words">
                        {visibleValue}
                      </span>
                    )
                  )}

                  {/* Blinking Typewriter Cursor at active typing position */}
                  {isCurrentlyTypingThisLine && (
                    <span
                      className="inline-block w-1.5 sm:w-2 h-3.5 sm:h-4.5 bg-[#C78235] ml-1 animate-pulse align-middle"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Keyboard shortcut hint (hidden on mobile) */}
          <div className="hidden sm:block mt-4 sm:mt-6 pt-2 sm:pt-3 border-t border-[#D6BC90]/40 text-[9px] sm:text-[10px] font-sans text-[#8C5D35]/75 select-none">
            <span className="hidden sm:inline">Tekan <kbd className="px-1 py-0.5 rounded bg-[#FAF0D4] border border-[#D6BC90] font-mono text-[9px]">ESC</kbd> untuk menutup</span>
          </div>
        </div>
      </div>
    </div>
  );
};
