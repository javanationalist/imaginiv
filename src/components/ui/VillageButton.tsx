/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface VillageButtonProps {
  id?: string;
  variant?: 'wood' | 'green' | 'blue' | 'parchment';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const VillageButton: React.FC<VillageButtonProps> = ({
  id,
  variant = 'wood',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
  icon,
}) => {
  const variantClass = {
    wood: 'village-btn-wood text-white text-tactile-white font-semibold',
    green: 'village-btn-green text-white text-tactile-white font-semibold',
    blue: 'village-btn-blue text-white text-tactile-white font-semibold',
    parchment: 'village-btn-parchment text-[#3D2211] font-bold',
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[36px] gap-1.5',
    md: 'px-5 py-2.5 text-sm md:text-base rounded-2xl min-h-[44px] gap-2',
    lg: 'px-7 py-3.5 text-base md:text-lg rounded-2xl min-h-[50px] gap-2.5',
    xl: 'px-8 py-4 text-lg md:text-xl rounded-2xl min-h-[56px] gap-3 font-display',
  }[size];

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center select-none font-display tracking-wide
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClass}
        ${sizeClass}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
