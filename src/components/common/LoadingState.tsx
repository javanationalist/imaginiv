/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading village grounds...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-[#5C3217] border-2 border-[#D9A372] shadow-inner flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 text-[#FFEDD5] animate-spin" />
      </div>
      <p className="font-display text-base font-semibold text-[#5C3217]">
        {message}
      </p>
    </div>
  );
};
