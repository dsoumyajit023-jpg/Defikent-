import {
  initSplash, initDarkMode, initSoundToggle,
  initLocationDropdowns, initPreferenceChips,
  initSliders, initBikeCards, initBudgetSlider, initTabs,
  resetAll, resetSuggest, renderGarage,
} from './modules/ui.js';
import { compareNow, profileNow, suggestNow } from './modules/compare.js';
import { playHorn, setSoundEnabled, loadSoundPref } from './modules/sounds.js';
import { CITIES } from './modules/data.js';

/* ── Boot ── */
initSplash();
initDarkMode();
initSoundToggle(setSoundEnabled, loadSoundPref);
initLocationDropdowns();
initSliders();
initBikeCards();
initTabs();
initBudgetSlider();

/* ── Suggest location dropdowns ── */
const suggestStateEl = document.getElementById('suggestState');
const suggestCityEl  = document.getElementById('suggestCity');
if (suggestStateEl) {
  Object.keys(CITIES).forEach(s => {
    const o = document.createElement('option'); o.value = o.textContent = s;
    suggestStateEl.appendChild(o);
  });
  suggestStateEl.addEventListener('change', () => {
    suggestCityEl.innerHTML = '<option value="">Select City</option>';
    (CITIES[suggestStateEl.value] || []).forEach(c => {
      const o = document.createElement('option'); o.value = o.textContent = c;
      suggestCityEl.appendChild(o);
    });
  });
}

/* ── Preference chip sets (one per tab) ── */
const comparePrefs = initPreferenceChips('prefChips');
const suggestPrefs = initPreferenceChips('suggestPrefChips');

/* ── Horn on site open ── */
window.addEventListener('load', () => setTimeout(playHorn, 600));

/* ── Compare ── */
document.getElementById('compareBtn')?.addEventListener('click', () => compareNow(comparePrefs));

/* ── Profile ── */
document.getElementById('profileBtn')?.addEventListener('click', () => profileNow());

/* ── Suggest ── */
document.getElementById('suggestBtn')?.addEventListener('click', () => suggestNow(suggestPrefs));

/* ── Reset (delegated) ── */
document.getElementById('results')?.addEventListener('click', e => {
  if (e.target.id !== 'resetBtn') return;
  const tab = document.querySelector('.tab-btn.active')?.dataset.tab;
  if (tab === 'suggest') { suggestPrefs.clear(); resetSuggest(); }
  else                   { comparePrefs.clear(); resetAll(); }
});

/* ── Garage panel ── */
const garagePanel = document.getElementById('garagePanel');
const garageOverlay = document.getElementById('garageOverlay');

function openGarage() {
  garagePanel.classList.add('open');
  garageOverlay.style.display = 'block';
  renderGarage();
}
function closeGarage() {
  garagePanel.classList.remove('open');
  garageOverlay.style.display = 'none';
}

document.getElementById('garageClose')?.addEventListener('click', closeGarage);
garageOverlay?.addEventListener('click', closeGarage);

/* ── Bottom nav ── */
document.getElementById('garageNavBtn')?.addEventListener('click', openGarage);
document.getElementById('homeNavBtn')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('suggestNavBtn')?.addEventListener('click', () => {
  document.querySelector('[data-tab="suggest"]')?.click();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.getElementById('homeNavBtn')?.addEventListener('click',   () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('suggestNavBtn')?.addEventListener('click', () => {
  document.querySelector('[data-tab="suggest"]')?.click();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
