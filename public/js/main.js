/**
 * main.js
 * Application entry point.
 * Imports modules and wires all event listeners.
 * Nothing else lives here.
 */

import { initSplash, initLocationDropdowns, initPreferenceChips, initSliders, initBikeCards, resetAll } from './modules/ui.js';
import { compareNow } from './modules/compare.js';

// ── Boot ──────────────────────────────────────────────────────────────────────
initSplash();
initLocationDropdowns();
initSliders();
initBikeCards();

// Preference chips return a live Set we pass to compareNow
const selectedPrefs = initPreferenceChips();

// ── Global event listeners ────────────────────────────────────────────────────
document.getElementById('compareBtn')?.addEventListener('click', () => {
  compareNow(selectedPrefs);
});

// Reset button is rendered dynamically inside results — use delegation
// Also clear the selectedPrefs Set so chips reset properly
document.getElementById('results')?.addEventListener('click', (e) => {
  if (e.target.id === 'resetBtn') {
    selectedPrefs.clear();
    resetAll();
  }
});
