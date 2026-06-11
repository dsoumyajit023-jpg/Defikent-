import { CONFIG, SPEC_KEYS, SPEC_TOOLTIPS, META_KEYS, META_TOOLTIPS, PREFERENCES } from './config.js';
import { CITIES, STATES, BIKE_LIST } from './data.js';
import { saveToGarage, getGarage, deleteFromGarage } from './garage.js';
import { playClick, playHeartPop, playChime, playNotify } from './sounds.js';

/* ── Splash ──────────────────────────────────────────────────────────────── */
export function initSplash() {
  const hide = () => {
    const s = document.getElementById('splash');
    if (!s) return;
    s.classList.add('hide');
    setTimeout(() => s.remove(), CONFIG.SPLASH_FADE);
  };
  if (document.readyState === 'complete') {
    setTimeout(hide, CONFIG.SPLASH_DELAY);
  } else {
    window.addEventListener('load', () => setTimeout(hide, CONFIG.SPLASH_DELAY));
  }
}

/* ── Sound toggle ────────────────────────────────────────────────────────── */
export function initSoundToggle(setSoundEnabled, loadSoundPref) {
  const btn = document.getElementById('soundToggle');
  let on = loadSoundPref();
  syncSoundBtn(btn, on);
  btn?.addEventListener('click', () => {
    on = !on;
    setSoundEnabled(on);
    syncSoundBtn(btn, on);
  });
}
function syncSoundBtn(btn, on) {
  if (btn) btn.textContent = on ? 'Sound On' : 'Sound Off';
}

/* ── Location dropdowns ──────────────────────────────────────────────────── */
export function initLocationDropdowns() {
  const el = document.getElementById('stateSelect');
  STATES.forEach(s => { const o = document.createElement('option'); o.value = o.textContent = s; el.appendChild(o); });
  el.addEventListener('change', () => fillCities('citySelect', el.value));
}

function fillCities(id, state) {
  const el = document.getElementById(id);
  el.innerHTML = '<option value="">Select City</option>';
  (CITIES[state] || []).forEach(c => { const o = document.createElement('option'); o.value = o.textContent = c; el.appendChild(o); });
}

/* ── Preference chips ────────────────────────────────────────────────────── */
export function initPreferenceChips(containerId = 'prefChips') {
  const wrap = document.getElementById(containerId);
  if (!wrap) return new Set();
  wrap.innerHTML = '';
  const sel = new Set();
  PREFERENCES.forEach(({ key, label }) => {
    const d = document.createElement('div');
    d.className = 'chip'; d.textContent = label;
    d.addEventListener('click', () => {
      d.classList.toggle('active');
      sel.has(key) ? sel.delete(key) : sel.add(key);
      playClick();
    });
    wrap.appendChild(d);
  });
  return sel;
}

