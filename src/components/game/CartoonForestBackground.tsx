/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const CartoonForestBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none" aria-hidden="true">
      {/* Dynamic Cartoon Forest SVG Canvas */}
      <svg
        className="w-full h-full object-cover min-h-screen"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="720" y1="0" x2="720" y2="550" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#76C7F7" />
            <stop offset="60%" stopColor="#AEE2FD" />
            <stop offset="100%" stopColor="#D8F3DC" />
          </linearGradient>

          {/* Rolling Hill Gradient Far */}
          <linearGradient id="hillFarGrad" x1="720" y1="350" x2="720" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#72B944" />
            <stop offset="100%" stopColor="#51942A" />
          </linearGradient>

          {/* Rolling Hill Gradient Mid */}
          <linearGradient id="hillMidGrad" x1="720" y1="450" x2="720" y2="850" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8FD14F" />
            <stop offset="100%" stopColor="#5EA832" />
          </linearGradient>

          {/* Wood Bark Gradient */}
          <linearGradient id="barkGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9C6538" />
            <stop offset="50%" stopColor="#7E4A20" />
            <stop offset="100%" stopColor="#522C10" />
          </linearGradient>

          {/* Leaves Cluster Gradient */}
          <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FD235" />
            <stop offset="50%" stopColor="#57A522" />
            <stop offset="100%" stopColor="#3B7914" />
          </linearGradient>

          {/* Mushroom Cap Gradient */}
          <linearGradient id="mushRedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B57" />
            <stop offset="100%" stopColor="#D93826" />
          </linearGradient>

          {/* Shading filter for cartoon depth */}
          <filter id="cartoonDrop" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1B120A" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. Sky */}
        <rect width="1440" height="900" fill="url(#skyGrad)" />

        {/* 2. Cartoon Sun */}
        <circle cx="1180" cy="140" r="70" fill="#FFE17D" opacity="0.85" />
        <circle cx="1180" cy="140" r="54" fill="#FFC93C" />

        {/* 3. Floating Cartoon Clouds */}
        <g className="cloud-anim" opacity="0.9">
          {/* Cloud 1 */}
          <path
            d="M240 140 Q255 105 295 110 Q330 90 370 115 Q410 105 430 135 Q445 155 435 180 Q420 200 380 195 L260 195 Q230 190 230 165 Q230 145 240 140 Z"
            fill="#FFFFFF"
            stroke="#2B1B12"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Cloud 2 */}
          <path
            d="M920 180 Q940 150 980 155 Q1015 135 1055 160 Q1090 150 1105 180 Q1120 200 1110 225 L950 225 Q915 220 915 195 Q915 185 920 180 Z"
            fill="#FFFFFF"
            stroke="#2B1B12"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </g>

        {/* 4. Distant Mountains / Rolling Hills */}
        <path
          d="M-50 540 Q180 430 450 490 Q720 550 980 470 Q1240 390 1500 510 L1500 950 L-50 950 Z"
          fill="url(#hillFarGrad)"
          stroke="#2B1B12"
          strokeWidth="4"
        />

        {/* Distant Mushroom Village Houses */}
        {/* Left Mushroom House */}
        <g transform="translate(180, 430)">
          {/* Stem */}
          <path d="M40 70 Q35 115 25 130 L95 130 Q85 115 80 70 Z" fill="#FDF3E3" stroke="#2B1B12" strokeWidth="3" />
          {/* Door */}
          <path d="M50 130 Q50 100 60 100 Q70 100 70 130 Z" fill="#7E4A20" stroke="#2B1B12" strokeWidth="2.5" />
          {/* Cap */}
          <path d="M5 75 Q60 15 115 75 Q90 85 60 85 Q30 85 5 75 Z" fill="url(#mushRedGrad)" stroke="#2B1B12" strokeWidth="3.5" />
          {/* Dots */}
          <circle cx="40" cy="55" r="8" fill="#FFFFFF" />
          <circle cx="80" cy="50" r="7" fill="#FFFFFF" />
          <circle cx="60" cy="35" r="9" fill="#FFFFFF" />
        </g>

        {/* Right Mushroom House */}
        <g transform="translate(1120, 390) scale(0.85)">
          <path d="M40 70 Q35 115 25 130 L95 130 Q85 115 80 70 Z" fill="#FDF3E3" stroke="#2B1B12" strokeWidth="3" />
          <path d="M50 130 Q50 100 60 100 Q70 100 70 130 Z" fill="#7E4A20" stroke="#2B1B12" strokeWidth="2.5" />
          <path d="M5 75 Q60 15 115 75 Q90 85 60 85 Q30 85 5 75 Z" fill="#FFC93C" stroke="#2B1B12" strokeWidth="3.5" />
          <circle cx="45" cy="55" r="7" fill="#FFFFFF" />
          <circle cx="75" cy="50" r="8" fill="#FFFFFF" />
        </g>

        {/* 5. Midground Rolling Hill */}
        <path
          d="M-50 630 Q220 540 560 610 Q900 680 1220 580 Q1380 530 1500 590 L1500 950 L-50 950 Z"
          fill="url(#hillMidGrad)"
          stroke="#2B1B12"
          strokeWidth="4"
        />

        {/* 6. Foreground Big Cartoon Oak Trees framing the screen (Left & Right) */}
        {/* Left Ancient Tree Trunk & Overhanging Branch */}
        <g filter="url(#cartoonDrop)">
          {/* Main Trunk */}
          <path
            d="M-80 950 L-40 400 Q-10 250 120 180 Q220 130 380 110 Q280 170 160 210 Q60 250 30 430 L-10 950 Z"
            fill="url(#barkGrad)"
            stroke="#2B1B12"
            strokeWidth="5"
          />
          {/* Bark Lines */}
          <path d="M-10 520 Q20 480 30 440" stroke="#2B1B12" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 360 Q70 300 130 260" stroke="#2B1B12" strokeWidth="3" strokeLinecap="round" />

          {/* Left Foliage Canopy Clusters */}
          <path
            d="M-80 280 Q-40 160 50 140 Q120 60 220 90 Q320 40 400 110 Q470 90 510 160 Q550 230 480 290 Q400 350 310 320 Q220 370 120 330 Q20 360 -80 280 Z"
            fill="url(#leafGrad)"
            stroke="#2B1B12"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* Hanging Vine with Pink Bellflowers */}
          <path d="M220 320 Q240 390 225 460" stroke="#3B7914" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M210 460 Q225 450 240 460 L235 480 Q225 490 215 480 Z" fill="#FF85A1" stroke="#2B1B12" strokeWidth="2.5" />
          <path d="M230 380 Q245 370 260 380 L255 400 Q245 410 235 400 Z" fill="#FF85A1" stroke="#2B1B12" strokeWidth="2.5" />
        </g>

        {/* Right Ancient Tree Trunk & Overhanging Branch */}
        <g filter="url(#cartoonDrop)">
          {/* Right Trunk */}
          <path
            d="M1520 950 L1480 420 Q1450 260 1320 190 Q1220 140 1060 120 Q1160 180 1280 220 Q1380 260 1410 440 L1450 950 Z"
            fill="url(#barkGrad)"
            stroke="#2B1B12"
            strokeWidth="5"
          />
          {/* Bark Lines */}
          <path d="M1450 530 Q1420 490 1410 450" stroke="#2B1B12" strokeWidth="3" strokeLinecap="round" />
          <path d="M1420 370 Q1370 310 1310 270" stroke="#2B1B12" strokeWidth="3" strokeLinecap="round" />

          {/* Right Foliage Canopy Clusters */}
          <path
            d="M1520 290 Q1480 170 1390 150 Q1320 70 1220 100 Q1120 50 1040 120 Q970 100 930 170 Q890 240 960 300 Q1040 360 1130 330 Q1220 380 1320 340 Q1420 370 1520 290 Z"
            fill="url(#leafGrad)"
            stroke="#2B1B12"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* Hanging Vine with Pink Bellflower */}
          <path d="M1220 330 Q1200 400 1215 470" stroke="#3B7914" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M1205 470 Q1220 460 1235 470 L1230 490 Q1220 500 1210 490 Z" fill="#FF85A1" stroke="#2B1B12" strokeWidth="2.5" />
        </g>
      </svg>

      {/* Atmospheric Contrast Overlay: Darkens slightly behind content so text & buttons have high contrast */}
      <div className="absolute inset-0 bg-[#1D2B14]/25 backdrop-blur-[0.5px]" />
    </div>
  );
};
