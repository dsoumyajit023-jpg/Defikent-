/**
 * ui.js
 * All DOM read/write lives here.
 * No API calls, no business logic — pure presentation layer.
 */

import { CONFIG, SPEC_KEYS, META_KEYS, PREFERENCES } from './config.js';
import { CITIES, STATES } from './data.js';

// ─── Splash ──────────────────────────────────────────────────────────────────

export function initSplash() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const splash = document.getElementById('splash');
      if (!splash) return;
      splash.classList.add('hide');
      setTimeout(() => splash.remove(), CONFIG.SPLASH_FADE);
    }, CONFIG.SPLASH_DELAY);
  });
}

// ─── Location dropdowns ──────────────────────────────────────────────────────

export function initLocationDropdowns() {
  const stateEl = document.getElementById('stateSelect');

  // Populate states
  STATES.forEach(s => {
    const o = document.createElement('option');
    o.textContent = s;
    o.value = s;
    stateEl.appendChild(o);
  });

  stateEl.addEventListener('change', () => loadCities(stateEl.value));
}

export function loadCities(state) {
  const cs = document.getElementById('citySelect');
  cs.innerHTML = '<option value="">Select City</option>';
  (CITIES[state] || []).forEach(c => {
    const o = document.createElement('option');
    o.textContent = c;
    o.value = c;
    cs.appendChild(o);
  });
}

// ─── Preference chips ────────────────────────────────────────────────────────

/** @returns {Set<string>} live set — stays in sync with clicks */
export function initPreferenceChips() {
  const wrap = document.getElementById('prefChips');
  const selected = new Set();

  PREFERENCES.forEach(({ key, label }) => {
    const div = document.createElement('div');
    div.className = 'chip';
    div.textContent = label;
    div.addEventListener('click', () => {
      div.classList.toggle('active');
      selected.has(key) ? selected.delete(key) : selected.add(key);
    });
    wrap.appendChild(div);
  });

  return selected;
}

// ─── Sliders ─────────────────────────────────────────────────────────────────

export function initSliders() {
  const km = document.getElementById('kmSlider');
  const kmVal = document.getElementById('kmVal');
  km.min = CONFIG.KM_MIN;
  km.max = CONFIG.KM_MAX;
  km.value = CONFIG.KM_DEFAULT;
  kmVal.textContent = `${CONFIG.KM_DEFAULT} km/day`;
  km.addEventListener('input', () => { kmVal.textContent = `${km.value} km/day`; });

  const sal = document.getElementById('salarySlider');
  const salVal = document.getElementById('salaryVal');
  sal.min = CONFIG.SALARY_MIN;
  sal.max = CONFIG.SALARY_MAX;
  sal.step = CONFIG.SALARY_STEP;
  sal.value = CONFIG.SALARY_DEFAULT;
  salVal.textContent = `₹${Number(CONFIG.SALARY_DEFAULT).toLocaleString('en-IN')}`;
  sal.addEventListener('input', () => {
    salVal.textContent = `₹${Number(sal.value).toLocaleString('en-IN')}`;
  });
}

// ─── Bike input cards ────────────────────────────────────────────────────────

export function initBikeCards() {
  [0, 1, 2].forEach(i => {
    const input = document.getElementById(`bike${i}`);
    if (!input) return;
    input.addEventListener('input', () => checkFilled(i));
  });

  document.getElementById('addThirdBtn')?.addEventListener('click', addThird);
  document.getElementById('removeThirdBtn')?.addEventListener('click', removeThird);
}

export function checkFilled(i) {
  const val = document.getElementById(`bike${i}`)?.value.trim() || '';
  document.getElementById(`bikeCard${i}`)?.classList.toggle('filled', val.length > 0);
}

function addThird() {
  document.getElementById('thirdBikeWrap').style.display = 'block';
  document.getElementById('addThirdBtn').style.display = 'none';
}

function removeThird() {
  document.getElementById('thirdBikeWrap').style.display = 'none';
  document.getElementById('addThirdBtn').style.display = 'inline-flex';
  const input = document.getElementById('bike2');
  if (input) input.value = '';
  checkFilled(2);
}

// ─── Error / loading ─────────────────────────────────────────────────────────

export function showError(msg) {
  const el = document.getElementById('errorBox');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), CONFIG.ERROR_DISMISS);
}

export function setLoading(on) {
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  if (on) {
    loading.classList.add('show');
    results.classList.remove('show');
    results.innerHTML = '';
  } else {
    loading.classList.remove('show');
  }
}

// ─── Results rendering ───────────────────────────────────────────────────────

