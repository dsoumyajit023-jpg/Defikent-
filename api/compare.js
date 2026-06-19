
/**
 * api/compare.js  —  Vercel Serverless Function   POST /api/compare
 *
 * Browser sends { prompt }.
 * This function calls Groq with the secret key from process.env.
 * Returns { result } as a JSON string.
 * The GROQ_API_KEY is NEVER visible to the browser.
 */

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL      = process.env.GROQ_MODEL || 'llama3-70b-8192';
const MAX_TOKENS = 2000;
const TEMP       = 0.3;

export default async function handler(req, res) {
  /* ── CORS ── */
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  /* ── Env check ── */
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[compare] GROQ_API_KEY not set');
    return res.status(500).json({ error: 'Server misconfiguration. Contact admin.' });
  }

  /* ── Validate body ── */
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || prompt.length < 10)
    return res.status(400).json({ error: 'Invalid request: prompt missing or too short.' });
  if (prompt.length > 8000)
    return res.status(400).json({ error: 'Prompt too long.' });

  /* ── Call Groq ── */
  let groqRes;
  try {
    groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       MODEL,
        max_tokens:  MAX_TOKENS,
        temperature: TEMP,
        messages:    [{ role: 'user', content: prompt }],
      }),
    });
  } catch (err) {
    console.error('[compare] network error:', err);
    return res.status(502).json({ error: 'Could not reach AI service. Try again.' });
  }

  if (!groqRes.ok) {
    const errBody = await groqRes.json().catch(() => ({}));
    console.error('[compare] Groq error:', groqRes.status, errBody);
    return res.status(502).json({
      error: errBody?.error?.message || `Groq error ${groqRes.status}`,
    });
  }

  /* ── Parse & validate ── */
  const groqData = await groqRes.json();
  let raw = groqData?.choices?.[0]?.message?.content || '';
  raw = raw.replace(/```json|```/g, '').trim();

  try {
    JSON.parse(raw); // ensure it's valid JSON before sending
  } catch {
    console.error('[compare] non-JSON from Groq:', raw.slice(0, 200));
    return res.status(502).json({ error: 'AI returned an unexpected format. Please retry.' });
  }

  return res.status(200).json({ result: raw });
}
