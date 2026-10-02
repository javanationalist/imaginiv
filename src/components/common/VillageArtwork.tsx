/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Cartoon Forest Environment Backdrop
 * Features lush rolling green hills, cartoon pine & round trees, mushroom huts,
 * whimsical wild flowers, and fluffy clouds.
 */
export const ForestBackdrop: React.FC<{ bgColor?: string }> = ({ bgColor = '#F6EAD2' }) => {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none" style={{ backgroundColor: bgColor }}>
      {/* Sky backdrop layer */}
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />

      {/* Distant Cartoon Hills & Mountain Ridge */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[650px] min-w-[1280px]"
        viewBox="0 0 1440 650"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Deep Hills */}
        <path
          d="M-50 420 C 220 280, 480 370, 720 310 C 980 250, 1220 330, 1500 290 L 1500 650 L -50 650 Z"
          fill="#5FA834"
        />
        {/* Mid Hills with stylized round treetops */}
        <path
          d="M-50 490 C 200 380, 520 460, 800 400 C 1080 340, 1300 430, 1500 390 L 1500 650 L -50 650 Z"
          fill="#70BE38"
        />
        {/* Foreground Lush Grass Hill */}
        <path
          d="M-50 560 C 250 470, 600 530, 950 480 C 1250 430, 1400 490, 1500 460 L 1500 650 L -50 650 Z"
          fill="#84D342"
        />
      </svg>

      {/* Scattered Cartoon Trees & Mushroom Cottages along the horizon */}
      <div className="absolute bottom-0 left-0 w-full h-44 overflow-hidden opacity-90">
        {/* Left Tree Cluster */}
        <div className="absolute -bottom-8 left-4 sm:left-12 flex items-end gap-1">
          <div className="w-16 h-32 bg-[#4D8C24] rounded-t-full border-4 border-[#326114] shadow-md relative">
            <div className="absolute top-4 left-3 w-4 h-6 bg-[#68B234] rounded-full" />
          </div>
          <div className="w-24 h-44 bg-[#3E7A1C] rounded-t-full border-4 border-[#285210] shadow-lg relative -ml-6">
            <div className="absolute top-6 left-4 w-6 h-8 bg-[#58A129] rounded-full" />
          </div>
          <div className="w-14 h-28 bg-[#5AA22B] rounded-t-full border-4 border-[#356B16] relative -ml-4" />
        </div>

        {/* Right Tree Cluster */}
        <div className="absolute -bottom-8 right-6 sm:right-16 flex items-end gap-1">
          <div className="w-20 h-38 bg-[#448220] rounded-t-full border-4 border-[#2C5712] shadow-lg relative">
            <div className="absolute top-5 left-4 w-5 h-7 bg-[#5DA82E] rounded-full" />
          </div>
          <div className="w-14 h-26 bg-[#5BA52C] rounded-t-full border-4 border-[#386F19] relative -ml-4" />
          <div className="w-22 h-44 bg-[#397218] rounded-t-full border-4 border-[#244C0E] shadow-xl relative -ml-5">
            <div className="absolute top-6 left-4 w-6 h-9 bg-[#549E25] rounded-full" />
          </div>
        </div>

        {/* Whimsical Mushroom Cottages in distance */}
        <div className="hidden lg:flex absolute bottom-2 left-[22%] items-end">
          <div className="relative">
            <div className="w-10 h-7 bg-[#E83F3F] rounded-t-full border-2 border-[#8A1B1B] relative">
              <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-1 left-2" />
              <div className="w-2 h-2 bg-white rounded-full absolute top-2 right-2" />
            </div>
            <div className="w-6 h-5 bg-[#F6E9CE] rounded-b-md mx-auto border-x-2 border-b-2 border-[#9C794D]" />
          </div>
        </div>

        <div className="hidden lg:flex absolute bottom-4 right-[28%] items-end">
          <div className="relative">
            <div className="w-12 h-9 bg-[#4188F0] rounded-t-full border-2 border-[#1E4E94] relative">
              <div className="w-3 h-3 bg-white rounded-full absolute top-1.5 left-2.5" />
              <div className="w-2 h-2 bg-white rounded-full absolute top-2.5 right-2.5" />
            </div>
            <div className="w-7 h-6 bg-[#F6E9CE] rounded-b-md mx-auto border-x-2 border-b-2 border-[#9C794D]" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Original Cartoon Mascots:
 * "The Imaginiv Villagers"
 * Styled exactly like the cheerful characters peeking around the wooden pop-up panel
 * in village builder games (Smurfs' Village style).
 */
export const PeekingMascots: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none anim-mascot-bounce ${className}`}
    >
      <svg
        width="150"
        height="240"
        viewBox="0 0 150 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.35)]"
      >
        {/* CHARACTER 1 (TOP): "Pixel" the Director Sprite with artist cap & clapperboard */}
        <g id="mascot-top">
          {/* Body / Blue Robe */}
          <path
            d="M50 85 C 35 75, 20 95, 25 115 C 30 135, 65 130, 65 110 Z"
            fill="#2F8FE0"
            stroke="#0C457A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Peeking Hand on Wood Frame */}
          <ellipse
            cx="72"
            cy="102"
            rx="9"
            ry="7"
            fill="#56B4FD"
            stroke="#0C457A"
            strokeWidth="3"
          />
          <ellipse
            cx="78"
            cy="98"
            rx="4"
            ry="4"
            fill="#56B4FD"
            stroke="#0C457A"
            strokeWidth="2.5"
          />

          {/* Head */}
          <circle
            cx="48"
            cy="65"
            r="24"
            fill="#56B4FD"
            stroke="#0C457A"
            strokeWidth="3.5"
          />
          {/* Rosy Cheeks */}
          <ellipse cx="36" cy="72" rx="4" ry="2.5" fill="#FF8BA7" opacity="0.75" />
          <ellipse cx="60" cy="72" rx="4" ry="2.5" fill="#FF8BA7" opacity="0.75" />
          {/* Big Big Cheerful Cartoon Eyes */}
          <ellipse cx="40" cy="62" rx="6.5" ry="8.5" fill="white" stroke="#0C457A" strokeWidth="2.5" />
          <ellipse cx="56" cy="62" rx="6.5" ry="8.5" fill="white" stroke="#0C457A" strokeWidth="2.5" />
          {/* Pupils with sparkle highlight */}
          <circle cx="42" cy="63" r="3.5" fill="#1A2D42" />
          <circle cx="43" cy="61" r="1.2" fill="white" />
          <circle cx="58" cy="63" r="3.5" fill="#1A2D42" />
          <circle cx="59" cy="61" r="1.2" fill="white" />
          {/* Cute Round Nose */}
          <circle cx="48" cy="67" r="4.5" fill="#6EC2FF" stroke="#0C457A" strokeWidth="2.5" />
          {/* Happy Open Smile */}
          <path
            d="M42 75 Q 48 83, 54 75 Z"
            fill="#D33F49"
            stroke="#0C457A"
            strokeWidth="2"
          />
          {/* Director White/Red Artist Beret */}
          <path
            d="M26 50 C 20 20, 65 10, 72 38 C 76 52, 60 56, 48 54 C 36 52, 28 54, 26 50 Z"
            fill="#FFFFFF"
            stroke="#0C457A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M62 26 C 68 18, 78 22, 74 32 Z"
            fill="#D33F49"
            stroke="#0C457A"
            strokeWidth="2.5"
          />
        </g>

        {/* CHARACTER 2 (BOTTOM): "Artie" the Craft Sprite holding a paintbrush */}
        <g id="mascot-bottom">
          {/* Body */}
          <path
            d="M45 155 C 30 145, 10 165, 18 190 C 25 215, 60 210, 60 185 Z"
            fill="#52C01B"
            stroke="#1C5207"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Hand clasping wooden edge */}
          <ellipse
            cx="66"
            cy="172"
            rx="8.5"
            ry="6.5"
            fill="#56B4FD"
            stroke="#0C457A"
            strokeWidth="3"
          />
          <ellipse
            cx="72"
            cy="168"
            rx="4"
            ry="4"
            fill="#56B4FD"
            stroke="#0C457A"
            strokeWidth="2.5"
          />

          {/* Head */}
          <circle
            cx="44"
            cy="140"
            r="23"
            fill="#56B4FD"
            stroke="#0C457A"
            strokeWidth="3.5"
          />
          {/* Cheeks */}
          <ellipse cx="32" cy="146" rx="4" ry="2.5" fill="#FF8BA7" opacity="0.75" />
          <ellipse cx="55" cy="146" rx="4" ry="2.5" fill="#FF8BA7" opacity="0.75" />
          {/* Cartoon Eyes */}
          <ellipse cx="37" cy="138" rx="6" ry="8" fill="white" stroke="#0C457A" strokeWidth="2.5" />
          <ellipse cx="52" cy="138" rx="6" ry="8" fill="white" stroke="#0C457A" strokeWidth="2.5" />
          <circle cx="39" cy="139" r="3.2" fill="#1A2D42" />
          <circle cx="40" cy="137" r="1" fill="white" />
          <circle cx="54" cy="139" r="3.2" fill="#1A2D42" />
          <circle cx="55" cy="137" r="1" fill="white" />
          {/* Nose */}
          <circle cx="44" cy="144" r="4.2" fill="#6EC2FF" stroke="#0C457A" strokeWidth="2.5" />
          {/* Winking cheeky smile */}
          <path
            d="M39 150 Q 45 156, 51 150"
            fill="none"
            stroke="#0C457A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Gold Craft Hat / Village Phrygian Cap */}
          <path
            d="M24 130 C 18 100, 58 85, 68 112 C 72 124, 56 132, 44 130 C 34 128, 26 132, 24 130 Z"
            fill="#FFC933"
            stroke="#8A5A05"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Curved Cap Tip */}
          <path
            d="M58 98 C 66 84, 76 92, 70 106 Z"
            fill="#FFA71A"
            stroke="#8A5A05"
            strokeWidth="2.5"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Cartoon Creative Atelier / Village House SVG
 * Whimsical wooden workshop with glowing warm windows, chimney with smoke puff,
 * timber beams, and a creative village emblem.
 */
export const VillageAtelierIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width="220"
        height="180"
        viewBox="0 0 220 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_10px_16px_rgba(40,20,5,0.3)]"
      >
        {/* Soft Grass Mound under cottage */}
        <ellipse cx="110" cy="165" rx="90" ry="14" fill="#6FB832" stroke="#386A14" strokeWidth="3" />
        <ellipse cx="110" cy="163" rx="80" ry="9" fill="#88D644" />

        {/* Small Flowers */}
        <circle cx="45" cy="162" r="3.5" fill="#FF5E5E" />
        <circle cx="45" cy="162" r="1.5" fill="#FFF275" />
        <circle cx="175" cy="164" r="3.5" fill="#4AA8FF" />
        <circle cx="175" cy="164" r="1.5" fill="#FFF275" />

        {/* Chimney */}
        <rect x="145" y="42" width="22" height="42" rx="4" fill="#A8572A" stroke="#52230A" strokeWidth="3" />
        <rect x="142" y="38" width="28" height="8" rx="3" fill="#C56A36" stroke="#52230A" strokeWidth="2.5" />
        {/* Whimsical Smoke Puffs */}
        <circle cx="156" cy="28" r="7" fill="white" opacity="0.85" />
        <circle cx="163" cy="16" r="9" fill="white" opacity="0.75" />
        <circle cx="172" cy="4" r="6" fill="white" opacity="0.6" />

        {/* Cozy Cottage Walls (Cream Timber) */}
        <rect x="52" y="90" width="116" height="72" rx="14" fill="#FAF1D8" stroke="#4A2609" strokeWidth="3.5" />
        {/* Timber Post Accents */}
        <rect x="52" y="92" width="12" height="68" rx="4" fill="#8E5224" stroke="#4A2609" strokeWidth="2.5" />
        <rect x="156" y="92" width="12" height="68" rx="4" fill="#8E5224" stroke="#4A2609" strokeWidth="2.5" />
        <rect x="54" y="125" width="112" height="8" rx="2" fill="#9C5E2C" stroke="#4A2609" strokeWidth="2" />

        {/* Cottage Mushroom / Timber Roof with Big Overhang */}
        <path
          d="M25 94 C 20 88, 30 52, 110 44 C 190 52, 200 88, 195 94 C 188 99, 175 92, 110 88 C 45 92, 32 99, 25 94 Z"
          fill="#D6453D"
          stroke="#4D1510"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* White Polka Dots on Roof (Smurfs' Village Cottage Signature!) */}
        <circle cx="68" cy="68" r="8" fill="white" opacity="0.9" />
        <circle cx="112" cy="58" r="10" fill="white" opacity="0.9" />
        <circle cx="152" cy="70" r="7.5" fill="white" opacity="0.9" />
        <circle cx="88" cy="78" r="5" fill="white" opacity="0.9" />
        <circle cx="134" cy="80" r="5" fill="white" opacity="0.9" />

        {/* Front Wooden Door */}
        <path
          d="M92 120 C 92 110, 128 110, 128 120 L 128 162 L 92 162 Z"
          fill="#8A4E21"
          stroke="#421E06"
          strokeWidth="3"
        />
        {/* Door Brass Knob */}
        <circle cx="120" cy="138" r="3.5" fill="#FFDE59" stroke="#664603" strokeWidth="1.5" />

        {/* Glowing Cozy Windows */}
        <rect x="68" y="104" width="18" height="18" rx="4" fill="#FFE57F" stroke="#4A2609" strokeWidth="2.5" />
        <line x1="77" y1="104" x2="77" y2="122" stroke="#6E3D12" strokeWidth="2" />
        <line x1="68" y1="113" x2="86" y2="113" stroke="#6E3D12" strokeWidth="2" />

        <rect x="134" y="104" width="18" height="18" rx="4" fill="#FFE57F" stroke="#4A2609" strokeWidth="2.5" />
        <line x1="143" y1="104" x2="143" y2="122" stroke="#6E3D12" strokeWidth="2" />
        <line x1="134" y1="113" x2="152" y2="113" stroke="#6E3D12" strokeWidth="2" />

        {/* Signboard hanging over door */}
        <rect x="94" y="96" width="32" height="13" rx="3" fill="#FFE08A" stroke="#573804" strokeWidth="2" />
        <text x="110" y="105" textAnchor="middle" fill="#573804" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">
          IMAGINIV
        </text>
      </svg>
    </div>
  );
};
