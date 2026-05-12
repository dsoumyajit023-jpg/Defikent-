/**
 * compare.js — orchestration module.
 */

import { buildPrompt, buildSuggestPrompt } from './prompt.js';
import { fetchComparison } from './api.js';
import { showError, setLoading, renderResults } from './ui.js';
import { playRevSound } from './sounds.js';

export async function compareNow(selectedPrefs) {
  const b0 = document.getElementById('bike0')?.value.trim() || '';
  const b1 = document.getElementById('bike1')?.value.trim() || '';
  const b2 = document.getElementById('bike2')?.value.trim() || '';

  if (!b0 || !b1) {
    showError('Please enter at least 2 bike models to compare.');
    return;
  }

  const bikes    = b2 ? [b0, b1, b2] : [b0, b1];
  const state    = document.getElementById('stateSelect')?.value || '';
  const city     = document.getElementById('citySelect')?.value || '';
  const customPref = document.getElementById('customPref')?.value.trim() || '';
  const kmDay    = document.getElementById('kmSlider')?.value || '50';
  const salary   = document.getElementById('salarySlider')?.value || '40000';
  const location = city && state ? `${city}, ${state}` : state || 'India';
  const prefList = selectedPrefs.size > 0 ? Array.from(selectedPrefs).join(', ') : 'general riding';

  const prompt = buildPrompt({ bikes, location, kmDay, salary, prefList, customPref });

  playRevSound();
  setLoading(true);

  try {
    const result = await fetchComparison(prompt);
    renderResults(result, false);
  } catch (err) {
    showError(err.message);
    console.error('[Defikent] compare error:', err);
  } finally {
    setLoading(false);
  }
}

export async function suggestNow(selectedPrefs) {
  const budget   = document.getElementById('budgetSlider')?.value || CONFIG.BUDGET_DEFAULT;
  const state    = document.getElementById('suggestState')?.value || '';
  const city     = document.getElementById('suggestCity')?.value || '';
  const customPref = document.getElementById('suggestCustomPref')?.value.trim() || '';
  const prefList = selectedPrefs.size > 0 ? Array.from(selectedPrefs).join(', ') : 'general riding';
  const location = city && state ? `${city}, ${state}` : state || 'India';

  const prompt = buildSuggestPrompt({ budget, prefList, location, customPref });

  playRevSound();
  setLoading(true);

  try {
    const result = await fetchComparison(prompt);
    renderResults(result, true);
  } catch (err) {
    showError(err.message);
    console.error('[Defikent] suggest error:', err);
  } finally {
    setLoading(false);
  }
}
