/**
 * ui.js — All DOM rendering. No API calls here.
 */

import { CONFIG, SPEC_KEYS, SPEC_TOOLTIPS, META_KEYS, META_TOOLTIPS, PREFERENCES } from './config.js';
import { CITIES, STATES } from './data.js';
import { saveToGarage, getGarage, deleteFromGarage } from './garage.js';
import { playClick, playHeartPop, playChime, playNotify } from './sounds.js';

// ── Splash ───────────────────────────────────────────────────────────────────

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

// ── Dark mode ────────────────────────────────────────────────────────────────

export function initDarkMode() {
  const btn = document.getElementById('darkToggle');
  const stored = localStorage.getItem('dk_dark');
  if (stored === '1') document.documentElement.classList.add('dark');
  updateDarkBtn(btn);
  btn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('dk_dark', isDark ? '1' : '0');
    updateDarkBtn(btn);
    playClick();
  });
}

function updateDarkBtn(btn) {
  if (!btn) return;
  const isDark = document.documentElement.classList.contains('dark');
  btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

// ── Sound toggle ─────────────────────────────────────────────────────────────

export function initSoundToggle(setSoundEnabled, loadSoundPref) {
  const btn = document.getElementById('soundToggle');
  let enabled = loadSoundPref();
  updateSoundBtn(btn, enabled);
  btn?.addEventListener('click', () => {
    enabled = !enabled;
    setSoundEnabled(enabled);
    updateSoundBtn(btn, enabled);
  });
}

function updateSoundBtn(btn, enabled) {
  if (!btn) return;
  btn.textContent = enabled ? 'Sound On' : 'Sound Off';
}

// ── Location ─────────────────────────────────────────────────────────────────

export function initLocationDropdowns() {
  const stateEl = document.getElementById('stateSelect');
  STATES.forEach(s => {
    const o = document.createElement('option');
    o.textContent = s; o.value = s;
    stateEl.appendChild(o);
  });
  stateEl.addEventListener('change', () => loadCities(stateEl.value));
}

export function loadCities(state) {
  const cs = document.getElementById('citySelect');
  cs.innerHTML = '<option value="">Select City</option>';
  (CITIES[state] || []).forEach(c => {
    const o = document.createElement('option');
    o.textContent = c; o.value = c;
    cs.appendChild(o);
  });
}

// ── Preference chips ─────────────────────────────────────────────────────────

export function initPreferenceChips(containerId = 'prefChips') {
  const wrap = document.getElementById(containerId);
  if (!wrap) return new Set();
  wrap.innerHTML = '';
  const selected = new Set();
  PREFERENCES.forEach(({ key, label }) => {
    const div = document.createElement('div');
    div.className = 'chip';
    div.textContent = label;
    div.addEventListener('click', () => {
      div.classList.toggle('active');
      selected.has(key) ? selected.delete(key) : selected.add(key);
      playClick();
    });
    wrap.appendChild(div);
  });
  return selected;
}

// ── Sliders ───────────────────────────────────────────────────────────────────

export function initSliders() {
  const km = document.getElementById('kmSlider');
  const kmVal = document.getElementById('kmVal');
  km.min = CONFIG.KM_MIN; km.max = CONFIG.KM_MAX; km.value = CONFIG.KM_DEFAULT;
  kmVal.textContent = `${CONFIG.KM_DEFAULT} km/day`;
  km.addEventListener('input', () => { kmVal.textContent = `${km.value} km/day`; });

  const sal = document.getElementById('salarySlider');
  const salVal = document.getElementById('salaryVal');
  sal.min = CONFIG.SALARY_MIN; sal.max = CONFIG.SALARY_MAX;
  sal.step = CONFIG.SALARY_STEP; sal.value = CONFIG.SALARY_DEFAULT;
  salVal.textContent = `₹${Number(CONFIG.SALARY_DEFAULT).toLocaleString('en-IN')}`;
  sal.addEventListener('input', () => {
    salVal.textContent = `₹${Number(sal.value).toLocaleString('en-IN')}`;
  });
}

export function initBudgetSlider() {
  const sl = document.getElementById('budgetSlider');
  const val = document.getElementById('budgetVal');
  if (!sl) return;
  sl.min = CONFIG.BUDGET_MIN; sl.max = CONFIG.BUDGET_MAX;
  sl.step = CONFIG.BUDGET_STEP; sl.value = CONFIG.BUDGET_DEFAULT;
  val.textContent = `₹${Number(CONFIG.BUDGET_DEFAULT).toLocaleString('en-IN')}`;
  sl.addEventListener('input', () => {
    val.textContent = `₹${Number(sl.value).toLocaleString('en-IN')}`;
  });
}

// ── Bike input cards ─────────────────────────────────────────────────────────

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
  const inp = document.getElementById('bike2');
  if (inp) inp.value = '';
  checkFilled(2);
}