export function renderResults(data) {
  const { bikes, winner_index, winner_reason, yes_no, verdict } = data;
  const container = document.getElementById('results');
  container.classList.add('show');

  container.innerHTML = [
    buildHeader(bikes, winner_index, winner_reason),
    buildSpecs(bikes, winner_index),
    buildCosts(bikes, winner_index),
    buildYesNo(bikes, yes_no),
    buildVerdict(verdict),
    buildReset(),
  ].join('');

  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildHeader(bikes, winner_index, winner_reason) {
  const cols = bikes.length === 3 ? '1fr auto 1fr auto 1fr' : '1fr auto 1fr';
  let html = `<div class="result-section">
    <p class="section-label">AI Comparison Result</p>
    <p class="section-title">Side-by-Side Analysis</p>
    <div class="compare-header" style="grid-template-columns:${cols};">`;

  bikes.forEach((bike, i) => {
    const isWinner = i === winner_index;
    html += `<div class="bike-header-card ${isWinner ? 'winner' : ''}">
      ${isWinner ? '<div class="winner-badge">🏆 Winner</div>' : ''}
      <div class="bike-name-result">${bike.name}</div>
      <div class="bike-score-wrap">
        <div class="score-ring ${isWinner ? '' : 'gray-ring'}">${bike.score}</div>
        <div class="score-label">/ 100</div>
      </div>
    </div>`;
    if (i < bikes.length - 1) html += '<div class="vs-badge">VS</div>';
  });

  html += `</div>
    <p style="text-align:center;font-size:13px;color:var(--gray-500);margin-top:10px;">🏆 ${winner_reason}</p>
  </div>`;
  return html;
}

function buildSpecs(bikes, winner_index) {
  const headerRow = `<tr>
    <td class="spec-label" style="font-weight:700;">Spec</td>
    ${bikes.map(b => `<td class="spec-val" style="font-weight:700;color:var(--gray-800);">${b.name.split(' ').slice(-2).join(' ')}</td>`).join('')}
  </tr>`;

  const specRows = Object.entries(SPEC_KEYS).map(([key, label]) => `<tr>
    <td class="spec-label">${label}</td>
    ${bikes.map((b, i) => `<td class="spec-val ${i === winner_index ? 'highlight' : ''}">${b.specs?.[key] || '—'}</td>`).join('')}
  </tr>`).join('');

  const metaRows = META_KEYS.map(([key, label]) => `<tr>
    <td class="spec-label">${label}</td>
    ${bikes.map((b, i) => `<td class="spec-val ${i === winner_index ? 'highlight' : ''}">${b[key] || '—'}</td>`).join('')}
  </tr>`).join('');

  return `<div class="card result-section">
    <div class="result-section-title">📊 Full Specifications</div>
    <table class="spec-table">${headerRow}${specRows}${metaRows}</table>
  </div>`;
}

function buildCosts(bikes, winner_index) {
  const cards = bikes.map((bike, i) => {
    const isW = i === winner_index;
    const bg = isW ? '' : 'background:linear-gradient(135deg,#374151,#1f2937);';
    return `<div class="cost-card" style="${bg}">
      ${isW ? '<span style="font-size:11px;font-weight:700;background:rgba(255,255,255,0.2);padding:3px 10px;border-radius:30px;letter-spacing:0.5px;">WINNER</span><br><br>' : ''}
      <div class="cost-card-title">${bike.name}</div>
      <div class="cost-total">${bike.total_monthly_cost}</div>
      <div class="cost-sub">Total monthly cost</div>
      <div class="cost-grid">
        <div class="cost-item"><div class="cost-item-label">EMI</div><div class="cost-item-val">${bike.emi || '—'}</div></div>
        <div class="cost-item"><div class="cost-item-label">Fuel/month</div><div class="cost-item-val">${bike.fuel_cost_month}</div></div>
        <div class="cost-item"><div class="cost-item-label">Service/year</div><div class="cost-item-val">${bike.service_cost_year}</div></div>
        <div class="cost-item"><div class="cost-item-label">Insurance/yr</div><div class="cost-item-val">${bike.insurance_year}</div></div>
      </div>
      <div style="margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.12);font-size:13px;color:rgba(255,255,255,0.6);">
        Salary recommended: <strong style="color:white;">${bike.salary_needed}</strong>
      </div>
    </div>`;
  }).join('');

  return `<div class="result-section">
    <div class="result-section-title" style="background:none;border:none;">💸 Monthly Cost Breakdown</div>
    <div style="display:grid;grid-template-columns:repeat(${bikes.length},1fr);gap:14px;">${cards}</div>
  </div>`;
}

function buildYesNo(bikes, yes_no) {
  const items = (yes_no || []).flatMap(item =>
    bikes.map((bike, i) => {
      const isYes = item.yes_index === i;
      return `<div class="yesno-item">
        <span class="yesno-badge ${isYes ? 'yes' : 'no'}">${isYes ? 'YES' : 'NO'}</span>
        <span class="yesno-label">${bike.name.split(' ').slice(-2).join(' ')}: ${item.question}</span>
      </div>`;
    })
  ).join('');

  return `<div class="card result-section">
    <div class="result-section-title">✅ Quick Yes / No Answers</div>
    <div class="yesno-grid">${items}</div>
  </div>`;
}

function buildVerdict(verdict) {
  return `<div class="verdict-card result-section">
    <div class="verdict-icon">🎯</div>
    <div class="verdict-text">${verdict}</div>
  </div>`;
}

function buildReset() {
  return `<div style="text-align:center;margin-top:24px;">
    <button class="btn btn-ghost" id="resetBtn">↩ Compare Again</button>
  </div>`;
}

export function resetAll() {
  const results = document.getElementById('results');
  results.classList.remove('show');
  results.innerHTML = '';
  window.scrollTo({ behavior: 'smooth', top: 0 });
}
