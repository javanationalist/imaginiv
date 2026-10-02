/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Subtle cartoon pop sound generator using Web Audio API.
 * Zero-dependency, lightweight, tactile, and handles browser audio policies gracefully.
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a soft, playful cartoon pop sound.
 * @param pitchOffset Optional offset for staggered musical variation (0, 1, 2...)
 * @param volume Master volume multiplier (defaults to subtle 0.07)
 */
export function playCartoonPop(pitchOffset: number = 0, volume: number = 0.07): void {
  try {
    // Respect user's reduced-motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Gentle low-pass filter to keep the pop warm, soft, and never piercing
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    // Warm, rounded tone using sine wave
    osc.type = 'sine';

    // Soft playful bubble pitch contour with gentle climb across staggered items
    const baseFreq = 520 + (pitchOffset % 6) * 35;
    osc.frequency.setValueAtTime(baseFreq * 0.85, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.025);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.075);

    // Snappy envelope: gentle rise and soft exponential decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    // Connect node graph
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  } catch {
    // Gracefully ignore any browser audio constraints
  }
}

/**
 * Schedule a cartoon pop sound with a delay (in seconds).
 */
export function scheduleCartoonPop(delaySeconds: number, pitchOffset: number = 0): void {
  if (delaySeconds <= 0) {
    playCartoonPop(pitchOffset);
  } else {
    setTimeout(() => {
      playCartoonPop(pitchOffset);
    }, delaySeconds * 1000);
  }
}