// ── Error / loading ───────────────────────────────────────────────────────────

export function showError(msg) {
  const el = document.getElementById('errorBox');
  if (!el) return;
  el.innerHTML = `<strong>Oops! No result found.</strong> ${msg} — we respect your search. Try again shortly.`;
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
    // Skeleton after spinner phase
    setTimeout(() => {
      if (loading.classList.contains('show')) showSkeleton();
    }, 1800);
  } else {
    loading.classList.remove('show');
    hideSkeleton();
  }
}

function showSkeleton() {
  const loading = document.getElementById('loading');
  const ring = loading.querySelector('.loading-ring');
  if (ring) ring.style.display = 'none';
  const existing = loading.querySelector('.skeleton-wrap');
  if (existing) return;
  const sk = document.createElement('div');
  sk.className = 'skeleton-wrap';
  sk.innerHTML = `
    <div class="skel skel-title"></div>
    <div class="skel-row">
      <div class="skel skel-card"></div>
      <div class="skel skel-card"></div>
    </div>
    <div class="skel skel-bar"></div>
    <div class="skel skel-bar short"></div>
    <div class="skel skel-bar"></div>
  `;
  loading.appendChild(sk);
}
function hideSkeleton() {
  const sk = document.querySelector('.skeleton-wrap');
  if (sk) sk.remove();
  const ring = document.querySelector('#loading .loading-ring');
  if (ring) ring.style.display = '';
}

// ── Tab switching ─────────────────────────────────────────────────────────────

export function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${target}`)?.classList.add('active');
      playClick();
    });
  });
}

// ── Toast notification ────────────────────────────────────────────────────────

export function showToast(msg) {
  let toast = document.getElementById('toastBar');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastBar';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  playNotify();
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── Star rating ───────────────────────────────────────────────────────────────

export function initRating() {
  const wrap = document.getElementById('starRating');
  if (!wrap) return;
  const stars = wrap.querySelectorAll('.star');
  let selected = 0;
  stars.forEach((star, i) => {
    star.addEventListener('mouseenter', () => highlightStars(stars, i));
    star.addEventListener('mouseleave', () => highlightStars(stars, selected - 1));
    star.addEventListener('click', () => {
      selected = i + 1;
      highlightStars(stars, i);
      playChime();
      const msg = document.getElementById('ratingMsg');
      const messages = ['', 'We hear you. We will improve!', 'Thanks for the feedback!', 'Glad you like it!', 'Awesome — thank you!', 'You made our day!'];
      if (msg) { msg.textContent = messages[selected]; msg.classList.add('show'); }
      localStorage.setItem('dk_rating', selected);
    });
  });
  const saved = parseInt(localStorage.getItem('dk_rating') || '0');
  if (saved > 0) { selected = saved; highlightStars(stars, saved - 1); }
}

function highlightStars(stars, upTo) {
  stars.forEach((s, i) => s.classList.toggle('active', i <= upTo));
}

// ── My Garage panel ───────────────────────────────────────────────────────────

export function renderGarage() {
  const wrap = document.getElementById('garageList');
  if (!wrap) return;
  const items = getGarage();
  if (items.length === 0) {
    wrap.innerHTML = '<p class="garage-empty">Your garage is empty. Save a comparison to see it here.</p>';
    return;
  }
  wrap.innerHTML = items.map(item => `
    <div class="garage-item" data-id="${item.id}">
      <div class="garage-item-names">${item.bikeNames || 'Comparison'}</div>
      <div class="garage-item-date">${item.savedAt}</div>
      <div class="garage-item-actions">
        <button class="btn btn-ghost btn-sm garage-load" data-id="${item.id}">Load</button>
        <button class="btn btn-ghost btn-sm garage-delete" data-id="${item.id}" style="color:var(--red)">Delete</button>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('.garage-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteFromGarage(Number(btn.dataset.id));
      renderGarage();
      playClick();
    });
  });
}

// ── Results rendering ─────────────────────────────────────────────────────────

