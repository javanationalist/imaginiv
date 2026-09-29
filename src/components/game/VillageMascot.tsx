/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundManager } from '../../services/soundService';

interface VillageMascotProps {
  className?: string;
  speechText?: string;
}

export const VillageMascot: React.FC<VillageMascotProps> = ({
  className = '',
  speechText = "Welcome to our Creative Village!",
}) => {
  const [bubbleOpen, setBubbleOpen] = useState(false);

  const handleClick = () => {
    soundManager.playClick();
    setBubbleOpen(!bubbleOpen);
  };

  return (
    <div
      className={`relative z-20 select-none cursor-pointer group ${className}`}
      onClick={handleClick}
      title="Click me!"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Speech Bubble (pops up when mascot is clicked or on hover) */}
      <div
        className={`absolute -top-14 left-1/2 -translate-x-1/2 sm:-translate-x-1/4 min-w-[200px] max-w-[240px] transition-all duration-200 pointer-events-none z-30 ${
          bubbleOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
        }`}
      >
        <div className="bg-[#FFFFFF] border-2.5 border-[#2B1B12] rounded-2xl px-3.5 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.25)] text-center">
          <p className="font-cartoon text-xs text-[#5E3A1A] leading-tight">
            {speechText}
          </p>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/3 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#2B1B12]" />
          <div className="absolute -bottom-1.5 left-1/3 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#FFFFFF]" />
        </div>
      </div>

      {/* SVG Original Mascot: "Frami" the creative forest spirit */}
      <div className="mascot-wobble filter drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)] w-24 h-28 sm:w-28 sm:h-32 transition-transform duration-200 group-hover:scale-105">
        <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="bodyGrad" x1="60" y1="40" x2="60" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFA07A" />
              <stop offset="60%" stopColor="#FA7252" />
              <stop offset="100%" stopColor="#E24D2D" />
            </linearGradient>
            <linearGradient id="hatGrad" x1="60" y1="10" x2="60" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9C6538" />
              <stop offset="100%" stopColor="#5E3A1A" />
            </linearGradient>
            <linearGradient id="bellyGrad" x1="60" y1="75" x2="60" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF3E0" />
              <stop offset="100%" stopColor="#FFE0B2" />
            </linearGradient>
          </defs>

          {/* Cute Little Tail */}
          <path
            d="M25 105 Q10 100 12 85 Q14 75 24 82"
            fill="#FA7252"
            stroke="#2B1B12"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Chubby Round Body */}
          <ellipse
            cx="60"
            cy="90"
            rx="38"
            ry="40"
            fill="url(#bodyGrad)"
            stroke="#2B1B12"
            strokeWidth="3.5"
          />

          {/* Light Cream Belly Patch */}
          <ellipse cx="60" cy="98" rx="24" ry="26" fill="url(#bellyGrad)" />

          {/* Little Feet Paws */}
          <ellipse cx="44" cy="130" rx="14" ry="7" fill="#E24D2D" stroke="#2B1B12" strokeWidth="3" />
          <ellipse cx="76" cy="130" rx="14" ry="7" fill="#E24D2D" stroke="#2B1B12" strokeWidth="3" />

          {/* Rosy Cheeks */}
          <ellipse cx="34" cy="88" rx="7" ry="4" fill="#FF85A1" opacity="0.85" />
          <ellipse cx="86" cy="88" rx="7" ry="4" fill="#FF85A1" opacity="0.85" />

          {/* Big Sparkly Eyes */}
          {/* Left Eye */}
          <g>
            <ellipse cx="45" cy="74" rx="8" ry="11" fill="#2B1B12" />
            <circle cx="43" cy="70" r="3.5" fill="#FFFFFF" />
            <circle cx="48" cy="77" r="1.5" fill="#FFFFFF" />
          </g>
          {/* Right Eye */}
          <g>
            <ellipse cx="75" cy="74" rx="8" ry="11" fill="#2B1B12" />
            <circle cx="73" cy="70" r="3.5" fill="#FFFFFF" />
            <circle cx="78" cy="77" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Cute Cat-like Smile */}
          <path
            d="M52 86 Q60 92 60 87 Q60 92 68 86"
            stroke="#2B1B12"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cute Acorn Beret / Creative Cap */}
          <g>
            {/* Cap Stem */}
            <path d="M60 14 Q63 6 68 8" stroke="#2B1B12" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Beret Main */}
            <path
              d="M26 42 Q60 18 94 42 Q98 52 90 54 Q60 58 30 54 Q22 52 26 42 Z"
              fill="url(#hatGrad)"
              stroke="#2B1B12"
              strokeWidth="3.5"
            />
            {/* Beret Rim */}
            <path
              d="M27 52 Q60 60 93 52"
              stroke="#FFC93C"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Little Hands Resting on Edge / Clapperboard */}
          {/* Left Hand */}
          <circle cx="30" cy="98" r="7" fill="#FFA07A" stroke="#2B1B12" strokeWidth="3" />
          {/* Right Hand Waving or Holding Paintbrush */}
          <g transform="rotate(15 95 90)">
            <circle cx="95" cy="90" r="7" fill="#FFA07A" stroke="#2B1B12" strokeWidth="3" />
            {/* Wooden Paintbrush */}
            <rect x="92" y="68" width="4" height="22" rx="2" fill="#D49B64" stroke="#2B1B12" strokeWidth="1.8" />
            {/* Brush Tip with Blue Paint */}
            <path d="M91 68 Q94 60 97 68 Z" fill="#2F8FE0" stroke="#2B1B12" strokeWidth="1.8" />
          </g>
        </svg>
      </div>
    </div>
  );
};
