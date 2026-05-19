/**
 * api.js — browser-side HTTP layer.
 * Talks ONLY to our own Vercel function at /api/compare.
 * The Groq API key is NEVER in the browser.
 */
import { CONFIG } from './config.js';

export async function fetchComparison(prompt) {
  let res;
  try {
    res = await fetch(CONFIG.API_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ prompt }),
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Server error ${res.status}. Please try again.`);
  }

  const data = await res.json();
  let raw = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
  raw = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('AI returned an unexpected format. Please try again.');
  }
}