export function renderResults(data, isSuggest = false) {
  const { bikes, winner_index, winner_reason, yes_no, verdict, differences } = data;
  const container = document.getElementById('results');
  container.classList.add('show');

  container.innerHTML = `
    ${buildHero(bikes, winner_index, winner_reason)}
    ${buildDifferencesHighlight(bikes, differences)}
    ${buildSpecs(bikes, winner_index)}
    ${buildCosts(bikes, winner_index)}
    ${buildYesNo(bikes, yes_no)}
    ${buildVerdict(verdict)}
    ${buildShareSave(data)}
    ${buildRatingWidget()}
    ${buildReset(isSuggest)}
  `;

  // Wire save button
  container.querySelector('#saveResultBtn')?.addEventListener('click', () => {
    saveResult(data);
  });

  // Wire share button
  container.querySelector('#shareBtn')?.addEventListener('click', () => {
    handleShare(data);
  });

  // Sticky comparison header
  initStickyHeader(bikes, winner_index);

  // Animate bar fills
  requestAnimationFrame(() => {
    container.querySelectorAll('.bar-fill[data-pct]').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  });

  initRating();
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Sticky header ─────────────────────────────────────────────────────────────

function initStickyHeader(bikes, winner_index) {
  let sticky = document.getElementById('stickyCompareBar');
  if (!sticky) {
    sticky = document.createElement('div');
    sticky.id = 'stickyCompareBar';
    document.body.appendChild(sticky);
  }
  sticky.innerHTML = bikes.map((b, i) => `
    <div class="sticky-bike ${i === winner_index ? 'sticky-winner' : ''}">
      <span class="sticky-name">${b.name}</span>
      <span class="sticky-score">${b.score}/100</span>
    </div>
  `).join('<span class="sticky-vs">vs</span>');

  const results = document.getElementById('results');
  const observer = new IntersectionObserver(([entry]) => {
    sticky.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0 });
  observer.observe(results);
}

// ── Save result ───────────────────────────────────────────────────────────────

function saveResult(data) {
  const entry = saveToGarage({
    bikeNames: data.bikes.map(b => b.name).join(' vs '),
    data,
  });
  playHeartPop();

  // Heart animation
  const btn = document.getElementById('saveResultBtn');
  if (btn) {
    btn.classList.add('heart-pop');
    setTimeout(() => btn.classList.remove('heart-pop'), 700);
  }

  showToast(`Saved to My Garage — "${entry.bikeNames}"`);
  renderGarage();
}

// ── Share ─────────────────────────────────────────────────────────────────────

function handleShare(data) {
  const payload = encodeURIComponent(JSON.stringify({
    bikes: data.bikes.map(b => b.name),
    winner: data.bikes[data.winner_index]?.name,
    verdict: data.verdict,
  }));
  const url = `${location.origin}${location.pathname}?share=${payload}`;

  navigator.clipboard.writeText(url).then(() => {
    playChime();
    const btn = document.getElementById('shareBtn');
    if (btn) {
      btn.classList.add('share-burst');
      btn.textContent = 'Link Copied!';
      setTimeout(() => {
        btn.classList.remove('share-burst');
        btn.textContent = 'Share Result';
      }, 2200);
    }
  }).catch(() => {
    prompt('Copy this link:', url);
  });
}

// ── Builder: Hero ─────────────────────────────────────────────────────────────

function buildHero(bikes, winner_index, winner_reason) {
  const cols = bikes.length === 3
    ? 'grid-template-columns: 1fr 40px 1fr 40px 1fr'
    : 'grid-template-columns: 1fr 40px 1fr';

  let cards = '';
  bikes.forEach((bike, i) => {
    const isW = i === winner_index;
    const pct = bike.score;
    const circumference = 2 * Math.PI * 28;
    const offset = circumference - (pct / 100) * circumference;
    cards += `
      <div class="bike-hero-card ${isW ? 'is-winner' : ''}">
        ${isW ? '<div class="winner-label">Top Pick</div>' : ''}
        <div class="bike-hero-name">${bike.name}</div>
        <div class="score-dial">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" stroke-width="5"/>
            <circle cx="32" cy="32" r="28"
              stroke="${isW ? '#4176e8' : '#6b7a92'}"
              stroke-width="5"
              stroke-linecap="round"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"
              transform="rotate(-90 32 32)"
              style="transition: stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)"/>
          </svg>
          <div class="score-number">${bike.score}</div>
        </div>
        <div class="score-sub">out of 100</div>
        ${bike.key_strength ? `<div class="hero-strength">${bike.key_strength}</div>` : ''}
      </div>`;
    if (i < bikes.length - 1) cards += '<div class="vs-col"><div class="vs-text">vs</div></div>';
  });

  return `
    <div class="compare-hero result-block">
      <div class="compare-hero-label">AI Comparison Result</div>
      <div class="compare-bikes-row" style="${cols};">${cards}</div>
      <div class="winner-reason-bar">
        Top pick rationale: <strong>${winner_reason}</strong>
      </div>
    </div>`;
}

// ── Builder: Key Differences (yellow highlight) ───────────────────────────────

function buildDifferencesHighlight(bikes, differences) {
  if (!differences || !differences.length) return '';
  const rows = differences.map(d => `
    <div class="diff-row">
      <div class="diff-spec">${d.spec}</div>
      <div class="diff-verdict highlight-yellow">${d.verdict}</div>
    </div>
  `).join('');
  return `
    <div class="chart-panel result-block">
      <div class="panel-title">Key Differences</div>
      <div class="diff-list">${rows}</div>
    </div>`;
}

// ── Builder: Specs ────────────────────────────────────────────────────────────

function buildSpecs(bikes, winner_index) {
  const headers = `<tr>
    <th>Specification</th>
    ${bikes.map(b => `<th>${b.name}</th>`).join('')}
  </tr>`;

  // Determine which cell "wins" per spec row for numeric-parseable specs
  const specRows = Object.entries(SPEC_KEYS).map(([key, label]) => {
    const vals = bikes.map(b => b.specs?.[key] || '—');
    const tooltip = SPEC_TOOLTIPS[key] || '';
    const cells = vals.map((v, i) => {
      const isW = i === winner_index;
      return `<td class="spec-val ${isW ? 'spec-winner' : ''}" data-label="${label}">${v}</td>`;
    }).join('');
    return `<tr>
      <td class="spec-label">
        ${label}
        ${tooltip ? `<span class="tooltip" data-tip="${tooltip}">?</span>` : ''}
      </td>
      ${cells}
    </tr>`;
  }).join('');

  const metaRows = META_KEYS.map(([key, label]) => {
    const tooltip = META_TOOLTIPS[key] || '';
    const cells = bikes.map((b, i) => {
      const isW = i === winner_index;
      return `<td class="spec-val ${isW ? 'spec-winner' : ''}">${b[key] || '—'}</td>`;
    }).join('');
    return `<tr>
      <td class="spec-label">
        ${label}
        ${tooltip ? `<span class="tooltip" data-tip="${tooltip}">?</span>` : ''}
      </td>
      ${cells}
    </tr>`;
  }).join('');

  return `
    <div class="chart-panel result-block">
      <div class="panel-title">Full Specifications</div>
      <div class="table-scroll">
        <table class="spec-table">${headers}${specRows}${metaRows}</table>
      </div>
    </div>`;
}

// ── Builder: Costs ────────────────────────────────────────────────────────────

function buildCosts(bikes, winner_index) {
  const cards = bikes.map((bike, i) => {
    const isW = i === winner_index;
    return `
      <div class="cost-card ${isW ? 'is-winner' : ''}">
        ${isW ? '<div class="cost-winner-flag">Best Value</div>' : ''}
        <div class="cost-bike-name">${bike.name}</div>
        <div class="cost-total-val">${bike.total_monthly_cost}</div>
        <div class="cost-total-sub">Total monthly cost</div>
        <div class="cost-items">
          <div class="cost-item"><div class="cost-item-label">EMI (3yr)</div><div class="cost-item-val">${bike.emi || '—'}</div></div>
          <div class="cost-item"><div class="cost-item-label">Fuel / month</div><div class="cost-item-val">${bike.fuel_cost_month}</div></div>
          <div class="cost-item"><div class="cost-item-label">Service / year</div><div class="cost-item-val">${bike.service_cost_year}</div></div>
          <div class="cost-item"><div class="cost-item-label">Insurance / yr</div><div class="cost-item-val">${bike.insurance_year}</div></div>
        </div>
        <div class="cost-salary-note">Recommended salary: <strong>${bike.salary_needed}</strong></div>
      </div>`;
  }).join('');

  return `
    <div class="result-block">
      <div class="panel-title" style="padding: 0 0 14px 0;">Monthly Cost Breakdown</div>
      <div class="cost-grid-wrap" style="grid-template-columns: repeat(${bikes.length}, 1fr);">
        ${cards}
      </div>
    </div>`;
}

// ── Builder: Yes/No ───────────────────────────────────────────────────────────

function buildYesNo(bikes, yes_no) {
  if (!yes_no || !yes_no.length) return '';
  const rows = yes_no.map(item => {
    const answers = bikes.map((b, i) => {
      const isYes = item.yes_index === i;
      return `
        <div class="yesno-answer">
          <span class="yesno-bike-name">${b.name.split(' ').slice(-2).join(' ')}</span>
          <span class="${isYes ? 'badge-yes' : 'badge-no'}">${isYes ? 'YES' : 'NO'}</span>
        </div>`;
    }).join('');
    return `
      <div class="yesno-row">
        <div class="yesno-question">${item.question}</div>
        <div class="yesno-answers">${answers}</div>
      </div>`;
  }).join('');

  return `
    <div class="chart-panel result-block">
      <div class="panel-title">Quick Answers</div>
      <div class="yesno-list">${rows}</div>
    </div>`;
}

// ── Builder: Verdict ──────────────────────────────────────────────────────────

function buildVerdict(verdict) {
  return `
    <div class="verdict-card result-block">
      <div class="verdict-stripe"></div>
      <div>
        <div class="verdict-label">AI Verdict</div>
        <div class="verdict-text">${verdict}</div>
      </div>
    </div>`;
}

// ── Builder: Save + Share ─────────────────────────────────────────────────────

function buildShareSave(data) {
  return `
    <div class="action-row result-block">
      <button class="btn btn-primary" id="saveResultBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        Save to Garage
      </button>
      <button class="btn btn-ghost" id="shareBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        Share Result
      </button>
    </div>`;
}

// ── Builder: Star rating ──────────────────────────────────────────────────────

function buildRatingWidget() {
  return `
    <div class="rating-widget result-block">
      <div class="panel-title">Rate Your Experience</div>
      <div id="starRating" class="star-row">
        ${[1,2,3,4,5].map(n => `<button class="star" data-n="${n}" aria-label="${n} star">★</button>`).join('')}
      </div>
      <div id="ratingMsg" class="rating-msg"></div>
    </div>`;
}

// ── Builder: Reset ────────────────────────────────────────────────────────────

function buildReset(isSuggest) {
  return `<div style="text-align:center; margin-top:24px; margin-bottom:12px;">
    <button class="btn btn-ghost" id="resetBtn">
      ${isSuggest ? 'Try Another Budget' : 'Compare Again'}
    </button>
  </div>`;
}

// ── Reset all ─────────────────────────────────────────────────────────────────

export function resetAll() {
  const results = document.getElementById('results');
  results.classList.remove('show');
  results.innerHTML = '';

  const sticky = document.getElementById('stickyCompareBar');
  if (sticky) sticky.classList.remove('visible');

  [0, 1, 2].forEach(i => {
    const inp = document.getElementById(`bike${i}`);
    if (inp) inp.value = '';
    document.getElementById(`bikeCard${i}`)?.classList.remove('filled');
  });

  document.getElementById('thirdBikeWrap').style.display = 'none';
  document.getElementById('addThirdBtn').style.display = 'inline-flex';

  const stateEl = document.getElementById('stateSelect');
  if (stateEl) stateEl.value = '';
  const cityEl = document.getElementById('citySelect');
  if (cityEl) cityEl.innerHTML = '<option value="">Select City</option>';

  document.querySelectorAll('#prefChips .chip.active').forEach(c => c.classList.remove('active'));
  const cp = document.getElementById('customPref');
  if (cp) cp.value = '';

  const km = document.getElementById('kmSlider');
  if (km) { km.value = CONFIG.KM_DEFAULT; document.getElementById('kmVal').textContent = `${CONFIG.KM_DEFAULT} km/day`; }
  const sal = document.getElementById('salarySlider');
  if (sal) { sal.value = CONFIG.SALARY_DEFAULT; document.getElementById('salaryVal').textContent = `₹${Number(CONFIG.SALARY_DEFAULT).toLocaleString('en-IN')}`; }

  document.getElementById('errorBox')?.classList.remove('show');
  window.scrollTo({ behavior: 'smooth', top: 0 });
}

export function resetSuggest() {
  const results = document.getElementById('results');
  results.classList.remove('show');
  results.innerHTML = '';
  document.querySelectorAll('#suggestPrefChips .chip.active').forEach(c => c.classList.remove('active'));
  const cp = document.getElementById('suggestCustomPref');
  if (cp) cp.value = '';
  const sticky = document.getElementById('stickyCompareBar');
  if (sticky) sticky.classList.remove('visible');
  window.scrollTo({ behavior: 'smooth', top: 0 });
}
