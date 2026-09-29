/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl game-wood-frame overflow-visible animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Top-Right Circular Wood Close Button (Iconic Game Pop-Up Close 'X') */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute -top-4 -right-4 game-wood-circle-btn z-30 text-white"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>

        {/* Top Wood Header Plaque Banner */}
        <div className="game-wood-plank -mt-6 mx-auto max-w-md py-2.5 px-6 text-center shadow-[0_5px_0_#2B1302]">
          <h3 className="game-text-title text-xl sm:text-2xl uppercase tracking-wider line-clamp-1">
            {title}
          </h3>
        </div>

        {/* Parchment Body Canvas */}
        <div className="p-4 sm:p-6">
          <div className="game-parchment p-5 sm:p-6 max-h-[75vh] overflow-y-auto text-[#381E0A]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
