/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Mail, 
  Linkedin, 
  Instagram, 
  Youtube, 
  Globe, 
  MoreHorizontal 
} from 'lucide-react';
import { SocialPlatform } from '../../types';

interface SocialIconProps {
  platform: SocialPlatform;
  className?: string;
  size?: number;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  platform, 
  className = 'w-4 h-4', 
  size = 16 
}) => {
  switch (platform) {
    case 'Email':
      return <Mail className={className} size={size} />;
    case 'LinkedIn':
      return <Linkedin className={className} size={size} />;
    case 'Instagram':
      return <Instagram className={className} size={size} />;
    case 'YouTube':
      return <Youtube className={className} size={size} />;
    case 'Website':
      return <Globe className={className} size={size} />;
    case 'Lainnya':
      return <MoreHorizontal className={className} size={size} />;

    case 'TikTok':
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );

    case 'Pinterest':
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.365-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C10.07 23.818 11.018 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      );

    case 'X':
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    case 'Threads':
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 1 0 10 10c0-4.42-3-8-7.5-8-3.5 0-6 2.5-6 6s2.5 6 5.5 6c2 0 3.5-.8 4.2-2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );

    default:
      return <Globe className={className} size={size} />;
  }
};

/**
 * Format URL appropriately (e.g. mailto: for email, prepend https:// if missing for links)
 */
export const formatSocialHref = (platform: SocialPlatform, valueOrUrl: string): string => {
  const trimmed = valueOrUrl.trim();
  if (!trimmed) return '#';

  if (platform === 'Email') {
    if (trimmed.toLowerCase().startsWith('mailto:')) {
      return trimmed;
    }
    return `mailto:${trimmed}`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Handle common handles like @username
  if (trimmed.startsWith('@')) {
    const handle = trimmed.substring(1);
    if (platform === 'Instagram') return `https://instagram.com/${handle}`;
    if (platform === 'X') return `https://x.com/${handle}`;
    if (platform === 'TikTok') return `https://tiktok.com/@${handle}`;
    if (platform === 'Threads') return `https://threads.net/@${handle}`;
    if (platform === 'Pinterest') return `https://pinterest.com/${handle}`;
  }

  return `https://${trimmed}`;
};
