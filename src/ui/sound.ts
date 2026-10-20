/**
 * Procedural WebAudio synthesizer inspired by Resn & Star Atlas.
 * Zero external audio assets — pure harmonic synthesis.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private droneGain: GainNode | null = null;
  private lastTick = 0;

  toggle(): boolean {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.startDrone();
    }
    this.enabled = !this.enabled;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.droneGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.droneGain.gain.cancelScheduledValues(now);
      this.droneGain.gain.setTargetAtTime(this.enabled ? 0.045 : 0.0001, now, 0.4);
    }
    if (this.enabled) {
      this.chime(587.33, 0.12); // D5
    }
    return this.enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private startDrone() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, now);

    // D2 + A2 cosmic fifth
    [73.42, 110.0, 146.83].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = i === 2 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((i - 1) * 6, now);
      osc.connect(filter);
      osc.start();
    });

    filter.connect(master);
    master.connect(this.ctx.destination);
    this.droneGain = master;
  }

  /** Subtle high-tech UI tick on hover */
  hover() {
    if (!this.enabled || !this.ctx) return;
    const now = performance.now();
    if (now - this.lastTick < 55) return;
    this.lastTick = now;

    const scale = [587.33, 659.25, 698.46, 880.0, 1046.5, 1174.66];
    const freq = scale[Math.floor(Math.random() * scale.length)];
    this.chime(freq, 0.035, 0.09);
  }

  /** Harmonic chime */
  chime(freq = 880, volume = 0.06, duration = 0.35) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.005, t + duration);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  /** Cosmic morph / burst whoosh */
  morph() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(52, t + 0.65);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.75);
  }
}

export const sound = new SoundEngine();