/* ── Sliders ─────────────────────────────────────────────────────────────── */
export function initSliders() {
  wire('kmSlider',     'kmVal',     CONFIG.KM_MIN,     CONFIG.KM_MAX,     CONFIG.KM_DEFAULT,     v => `${v} km/day`);
  wire('salarySlider', 'salaryVal', CONFIG.SALARY_MIN, CONFIG.SALARY_MAX, CONFIG.SALARY_DEFAULT, v => `Rs ${Number(v).toLocaleString('en-IN')}`, CONFIG.SALARY_STEP);
}
export function initBudgetSlider() {
  wire('budgetSlider', 'budgetVal', CONFIG.BUDGET_MIN, CONFIG.BUDGET_MAX, CONFIG.BUDGET_DEFAULT, v => `Rs ${Number(v).toLocaleString('en-IN')}`, CONFIG.BUDGET_STEP);
}
function wire(sliderId, valId, min, max, def, fmt, step) {
  const sl = document.getElementById(sliderId); if (!sl) return;
  const vl = document.getElementById(valId);
  sl.min = min; sl.max = max; sl.value = def; if (step) sl.step = step;
  vl.textContent = fmt(def);
  sl.addEventListener('input', () => { vl.textContent = fmt(sl.value); });
}
function attachAutocomplete(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const wrap = input.parentElement;
  wrap.style.position = 'relative';

  const drop = document.createElement('div');
  drop.className = 'bike-dropdown';
  wrap.appendChild(drop);

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    drop.innerHTML = '';
    if (!val || val.length < 2) { drop.style.display = 'none'; return; }
    const matches = BIKE_LIST.filter(b => b.toLowerCase().includes(val)).slice(0, 6);
    if (!matches.length) { drop.style.display = 'none'; return; }
    matches.forEach(bike => {
      const item = document.createElement('div');
      item.className = 'bike-dropdown-item';
      item.textContent = bike;
      item.addEventListener('mousedown', () => {
        input.value = bike;
        drop.style.display = 'none';
        input.dispatchEvent(new Event('input'));
      });
      drop.appendChild(item);
    });
    drop.style.display = 'block';
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { drop.style.display = 'none'; }, 150);
  });
  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) input.dispatchEvent(new Event('input'));
  });
}
/* ── Bike cards ──────────────────────────────────────────────────────────── */
export function initBikeCards() {
  [0, 1, 2].forEach(i => {
    const input = document.getElementById(`bike${i}`);
    if (!input) return;
    input.addEventListener('input', () => {
      markFilled(i);
      // Clear results when user edits any bike name
      const results = document.getElementById('results');
      if (results) { results.classList.remove('show'); results.innerHTML = ''; }
      const stickyBar = document.getElementById('stickyBar');
      if (stickyBar) stickyBar.classList.remove('visible');
    });
 input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        });
  });

  // Autocomplete for all bike inputs
  attachAutocomplete('bike0');
  attachAutocomplete('bike1');
  attachAutocomplete('bike2');
  attachAutocomplete('profileBike');

  document.getElementById('addThirdBtn')
      }
      }
    });
  });

  // Suggest mode enter key
  document.getElementById('suggestCustomPref')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('suggestBtn')?.click();
    }
  });
  document.getElementById('addThirdBtn')?.addEventListener('click', () => {
    document.getElementById('thirdBikeWrap').style.display = 'block';
    document.getElementById('addThirdBtn').style.display = 'none';
  });
  document.getElementById('removeThirdBtn')?.addEventListener('click', () => {
    document.getElementById('thirdBikeWrap').style.display = 'none';
    document.getElementById('addThirdBtn').style.display = 'inline-flex';
    const inp = document.getElementById('bike2'); if (inp) inp.value = '';
    markFilled(2);
  });
}
function markFilled(i) {
  const v = document.getElementById(`bike${i}`)?.value.trim() || '';
  document.getElementById(`bikeCard${i}`)?.classList.toggle('filled', v.length > 0);
}

/* ── Tabs ────────────────────────────────────────────────────────────────── */
export function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
      playClick();
      // Clear results and sticky bar when switching tabs
      const results = document.getElementById('results');
      if (results) { results.classList.remove('show'); results.innerHTML = ''; }
      const stickyBar = document.getElementById('stickyBar');
      if (stickyBar) stickyBar.classList.remove('visible');
      const errorBox = document.getElementById('errorBox');
      if (errorBox) errorBox.classList.remove('show');
    });
  });
}

/* ── Error ───────────────────────────────────────────────────────────────── */
export function showError(msg) {
  const el = document.getElementById('errorBox'); if (!el) return;
  el.innerHTML = `<strong>Oops! No bike found.</strong> ${msg} — Please wait a few minutes before you try again later!.`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), CONFIG.ERROR_DISMISS);
}

/* ── Loading: wheel spinner → skeleton ───────────────────────────────────── */
export function setLoading(on) {
  const ld = document.getElementById('loading');
  const rs = document.getElementById('results');
  if (on) {
    ld.classList.add('show');
    rs.classList.remove('show'); rs.innerHTML = '';
    ld._skTimer = setTimeout(() => {
      if (!ld.classList.contains('show')) return;
      ld.querySelector('.wheel-spinner').style.display = 'none';
      let sk = ld.querySelector('.skeleton-wrap');
      if (!sk) {
        sk = document.createElement('div'); sk.className = 'skeleton-wrap';
        sk.innerHTML = `
          <div class="skel skel-title"></div>
          <div class="skel-row"><div class="skel skel-card"></div><div class="skel skel-card"></div></div>
          <div class="skel skel-bar"></div>
          <div class="skel skel-bar short"></div>
          <div class="skel skel-bar"></div>`;
        ld.appendChild(sk);
      }
    }, 2000);
  } else {
    clearTimeout(ld._skTimer);
    ld.classList.remove('show');
    const sk = ld.querySelector('.skeleton-wrap'); if (sk) sk.remove();
    const ws = ld.querySelector('.wheel-spinner'); if (ws) ws.style.display = '';
  }
}

