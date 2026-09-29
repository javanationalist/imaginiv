/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../services/soundService';

export const AudioToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [enabled, setEnabled] = useState(soundManager.isSoundEnabled());

  const handleToggle = () => {
    const newState = soundManager.toggleSound();
    setEnabled(newState);
  };

  return (
    <button
      id="village-audio-toggle"
      onClick={handleToggle}
      className={`btn-round-wood w-10 h-10 sm:w-11 sm:h-11 touch-target text-white ${className}`}
      title={enabled ? 'Mute village sounds' : 'Enable playful village sounds'}
      aria-label={enabled ? 'Mute village sounds' : 'Enable playful village sounds'}
    >
      {enabled ? (
        <Volume2 className="w-5 h-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
      ) : (
        <VolumeX className="w-5 h-5 text-[#FFD6A5] drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
      )}
    </button>
  );
};
