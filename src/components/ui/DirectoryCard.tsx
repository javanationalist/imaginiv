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
  ArrowUpRight
} from 'lucide-react';
import { DirectoryItem } from '../../types';

interface DirectoryCardProps {
  item: DirectoryItem;
}

export const DirectoryCard: React.FC<DirectoryCardProps> = ({ item }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'project':
        return <Clapperboard className="w-10 h-10 md:w-12 md:h-12 text-[#9E5D2A]" strokeWidth={2.2} />;
      case 'portfolio':
        return <Images className="w-10 h-10 md:w-12 md:h-12 text-[#3D7AA6]" strokeWidth={2.2} />;
      case 'creative':
        return <Lightbulb className="w-10 h-10 md:w-12 md:h-12 text-[#D28929]" strokeWidth={2.2} />;
      case 'team':
        return <UsersRound className="w-10 h-10 md:w-12 md:h-12 text-[#538634]" strokeWidth={2.2} />;
      case 'ethics':
        return <Scale className="w-10 h-10 md:w-12 md:h-12 text-[#7F4E24]" strokeWidth={2.2} />;
      case 'inclusivity':
        return <HeartHandshake className="w-10 h-10 md:w-12 md:h-12 text-[#B95535]" strokeWidth={2.2} />;
      case 'about':
        return <Compass className="w-10 h-10 md:w-12 md:h-12 text-[#496E8A]" strokeWidth={2.2} />;
      default:
        return <Compass className="w-10 h-10 md:w-12 md:h-12 text-[#9E5D2A]" strokeWidth={2.2} />;
    }
  };

  return (
    <Link
      id={`directory-card-${item.id}`}
      to={item.route}
      className="directory-card group relative flex flex-col items-center justify-between p-5 md:p-6 text-center select-none overflow-hidden cursor-pointer"
    >
      {/* Tactile Icon Recess Container */}
      <div className="w-22 h-22 md:w-26 md:h-26 my-2 rounded-2xl bg-[#EDE2CE] border-2 border-[#D3BEA2] shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#EAE0CA]">
        {getIcon(item.iconName)}
      </div>

      {/* Directory Item Title */}
      <div className="mt-3 w-full">
        <h3 className="text-lg md:text-xl font-bold font-display text-[#361E10] tracking-wide group-hover:text-[#8E491A] transition-colors flex items-center justify-center gap-1">
          {item.name}
          <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#8E491A]" />
        </h3>
      </div>

      {/* Subtle bottom wooden accent pill */}
      <div className="mt-2 w-12 h-1 rounded-full bg-[#D1BC9E] group-hover:bg-[#A3602D] transition-colors" />
    </Link>
  );
};
