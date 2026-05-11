/**
 * api.js
 * HTTP layer — talks only to our own Vercel serverless function.
 * The Groq API key is NEVER in the browser; it lives in process.env on the server.
 */

import { CONFIG } from './config.js';

/**
 * Send comparison request to backend.
 * @param {string} prompt  - built by prompt.js
 * @returns {Promise<object>} parsed JSON result from Groq
 * @throws {Error} with user-readable message on failure
 */
export async function fetchComparison(prompt) {
  let res;

  try {
    res = await fetch(CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
  } catch (networkErr) {
    throw new Error('Network error — check your connection and try again.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Server error ${res.status}. Please try again.`);
  }

  const data = await res.json();

  // Defensive: strip accidental markdown fences the model might emit
  let raw = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
  raw = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('AI returned an unexpected format. Please try again.');
  }
}
