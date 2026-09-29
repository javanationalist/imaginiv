/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="parchment-surface p-6 rounded-2xl border-2 border-[#A83D2A] text-center my-4">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#FAECE8] border-2 border-[#B94430] flex items-center justify-center text-[#B94430] mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <p className="font-display text-sm md:text-base font-bold text-[#741F14] mb-3">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="village-btn-wood px-4 py-1.5 rounded-xl text-xs font-bold"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
