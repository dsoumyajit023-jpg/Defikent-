/**
 * compare.js
 * Orchestration: reads form state → builds prompt → calls API → renders result.
 * No DOM styling, no raw fetch, no hardcoded strings.
 */

import { buildPrompt } from './prompt.js';
import { fetchComparison } from './api.js';
import { showError, setLoading, renderResults } from './ui.js';

/**
 * Entry point wired to the Compare button.
 * @param {Set<string>} selectedPrefs - live reference from ui.initPreferenceChips()
 */
export async function compareNow(selectedPrefs) {
  // ── 1. Collect inputs ──────────────────────────────────────────────────────
  const b0 = document.getElementById('bike0')?.value.trim() || '';
  const b1 = document.getElementById('bike1')?.value.trim() || '';
  const b2 = document.getElementById('bike2')?.value.trim() || '';

  if (!b0 || !b1) {
    showError('Please enter at least 2 bike models.');
    return;
  }

  const bikes = b2 ? [b0, b1, b2] : [b0, b1];
  const state      = document.getElementById('stateSelect')?.value || '';
  const city       = document.getElementById('citySelect')?.value || '';
  const customPref = document.getElementById('customPref')?.value.trim() || '';
  const kmDay      = document.getElementById('kmSlider')?.value || '50';
  const salary     = document.getElementById('salarySlider')?.value || '40000';

  const location = city && state ? `${city}, ${state}` : state || 'India';
  const prefList = selectedPrefs.size > 0
    ? Array.from(selectedPrefs).join(', ')
    : 'general riding';

  // ── 2. Build prompt ────────────────────────────────────────────────────────
  const prompt = buildPrompt({ bikes, location, kmDay, salary, prefList, customPref });

  // ── 3. Show loading ────────────────────────────────────────────────────────
  setLoading(true);

  // ── 4. Call API & render ───────────────────────────────────────────────────
  try {
    const result = await fetchComparison(prompt);
    renderResults(result);
  } catch (err) {
    showError(err.message);
    console.error('[Defikent] compare error:', err);
  } finally {
    setLoading(false);
  }
}

