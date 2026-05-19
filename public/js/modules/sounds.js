/**
 * sounds.js — All sounds generated via Web Audio API.
 * No external audio files needed.
 */

let _ctx = null;
let _enabled = true;

function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

export function setSoundEnabled(v) {
  _enabled = v;
  localStorage.setItem('dk_sound', v ? '1' : '0');
}

export function loadSoundPref() {
  const s = localStorage.getItem('dk_sound');
  _enabled = s === null ? true : s === '1';
  return _enabled;
}

/** Bike horn — two-tone beep played at site open */
export function playHorn() {
  if (!_enabled) return;
  const c = ctx();
  [{ f: 520, t: 0 }, { f: 420, t: 0.28 }].forEach(({ f, t }) => {
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(f, c.currentTime + t);
    osc.frequency.exponentialRampToValueAtTime(f * 1.04, c.currentTime + t + 0.13);
    gain.gain.setValueAtTime(0, c.currentTime + t);
    gain.gain.linearRampToValueAtTime(0.22, c.currentTime + t + 0.02);
    gain.gain.setValueAtTime(0.22, c.currentTime + t + 0.12);
    gain.gain.linearRampToValueAtTime(0, c.currentTime + t + 0.20);
    osc.start(c.currentTime + t);
    osc.stop(c.currentTime + t + 0.22);
  });
}

/** Engine rev — played when user hits Compare / Suggest */
export function playRevSound() {
  if (!_enabled) return;
  const c = ctx();
  const sr  = c.sampleRate;
  const dur = 0.7;
  const buf = c.createBuffer(1, sr * dur, sr);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    const t    = i / sr;
    const prog = t / dur;
    const freq = 60 + 500 * prog * prog;
    const amp  = 0.15 * Math.pow(1 - prog, 0.4);
    d[i] = (Math.sin(2 * Math.PI * freq * t)
          + 0.4 * Math.sin(2 * Math.PI * freq * 2 * t)
          + 0.15 * Math.sin(2 * Math.PI * freq * 3 * t)) * amp;
  }
  const src  = c.createBufferSource();
  src.buffer = buf;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.7, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur - 0.05);
  src.connect(gain); gain.connect(c.destination);
  src.start();
}

/** Soft click — chip toggles, tab switches */
export function playClick() {
  if (!_enabled) return;
  const c = ctx();
  const osc  = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain); gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(280, c.currentTime + 0.07);
  gain.gain.setValueAtTime(0.06, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.09);
}

/** Heart pop — save button */
export function playHeartPop() {
  if (!_enabled) return;
  const c = ctx();
  [550, 750, 950].forEach((f, i) => {
    const osc = c.createOscillator(), gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, c.currentTime + i * 0.07);
    gain.gain.setValueAtTime(0.10, c.currentTime + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.07 + 0.12);
    osc.start(c.currentTime + i * 0.07);
    osc.stop(c.currentTime + i * 0.07 + 0.13);
  });
}

/** Chime — share copied / star rating */
export function playChime() {
  if (!_enabled) return;
  const c = ctx();
  [880, 1100, 1320, 1760].forEach((f, i) => {
    const osc = c.createOscillator(), gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f, c.currentTime + i * 0.08);
    gain.gain.setValueAtTime(0.08, c.currentTime + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.08 + 0.28);
    osc.start(c.currentTime + i * 0.08);
    osc.stop(c.currentTime + i * 0.08 + 0.30);
  });
}

/** Notify pop — toast / garage save */
export function playNotify() {
  if (!_enabled) return;
  const c = ctx();
  const osc = c.createOscillator(), gain = c.createGain();
  osc.connect(gain); gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600,  c.currentTime);
  osc.frequency.setValueAtTime(900,  c.currentTime + 0.08);
  osc.frequency.setValueAtTime(1100, c.currentTime + 0.16);
  gain.gain.setValueAtTime(0.10, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.36);
}
