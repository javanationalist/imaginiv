/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { parseArticleContent, ArticleInlineImageData, normalizePlaceholder } from '../../utils/articleImageUtils';

interface MarkdownContentProps {
  content: string;
  inlineImages?: ArticleInlineImageData[];
  className?: string;
}

/**
 * Renders a responsive inline image with an optional centered caption.
 * Placed exactly at the sequential position of its corresponding [Gambar XX] placeholder.
 */
export const ArticleInlineFigure: React.FC<{ url: string; title?: string }> = ({ url, title }) => {
  return (
    <figure className="my-6 sm:my-8 flex flex-col items-center w-full">
      <div className="w-full max-w-full overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-[#542E10] shadow-[0_6px_0_#2B1302,0_12px_24px_rgba(0,0,0,0.12)] bg-[#FAF2DF]">
        <img
          src={url}
          alt={title || 'Article illustration'}
          loading="lazy"
          className="w-full h-auto max-h-[560px] object-cover sm:object-contain mx-auto block"
          style={{ maxWidth: '100%' }}
        />
      </div>
      {title && title.trim() ? (
        <figcaption className="mt-2.5 text-center text-xs sm:text-sm font-sans font-medium text-[#7C471E] italic px-4 max-w-xl">
          {title.trim()}
        </figcaption>
      ) : null}
    </figure>
  );
};

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  inlineImages,
  className = '',
}) => {
  if (!content) return null;

  // Extract clean body text and associated images metadata
  const { bodyText, images: parsedImages } = parseArticleContent(content);

  // Combine with any provided inlineImages
  const allImages = [...parsedImages];
  if (inlineImages && Array.isArray(inlineImages)) {
    inlineImages.forEach((img) => {
      const canonical = normalizePlaceholder(img.placeholder).toLowerCase();
      const existingIdx = allImages.findIndex(
        (e) => normalizePlaceholder(e.placeholder).toLowerCase() === canonical
      );
      if (existingIdx !== -1) {
        allImages[existingIdx] = { ...allImages[existingIdx], ...img };
      } else {
        allImages.push(img);
      }
    });
  }

  // Map placeholders [Gambar 01], [Gambar 02], etc. to their image data
  const imagesMap = new Map<string, ArticleInlineImageData>();
  allImages.forEach((img) => {
    const canonical = normalizePlaceholder(img.placeholder).toLowerCase();
    imagesMap.set(canonical, img);
    imagesMap.set(img.placeholder.toLowerCase(), img);
    imagesMap.set(img.id.toLowerCase(), img);
  });

  // Split content into paragraph/block chunks
  const blocks = bodyText.split(/\n\s*\n/);

  return (
    <div className={`prose-parchment space-y-5 text-[#381E0A] leading-relaxed text-base sm:text-lg font-serif ${className}`}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Standalone Image Placeholder: [Gambar 01], [Gambar 02], etc.
        const standalonePlaceholder = trimmed.match(/^\[(?:gambar\s*|image\s*)(\d+)\]$/i);
        if (standalonePlaceholder) {
          const canonical = normalizePlaceholder(trimmed).toLowerCase();
          const imgData = imagesMap.get(canonical) || imagesMap.get(trimmed.toLowerCase());
          const url = imgData?.image_url || imgData?.url;
          const title = imgData?.image_title !== undefined ? imgData?.image_title : imgData?.title;

          if (url) {
            return (
              <ArticleInlineFigure
                key={idx}
                url={url}
                title={title}
              />
            );
          }
          // Do not display raw placeholders to readers
          return null;
        }

        // 2. Heading 1 (# ...)
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="font-display text-2xl sm:text-3xl text-[#381E0A] pt-4 pb-1 border-b-2 border-[#D6BC90]">
              {trimmed.substring(2)}
            </h1>
          );
        }

        // 3. Heading 2 (## ...)
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-display text-xl sm:text-2xl text-[#381E0A] pt-3 pb-1 border-b border-[#D6BC90]/60">
              {trimmed.substring(3)}
            </h2>
          );
        }

        // 4. Heading 3 (### ...)
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-display text-lg sm:text-xl text-[#5C3210] pt-2">
              {trimmed.substring(4)}
            </h3>
          );
        }

        // 5. Blockquote (> ...)
        if (trimmed.startsWith('> ')) {
          const quoteLines = trimmed.split('\n').map(l => l.replace(/^>\s?/, '')).join(' ');
          return (
            <blockquote key={idx} className="p-4 sm:p-5 rounded-2xl bg-[#FFF9ED] border-l-4 border-[#2F8FE0] italic text-[#5C3210] font-sans shadow-xs my-4">
              <p className="text-base sm:text-lg font-medium">{quoteLines}</p>
            </blockquote>
          );
        }

        // 6. Unordered list (* ... or - ...)
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

        // 7. Paragraph with embedded [Gambar XX] placeholders
        if (/\[(?:gambar\s*|image\s*)\d+\]/i.test(trimmed)) {
          const parts = trimmed.split(/(\[(?:gambar\s*|image\s*)\d+\])/gi);
          return (
            <React.Fragment key={idx}>
              {parts.map((part, pIdx) => {
                const pTrimmed = part.trim();
                if (!pTrimmed) return null;
                if (/^\[(?:gambar\s*|image\s*)\d+\]$/i.test(pTrimmed)) {
                  const canonical = normalizePlaceholder(pTrimmed).toLowerCase();
                  const imgData = imagesMap.get(canonical) || imagesMap.get(pTrimmed.toLowerCase());
                  const url = imgData?.image_url || imgData?.url;
                  const title = imgData?.image_title !== undefined ? imgData?.image_title : imgData?.title;

                  if (url) {
                    return (
                      <ArticleInlineFigure
                        key={`inline-img-${pIdx}`}
                        url={url}
                        title={title}
                      />
                    );
                  }
                  return null;
                }
                return (
                  <p key={`text-${pIdx}`} className="leading-relaxed font-sans text-[#4A2408] text-base sm:text-lg">
                    <InlineFormatted text={part} />
                  </p>
                );
              })}
            </React.Fragment>
          );
        }

        // 8. Standard Paragraph
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
