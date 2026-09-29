/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Optional playful Web Audio sound effects (default muted/off)
class SoundManager {
  private enabled: boolean = false;
  private audioCtx: AudioContext | null = null;

  constructor() {
    // Check localStorage if user previously enabled sound
    const saved = localStorage.getItem('village_sound_enabled');
    this.enabled = saved === 'true';
  }

  public isSoundEnabled(): boolean {
    return this.enabled;
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('village_sound_enabled', String(this.enabled));
    if (this.enabled) {
      this.playChime();
    }
    return this.enabled;
  }

  private initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Playful cartoon pop/click
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.09);
    } catch {
      // Audio context might fail in silent mode, safe to ignore
    }
  }

  // Playful village chime / celebration
  public playChime() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.26);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundManager();
