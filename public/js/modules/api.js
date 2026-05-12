// api.js
import { CONFIG } from './config.js';

export async function fetchComparison(prompt) {
  let res;
  try {
    res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer ${CONFIG.GROQ_API_KEY}, // add this to config.js
      },
      body: JSON.stringify({
        model: CONFIG.GROQ_MODEL,
        max_tokens: CONFIG.GROQ_MAX_TOKENS,
        temperature: CONFIG.GROQ_TEMPERATURE,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || Server error ${res.status}. Please try again.);
  }

  const data = await res.json();
  let raw = data.choices?.[0]?.message?.content || '';
  raw = raw.replace(/json|/g, '').trim();

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('AI returned an unexpected format. Please try again.');
  }
}
