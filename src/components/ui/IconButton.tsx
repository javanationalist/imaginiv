/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface IconButtonProps {
  id?: string;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'wood' | 'parchment' | 'green' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded';
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  id,
  icon,
  onClick,
  variant = 'wood',
  size = 'md',
  shape = 'circle',
  ariaLabel,
  disabled = false,
  className = '',
}) => {
  const variantClass = {
    wood: 'village-btn-wood text-white',
    parchment: 'village-btn-parchment text-[#3D2211]',
    green: 'village-btn-green text-white',
    blue: 'village-btn-blue text-white',
  }[variant];

  const sizeClass = {
    sm: 'w-9 h-9 min-w-[36px] min-h-[36px]',
    md: 'w-11 h-11 min-w-[44px] min-h-[44px]',
    lg: 'w-13 h-13 min-w-[52px] min-h-[52px]',
  }[size];

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClass}
        ${sizeClass}
        ${shapeClass}
        ${className}
      `}
    >
      {icon}
    </button>
  );
};
