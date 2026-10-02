/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Image as ImageIcon, Check, ExternalLink, HelpCircle } from 'lucide-react';
import {
  ArticleInlineImageData,
  getNextPlaceholder,
  normalizePlaceholder,
  placeholderToId,
} from '../../utils/articleImageUtils';

export interface ArticleContentEditorRef {
  insertImageAtCursor: () => void;
  insertSnippet: (snippet: string) => void;
}

interface ArticleContentEditorProps {
  content: string;
  onChange: (value: string) => void;
  inlineImages: ArticleInlineImageData[];
  onImagesChange: (images: ArticleInlineImageData[]) => void;
}

/**
 * Calculates pixel coordinates of a character position inside a textarea.
 */
function getCaretCoordinates(element: HTMLTextAreaElement, position: number) {
  const properties = [
    'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize',
    'lineHeight', 'fontFamily', 'textAlign', 'textTransform',
    'textIndent', 'letterSpacing', 'wordSpacing', 'whiteSpace', 'wordBreak',
  ];

  const div = document.createElement('div');
  div.id = 'textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  const style = div.style;
  const computed = window.getComputedStyle(element);

  style.whiteSpace = 'pre-wrap';
  style.wordWrap = 'break-word';
  style.position = 'absolute';
  style.visibility = 'hidden';

  properties.forEach((prop) => {
    (style as any)[prop] = (computed as any)[prop];
  });

  const clampedPos = Math.max(0, Math.min(position, element.value.length));
  div.textContent = element.value.substring(0, clampedPos);

  const span = document.createElement('span');
  span.textContent = element.value.substring(clampedPos) || '.';
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop,
    left: span.offsetLeft,
    height: span.offsetHeight || parseInt(computed.lineHeight, 10) || 24,
  };

  document.body.removeChild(div);
  return coordinates;
}