/* ── Toast ───────────────────────────────────────────────────────────────── */
export function showToast(msg) {
  let t = document.getElementById('toastBar');
  if (!t) { t = document.createElement('div'); t.id = 'toastBar'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show'); playNotify();
  clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── Star rating ─────────────────────────────────────────────────────────── */
export function initRating() {
  const wrap = document.getElementById('starRating'); if (!wrap) return;
  const stars = wrap.querySelectorAll('.star');

  async function loadAverage() {
    try {
      const data = await fetch('/api/rating').then(r => r.json());
      return data;
    } catch { return null; }
  }

  async function saveRating(star) {
    try {
      const ipData = await fetch('https://api.ipify.org?format=json').then(r => r.json()).catch(() => ({ ip: 'unknown' }));
      const data = await fetch('/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ star, ip: ipData.ip })
      }).then(r => r.json());
      return data.average;
    } catch { return null; }
  }

  let picked = parseInt(localStorage.getItem('dk_rating') || '0');

  loadAverage().then(data => {
    if (data && data.count > 0) {
      const avg = document.getElementById('ratingAvg');
      if (avg) avg.textContent = `Average: ${data.average} / 5 (${data.count} ratings)`;
    }
  });

  paintStars(stars, picked - 1);
  if (picked > 0) stars.forEach(s => s.disabled = true);

  stars.forEach((s, i) => {
    s.addEventListener('mouseenter', () => paintStars(stars, i));
    s.addEventListener('mouseleave', () => paintStars(stars, picked - 1));
    s.addEventListener('click', async () => {
      picked = i + 1;
      paintStars(stars, i);
      playChime();
      const msgs = ['', 'We will improve!', 'Thanks for the feedback!', 'Glad you like it!', 'Awesome — thank you!', 'You made our day!'];
      const m = document.getElementById('ratingMsg');
      if (m) { m.textContent = msgs[picked]; m.classList.add('show'); }
      localStorage.setItem('dk_rating', picked);
      stars.forEach(s => s.disabled = true);
      const avg = await saveRating(picked);
      const avgEl = document.getElementById('ratingAvg');
      if (avgEl && avg) avgEl.textContent = `Average: ${avg} / 5`;
    });
  });
}
function paintStars(stars, upTo) { stars.forEach((s, i) => s.classList.toggle('active', i <= upTo)); }
/* ── Garage ──────────────────────────────────────────────────────────────── */
export function renderGarage() {
  const wrap = document.getElementById('garageList'); if (!wrap) return;
  const items = getGarage();
  if (!items.length) { wrap.innerHTML = '<p class="garage-empty">Your garage is empty. Save a comparison to see it here.</p>'; return; }
  wrap.innerHTML = items.map(it => `
    <div class="garage-item" data-id="${it.id}">
      <div class="garage-item-names">${it.bikeNames || 'Comparison'}</div>
      <div class="garage-item-date">${it.savedAt}</div>
      <div class="garage-item-actions">
        <button class="btn btn-ghost btn-sm garage-del" data-id="${it.id}" style="color:var(--red)">Delete</button>
      </div>
    </div>`).join('');
  wrap.querySelectorAll('.garage-del').forEach(b => b.addEventListener('click', () => {
    deleteFromGarage(Number(b.dataset.id)); renderGarage(); playClick();
  }));
}

/* ── Render results ──────────────────────────────────────────────────────── */
export function renderResults(data, mode = 'compare') {
  const { bikes, winner_index, winner_reason, yes_no, verdict, differences } = data;
  const box = document.getElementById('results');
  box.classList.add('show');
  box.innerHTML =
    buildHero(bikes, winner_index, winner_reason, mode) +
    buildDifferences(differences) +
    buildSpecs(bikes, winner_index) +
    buildCosts(bikes, winner_index) +
    buildYesNo(bikes, yes_no) +
    buildVerdict(verdict) +
    buildActions() +
    buildRatingWidget() +
    buildReset(mode);

  const saveBtn = box.querySelector('#saveResultBtn');
  const shareBtn = box.querySelector('#shareBtn');
  if (saveBtn) saveBtn.addEventListener('click', () => doSave(data), { once: true });
  if (shareBtn) shareBtn.addEventListener('click', () => doShare(data));
  initStickyBar(bikes, winner_index);
  initRating();
setTimeout(() => {
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 100);
}

/* ── Sticky comparison bar ───────────────────────────────────────────────── */
function initStickyBar(bikes, wi) {
  let bar = document.getElementById('stickyBar');
  if (!bar) { bar = document.createElement('div'); bar.id = 'stickyBar'; document.body.appendChild(bar); }
  bar.innerHTML = bikes.map((b, i) => `
    <div class="sticky-bike ${i === wi ? 'sticky-winner' : ''}">
      <span class="sticky-name">${b.name}</span>
      <span class="sticky-score">${b.score}/100</span>
    </div>`).join('<span class="sticky-vs">vs</span>');
  const results = document.getElementById('results');
  const hero = document.querySelector('.compare-hero');
  new IntersectionObserver(([e]) => bar.classList.toggle('visible', !e.isIntersecting), { threshold: 0.1 })
    .observe(hero || results);
}

/* ── Save ────────────────────────────────────────────────────────────────── */
function doSave(data) {
  const entry = saveToGarage({ bikeNames: data.bikes.map(b => b.name).join(' vs '), data });
  playHeartPop();
  const btn = document.getElementById('saveResultBtn');
  if (btn) { btn.classList.add('heart-pop'); setTimeout(() => btn.classList.remove('heart-pop'), 700); }
  showToast(`Added to My Garage — "${entry.bikeNames}"`);
  renderGarage();
}

/* ── Share ───────────────────────────────────────────────────────────────── */
function doShare(data) {
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
      btn.classList.add('share-burst'); btn.textContent = 'Link Copied!';
      setTimeout(() => { btn.classList.remove('share-burst'); btn.textContent = 'Share Result'; }, 2400);
    }
  }).catch(() => prompt('Copy this link:', url));
}

