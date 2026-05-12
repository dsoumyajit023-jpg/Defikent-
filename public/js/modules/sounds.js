/**
 * sounds.js — Web Audio API sound effects.
 * All sounds are procedurally generated — no external files needed.
 * Respects user's sound preference stored in localStorage.
 */

let ctx = null;
let soundEnabled = true;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function setSoundEnabled(val) {
  soundEnabled = val;
  localStorage.setItem('dk_sound', val ? '1' : '0');
}

export function loadSoundPref() {
  const stored = localStorage.getItem('dk_sound');
  soundEnabled = stored === null ? true : stored === '1';
  return soundEnabled;
}

function resume() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
  return c;
}

/** Bike horn — two-tone "beep beep" */
export function playHorn() {
  if (!soundEnabled) return;
  const c = resume();
  const tones = [520, 440];
  tones.forEach((freq, i) => {
    setTimeout(() => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, c.currentTime + 0.12);
      gain.gain.setValueAtTime(0, c.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, c.currentTime + 0.02);
      gain.gain.setValueAtTime(0.18, c.currentTime + 0.11);
      gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.18);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.2);
    }, i * 260);
  });
}

/** Bike engine rev — short acceleration burst */
export function playRevSound() {
  if (!soundEnabled) return;
  const c = resume();
  const buf = c.createBuffer(1, c.sampleRate * 0.6, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / c.sampleRate;
    const freq = 80 + 400 * (t / 0.6);
    data[i] = Math.sin(2 * Math.PI * freq * t) * 0.12 * Math.pow(1 - t / 0.6, 0.5);
    // add harmonics for engine texture
    data[i] += Math.sin(2 * Math.PI * freq * 2 * t) * 0.05 * Math.pow(1 - t / 0.6, 0.5);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.6, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.58);
  src.connect(gain); gain.connect(c.destination);
  src.start();
}

/** Soft click — for chip/chip toggle */
export function playClick() {
  if (!soundEnabled) return;
  const c = resume();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain); gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(900, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.06);
  gain.gain.setValueAtTime(0.07, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.07);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.08);
}

/** Heart pop — save button */
export function playHeartPop() {
  if (!soundEnabled) return;
  const c = resume();
  [600, 800, 1000].forEach((f, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, c.currentTime + i * 0.06);
    gain.gain.setValueAtTime(0.09, c.currentTime + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.06 + 0.1);
    osc.start(c.currentTime + i * 0.06);
    osc.stop(c.currentTime + i * 0.06 + 0.12);
  });
}

/** Share link copied — quick chime */
export function playChime() {
  if (!soundEnabled) return;
  const c = resume();
  [880, 1100, 1320].forEach((f, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f, c.currentTime + i * 0.07);
    gain.gain.setValueAtTime(0.08, c.currentTime + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.07 + 0.25);
    osc.start(c.currentTime + i * 0.07);
    osc.stop(c.currentTime + i * 0.07 + 0.28);
  });
}

/** Notification pop */
export function playNotify() {
  if (!soundEnabled) return;
  const c = resume();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain); gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(660, c.currentTime);
  osc.frequency.setValueAtTime(880, c.currentTime + 0.1);
  gain.gain.setValueAtTime(0.1, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.32);
}
