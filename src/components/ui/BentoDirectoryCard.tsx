/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clapperboard, 
  Images, 
  Lightbulb, 
  UsersRound, 
  Scale, 
  HeartHandshake, 
  Compass,
  BookOpen
} from 'lucide-react';
import { DirectoryItem } from '../../types';

export interface BentoCardData extends DirectoryItem {
  category: string;
  isFeatured?: boolean;
  accentColor: 'orange' | 'green' | 'blue' | 'primary';
  tags?: string[];
  villageRole?: string; // e.g. "Cinema Atelier", "Gallery Pavilion", etc.
}

interface BentoDirectoryCardProps {
  item: BentoCardData;
}

export const BentoDirectoryCard: React.FC<BentoDirectoryCardProps> = ({ item }) => {
  const getIcon = (iconName: string) => {
    const iconClass = "w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]";
    switch (iconName) {
      case 'project': return <Clapperboard className={iconClass} strokeWidth={2.3} />;
      case 'portfolio': return <Images className={iconClass} strokeWidth={2.3} />;
      case 'creative': return <Lightbulb className={iconClass} strokeWidth={2.3} />;
      case 'team': return <UsersRound className={iconClass} strokeWidth={2.3} />;
      case 'ethics': return <Scale className={iconClass} strokeWidth={2.3} />;
      case 'inclusivity': return <HeartHandshake className={iconClass} strokeWidth={2.3} />;
      case 'about': return <Compass className={iconClass} strokeWidth={2.3} />;
      case 'article': return <BookOpen className={iconClass} strokeWidth={2.3} />;
      default: return <Compass className={iconClass} strokeWidth={2.3} />;
    }
  };

  // 3D Cartoon Icon Badge Colors
  const iconThemeStyles = {
    orange: {
      box: 'bg-gradient-to-b from-[#FFB03A] to-[#E65100] border-2 border-[#662200] shadow-[0_4px_0_#4D1900]',
    },
    green: {
      box: 'bg-gradient-to-b from-[#8AE648] to-[#3B8C11] border-2 border-[#1B4B06] shadow-[0_4px_0_#143704]',
    },
    blue: {
      box: 'bg-gradient-to-b from-[#67BDFF] to-[#146FBF] border-2 border-[#093764] shadow-[0_4px_0_#062442]',
    },
    primary: {
      box: 'bg-gradient-to-b from-[#BD7F44] to-[#723C13] border-2 border-[#381B05] shadow-[0_4px_0_#241002]',
    },
  }[item.accentColor];

  return (
    <Link
      id={`bento-card-${item.id}`}
      to={item.route}
      className={`
        game-parchment group flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(40,18,4,0.3)] min-h-[140px]
        ${item.isFeatured ? 'md:col-span-2' : 'col-span-1'}
      `}
    >
      {/* Corner Nails on Parchment */}
      <div className="absolute top-2.5 left-2.5 game-nail !w-2.5 !h-2.5" />
      <div className="absolute top-2.5 right-2.5 game-nail !w-2.5 !h-2.5" />

      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-14 h-14 rounded-2xl ${iconThemeStyles.box} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
        >
          {getIcon(item.iconName)}
        </div>

        <h3 className="font-display text-2xl font-bold text-[#381E0A] group-hover:text-[#B45309] transition-colors leading-tight">
          {item.name}
        </h3>
      </div>
    </Link>
  );
};