/* ════════════════════════ HTML builders ════════════════════════ */

function buildHero(bikes, wi, reason, mode) {
  const cols = bikes.length === 3 ? '1fr 44px 1fr 44px 1fr' : '1fr 44px 1fr';
  const cards = bikes.map((b, i) => {
    const isW = i === wi;
    const C   = 2 * Math.PI * 28;
    const off = C - (b.score / 100) * C;
    return `
      <div class="bike-hero-card${isW ? ' is-winner' : ''}">
        ${isW && mode !== 'profile' ? '<div class="winner-label">Top Pick</div>' : ''}
        <div class="bike-hero-name">${b.name}</div>
        <div class="score-dial">
          <svg viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.10)" stroke-width="5"/>
            <circle cx="32" cy="32" r="28"
              stroke="${isW ? '#4176e8' : '#6b7a92'}" stroke-width="5" stroke-linecap="round"
              stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"
              transform="rotate(-90 32 32)"/>
          </svg>
          <div class="score-number">${b.score}</div>
        </div>
        <div class="score-sub">out of 100</div>
        ${b.key_strength ? `<div class="hero-tag">${b.key_strength}</div>` : ''}
      </div>`;
  }).join('<div class="vs-col"><span class="vs-text">vs</span></div>');

  return `
    <div class="compare-hero result-block">
      <div class="compare-bikes-row" style="grid-template-columns:${cols};justify-items:center">${cards}</div>
      ${reason ? `<div class="hero-reason">Top pick rationale: <strong>${reason}</strong></div>` : ''}
    </div>`;
}

