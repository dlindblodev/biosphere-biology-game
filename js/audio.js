// audio.js — fully procedural ambience + SFX via the WebAudio API (no assets).
// A low ambient drone bed plus short synthesized cues for UI/interactions.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.started = false;
    this.droneNodes = [];
  }

  ensure() {
    if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.6;
    this.master.connect(this.ctx.destination);
  }

  start() {
    this.ensure();
    if (!this.ctx || this.started) return;
    this.started = true;
    this._drone();
  }

  _drone() {
    const ctx = this.ctx;
    const bus = ctx.createGain();
    bus.gain.value = 0.10;
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass"; filt.frequency.value = 520;
    bus.connect(filt); filt.connect(this.master);
    // two detuned low oscillators + a slow shimmering high
    [55, 55.4, 82.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? "triangle" : "sawtooth";
      o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = i === 2 ? 0.04 : 0.09;
      o.connect(g); g.connect(bus); o.start();
      // slow LFO on gain for breathing
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.06 + i * 0.03;
      const lg = ctx.createGain(); lg.gain.value = 0.03;
      lfo.connect(lg); lg.connect(g.gain); lfo.start();
      this.droneNodes.push(o, lfo);
    });
    // gentle filter sweep
    const sweep = ctx.createOscillator(); sweep.frequency.value = 0.03;
    const sg = ctx.createGain(); sg.gain.value = 240;
    sweep.connect(sg); sg.connect(filt.frequency); sweep.start();
    this.droneNodes.push(sweep);
  }

  _blip({ freq = 440, dur = 0.12, type = "sine", gain = 0.25, slideTo = null, delay = 0 }) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.master); o.start(t0); o.stop(t0 + dur + 0.02);
  }

  // public cues -------------------------------------------------
  focus()    { this._blip({ freq: 660, dur: 0.06, type: "sine", gain: 0.06 }); }
  scan()     { this._blip({ freq: 520, slideTo: 880, dur: 0.18, type: "triangle", gain: 0.18 }); }
  open()     { this._blip({ freq: 300, slideTo: 90, dur: 0.5, type: "sawtooth", gain: 0.16 }); }
  correct()  { [523, 659, 784].forEach((f, i) => this._blip({ freq: f, dur: 0.22, type: "sine", gain: 0.16, delay: i * 0.07 })); }
  wrong()    { this._blip({ freq: 180, slideTo: 110, dur: 0.3, type: "square", gain: 0.12 }); }
  success()  { [523, 659, 784, 1046].forEach((f, i) => this._blip({ freq: f, dur: 0.5, type: "triangle", gain: 0.16, delay: i * 0.1 })); }
  warp()     { this._blip({ freq: 120, slideTo: 1200, dur: 0.7, type: "sawtooth", gain: 0.14 }); }
  step()     { this._blip({ freq: 90, slideTo: 55, dur: 0.09, type: "sine", gain: 0.05 }); }

  toggleMute() {
    this.ensure();
    this.muted = !this.muted;
    if (this.master) this.master.gain.setTargetAtTime(this.muted ? 0 : 0.6, this.ctx.currentTime, 0.05);
    return this.muted;
  }
}

export const Audio = new AudioEngine();
