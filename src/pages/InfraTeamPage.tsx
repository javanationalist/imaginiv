/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/common/PageShell';
import { ImaginersPageData, ImaginersMember } from '../types';
import { imaginersService } from '../services/imaginersService';
import { SocialIcon, formatSocialHref } from '../components/imaginers/SocialIcon';

export const InfraTeamPage: React.FC = () => {
  const [pageData, setPageData] = useState<ImaginersPageData>({
    title: '',
    description: '',
  });
  const [members, setMembers] = useState<ImaginersMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Document Title
  useEffect(() => {
    if (pageData.title && pageData.title.trim()) {
      document.title = `${pageData.title.trim()} – Imaginiv`;
    } else {
      document.title = 'The Imaginers – Imaginiv';
    }
  }, [pageData.title]);

  // Fetch page info and members from Supabase
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [pageRes, membersRes] = await Promise.all([
          imaginersService.getPageData(),
          imaginersService.getMembers(),
        ]);

        if (isMounted) {
          setPageData(pageRes);
          setMembers(membersRes);
        }
      } catch (err) {
        console.error('Failed to load The Imaginers public data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasTitle = Boolean(pageData.title && pageData.title.trim().length > 0);
  const hasDescription = Boolean(pageData.description && pageData.description.trim().length > 0);
  const hasInfoSection = hasTitle || hasDescription;

  return (
    <PageShell>
      {/* 1. Breadcrumb & Back Navigation */}
      <div className="w-full mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-bold text-[#381E0A]">
            <Link
              to="/"
              className="hover:text-[#2F8FE0] transition-colors inline-flex items-center gap-1.5 touch-target font-display"
            >
              <span>Creative Village</span>
            </Link>
            <span className="text-[#381E0A]/40 font-bold">/</span>
            <span className="font-display text-[#381E0A] text-base">
              {hasTitle ? pageData.title.trim() : 'The Imaginers'}
            </span>
          </nav>

          <Link
            to="/"
            className="game-btn-wood !py-1.5 !px-3.5 !min-h-[38px] text-xs sm:text-sm inline-flex items-center justify-center shadow-[0_3px_0_#2A1202]"
          >
            <span>Back to Village Map</span>
          </Link>
        </div>
      </div>

      {/* 2. Optional Page Information Section: Rendered ONLY if Judul or Deskripsi has content */}
      {hasInfoSection && (
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2.5">
          {hasTitle && (
            <h1 className="font-display text-2xl sm:text-4xl text-[#381E0A] drop-shadow-xs leading-tight">
              {pageData.title.trim()}
            </h1>
          )}
          {hasDescription && (
            <p className="text-sm sm:text-base text-[#7C471E] font-semibold leading-relaxed">
              {pageData.description.trim()}
            </p>
          )}
        </div>
      )}

      {/* 3. Main Content: Members Showcase (Centered, Maximum 2 Columns) */}
      <div className="w-full mb-12">
        {loading ? (
          /* Skeletons: Max 2 Columns, Centered */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto justify-items-center">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="game-wood-frame p-4 rounded-2xl bg-[#EADBBD] animate-pulse flex flex-col items-center w-full max-w-sm"
              >
                <div className="w-full aspect-[3/4] rounded-xl bg-[#FAF0D4] border-2 border-[#D6BC90] mb-3" />
                <div className="w-3/4 h-5 rounded-md bg-[#D6BC90] mb-2" />
                <div className="w-1/2 h-3.5 rounded-md bg-[#D6BC90]/70 mb-4" />
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#D6BC90]" />
                  <div className="w-7 h-7 rounded-full bg-[#D6BC90]" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          /* Empty State - No mock/fabricated data */
          <div className="game-wood-frame max-w-md mx-auto p-4 sm:p-6 text-center">
            <div className="game-parchment p-8 sm:p-10 rounded-2xl border-2 border-[#542E10] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FAF0D4] border-2 border-[#542E10] shadow-[0_4px_0_#2B1302] flex items-center justify-center text-[#52C01B]">
                <Users className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-display text-xl sm:text-2xl text-[#381E0A]">
                  The Imaginers Guild
                </h3>
                <p className="text-xs sm:text-sm text-[#7C471E] font-semibold mt-2 leading-relaxed">
                  Belum ada profil anggota yang dipublikasikan. Profil anggota yang ditambahkan melalui panel admin akan muncul di sini sesuai urutan yang dikonfigurasi.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Members Grid - Strictly Maximum 2 Columns, Centered, 3:4 Aspect Ratio Photos */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto justify-items-center">
            {members.map((member) => {
              const photoUrl = member.photo_url || member.picture_url || '';

              return (
                <div
                  key={member.id}
                  className="game-wood-frame p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full max-w-sm"
                >
                  {/* Photo with exact 3:4 portrait ratio without distortion */}
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#542E10] bg-[#1F1004] shadow-inner mb-3.5">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={member.name || member.role}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#D6BC90]">
                        <Users className="w-12 h-12" />
                      </div>
                    )}
                    {/* Subtle vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Centered Member Details: Name, Role, and Social Media */}
                  <div className="game-parchment p-4 rounded-xl border border-[#D6BC90] w-full flex flex-col items-center text-center space-y-2">
                    {/* 1. Nama Person as Primary Text */}
                    {member.name && (
                      <h2 className="font-display text-xl sm:text-2xl text-[#381E0A] leading-tight drop-shadow-xs">
                        {member.name}
                      </h2>
                    )}

                    {/* 2. Nomor Induk Mahasiswa (Label & Value directly below) */}
                    {member.nim && (
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-[#8C5D35] uppercase tracking-wider">
                          Nomor Induk Mahasiswa
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-extrabold text-[#381E0A] tracking-wider mt-0.5">
                          {member.nim}
                        </span>
                      </div>
                    )}

                    {/* 3. Role Beneath NIM */}
                    <p className="text-xs sm:text-sm text-[#7C471E] font-bold">
                      {member.role}
                    </p>

                    {/* 4. Social Media Icons Beneath Role (Rendered only if links exist) */}
                    {member.social_media && member.social_media.length > 0 && (
                      <div className="pt-2.5 mt-1 border-t border-[#D6BC90]/60 w-full flex items-center justify-center gap-2 flex-wrap">
                        {member.social_media.map((s, idx) => {
                          const href = formatSocialHref(s.platform, s.value_or_url);
                          const isEmail = s.platform === 'Email';

                          return (
                            <a
                              key={idx}
                              href={href}
                              target={isEmail ? undefined : '_blank'}
                              rel={isEmail ? undefined : 'noopener noreferrer'}
                              aria-label={`${member.name || member.role} on ${s.platform}`}
                              title={s.platform}
                              className="w-8 h-8 rounded-lg bg-[#FAF0D4] hover:bg-[#2F8FE0] text-[#542E10] hover:text-white border-2 border-[#542E10] shadow-[0_2px_0_#2B1302] flex items-center justify-center transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
                            >
                              <SocialIcon platform={s.platform} size={15} />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
};

// Also export alias for convenient import compatibility
export const TheImaginersPage = InfraTeamPage;