function buildDifferences(diffs) {
  if (!diffs?.length) return '';
  return `
    <div class="panel result-block">
      <div class="panel-title">Key Differences</div>
      <div class="diff-list">
        ${diffs.map(d => `
          <div class="diff-row">
            <div class="diff-spec">${d.spec}</div>
            <div class="diff-verdict hl-yellow">${d.verdict}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

function buildSpecs(bikes, wi) {
  const ths = bikes.map(b => `<th>${b.name}</th>`).join('');
  const specRows = Object.entries(SPEC_KEYS).map(([k, label]) => {
    const tip = SPEC_TOOLTIPS[k] ? `<span class="tip" data-tip="${SPEC_TOOLTIPS[k]}">?</span>` : '';
    const tds = bikes.map((b, i) =>
      `<td class="${i === wi ? 'spec-winner' : ''}">${b.specs?.[k] || '—'}</td>`).join('');
    return `<tr><td class="spec-label-cell">${label}${tip}</td>${tds}</tr>`;
  }).join('');
  const metaRows = META_KEYS.map(([k, label]) => {
    const tip = META_TOOLTIPS[k] ? `<span class="tip" data-tip="${META_TOOLTIPS[k]}">?</span>` : '';
    const tds = bikes.map((b, i) =>
      `<td class="${i === wi ? 'spec-winner' : ''}">${b[k] || '—'}</td>`).join('');
    return `<tr><td class="spec-label-cell">${label}${tip}</td>${tds}</tr>`;
  }).join('');
  return `
    <div class="panel result-block">
      <div class="panel-title">Full Specifications</div>
      <div class="table-scroll">
        <table class="spec-table">
          <thead><tr><th>Specification</th>${ths}</tr></thead>
          <tbody>${specRows}${metaRows}</tbody>
        </table>
      </div>
    </div>`;
}

function buildCosts(bikes, wi) {
  const cards = bikes.map((b, i) => {
    const isW = i === wi;
    return `
      <div class="cost-card${isW ? ' is-winner' : ''}">
        ${isW ? '<div class="cost-flag">Best Value</div>' : ''}
        <div class="cost-bike">${b.name}</div>
        <div class="cost-total">${b.total_monthly_cost}</div>
        <div class="cost-sub">Total monthly cost</div>
        <div class="cost-items">
          <div class="cost-item"><div class="ci-label">EMI (3yr)</div><div class="ci-val">${b.emi || '—'}</div></div>
          <div class="cost-item"><div class="ci-label">Fuel / month</div><div class="ci-val">${b.fuel_cost_month}</div></div>
          <div class="cost-item"><div class="ci-label">Service / yr</div><div class="ci-val">${b.service_cost_year}</div></div>
          <div class="cost-item"><div class="ci-label">Insurance / yr</div><div class="ci-val">${b.insurance_year}</div></div>
        </div>
        <div class="cost-salary">Recommended salary: <strong>${b.salary_needed}</strong></div>
      </div>`;
  }).join('');
  return `
    <div class="result-block">
      <div class="panel-title" style="margin-bottom:14px">Monthly Cost Breakdown</div>
      <div class="cost-grid" style="grid-template-columns:repeat(${bikes.length},1fr)">${cards}</div>
    </div>`;
}

function buildYesNo(bikes, yes_no) {
  if (!yes_no?.length) return '';
  const rows = yes_no.map(item => {
    const answers = bikes.map((b, i) => {
      const isY = item.yes_index === i;
      return `
        <div class="yn-answer">
          <span class="yn-bike">${b.name.split(' ').slice(-2).join(' ')}</span>
          <span class="${isY ? 'badge-yes' : 'badge-no'}">${isY ? 'YES' : 'NO'}</span>
        </div>`;
    }).join('');
    return `
      <div class="yn-row">
        <div class="yn-q">${item.question}</div>
        <div class="yn-answers">${answers}</div>
      </div>`;
  }).join('');
  return `
    <div class="panel result-block">
      <div class="panel-title">Quick Answers</div>
      <div class="yn-list">${rows}</div>
    </div>`;
}

function buildVerdict(verdict) {
  return `
    <div class="verdict-card result-block">
      <div class="verdict-bar"></div>
      <div>
        <div class="verdict-label">AI Verdict</div>
        <div class="verdict-text">${verdict}</div>
      </div>
    </div>`;
}

function buildActions() {
  return `
    <div class="action-row result-block">
      <button class="btn btn-ghost" id="shareBtn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Share Result
      </button>
    </div>`;
}

function buildRatingWidget() {
  return `
    <div class="panel rating-widget result-block" style="text-align:center">
      <div class="panel-title">Rate Your Experience</div>
      <div id="starRating" class="star-row">
        ${[1,2,3,4,5].map(n => `<button class="star" aria-label="${n} star">★</button>`).join('')}
      </div>
      <div id="ratingMsg" class="rating-msg"></div>
      <div id="ratingAvg" style="font-size:12px;color:var(--muted);margin-top:6px"></div>
    </div>`;
}

function buildReset(mode) {
  return `
    <div style="text-align:center;margin:24px 0 12px">
      <button class="btn btn-ghost" id="resetBtn">${mode === 'suggest' ? 'Try Another Budget' : mode === 'profile' ? 'Explore Another Bike' : 'Compare Again'}</button>
    </div>`;
}

/* ── Reset all ───────────────────────────────────────────────────────────── */
export function resetAll() {
  const r = document.getElementById('results'); r.classList.remove('show'); r.innerHTML = '';
  document.getElementById('stickyBar')?.classList.remove('visible');
  [0,1,2].forEach(i => { const inp = document.getElementById(`bike${i}`); if(inp) inp.value=''; document.getElementById(`bikeCard${i}`)?.classList.remove('filled'); });
  document.getElementById('thirdBikeWrap').style.display = 'none';
  document.getElementById('addThirdBtn').style.display   = 'inline-flex';
  document.getElementById('stateSelect').value = '';
  document.getElementById('citySelect').innerHTML = '<option value="">Select City</option>';
  document.querySelectorAll('#prefChips .chip.active').forEach(c => c.classList.remove('active'));
  const cp = document.getElementById('customPref'); if(cp) cp.value = '';
  wire('kmSlider',     'kmVal',     CONFIG.KM_MIN,     CONFIG.KM_MAX,     CONFIG.KM_DEFAULT,     v => `${v} km/day`);
  wire('salarySlider', 'salaryVal', CONFIG.SALARY_MIN, CONFIG.SALARY_MAX, CONFIG.SALARY_DEFAULT, v => `Rs ${Number(v).toLocaleString('en-IN')}`, CONFIG.SALARY_STEP);
  document.getElementById('errorBox')?.classList.remove('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function resetSuggest() {
  const r = document.getElementById('results'); r.classList.remove('show'); r.innerHTML = '';
  document.getElementById('stickyBar')?.classList.remove('visible');
  document.querySelectorAll('#suggestPrefChips .chip.active').forEach(c => c.classList.remove('active'));
  const cp = document.getElementById('suggestCustomPref'); if(cp) cp.value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
// Profile input enter key
document.getElementById('profileBike')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('profileBtn')?.click();
  }
});
document.getElementById('profileBike')?.addEventListener('input', () => {
  const results = document.getElementById('results');
  if (results) { results.classList.remove('show'); results.innerHTML = ''; }
  const stickyBar = document.getElementById('stickyBar');
  if (stickyBar) stickyBar.classList.remove('visible');
});

// Suggest mode - clear results on any input change
document.getElementById('suggestCustomPref')?.addEventListener('input', () => {
  const results = document.getElementById('results');
  if (results) { results.classList.remove('show'); results.innerHTML = ''; }
  const stickyBar = document.getElementById('stickyBar');
  if (stickyBar) stickyBar.classList.remove('visible');
});

// Budget slider - clear results on change
document.getElementById('budgetSlider')?.addEventListener('input', () => {
  const results = document.getElementById('results');
  if (results) { results.classList.remove('show'); results.innerHTML = ''; }
  const stickyBar = document.getElementById('stickyBar');
  if (stickyBar) stickyBar.classList.remove('visible');
});

// All tabs enter key
document.getElementById('tab-suggest')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('suggestBtn')?.click();
  }
});

document.getElementById('tab-profile')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('profileBtn')?.click();
  }
});

document.getElementById('tab-compare')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('compareBtn')?.click();
  }
});

// Budget slider - clear results on change
document.getElementById('budgetSlider')?.addEventListener('input', () => {
  const results = document.getElementById('results');
  if (results) { results.classList.remove('show'); results.innerHTML = ''; }
  const stickyBar = document.getElementById('stickyBar');
  if (stickyBar) stickyBar.classList.remove('visible');
});
