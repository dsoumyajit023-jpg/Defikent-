/**
 * main.js — Application entry point.
 */

import {
  initSplash, initDarkMode, initSoundToggle,
  initLocationDropdowns, initPreferenceChips, initSliders,
  initBikeCards, initBudgetSlider, initTabs,
  resetAll, resetSuggest, renderGarage,
} from './modules/ui.js';
import { compareNow, suggestNow } from './modules/compare.js';
import { playHorn, playRevSound, setSoundEnabled, loadSoundPref } from './modules/sounds.js';
import { CITIES } from './modules/data.js';

// ── Boot ──────────────────────────────────────────────────────────────────────
initSplash();
initDarkMode();
initSoundToggle(setSoundEnabled, loadSoundPref);
initLocationDropdowns();
initSliders();
initBikeCards();
initTabs();

// Suggest location dropdowns (reuse CITIES data)
const suggestStateEl = document.getElementById('suggestState');
const suggestCityEl  = document.getElementById('suggestCity');
if (suggestStateEl) {
  Object.keys(CITIES).forEach(s => {
    const o = document.createElement('option'); o.textContent = s; o.value = s;
    suggestStateEl.appendChild(o);
  });
  suggestStateEl.addEventListener('change', () => {
    suggestCityEl.innerHTML = '<option value="">Select City</option>';
    (CITIES[suggestStateEl.value] || []).forEach(c => {
      const o = document.createElement('option'); o.textContent = c; o.value = c;
      suggestCityEl.appendChild(o);
    });
  });
}

initBudgetSlider();

// Preference chips — separate sets per tab
const comparePrefs = initPreferenceChips('prefChips');
const suggestPrefs = initPreferenceChips('suggestPrefChips');

// ── Play horn on load ─────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(playHorn, 2000); // after splash starts fading
});

// ── Compare tab button ────────────────────────────────────────────────────────
document.getElementById('compareBtn')?.addEventListener('click', () => {
  compareNow(comparePrefs);
});

// ── Suggest tab button ────────────────────────────────────────────────────────
document.getElementById('suggestBtn')?.addEventListener('click', () => {
  suggestNow(suggestPrefs);
});

// ── Reset buttons — delegated ─────────────────────────────────────────────────
document.getElementById('results')?.addEventListener('click', (e) => {
  if (e.target.id === 'resetBtn') {
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
    if (activeTab === 'suggest') {
      suggestPrefs.clear();
      resetSuggest();
    } else {
      comparePrefs.clear();
      resetAll();
    }
  }
});

// ── Garage panel toggle ───────────────────────────────────────────────────────
document.getElementById('garageToggle')?.addEventListener('click', () => {
  const panel = document.getElementById('garagePanel');
  if (!panel) return;
  const open = panel.classList.toggle('open');
  renderGarage();
  document.getElementById('garageToggle').setAttribute('aria-expanded', open);
});
document.getElementById('garageClose')?.addEventListener('click', () => {
  document.getElementById('garagePanel')?.classList.remove('open');
});

// ── Bottom nav ────────────────────────────────────────────────────────────────
document.getElementById('garageNavBtn')?.addEventListener('click', () => {
  document.getElementById('garageToggle').click();
});
document.getElementById('homeNavBtn')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.getElementById('suggestNavBtn')?.addEventListener('click', () => {
  document.querySelector('[data-tab="suggest"]')?.click();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Also close garage when overlay clicked
document.getElementById('garageOverlay')?.addEventListener('click', () => {
  document.getElementById('garagePanel')?.classList.remove('open');
});