export const ArticleContentEditor = forwardRef<ArticleContentEditorRef, ArticleContentEditorProps>(
  ({ content, onChange, inlineImages, onImagesChange }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [activePlaceholder, setActivePlaceholder] = useState<string | null>(null);
    const [floatingPos, setFloatingPos] = useState<{ top: number; left: number } | null>(null);

    // Position floating configuration popup directly below the active [Gambar XX] placeholder
    const updatePopupPosition = useCallback(() => {
      if (!activePlaceholder || !textareaRef.current || !containerRef.current) {
        setFloatingPos(null);
        return;
      }

      // Find index of the placeholder in content (case-insensitive)
      const lowerBody = content.toLowerCase();
      const lowerPlaceholder = activePlaceholder.toLowerCase();
      const placeholderIdx = lowerBody.indexOf(lowerPlaceholder);

      if (placeholderIdx === -1) {
        setFloatingPos(null);
        return;
      }

      const textarea = textareaRef.current;
      const container = containerRef.current;
      const pos = getCaretCoordinates(textarea, placeholderIdx + activePlaceholder.length);

      // Calculate position relative to container
      const relativeTop = pos.top - textarea.scrollTop + pos.height + 6;
      const maxLeft = Math.max(12, container.clientWidth - 380);
      const relativeLeft = Math.max(12, Math.min(pos.left, maxLeft));

      if (relativeTop > 10 && relativeTop < textarea.clientHeight + 40) {
        setFloatingPos({ top: relativeTop, left: relativeLeft });
      } else {
        setFloatingPos(null);
      }
    }, [activePlaceholder, content]);

    useEffect(() => {
      updatePopupPosition();
    }, [updatePopupPosition, content]);

    const handleTextareaScroll = () => {
      updatePopupPosition();
    };

    // Detect which placeholder the cursor is currently on or near
    const handleCheckCursor = () => {
      if (!textareaRef.current) return;
      const cursor = textareaRef.current.selectionStart;

      const regex = /\[(?:gambar\s*|image\s*)(\d+)\]/gi;
      let match: RegExpExecArray | null;
      let foundPlaceholder: string | null = null;

      while ((match = regex.exec(content)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        if (cursor >= start - 1 && cursor <= end + 1) {
          foundPlaceholder = normalizePlaceholder(match[0]);
          break;
        }
      }

      if (foundPlaceholder) {
        setActivePlaceholder(foundPlaceholder);
      }
    };

    // Insert image placeholder [Gambar XX] DIRECTLY at cursor position into article content
    const insertImageAtCursor = useCallback(() => {
      const textarea = textareaRef.current;
      const cursorStart = textarea ? textarea.selectionStart : content.length;
      const cursorEnd = textarea ? textarea.selectionEnd : cursorStart;

      const { id, placeholder } = getNextPlaceholder(content, inlineImages);

      // Build prefix and suffix with clean newlines if needed
      const before = content.substring(0, cursorStart);
      const after = content.substring(cursorEnd);

      const prefix = before.length > 0 && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
      const suffix = after.length > 0 && !after.startsWith('\n\n') ? (after.startsWith('\n') ? '\n' : '\n\n') : '';

      const insertion = `${prefix}${placeholder}${suffix}`;
      const newContent = before + insertion + after;

      // Register or update placeholder in inlineImages metadata
      const canonical = normalizePlaceholder(placeholder).toLowerCase();
      const existing = inlineImages.some(
        (img) => normalizePlaceholder(img.placeholder).toLowerCase() === canonical
      );

      const newImages = existing
        ? inlineImages
        : [
            ...inlineImages,
            {
              id,
              placeholder,
              image_url: '',
              image_title: '',
              url: '',
              title: '',
            },
          ];

      onChange(newContent);
      onImagesChange(newImages);
      setActivePlaceholder(placeholder);

      // Place cursor right after the inserted placeholder
      const newCursorPos = cursorStart + prefix.length + placeholder.length;
      requestAnimationFrame(() => {
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }
        updatePopupPosition();
      });
    }, [content, inlineImages, onChange, onImagesChange, updatePopupPosition]);

    // Insert markdown snippet (H2, bold, quote, etc.) at cursor position
    const insertSnippet = useCallback((snippet: string) => {
      const textarea = textareaRef.current;
      const cursorStart = textarea ? textarea.selectionStart : content.length;
      const cursorEnd = textarea ? textarea.selectionEnd : cursorStart;

      const before = content.substring(0, cursorStart);
      const after = content.substring(cursorEnd);
      const newContent = before + snippet + after;
      onChange(newContent);

      const newPos = cursorStart + snippet.length;
      requestAnimationFrame(() => {
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(newPos, newPos);
        }
      });
    }, [content, onChange]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      insertImageAtCursor,
      insertSnippet,
    }));

    // Update URL for a specific placeholder
    const handleUpdateImageUrl = (placeholder: string, newUrl: string) => {
      const canonical = normalizePlaceholder(placeholder).toLowerCase();
      let found = false;

      const updated = inlineImages.map((img) => {
        if (normalizePlaceholder(img.placeholder).toLowerCase() === canonical) {
          found = true;
          return { ...img, image_url: newUrl, url: newUrl };
        }
        return img;
      });

      if (!found) {
        updated.push({
          id: placeholderToId(placeholder),
          placeholder: normalizePlaceholder(placeholder),
          image_url: newUrl,
          image_title: '',
          url: newUrl,
          title: '',
        });
      }

      onImagesChange(updated);
    };

    // Update title for a specific placeholder
    const handleUpdateImageTitle = (placeholder: string, newTitle: string) => {
      const canonical = normalizePlaceholder(placeholder).toLowerCase();
      let found = false;

      const updated = inlineImages.map((img) => {
        if (normalizePlaceholder(img.placeholder).toLowerCase() === canonical) {
          found = true;
          return { ...img, image_title: newTitle, title: newTitle };
        }
        return img;
      });

      if (!found) {
        updated.push({
          id: placeholderToId(placeholder),
          placeholder: normalizePlaceholder(placeholder),
          image_url: '',
          image_title: newTitle,
          url: '',
          title: newTitle,
        });
      }

      onImagesChange(updated);
    };

    // Extract all placeholders currently present in content
    const placeholdersInContent: string[] = [];
    const phRegex = /\[(?:gambar\s*|image\s*)(\d+)\]/gi;
    let phMatch: RegExpExecArray | null;
    while ((phMatch = phRegex.exec(content)) !== null) {
      const normalized = normalizePlaceholder(phMatch[0]);
      if (!placeholdersInContent.includes(normalized)) {
        placeholdersInContent.push(normalized);
      }
    }

    // Active image metadata for popup
    const activeImage = activePlaceholder
      ? inlineImages.find(
          (img) => normalizePlaceholder(img.placeholder).toLowerCase() === normalizePlaceholder(activePlaceholder).toLowerCase()
        ) || {
          id: placeholderToId(activePlaceholder),
          placeholder: normalizePlaceholder(activePlaceholder),
          image_url: '',
          image_title: '',
        }
      : null;

    return (
      <div ref={containerRef} className="relative w-full space-y-4">
        {/* Main Textarea: [Gambar 01], [Gambar 02] exist directly in the text flow */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={16}
            value={content}
            onChange={(e) => {
              onChange(e.target.value);
              handleCheckCursor();
            }}
            onScroll={handleTextareaScroll}
            onClick={handleCheckCursor}
            onKeyUp={handleCheckCursor}
            placeholder="Write article content in Markdown format... Use the Image button or type [Gambar 01] directly in the text."
            className="w-full px-4 py-3 rounded-2xl border-2 border-[#D6BC90] bg-[#FFFBF2] text-[#381E0A] font-sans text-sm sm:text-base placeholder-[#9C7955] focus:outline-none focus:border-[#2F8FE0] transition-colors leading-relaxed"
          />

          {/* Small Image Configuration Popup directly below the active [Gambar XX] placeholder */}
          {activeImage && floatingPos && (
            <div
              className="absolute z-30 p-3.5 rounded-2xl bg-[#FFFBF2] border-2 border-[#8B5226] shadow-[0_8px_24px_rgba(43,19,2,0.35)] animate-in fade-in zoom-in-95 duration-150 w-72 sm:w-96"
              style={{ top: `${floatingPos.top}px`, left: `${floatingPos.left}px` }}
            >
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#D6BC90]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white bg-[#2F8FE0] px-2 py-0.5 rounded-md shadow-xs">
                    {activeImage.placeholder}
                  </span>
                  <span className="text-xs font-bold text-[#7C471E]">Image Configuration</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePlaceholder(null)}
                  className="p-1 rounded-md hover:bg-[#F3E2BD] text-[#52BE1A] cursor-pointer"
                  title="Done"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              <div className="space-y-2.5">
                {/* Image URL input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#381E0A] flex items-center justify-between">
                    <span>Image URL:</span>
                    {activeImage.image_url && (
                      <span className="text-[10px] text-[#52BE1A] font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Link configured
                      </span>
                    )}
                  </label>
                  <input
                    type="url"
                    value={activeImage.image_url || activeImage.url || ''}
                    onChange={(e) => handleUpdateImageUrl(activeImage.placeholder, e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D6BC90] rounded-lg text-[#381E0A] focus:outline-none focus:border-[#2F8FE0]"
                    autoFocus={!activeImage.image_url}
                  />
                </div>

                {/* Image Title / Caption input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#381E0A]">
                    Image title:
                  </label>
                  <input
                    type="text"
                    value={activeImage.image_title !== undefined ? activeImage.image_title : (activeImage.title || '')}
                    onChange={(e) => handleUpdateImageTitle(activeImage.placeholder, e.target.value)}
                    placeholder="Enter image title..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D6BC90] rounded-lg text-[#381E0A] focus:outline-none focus:border-[#2F8FE0]"
                  />
                  <p className="text-[10px] text-[#9C7955]">
                    Rendered centered directly below the image on the article page.
                  </p>
                </div>

                {/* Image thumbnail preview */}
                {activeImage.image_url && (
                  <div className="pt-1 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D6BC90] bg-[#FAF2DF] shrink-0">
                      <img
                        src={activeImage.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-[#381E0A] truncate">
                        {activeImage.image_title || 'Untitled Image'}
                      </div>
                      <div className="text-[10px] text-[#7C471E] font-mono truncate">
                        {activeImage.image_url}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Inline Images Overview Cards: Shows all placeholders detected in content */}
        {placeholdersInContent.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#FFF9ED] border-2 border-[#D6BC90]/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#2F8FE0]" />
                <h4 className="text-xs font-bold text-[#5C3210] uppercase tracking-wider">
                  Inline Images in Article ({placeholdersInContent.length})
                </h4>
              </div>
              <span className="text-[11px] text-[#9C7955]">
                Positioned in-flow at each [Gambar XX] placeholder
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {placeholdersInContent.map((ph) => {
                const imgData = inlineImages.find(
                  (i) => normalizePlaceholder(i.placeholder).toLowerCase() === ph.toLowerCase()
                ) || {
                  id: placeholderToId(ph),
                  placeholder: ph,
                  image_url: '',
                  image_title: '',
                };

                const isConfigured = Boolean(imgData.image_url);

                return (
                  <div
                    key={ph}
                    className={`p-3 rounded-xl border bg-white space-y-2 transition-all ${
                      activePlaceholder === ph
                        ? 'border-[#2F8FE0] ring-2 ring-[#2F8FE0]/20'
                        : 'border-[#D6BC90]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white bg-[#2F8FE0] px-2 py-0.5 rounded-md">
                          {ph}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isConfigured
                              ? 'bg-[#EBF7E6] text-[#2A7513]'
                              : 'bg-[#FEF3C7] text-[#92400E]'
                          }`}
                        >
                          {isConfigured ? 'Ready' : 'Missing URL'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActivePlaceholder(ph);
                          // Scroll to placeholder in textarea
                          if (textareaRef.current) {
                            const idx = content.toLowerCase().indexOf(ph.toLowerCase());
                            if (idx !== -1) {
                              textareaRef.current.focus();
                              textareaRef.current.setSelectionRange(idx, idx + ph.length);
                            }
                          }
                        }}
                        className="text-[11px] font-bold text-[#2F8FE0] hover:underline cursor-pointer"
                      >
                        Locate
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-[#7C471E] block mb-0.5">
                          Image URL:
                        </label>
                        <input
                          type="url"
                          value={imgData.image_url || imgData.url || ''}
                          onChange={(e) => handleUpdateImageUrl(ph, e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full px-2 py-1 text-xs bg-[#FFFBF2] border border-[#D6BC90] rounded-lg text-[#381E0A] focus:outline-none focus:border-[#2F8FE0]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#7C471E] block mb-0.5">
                          Image title:
                        </label>
                        <input
                          type="text"
                          value={imgData.image_title !== undefined ? imgData.image_title : (imgData.title || '')}
                          onChange={(e) => handleUpdateImageTitle(ph, e.target.value)}
                          placeholder="Enter image title..."
                          className="w-full px-2 py-1 text-xs bg-[#FFFBF2] border border-[#D6BC90] rounded-lg text-[#381E0A] focus:outline-none focus:border-[#2F8FE0]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ArticleContentEditor.displayName = 'ArticleContentEditor';
