/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content into paragraph/block chunks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className={`prose-parchment space-y-5 text-[#381E0A] leading-relaxed text-base sm:text-lg font-serif ${className}`}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 1 (# ...)
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="font-display text-2xl sm:text-3xl text-[#381E0A] pt-4 pb-1 border-b-2 border-[#D6BC90]">
              {trimmed.substring(2)}
            </h1>
          );
        }

        // Heading 2 (## ...)
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-display text-xl sm:text-2xl text-[#381E0A] pt-3 pb-1 border-b border-[#D6BC90]/60">
              {trimmed.substring(3)}
            </h2>
          );
        }

        // Heading 3 (### ...)
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-display text-lg sm:text-xl text-[#5C3210] pt-2">
              {trimmed.substring(4)}
            </h3>
          );
        }

        // Blockquote (> ...)
        if (trimmed.startsWith('> ')) {
          const quoteLines = trimmed.split('\n').map(l => l.replace(/^>\s?/, '')).join(' ');
          return (
            <blockquote key={idx} className="p-4 sm:p-5 rounded-2xl bg-[#FFF9ED] border-l-4 border-[#2F8FE0] italic text-[#5C3210] font-sans shadow-xs my-4">
              <p className="text-base sm:text-lg font-medium">{quoteLines}</p>
            </blockquote>
          );
        }

        // Unordered list (* ... or - ...)
        if (trimmed.split('\n').every(l => l.trim().startsWith('* ') || l.trim().startsWith('- '))) {
          const items = trimmed.split('\n').map(l => l.trim().replace(/^[\*\-]\s+/, ''));
          return (
            <ul key={idx} className="space-y-2 pl-6 list-disc list-outside text-[#5C3210] font-sans">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-normal">
                  <InlineFormatted text={item} />
                </li>
              ))}
            </ul>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="leading-relaxed font-sans text-[#4A2408] text-base sm:text-lg">
            <InlineFormatted text={trimmed} />
          </p>
        );
      })}
    </div>
  );
};

// Simple inline parser for bold (**text**), italic (*text*), inline code (`code`), and links
const InlineFormatted: React.FC<{ text: string }> = ({ text }) => {
  // Regex to split on bold, italic, or code
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-bold text-[#2E1402]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={i} className="italic text-[#4F2506]">
              {part.slice(1, -1)}
            </em>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="px-1.5 py-0.5 rounded-md bg-[#F2E5CE] text-[#7C471E] font-mono text-sm border border-[#DEC9A3]">
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </>
  );
};
